const config = require('./index');

module.exports = {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    db: config.redis.db,
  },
  
  defaultJobOptions: {
    removeOnComplete: 10,    // Keep last 10 completed jobs
    removeOnFail: 5,         // Keep last 5 failed jobs
    attempts: config.queue.maxRetries,
    backoff: {
      type: 'exponential',
      delay: config.queue.retryDelay,
    },
  },
  
  settings: {
    stalledInterval: 30 * 1000,  // 30 seconds
    maxStalledCount: 1,
  },
  
  concurrency: config.queue.concurrency,
};
