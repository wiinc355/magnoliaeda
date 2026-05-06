const { query, pool } = require('../db/postgres');

const DEFAULT_ROLE = 'Public User';

async function upsertUserFromIdentity({ externalSub, email, displayName }) {
  const result = await query(
    `INSERT INTO users (external_sub, email, display_name, is_active)
     VALUES ($1, $2, $3, true)
     ON CONFLICT (external_sub)
     DO UPDATE SET
       email = EXCLUDED.email,
       display_name = EXCLUDED.display_name,
       updated_at = now()
     RETURNING id, email, display_name, is_active`,
    [externalSub, email, displayName]
  );

  return result.rows[0];
}

async function ensureUserHasDefaultRole(userId) {
  await query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, r.id
     FROM roles r
     WHERE r.name = $2
     ON CONFLICT (user_id, role_id) DO NOTHING`,
    [userId, DEFAULT_ROLE]
  );
}

async function getUserRoles(userId) {
  const result = await query(
    `SELECT r.name
     FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId]
  );

  return result.rows.map((row) => row.name);
}

async function listUsersWithRoles() {
  const result = await query(
    `SELECT
      u.id,
      u.email,
      u.display_name,
      u.is_active,
      COALESCE(array_remove(array_agg(r.name ORDER BY r.name), NULL), ARRAY[]::text[]) AS roles
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     GROUP BY u.id, u.email, u.display_name, u.is_active
     ORDER BY u.display_name ASC, u.email ASC`
  );

  return result.rows;
}

async function setUserRoles({ userId, roleNames = [], assignedBy = null }) {
  if (!pool) {
    throw new Error('PostgreSQL is not configured');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

    for (const roleName of roleNames) {
      await client.query(
        `INSERT INTO user_roles (user_id, role_id, assigned_by)
         SELECT $1, id, $3
         FROM roles
         WHERE name = $2`,
        [userId, roleName, assignedBy]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  DEFAULT_ROLE,
  upsertUserFromIdentity,
  ensureUserHasDefaultRole,
  getUserRoles,
  listUsersWithRoles,
  setUserRoles
};
