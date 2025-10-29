const config = require('../config');

class ProxyService {
  constructor() {
    this.proxies = {
      italy: {
        host: '37.99.254.217',
        port: 5678,
        protocol: 'socks4',
        country: 'IT'
      },
      romania: {
        host: '89.40.222.59',
        port: 6435,
        protocol: 'http',
        country: 'RO'
      }
    };
    
    this.useProxy = false; // Temporarily disable proxies to fix scraping issues
  }
  
  // Get proxy configuration for a specific country
  getProxyForCountry(country) {
    if (!this.useProxy) return null;
    
    const proxy = this.proxies[country.toLowerCase()];
    if (!proxy) return null;
    
    return {
      host: proxy.host,
      port: proxy.port,
      protocol: proxy.protocol,
      country: proxy.country
    };
  }
  
  // Get proxy URL for HTTP requests
  getProxyUrl(country) {
    const proxy = this.getProxyForCountry(country);
    if (!proxy) return null;
    
    return `${proxy.protocol}://${proxy.host}:${proxy.port}`;
  }
  
  // Get proxy configuration for Puppeteer
  getPuppeteerProxy(country) {
    const proxy = this.getProxyForCountry(country);
    if (!proxy) return null;
    
    // For SOCKS4 proxies, use different format
    if (proxy.protocol === 'socks4') {
      return {
        server: `socks4://${proxy.host}:${proxy.port}`,
        username: process.env.PROXY_USERNAME || undefined,
        password: process.env.PROXY_PASSWORD || undefined
      };
    }
    
    // For HTTP proxies
    return {
      server: `http://${proxy.host}:${proxy.port}`,
      username: process.env.PROXY_USERNAME || undefined,
      password: process.env.PROXY_PASSWORD || undefined
    };
  }
  
  // Get proxy configuration for Axios
  getAxiosProxy(country) {
    const proxy = this.getProxyForCountry(country);
    if (!proxy) return null;
    
    return {
      host: proxy.host,
      port: proxy.port,
      protocol: proxy.protocol,
      auth: process.env.PROXY_USERNAME ? {
        username: process.env.PROXY_USERNAME,
        password: process.env.PROXY_PASSWORD
      } : undefined
    };
  }
  
  // Test proxy connection
  async testProxy(country) {
    const proxy = this.getProxyForCountry(country);
    if (!proxy) return { success: false, error: 'No proxy configured' };
    
    try {
      const axios = require('axios');
      const proxyConfig = this.getAxiosProxy(country);
      
      const response = await axios.get('https://httpbin.org/ip', {
        proxy: proxyConfig,
        timeout: 10000
      });
      
      return {
        success: true,
        proxy: proxy,
        response: response.data,
        country: proxy.country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        proxy: proxy
      };
    }
  }
  
  // Test all proxies
  async testAllProxies() {
    const results = {};
    
    for (const country of ['italy', 'romania']) {
      results[country] = await this.testProxy(country);
    }
    
    return results;
  }
  
  // Get proxy statistics
  getProxyStats() {
    return {
      enabled: this.useProxy,
      proxies: Object.keys(this.proxies).length,
      countries: Object.keys(this.proxies),
      details: this.proxies
    };
  }
  
  // Rotate proxy (for future implementation with multiple proxies)
  rotateProxy(country) {
    // For now, we only have one proxy per country
    // In the future, this could implement rotation logic
    return this.getProxyForCountry(country);
  }
  
  // Check if proxy is working
  async isProxyWorking(country) {
    try {
      const test = await this.testProxy(country);
      return test.success;
    } catch (error) {
      return false;
    }
  }
  
  // Get proxy health status
  async getProxyHealth() {
    const health = {};
    
    for (const country of ['italy', 'romania']) {
      health[country] = {
        configured: !!this.getProxyForCountry(country),
        working: await this.isProxyWorking(country)
      };
    }
    
    return health;
  }
}

module.exports = new ProxyService();
