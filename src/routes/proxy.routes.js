const express = require('express');
const router = express.Router();
const ProxyService = require('../services/ProxyService');
const authMiddleware = require('../middleware/auth.middleware');

// Get proxy status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const stats = ProxyService.getProxyStats();
    const health = await ProxyService.getProxyHealth();
    
    res.json({
      success: true,
      stats,
      health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test specific proxy
router.post('/test/:country', authMiddleware, async (req, res) => {
  try {
    const { country } = req.params;
    
    if (!['italy', 'romania'].includes(country.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid country. Use "italy" or "romania"'
      });
    }
    
    const result = await ProxyService.testProxy(country.toLowerCase());
    
    res.json({
      success: true,
      country: country.toLowerCase(),
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test all proxies
router.post('/test-all', authMiddleware, async (req, res) => {
  try {
    const results = await ProxyService.testAllProxies();
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get proxy configuration
router.get('/config', authMiddleware, (req, res) => {
  try {
    const stats = ProxyService.getProxyStats();
    
    res.json({
      success: true,
      config: {
        enabled: stats.enabled,
        proxies: stats.details
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get proxy health
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const health = await ProxyService.getProxyHealth();
    
    res.json({
      success: true,
      health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
