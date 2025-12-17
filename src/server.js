// Polyfill for File API (Node 18 compatibility)
if (typeof global.File === 'undefined') {
  global.File = class File extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

const app = require('./app');
const config = require('./config');
const autoScraper = require('./services/AutoScraperService');

const server = app.listen(config.port, async () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📊 Environment: ${config.env}`);
  console.log(`🏢 Companies Directory: http://localhost:${config.port}`);
  console.log(`🔗 API Base URL: http://localhost:${config.port}/api/${config.apiVersion}`);
  console.log(`🏥 Health Check: http://localhost:${config.port}/health`);

  // Start auto-scraping immediately
  await autoScraper.startAutoScraping();
});// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  autoScraper.stopAutoScraping();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = server;
