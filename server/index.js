require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');
const projectsRoutes = require('./routes/projects');
const contactsRoutes = require('./routes/contacts');
const cmsRoutes = require('./routes/cms');
const uploadRoutes = require('./routes/upload');
const enotifyRoutes = require('./routes/enotify');
const subscribersRoutes = require('./routes/subscribers');
const { router: marqueeRoutes, publicMarquee } = require('./routes/marquee');
const authRoutes = require('./routes/auth');
const secureRoutes = require('./routes/secure');
const publicDataRoutes = require('./routes/publicData');
const { router: profilesRouter } = require('./routes/profiles');
const { pool } = require('./db/postgres');
const { authRateLimiter, generalApiLimiter } = require('./middleware/rateLimiters');
const { requireAuth, requireAnyRole } = require('./middleware/authSession');
const { logSecurityEvent } = require('./utils/securityLogger');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

function isPlaceholder(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized
    || normalized.startsWith('your-')
    || normalized.includes('replace-with');
}

function isEntraConfigured() {
  return !isPlaceholder(process.env.ENTRA_CLIENT_ID)
    && !isPlaceholder(process.env.ENTRA_TENANT_ID)
    && !isPlaceholder(process.env.ENTRA_CLIENT_SECRET)
    && !isPlaceholder(process.env.ENTRA_REDIRECT_URI);
}

const PgSessionStore = connectPgSimple(session);
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const sessionConfig = {
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'replace-this-development-session-secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30
  }
};

if (pool) {
  sessionConfig.store = new PgSessionStore({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  });
}

app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false
}));
app.use(cors({
  origin: frontendOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use('/api', generalApiLimiter);
app.use('/api/auth', authRateLimiter, authRoutes);

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    authConfigured: Boolean(isEntraConfigured() && process.env.DATABASE_URL)
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Serve uploaded files publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/public', publicDataRoutes);
app.use('/api/public/enotify', enotifyRoutes);
app.get('/api/public/marquee', publicMarquee);
app.use('/api/secure', secureRoutes);
app.use(
  '/api/cms',
  requireAuth,
  requireAnyRole(['Admin', 'Staff']),
  cmsRoutes
);
app.use(
  '/api/cms',
  requireAuth,
  requireAnyRole(['Admin', 'Staff']),
  uploadRoutes
);
app.use(
  '/api/cms',
  requireAuth,
  requireAnyRole(['Admin', 'Staff']),
  subscribersRoutes
);
app.use(
  '/api/cms',
  requireAuth,
  requireAnyRole(['Admin', 'Staff']),
  marqueeRoutes
);
app.use(
  '/api/projects',
  requireAuth,
  requireAnyRole(['Admin', 'Staff', 'Department User']),
  projectsRoutes
);
app.use('/api/contacts', requireAuth, requireAnyRole(['Admin', 'Staff']), contactsRoutes);
app.use('/api/profiles', profilesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logSecurityEvent('api.unhandled_error', {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  logSecurityEvent('api.route_not_found', {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logSecurityEvent('api.server_started', {
    port: Number(PORT),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});
