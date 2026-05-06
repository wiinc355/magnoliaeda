const express = require('express');
const {
  msalClient,
  loginScopes,
  createRandomBase64Url,
  createPkceCodes
} = require('../config/authConfig');
const {
  upsertUserFromIdentity,
  ensureUserHasDefaultRole,
  getUserRoles,
  listUsersWithRoles,
  setUserRoles
} = require('../services/authUserService');
const { writeAuditLog, listAuditLogs, exportAuditLogs } = require('../services/auditService');
const { requireAuth, requireAnyRole } = require('../middleware/authSession');
const { logSecurityEvent } = require('../utils/securityLogger');

const router = express.Router();

function isPlaceholder(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized
    || normalized.startsWith('your-')
    || normalized.includes('replace-with');
}

function isEntraConfigured() {
  return !isPlaceholder(process.env.ENTRA_CLIENT_ID)
    && !isPlaceholder(process.env.ENTRA_TENANT_ID)
    && !isPlaceholder(process.env.ENTRA_CLIENT_SECRET)
    && !isPlaceholder(process.env.ENTRA_REDIRECT_URI);
}

function getFrontendBaseUrl() {
  return process.env.FRONTEND_REDIRECT_URL
    || ((process.env.FRONTEND_ORIGIN || 'http://localhost:3000').split(',')[0] || '').trim()
    || 'http://localhost:3000';
}

function getRequestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || null
  };
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);
  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

router.get('/login', async (req, res, next) => {
  try {
    const frontendBase = getFrontendBaseUrl();
    const requestedReturnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo.trim() : '';
    const returnTo = requestedReturnTo.startsWith('/') && !requestedReturnTo.startsWith('//')
      ? requestedReturnTo
      : '/dashboard';

    if (!isEntraConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return res.redirect(`${frontendBase}/login?error=auth_not_configured`);
      }

      const user = await upsertUserFromIdentity({
        externalSub: process.env.DEV_AUTH_EXTERNAL_SUB || 'dev-local-user',
        email: process.env.DEV_AUTH_EMAIL || 'dev@local.test',
        displayName: process.env.DEV_AUTH_DISPLAY_NAME || 'Local Development User'
      });

      await ensureUserHasDefaultRole(user.id);

      const requestedRoles = String(process.env.DEV_AUTH_ROLES || 'Admin,Staff')
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean);

      if (requestedRoles.length > 0) {
        await setUserRoles({ userId: user.id, roleNames: requestedRoles, assignedBy: null });
      }

      const roles = await getUserRoles(user.id);

      await regenerateSession(req);
      req.session.user = {
        id: user.id,
        externalSub: process.env.DEV_AUTH_EXTERNAL_SUB || 'dev-local-user',
        email: user.email,
        displayName: user.display_name,
        roles,
        isActive: user.is_active
      };

      await writeAuditLog({
        actorUserId: user.id,
        action: 'auth.login.dev_fallback',
        outcome: 'success',
        metadata: { roles, returnTo },
        ...getRequestMeta(req)
      }).catch(() => {});

      const callbackUrl = new URL('/auth/callback', frontendBase);
      callbackUrl.searchParams.set('returnTo', returnTo);
      return res.redirect(callbackUrl.toString());
    }

    const { verifier, challenge } = createPkceCodes();
    const state = createRandomBase64Url(24);
    const nonce = createRandomBase64Url(24);

    req.session.authFlow = { verifier, state, nonce, returnTo };

    const authCodeUrl = await msalClient.getAuthCodeUrl({
      scopes: loginScopes,
      redirectUri: process.env.ENTRA_REDIRECT_URI,
      responseMode: 'query',
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
      state,
      nonce,
      prompt: 'select_account'
    });

    res.redirect(authCodeUrl);
  } catch (error) {
    next(error);
  }
});

router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const authFlow = req.session.authFlow;
  const frontendBase = getFrontendBaseUrl();

  if (!code || !state || !authFlow || state !== authFlow.state) {
    await writeAuditLog({
      action: 'auth.callback',
      outcome: 'failure',
      metadata: { reason: 'state_or_code_invalid' },
      ...getRequestMeta(req)
    }).catch(() => {});

    return res.redirect(`${frontendBase}/login?error=auth_callback_invalid`);
  }

  try {
    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: loginScopes,
      redirectUri: process.env.ENTRA_REDIRECT_URI,
      codeVerifier: authFlow.verifier,
      nonce: authFlow.nonce
    });

    const claims = tokenResponse && tokenResponse.idTokenClaims ? tokenResponse.idTokenClaims : null;

    if (!claims || claims.aud !== process.env.ENTRA_CLIENT_ID) {
      throw new Error('Invalid id token claims');
    }

    const externalSub = claims.sub;
    const email = claims.preferred_username || claims.email || null;
    const displayName = claims.name || 'Municipality User';

    const user = await upsertUserFromIdentity({ externalSub, email, displayName });
    await ensureUserHasDefaultRole(user.id);
    const roles = await getUserRoles(user.id);

    await regenerateSession(req);

    req.session.user = {
      id: user.id,
      externalSub,
      email: user.email,
      displayName: user.display_name,
      roles,
      isActive: user.is_active
    };

    await writeAuditLog({
      actorUserId: user.id,
      action: 'auth.login',
      outcome: 'success',
      metadata: { roles },
      ...getRequestMeta(req)
    }).catch(() => {});

    const returnTo = authFlow.returnTo && authFlow.returnTo.startsWith('/') && !authFlow.returnTo.startsWith('//')
      ? authFlow.returnTo
      : '/dashboard';

    const callbackUrl = new URL('/auth/callback', frontendBase);
    callbackUrl.searchParams.set('returnTo', returnTo);

    return res.redirect(callbackUrl.toString());
  } catch (error) {
    await writeAuditLog({
      action: 'auth.login',
      outcome: 'failure',
      metadata: { reason: 'token_exchange_or_user_sync_failed', message: error.message },
      ...getRequestMeta(req)
    }).catch(() => {});

    return res.redirect(`${frontendBase}/login?error=auth_failed`);
  }
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({ authenticated: true, user: req.session.user });
});

