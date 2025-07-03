const { auditQueue } = require('../services/queueService');
const { saveAuditLog } = require('../modules/audit/audit.model');

console.log('🟢 auditWorker started');

auditQueue.process('logAction', async (job) => {
  console.log('Processing audit job:', job.data);
  try {
    const log = job.data;
    await saveAuditLog(log);
    console.log('✅ Audit log saved');
  } catch (error) {
    console.error('❌ Failed to save audit log:', error);
    throw error; // Triggers retry
  }
});
