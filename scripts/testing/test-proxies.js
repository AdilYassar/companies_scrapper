const ProxyService = require('../../src/services/ProxyService');

class ProxyTester {
  constructor() {
    this.proxyService = ProxyService;
  }
  
  async testAllProxies() {
    console.log('🔍 Testing proxy connections...');
    console.log('=====================================');
    
    // Test Italy proxy
    console.log('\n🇮🇹 Testing Italy proxy...');
    const italyResult = await this.proxyService.testProxy('italy');
    this.displayResult('Italy', italyResult);
    
    // Test Romania proxy
    console.log('\n🇷🇴 Testing Romania proxy...');
    const romaniaResult = await this.proxyService.testProxy('romania');
    this.displayResult('Romania', romaniaResult);
    
    // Display proxy statistics
    console.log('\n📊 Proxy Statistics:');
    console.log('=====================================');
    const stats = this.proxyService.getProxyStats();
    console.log(`Enabled: ${stats.enabled}`);
    console.log(`Total Proxies: ${stats.proxies}`);
    console.log(`Countries: ${stats.countries.join(', ')}`);
    
    // Display proxy details
    console.log('\n🔧 Proxy Details:');
    Object.entries(stats.details).forEach(([country, proxy]) => {
      console.log(`${country.toUpperCase()}: ${proxy.protocol}://${proxy.host}:${proxy.port}`);
    });
    
    // Test proxy health
    console.log('\n🏥 Proxy Health Check:');
    const health = await this.proxyService.getProxyHealth();
    Object.entries(health).forEach(([country, status]) => {
      const statusIcon = status.working ? '✅' : '❌';
      console.log(`${statusIcon} ${country.toUpperCase()}: ${status.working ? 'Working' : 'Not Working'}`);
    });
    
    console.log('\n✅ Proxy testing completed!');
  }
  
  displayResult(country, result) {
    if (result.success) {
      console.log(`  ✅ ${country} proxy working`);
      console.log(`     Protocol: ${result.proxy.protocol}`);
      console.log(`     Host: ${result.proxy.host}:${result.proxy.port}`);
      console.log(`     Country: ${result.proxy.country}`);
      if (result.response && result.response.origin) {
        console.log(`     IP: ${result.response.origin}`);
      }
    } else {
      console.log(`  ❌ ${country} proxy failed`);
      console.log(`     Error: ${result.error}`);
      if (result.proxy) {
        console.log(`     Proxy: ${result.proxy.protocol}://${result.proxy.host}:${result.proxy.port}`);
      }
    }
  }
  
  async testSpecificProxy(country) {
    console.log(`🔍 Testing ${country} proxy...`);
    const result = await this.proxyService.testProxy(country);
    this.displayResult(country, result);
    return result;
  }
  
  async getProxyInfo() {
    console.log('📋 Proxy Configuration:');
    console.log('=====================================');
    
    const stats = this.proxyService.getProxyStats();
    console.log(`Use Proxy: ${stats.enabled}`);
    
    if (stats.enabled) {
      Object.entries(stats.details).forEach(([country, proxy]) => {
        console.log(`\n${country.toUpperCase()} Proxy:`);
        console.log(`  Host: ${proxy.host}`);
        console.log(`  Port: ${proxy.port}`);
        console.log(`  Protocol: ${proxy.protocol}`);
        console.log(`  Country: ${proxy.country}`);
      });
    } else {
      console.log('Proxies are disabled');
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const tester = new ProxyTester();
  
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const country = args[0].toLowerCase();
    if (['italy', 'romania'].includes(country)) {
      tester.testSpecificProxy(country)
        .then(() => process.exit(0))
        .catch(error => {
          console.error('Test failed:', error);
          process.exit(1);
        });
    } else if (args[0] === 'info') {
      tester.getProxyInfo()
        .then(() => process.exit(0))
        .catch(error => {
          console.error('Failed to get proxy info:', error);
          process.exit(1);
        });
    } else {
      console.log('Usage: node test-proxies.js [italy|romania|info]');
      process.exit(1);
    }
  } else {
    tester.testAllProxies()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
      });
  }
}

module.exports = ProxyTester;
