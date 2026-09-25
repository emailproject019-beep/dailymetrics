import axios from 'axios';

export async function fetchNoyuHealthData(userId) {
    console.log(`[NOYU] Fetching health metrics for user: ${userId}...`);
    
    // In a production environment, you would fetch this from the NOYU API:
    // const response = await axios.get(`${process.env.NOYU_API_URL}/health/${userId}`, {
    //     headers: { Authorization: `Bearer ${process.env.NOYU_API_KEY}` }
    // });
    // return response.data;

    // Returning mock NOYU data for the prototype
    return {
        userId: userId,
        readiness: 82,
        sleepScore: 78,
        strain: 14.5,
        metrics: {
            hrv: 55,
            restingHeartRate: 48
        }
    };
}
