import e from 'express';
import { sendEmail } from './email.js';

const MAX_ERROR_COUNT = 5;
let errorCount = 0;
let stopPinging = false;
async function pingServer() {
  try {
    const response = await fetch(process.env.PING_URL);
    if (response.ok) {
      console.log('Self ping successful');
      errorCount = 0;
    } else {
      console.error('Self ping failed with status code:', response.status);
      errorCount++;
      if (errorCount >= MAX_ERROR_COUNT) {
        console.error('Max error count reached. Stopping self ping.');
        const emailresponse = await sendEmail(
          process.env.ADMIN_EMAIL,
          `Self ping failed with status code: ${response.status}`,
        );
        if (emailresponse.success) {
          console.log('Admin has been notified via email');
        }
        stopPinging = true;
      }
    }
  } catch (error) {
    console.error('Error during ping:', error);
  } finally {
    if (stopPinging) return;
    setTimeout(
      pingServer,
      parseInt(process.env.PING_INTERVAL_IN_MS) || 60 * 1000 * 15,
    );
  }
}

export default pingServer;
