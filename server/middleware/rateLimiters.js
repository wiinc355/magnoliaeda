const rateLimit = require('express-rate-limit');

const isProduction = process.env.NODE_ENV === 'production';

function isLocalDevRequest(req) {
  return !isProduction && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip);
}

const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isProduction ? 30 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalDevRequest,
  message: { error: 'Too many authentication requests. Please try again later.' }
});

const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Please slow down.' }
});

module.exports = {
  authRateLimiter,
  generalApiLimiter
};
