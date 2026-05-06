import { apiRequest } from './apiClient';

export function getContacts() {
  return apiRequest('/api/contacts');
}

export function createContact(payload) {
  return apiRequest('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateContact(id, payload) {
  return apiRequest(`/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteContact(id) {
  return apiRequest(`/api/contacts/${id}`, {
    method: 'DELETE'
  });
}
