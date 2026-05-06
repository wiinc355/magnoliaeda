import { apiRequest } from './apiClient';
import { API_BASE_URL } from '../config/apiConfig';

export async function getAuthUsers({ q = '', page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  return apiRequest(`/api/auth/users?${params.toString()}`, { method: 'GET' });
}

export async function updateAuthUserRoles(userId, roles) {
  return apiRequest(`/api/auth/users/${encodeURIComponent(userId)}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles })
  });
}

export async function getAuditLogs({ q = '', action = '', outcome = '', from = '', to = '', page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (action.trim()) params.set('action', action.trim());
  if (outcome.trim()) params.set('outcome', outcome.trim());
  if (from.trim()) params.set('from', from.trim());
  if (to.trim()) params.set('to', to.trim());
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  return apiRequest(`/api/auth/audit-logs?${params.toString()}`, { method: 'GET' });
}

export async function downloadAuditLogsCsv({
  q = '',
  action = '',
  outcome = '',
  from = '',
  to = '',
  maxRows = 5000
} = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (action.trim()) params.set('action', action.trim());
  if (outcome.trim()) params.set('outcome', outcome.trim());
  if (from.trim()) params.set('from', from.trim());
  if (to.trim()) params.set('to', to.trim());
  params.set('maxRows', String(maxRows));

  const response = await fetch(`${API_BASE_URL}/api/auth/audit-logs/export?${params.toString()}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to export audit logs');
  }

  return response.text();
}
