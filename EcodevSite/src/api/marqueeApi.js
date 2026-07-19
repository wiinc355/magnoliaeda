import { apiRequest } from './apiClient';

export function getPublicMarquee() {
  return apiRequest('/api/public/marquee?site=ecodevsite');
}
