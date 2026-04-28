const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/reviews
// @access  Público
router.get('/', reviewController.getAllReviews);

// @route   POST /api/reviews
// @access  Privado
router.post('/', authMiddleware, reviewController.createReview);

// @route   DELETE /api/reviews/:id
// @access  Privado
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
