const express = require('express');
const router = express.Router();
const ScrapeController = require('../controllers/ScrapeController');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');

// Scraping endpoints
router.post('/italy', authMiddleware, ScrapeController.scrapeItaly);
router.post('/romania', authMiddleware, ScrapeController.scrapeRomania);

// Job management endpoints
router.get('/jobs', authMiddleware, ScrapeController.getJobs);
router.get('/jobs/:jobId', authMiddleware, ScrapeController.getJobStatus);
router.delete('/jobs/:jobId', authMiddleware, ScrapeController.cancelJob);

module.exports = router;
