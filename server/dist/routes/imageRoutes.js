"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const multerConfig_1 = require("../utils/multerConfig");
const router = (0, express_1.Router)();
// Upload image route
router.post('/upload', multerConfig_1.upload.single('image'), imageController_1.uploadImage);
// Process image route
router.post('/process', multerConfig_1.upload.single('image'), imageController_1.processImage);
// Download image route
router.get('/download', imageController_1.downloadImage);
exports.default = router;
