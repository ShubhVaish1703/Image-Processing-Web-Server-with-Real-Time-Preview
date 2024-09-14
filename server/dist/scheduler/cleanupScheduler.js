"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Path to the temporary folder
const TEMP_FOLDER = path_1.default.join(__dirname, '../../temp');
// Cleanup function to delete old files
const cleanupTempFolder = () => {
    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    fs_1.default.readdir(TEMP_FOLDER, (err, files) => {
        if (err) {
            console.error('Error reading temp folder:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path_1.default.join(TEMP_FOLDER, file);
            fs_1.default.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                // Check if the file is older than the expiration time
                if (now - stats.mtimeMs > expirationTime) {
                    fs_1.default.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                        else {
                            console.log(`Deleted old file: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
};
// Schedule cleanup every 24 hours (runs at midnight every day)
node_cron_1.default.schedule('0 0 * * *', cleanupTempFolder);
