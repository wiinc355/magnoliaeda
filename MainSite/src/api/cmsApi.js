import { apiRequest } from './apiClient';
import { API_BASE_URL } from '../config/apiConfig';

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/cms/upload`, {
    credentials: 'include',
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getDashboardStats() {
  return apiRequest('/api/cms/stats');
}

// ─── Announcements ────────────────────────────────────────────────────────────

export function getAnnouncements() {
  return apiRequest('/api/cms/announcements');
}

export function createAnnouncement(data) {
  return apiRequest('/api/cms/announcements', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateAnnouncement(id, data) {
  return apiRequest(`/api/cms/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteAnnouncement(id) {
  return apiRequest(`/api/cms/announcements/${id}`, { method: 'DELETE' });
}

// ─── Events ───────────────────────────────────────────────────────────────────

export function getEvents() {
  return apiRequest('/api/cms/events');
}

export function createEvent(data) {
  return apiRequest('/api/cms/events', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateEvent(id, data) {
  return apiRequest(`/api/cms/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteEvent(id) {
  return apiRequest(`/api/cms/events/${id}`, { method: 'DELETE' });
}

// ─── Contacts (re-export for dashboard use) ───────────────────────────────────

export function getDashboardContacts() {
  return apiRequest('/api/contacts');
}

export function createContact(data) {
  return apiRequest('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateContact(id, data) {
  return apiRequest(`/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteContact(id) {
  return apiRequest(`/api/contacts/${id}`, { method: 'DELETE' });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function getDashboardProjects() {
  return apiRequest('/api/projects');
}

export function createProject(data) {
  return apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateProject(id, data) {
  return apiRequest(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteProject(id) {
  return apiRequest(`/api/projects/${id}`, { method: 'DELETE' });
}

// ─── Personnel ───────────────────────────────────────────────────────────────

export function getDashboardPersonnel() {
  return apiRequest('/api/cms/personnel');
}

export function createPersonnel(data) {
  return apiRequest('/api/cms/personnel', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updatePersonnel(id, data) {
  return apiRequest(`/api/cms/personnel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deletePersonnel(id) {
  return apiRequest(`/api/cms/personnel/${id}`, { method: 'DELETE' });
}

// ─── Building Addresses ──────────────────────────────────────────────────────

export function getDashboardBuildingAddresses() {
  return apiRequest('/api/cms/building-addresses');
}

export function createBuildingAddress(data) {
  return apiRequest('/api/cms/building-addresses', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateBuildingAddress(id, data) {
  return apiRequest(`/api/cms/building-addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteBuildingAddress(id) {
  return apiRequest(`/api/cms/building-addresses/${id}`, { method: 'DELETE' });
}

// ─── Public Dynamic Data ─────────────────────────────────────────────────────

export function getPublicPersonnel() {
  return apiRequest('/api/public/personnel');
}

export function getPublicEvents(month = '') {
  const params = month ? `?month=${encodeURIComponent(month)}` : '';
  return apiRequest(`/api/public/events${params}`);
}

export function getPublicAnnouncements() {
  return apiRequest('/api/public/announcements');
}

export function getPublicBuildingAddresses() {
  return apiRequest('/api/public/building-addresses');
}

// ─── eNotify (public) ─────────────────────────────────────────────────────────

export function subscribeEnotify(data) {
  return apiRequest('/api/public/enotify/subscribe', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function confirmEnotify(token) {
  return apiRequest(`/api/public/enotify/confirm/${encodeURIComponent(token)}`);
}

export function unsubscribeEnotify(token) {
  return apiRequest(`/api/public/enotify/unsubscribe/${encodeURIComponent(token)}`);
}

export function getEnotifyCategories() {
  return apiRequest('/api/public/enotify/categories');
}

// ─── Subscribers (admin) ──────────────────────────────────────────────────────

export function getSubscribers() {
  return apiRequest('/api/cms/subscribers');
}

export function updateSubscriber(id, data) {
  return apiRequest(`/api/cms/subscribers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteSubscriber(id) {
  return apiRequest(`/api/cms/subscribers/${id}`, { method: 'DELETE' });
}

export function getNotificationsLog(limit = 200) {
  return apiRequest(`/api/cms/notifications-log?limit=${limit}`);
}

export function sendBlast(data) {
  return apiRequest('/api/cms/blast', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
