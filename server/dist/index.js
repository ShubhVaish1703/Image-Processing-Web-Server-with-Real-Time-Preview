"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Create an HTTP server
const server = http_1.default.createServer(app);
// Set up WebSocket server
const wss = new ws_1.Server({ server });
globalThis.wss = wss; // TypeScript declaration for global WebSocket server
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
// Enable CORS
app.use((0, cors_1.default)());
// Set a global prefix for all routes
const globalPrefix = '/api/v1';
app.use(globalPrefix, routes_1.default); // Use the routes with the global prefix
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${globalPrefix}`);
});
