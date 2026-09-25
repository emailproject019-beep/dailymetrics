import express from 'express';
import { runDaytonaAnalysis } from '../services/daytonaService.js';

const router = express.Router();

// Ingest health metrics directly pushed from phone's Health Connect / NOYU app
router.post('/api/ingest/health-connect', async (req, res) => {
    try {
        const { readiness, sleepScore, strain, hrv, restingHeartRate, userId } = req.body;

        const payload = {
            userId: userId || 'mobile_user',
            readiness: readiness || 0,
            sleepScore: sleepScore || 0,
            strain: strain || 0,
            metrics: { hrv, restingHeartRate }
        };

        // Instantly trigger Daytona Sandbox processing
        const analysis = await runDaytonaAnalysis(payload);

        res.status(200).json({
            message: 'Metrics received and processed via Daytona',
            analysis
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
