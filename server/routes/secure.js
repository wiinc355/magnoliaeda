const express = require('express');
const { requireAuth, requireAnyRole } = require('../middleware/authSession');
const { writeAuditLog } = require('../services/auditService');

const router = express.Router();

router.get('/admin', requireAuth, requireAnyRole(['Admin']), async (req, res) => {
  await writeAuditLog({
    actorUserId: req.session.user.id,
    action: 'api.secure.admin_access',
    outcome: 'success',
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || null
  }).catch(() => {});

  res.json({ message: 'Admin secure endpoint', user: req.session.user });
});

router.get('/staff', requireAuth, requireAnyRole(['Admin', 'Staff']), (req, res) => {
  res.json({ message: 'Staff secure endpoint', user: req.session.user });
});

router.get('/department', requireAuth, requireAnyRole(['Admin', 'Department User']), (req, res) => {
  res.json({ message: 'Department secure endpoint', user: req.session.user });
});

module.exports = router;
