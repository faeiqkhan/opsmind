const Queue = require('bull');
const Redis = require('ioredis');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

const auditQueue = new Queue('audit', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  }
});

console.log('Connecting to Redis at', process.env.REDIS_HOST, process.env.REDIS_PORT);

module.exports = {
  auditQueue
};
