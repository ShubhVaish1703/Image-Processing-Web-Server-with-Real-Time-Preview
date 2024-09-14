"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const router = (0, express_1.Router)();
// Define routes under this router
router.get('/', (req, res) => {
    res.send('Server is live!');
});
// Routes
router.use('/images', imageRoutes_1.default);
exports.default = router;
