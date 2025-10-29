require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  
  queue: {
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 5,
    maxRetries: parseInt(process.env.QUEUE_MAX_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.QUEUE_RETRY_DELAY, 10) || 5000,
  },
  
  scraping: {
    timeout: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 30000,
    userAgent: process.env.DEFAULT_USER_AGENT,
    puppeteerHeadless: process.env.PUPPETEER_HEADLESS !== 'false',
    puppeteerArgs: process.env.PUPPETEER_ARGS?.split(',') || [],
  },
  
  rateLimits: {
    italy: parseInt(process.env.ITALY_RATE_LIMIT, 10) || 60,
    romania: parseInt(process.env.ROMANIA_RATE_LIMIT, 10) || 60,
    global: parseInt(process.env.GLOBAL_RATE_LIMIT, 10) || 100,
  },
  
  countries: {
    italy: {
      focusRegions: process.env.ITALY_FOCUS_REGIONS?.split(',') || [],
      focusCities: process.env.ITALY_FOCUS_CITIES?.split(',') || [],
    },
    romania: {
      focusCounties: process.env.ROMANIA_FOCUS_COUNTIES?.split(',') || [],
      focusCities: process.env.ROMANIA_FOCUS_CITIES?.split(',') || [],
    },
  },
  
  dataQuality: {
    minScore: parseInt(process.env.MIN_DATA_QUALITY_SCORE, 10) || 50,
    autoEnrichment: process.env.ENABLE_AUTO_ENRICHMENT === 'true',
    autoDeduplication: process.env.ENABLE_AUTO_DEDUPLICATION === 'true',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/app.log',
  },
  
  security: {
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};
