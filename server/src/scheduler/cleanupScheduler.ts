import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// Path to the temporary folder
const TEMP_FOLDER = path.join(__dirname, '../../temp');

// Cleanup function to delete old files
const cleanupTempFolder = () => {
    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    fs.readdir(TEMP_FOLDER, (err, files) => {
        if (err) {
            console.error('Error reading temp folder:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(TEMP_FOLDER, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                // Check if the file is older than the expiration time
                if (now - stats.mtimeMs > expirationTime) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log(`Deleted old file: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
};

// Schedule cleanup every 24 hours (runs at midnight every day)
cron.schedule('0 0 * * *', cleanupTempFolder);
