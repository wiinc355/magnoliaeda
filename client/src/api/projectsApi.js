import { apiRequest } from './apiClient';

export function getProjects() {
  return apiRequest('/api/projects');
}

export function createProject(payload) {
  return apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateProject(id, payload) {
  return apiRequest(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteProject(id) {
  return apiRequest(`/api/projects/${id}`, {
    method: 'DELETE'
  });
}
