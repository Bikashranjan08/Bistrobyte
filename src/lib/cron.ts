import cron from 'node-cron';
import mongoose from 'mongoose';
import User from '../models/User'; // Assuming we can import this, or just do a raw ping

// Function to keep the DB connection alive
let isInitialized = false;

export const initCronJobs = () => {
    if (isInitialized) return;
    isInitialized = true;
    console.log('Initializing Cron Jobs...');

    // Schedule a task to run every 12 hours
    // '0 */12 * * *' = At minute 0 past every 12th hour.
    cron.schedule('0 */12 * * *', async () => {
        console.log('[Cron] Checking DB connection to keep Atlas active...');
        try {
            if (mongoose.connection.readyState === 1) {
                // Perform a lightweight operation
                const count = await User.countDocuments();
                console.log(`[Cron] DB Active. User count: ${count}`);
            } else {
                console.log('[Cron] DB not connected, skipping ping.');
            }
        } catch (error) {
            console.error('[Cron] Error pinging DB:', error);
        }
    });
};
