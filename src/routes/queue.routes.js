const express = require('express');
const router = express.Router();
const Queue = require('bull');
const queueConfig = require('../config/queue.config');

// Create queue instance for dashboard
const scrapeQueue = new Queue('scraping jobs', {
  redis: queueConfig.redis,
  defaultJobOptions: queueConfig.defaultJobOptions,
  settings: queueConfig.settings,
});

// Get queue status
router.get('/status', async (req, res) => {
  try {
    const waiting = await scrapeQueue.getWaiting();
    const active = await scrapeQueue.getActive();
    const completed = await scrapeQueue.getCompleted();
    const failed = await scrapeQueue.getFailed();
    
    res.json({
      success: true,
      queue: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total: waiting.length + active.length + completed.length + failed.length
      },
      jobs: {
        waiting: waiting.slice(0, 10).map(job => ({
          id: job.id,
          type: job.name,
          data: job.data,
          created_at: job.timestamp
        })),
        active: active.slice(0, 10).map(job => ({
          id: job.id,
          type: job.name,
          data: job.data,
          progress: job.progress(),
          started_at: job.processedOn
        })),
        completed: completed.slice(0, 10).map(job => ({
          id: job.id,
          type: job.name,
          data: job.data,
          completed_at: job.finishedOn,
          duration: job.finishedOn - job.processedOn
        })),
        failed: failed.slice(0, 10).map(job => ({
          id: job.id,
          type: job.name,
          data: job.data,
          failed_at: job.failedOn,
          error: job.failedReason
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific job details
router.get('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await scrapeQueue.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    const state = await job.getState();
    const progress = job.progress();
    
    res.json({
      success: true,
      job: {
        id: job.id,
        type: job.name,
        data: job.data,
        state: state,
        progress: progress,
        created_at: job.timestamp,
        processed_at: job.processedOn,
        completed_at: job.finishedOn,
        failed_at: job.failedOn,
        error: job.failedReason,
        attempts: job.attemptsMade,
        max_attempts: job.opts.attempts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Pause queue
router.post('/pause', async (req, res) => {
  try {
    await scrapeQueue.pause();
    res.json({
      success: true,
      message: 'Queue paused'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Resume queue
router.post('/resume', async (req, res) => {
  try {
    await scrapeQueue.resume();
    res.json({
      success: true,
      message: 'Queue resumed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clean completed jobs
router.post('/clean', async (req, res) => {
  try {
    const { type = 'completed', count = 100 } = req.body;
    await scrapeQueue.clean(5000, type, count);
    
    res.json({
      success: true,
      message: `Cleaned ${count} ${type} jobs`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
