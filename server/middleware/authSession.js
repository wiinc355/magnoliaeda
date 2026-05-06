const { writeAuditLog } = require('../services/auditService');
const { logSecurityEvent } = require('../utils/securityLogger');

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    writeAuditLog({
      action: 'auth.access_denied',
      outcome: 'failure',
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      metadata: { reason: 'missing_session', path: req.originalUrl }
    }).catch(() => {});

    logSecurityEvent('auth.access_denied', {
      reason: 'missing_session',
      path: req.originalUrl,
      ip: req.ip
    });

    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.session.user.isActive) {
    writeAuditLog({
      actorUserId: req.session.user.id,
      action: 'auth.access_denied',
      outcome: 'failure',
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      metadata: { reason: 'inactive_account', path: req.originalUrl }
    }).catch(() => {});

    logSecurityEvent('auth.access_denied', {
      reason: 'inactive_account',
      actorUserId: req.session.user.id,
      path: req.originalUrl,
      ip: req.ip
    });

    return res.status(403).json({ error: 'Account disabled' });
  }

  return next();
}

function requireAnyRole(allowedRoles = []) {
  return (req, res, next) => {
    const roles = (req.session && req.session.user && req.session.user.roles) || [];
    const isAllowed = roles.some((role) => allowedRoles.includes(role));

    if (!isAllowed) {
      writeAuditLog({
        actorUserId: req.session && req.session.user ? req.session.user.id : null,
        action: 'rbac.access_denied',
        outcome: 'failure',
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
        metadata: {
          requiredRoles: allowedRoles,
          userRoles: roles,
          path: req.originalUrl
        }
      }).catch(() => {});

      logSecurityEvent('rbac.access_denied', {
        actorUserId: req.session && req.session.user ? req.session.user.id : null,
        requiredRoles: allowedRoles,
        userRoles: roles,
        path: req.originalUrl,
        ip: req.ip
      });

      return res.status(403).json({ error: 'Forbidden' });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireAnyRole
};
