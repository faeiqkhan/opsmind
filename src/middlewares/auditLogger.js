const { auditQueue } = require('../services/queueService');

console.log('🟢 auditLogger middleware loaded');

const auditLogger = (req, res, next) => {
  res.on('finish', () => {
    const log = {
      userId: req.user?.id || 'guest',
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      metadata: {
        userAgent: req.headers['user-agent'],
        query: req.query,
        body: req.body,
      },
      timestamp: new Date().toISOString()
    };

    console.log('🟡 Adding job to audit queue:', log);

    auditQueue.add('logAction', log, { attempts: 3, backoff: 5000 })
  .then(() => console.log('🚀 Job added to audit queue'))
  .catch((err) => console.error('❌ Failed to add job:', err));

  });

  next();
};

module.exports = auditLogger;
