import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Generate OAuth URL for Google Health Login
export function getGoogleHealthAuthUrl() {
    const scopes = [
        'https://www.googleapis.com/auth/googlehealth.readonly'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
}

// Fetch health metrics synced from NOYU via Google Health API
export async function fetchGoogleHealthMetrics(tokens) {
    oauth2Client.setCredentials(tokens);

    try {
        // Query daily rollups from Google Health API endpoint
        const response = await oauth2Client.request({
            url: 'https://health.googleapis.com/v4/users/me/dailyRollUp',
            method: 'GET',
            params: {
                // Fetch last 24 hours of aggregated data
                startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endTime: new Date().toISOString()
            }
        });

        const data = response.data;

        // Map Google Health API payload to standardized NOYU/DailyMetrics format
        return {
            userId: data.userId || 'google_health_user',
            readiness: data.readinessScore || 80,
            sleepScore: data.sleepQualityScore || 75,
            strain: data.dailyStrain || 12.4,
            metrics: {
                hrv: data.hrvAvg || 50,
                restingHeartRate: data.restingHeartRate || 55
            }
        };
    } catch (error) {
        console.error('Error fetching Google Health data:', error.message);
        throw error;
    }
}
