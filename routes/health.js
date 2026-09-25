import express from 'express';
import { getGoogleHealthAuthUrl, fetchGoogleHealthMetrics } from '../services/googleHealthService.js';
import { runDaytonaAnalysis } from '../services/daytonaService.js';

const router = express.Router();

// 1. Redirect user to Google OAuth screen
router.get('/auth/google', (req, res) => {
    const url = getGoogleHealthAuthUrl();
    res.redirect(url);
});

// 2. OAuth Callback & Trigger Daytona Sandbox
router.get('/auth/callback/google', async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange code for access tokens
        const { tokens } = await oauth2Client.getToken(code);
        
        // Fetch health data synced from NOYU via Google Health
        const healthMetrics = await fetchGoogleHealthMetrics(tokens);

        // Send retrieved metrics to Daytona Python sandbox for analysis
        const aiAnalysis = await runDaytonaAnalysis(healthMetrics);

        res.json({
            status: 'success',
            metrics: healthMetrics,
            analysis: aiAnalysis
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process Google Health data', details: err.message });
    }
});

export default router;
