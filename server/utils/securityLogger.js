function logSecurityEvent(eventName, details = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level: 'security',
    event: eventName,
    ...details
  };

  console.log(JSON.stringify(payload));
}

module.exports = {
  logSecurityEvent
};