router.get('/users', requireAuth, requireAnyRole(['Admin']), async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10));
    const allUsers = await listUsersWithRoles();

    const filteredUsers = q
      ? allUsers.filter((entry) => {
        const displayName = String(entry.display_name || '').toLowerCase();
        const email = String(entry.email || '').toLowerCase();
        return displayName.includes(q) || email.includes(q);
      })
      : allUsers;

    const offset = (page - 1) * pageSize;
    const users = filteredUsers.slice(offset, offset + pageSize);

    return res.json({
      users,
      total: filteredUsers.length,
      page,
      pageSize
    });
  } catch (error) {
    logSecurityEvent('rbac.users_list_failed', {
      actorUserId: req.session && req.session.user ? req.session.user.id : null,
      message: error.message,
      ip: req.ip
    });
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/audit-logs', requireAuth, requireAnyRole(['Admin']), async (req, res) => {
  try {
    const result = await listAuditLogs({
      q: String(req.query.q || '').trim(),
      action: String(req.query.action || '').trim(),
      outcome: String(req.query.outcome || '').trim(),
      from: String(req.query.from || '').trim(),
      to: String(req.query.to || '').trim(),
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 20
    });

    return res.json(result);
  } catch (error) {
    logSecurityEvent('audit.logs_fetch_failed', {
      actorUserId: req.session && req.session.user ? req.session.user.id : null,
      message: error.message,
      ip: req.ip
    });

    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.get('/audit-logs/export', requireAuth, requireAnyRole(['Admin']), async (req, res) => {
  try {
    const rows = await exportAuditLogs({
      q: String(req.query.q || '').trim(),
      action: String(req.query.action || '').trim(),
      outcome: String(req.query.outcome || '').trim(),
      from: String(req.query.from || '').trim(),
      to: String(req.query.to || '').trim(),
      maxRows: Number(req.query.maxRows) || 5000
    });

    const header = [
      'id',
      'created_at',
      'action',
      'outcome',
      'actor_display_name',
      'actor_email',
      'ip_address',
      'user_agent',
      'metadata'
    ];

    const lines = [header.join(',')];

    for (const row of rows) {
      lines.push([
        escapeCsvValue(row.id),
        escapeCsvValue(row.created_at),
        escapeCsvValue(row.action),
        escapeCsvValue(row.outcome),
        escapeCsvValue(row.actor_display_name),
        escapeCsvValue(row.actor_email),
        escapeCsvValue(row.ip_address),
        escapeCsvValue(row.user_agent),
        escapeCsvValue(JSON.stringify(row.metadata || {}))
      ].join(','));
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${timestamp}.csv"`);
    return res.status(200).send(lines.join('\n'));
  } catch (error) {
    logSecurityEvent('audit.logs_export_failed', {
      actorUserId: req.session && req.session.user ? req.session.user.id : null,
      message: error.message,
      ip: req.ip
    });

    return res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

router.post('/logout', async (req, res) => {
  const actorUserId = req.session && req.session.user ? req.session.user.id : null;

  req.session.destroy(async () => {
    res.clearCookie('sid');

    await writeAuditLog({
      actorUserId,
      action: 'auth.logout',
      outcome: 'success',
      ...getRequestMeta(req)
    }).catch(() => {});

    res.status(204).send();
  });
});

router.put('/users/:userId/roles', requireAuth, requireAnyRole(['Admin']), async (req, res) => {
  const { userId } = req.params;
  const roles = Array.isArray(req.body.roles) ? req.body.roles : [];

  const allowedRoles = ['Admin', 'Staff', 'Department User', 'Public User'];
  const invalidRole = roles.find((role) => !allowedRoles.includes(role));

  if (invalidRole) {
    return res.status(400).json({ error: `Invalid role: ${invalidRole}` });
  }

  try {
    await setUserRoles({
      userId,
      roleNames: roles,
      assignedBy: req.session.user.id
    });

    await writeAuditLog({
      actorUserId: req.session.user.id,
      action: 'rbac.role_change',
      outcome: 'success',
      metadata: { targetUserId: userId, roles },
      ...getRequestMeta(req)
    }).catch(() => {});

    logSecurityEvent('rbac.role_change_success', {
      actorUserId: req.session.user.id,
      targetUserId: userId,
      roles,
      ip: req.ip
    });

    res.json({ ok: true });
  } catch (error) {
    logSecurityEvent('rbac.role_change_failed', {
      actorUserId: req.session && req.session.user ? req.session.user.id : null,
      targetUserId: userId,
      roles,
      message: error.message,
      ip: req.ip
    });
    res.status(500).json({ error: 'Failed to update roles' });
  }
});

module.exports = router;
