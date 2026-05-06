const { query } = require('../db/postgres');

function buildAuditFilters({ q = '', action = '', outcome = '', from = '', to = '' }) {
  const conditions = [];
  const params = [];

  if (action) {
    params.push(action);
    conditions.push(`al.action = $${params.length}`);
  }

  if (outcome) {
    params.push(outcome);
    conditions.push(`al.outcome = $${params.length}`);
  }

  if (from) {
    params.push(from);
    conditions.push(`al.created_at >= $${params.length}::timestamptz`);
  }

  if (to) {
    params.push(to);
    conditions.push(`al.created_at <= $${params.length}::timestamptz`);
  }

  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    const placeholder = `$${params.length}`;
    conditions.push(`(
      lower(coalesce(u.display_name, '')) LIKE ${placeholder}
      OR lower(coalesce(u.email, '')) LIKE ${placeholder}
      OR lower(coalesce(al.action, '')) LIKE ${placeholder}
      OR lower(coalesce(al.outcome, '')) LIKE ${placeholder}
      OR lower(coalesce(al.user_agent::text, '')) LIKE ${placeholder}
    )`);
  }

  return {
    params,
    whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  };
}

async function writeAuditLog({
  actorUserId = null,
  action,
  outcome,
  ipAddress = null,
  userAgent = null,
  metadata = {}
}) {
  if (!action || !outcome) {
    return;
  }

  await query(
    `INSERT INTO audit_logs (actor_user_id, action, outcome, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [
      actorUserId,
      action,
      outcome,
      ipAddress,
      userAgent,
      JSON.stringify(metadata || {})
    ]
  );
}

async function listAuditLogs({ q = '', action = '', outcome = '', from = '', to = '', page = 1, pageSize = 20 }) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const offset = (safePage - 1) * safePageSize;

  const { params, whereClause } = buildAuditFilters({ q, action, outcome, from, to });

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM audit_logs al
    LEFT JOIN users u ON u.id = al.actor_user_id
    ${whereClause}
  `;

  const dataSql = `
    SELECT
      al.id,
      al.actor_user_id,
      al.action,
      al.outcome,
      al.ip_address,
      al.user_agent,
      al.metadata,
      al.created_at,
      u.display_name AS actor_display_name,
      u.email AS actor_email
    FROM audit_logs al
    LEFT JOIN users u ON u.id = al.actor_user_id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  const countResult = await query(countSql, params);
  const total = countResult.rows[0] ? countResult.rows[0].total : 0;

  const dataResult = await query(dataSql, [...params, safePageSize, offset]);

  return {
    logs: dataResult.rows,
    total,
    page: safePage,
    pageSize: safePageSize
  };
}

async function exportAuditLogs({ q = '', action = '', outcome = '', from = '', to = '', maxRows = 5000 }) {
  const safeMaxRows = Math.min(20000, Math.max(1, Number(maxRows) || 5000));
  const { params, whereClause } = buildAuditFilters({ q, action, outcome, from, to });

  const dataSql = `
    SELECT
      al.id,
      al.created_at,
      al.action,
      al.outcome,
      al.ip_address,
      al.user_agent,
      u.display_name AS actor_display_name,
      u.email AS actor_email,
      al.metadata
    FROM audit_logs al
    LEFT JOIN users u ON u.id = al.actor_user_id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT $${params.length + 1}
  `;

  const dataResult = await query(dataSql, [...params, safeMaxRows]);
  return dataResult.rows;
}

module.exports = {
  writeAuditLog,
  listAuditLogs,
  exportAuditLogs
};
