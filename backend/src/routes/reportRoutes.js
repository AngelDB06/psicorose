const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/appointments', authMiddleware, reportController.generateUserReport);

module.exports = router;
