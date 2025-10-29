const winston = require('winston');
const ProxyService = require('../../services/ProxyService');

class BaseScraper {
  constructor(config) {
    this.config = config;
    this.name = this.constructor.name;
    this.results = [];
    this.errors = [];
    this.logger = this.setupLogger();
    this.proxyService = ProxyService;
  }
  
  setupLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: this.name },
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }
  
  // Abstract methods (must be implemented by subclasses)
  async scrape() {
    throw new Error('scrape() must be implemented');
  }
  
  async parse(html) {
    throw new Error('parse() must be implemented');
  }
  
  // Shared utility methods
  async retry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        this.log('warn', `Retry attempt ${i + 1}/${maxRetries} failed`, { error: error.message });
        if (i === maxRetries - 1) throw error;
        await this.sleep(1000 * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  log(level, message, metadata = {}) {
    this.logger.log(level, message, metadata);
  }
  
  // Data validation helpers
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validatePhone(phone) {
    // Basic phone validation - can be enhanced with libphonenumber-js
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
  
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  // Data quality scoring
  calculateDataQualityScore(company) {
    let score = 0;
    const fields = {
      company_name: 20,
      tax_id: 15,
      website: 15,
      email: 15,
      phone: 10,
      address: 10,
      city: 10,
      description: 5
    };
    
    Object.entries(fields).forEach(([field, points]) => {
      if (company[field] && company[field].toString().trim()) {
        score += points;
      }
    });
    
    return Math.min(score, 100);
  }
  
  // Normalize company data
  normalizeCompanyData(rawData) {
    return {
      company_name: this.cleanString(rawData.company_name),
      legal_name: this.cleanString(rawData.legal_name),
      tax_id: this.cleanString(rawData.tax_id),
      website: this.normalizeUrl(rawData.website),
      email: this.normalizeEmail(rawData.email),
      phone: this.normalizePhone(rawData.phone),
      address: this.cleanString(rawData.address),
      city: this.cleanString(rawData.city),
      description: this.cleanString(rawData.description),
      country: rawData.country || 'IT',
      source_platform: rawData.source_platform,
      source_url: rawData.source_url,
      data_quality_score: this.calculateDataQualityScore(rawData)
    };
  }
  
  cleanString(str) {
    if (!str) return null;
    return str.toString().trim().replace(/\s+/g, ' ');
  }
  
  normalizeUrl(url) {
    if (!url) return null;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return this.validateUrl(url) ? url : null;
  }
  
  normalizeEmail(email) {
    if (!email) return null;
    email = email.toLowerCase().trim();
    return this.validateEmail(email) ? email : null;
  }
  
  normalizePhone(phone) {
    if (!phone) return null;
    phone = phone.replace(/[\s\-\(\)]/g, '');
    return this.validatePhone(phone) ? phone : null;
  }
  
  // Error handling
  handleError(error, context = {}) {
    this.errors.push({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
    
    this.log('error', 'Scraper error', {
      error: error.message,
      context
    });
  }
  
  // Get results summary
  getResultsSummary() {
    return {
      total: this.results.length,
      errors: this.errors.length,
      success_rate: this.results.length / (this.results.length + this.errors.length) * 100,
      avg_quality_score: this.results.length > 0 
        ? this.results.reduce((sum, r) => sum + (r.data_quality_score || 0), 0) / this.results.length 
        : 0
    };
  }
  
  // Proxy methods
  getProxyForCountry(country) {
    return this.proxyService.getProxyForCountry(country);
  }
  
  getProxyUrl(country) {
    return this.proxyService.getProxyUrl(country);
  }
  
  getAxiosProxy(country) {
    return this.proxyService.getAxiosProxy(country);
  }
  
  getPuppeteerProxy(country) {
    return this.proxyService.getPuppeteerProxy(country);
  }
  
  async testProxy(country) {
    return await this.proxyService.testProxy(country);
  }
}

module.exports = BaseScraper;
