import { apiRequest } from './apiClient';

export async function getMyProfile() {
  return apiRequest('/api/profiles/me', { method: 'GET' });
}

export async function updateMyProfile(data) {
  return apiRequest('/api/profiles/me', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function getAllProfiles({ q = '', role = '' } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (role.trim()) params.set('role', role.trim());
  return apiRequest(`/api/profiles?${params.toString()}`, { method: 'GET' });
}

export async function getProfileById(id) {
  return apiRequest(`/api/profiles/${encodeURIComponent(id)}`, { method: 'GET' });
}
