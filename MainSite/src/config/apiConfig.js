const DEFAULT_API_BASE_BY_ENV = {
  development: 'http://localhost:5001',
  test: 'http://localhost:5001',
  production: ''
};

const currentEnv = process.env.NODE_ENV || 'development';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ??
  DEFAULT_API_BASE_BY_ENV[currentEnv] ??
  'http://localhost:5001';
