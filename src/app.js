require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');

// Import routes
const scrapeRoutes = require('./routes/scrape.routes');
const companyRoutes = require('./routes/companies.routes');
const queueRoutes = require('./routes/queue.routes');
const proxyRoutes = require('./routes/proxy.routes');

const app = express();

// Security middleware with relaxed CSP to allow Tailwind CDN, jsDelivr, cdnjs and Supabase endpoints
// Tailwind CDN injects styles via an inline <style> tag so we need to allow 'unsafe-inline' for styles
// We also permit script/style/connect sources for the CDNs used in `companies-directory.html`.
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
  imgSrc: ["'self'", 'data:']
};

// If a Supabase URL is configured, allow it for connect-src (for client fetches)
try {
  const supabaseUrl = require('./config').supabase && require('./config').supabase.url;
  if (supabaseUrl) {
    cspDirectives.connectSrc.push(supabaseUrl);
    // also allow CDN hosts sometimes used by Supabase (jsdelivr)
    cspDirectives.connectSrc.push('https://cdn.jsdelivr.net');
  }
} catch (err) {
  // ignore if config cannot be read at this moment
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: cspDirectives
    }
  })
);

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Serve static files from the root directory (for companies directory)
app.use(express.static(path.join(__dirname, '..')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API base endpoint
app.get(`/api/${config.apiVersion}`, (req, res) => {
  res.json({
    message: 'Web Scraping API - Italy & Romania',
    version: config.apiVersion,
    endpoints: {
      scrape: `/api/${config.apiVersion}/scrape`,
      companies: `/api/${config.apiVersion}/companies`,
      queue: `/api/${config.apiVersion}/queue`,
      proxy: `/api/${config.apiVersion}/proxy`
    },
    documentation: 'Visit / for full API documentation'
  });
});

// API routes
app.use(`/api/${config.apiVersion}/scrape`, scrapeRoutes);
app.use(`/api/${config.apiVersion}/companies`, companyRoutes);
app.use(`/api/${config.apiVersion}/queue`, queueRoutes);
app.use(`/api/${config.apiVersion}/proxy`, proxyRoutes);

// Root endpoint - Serve Companies Directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'companies-directory.html'), (err) => {
    if (err) {
      // Fallback to JSON response if HTML file not found
      res.json({
        message: 'Web Scraping Server - Italy & Romania',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          scrape: `/api/${config.apiVersion}/scrape`,
          companies: `/api/${config.apiVersion}/companies`,
          queue: `/api/${config.apiVersion}/queue`,
          proxy: `/api/${config.apiVersion}/proxy`
        },
        companies_directory: 'Companies Directory should be available at root URL'
      });
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
