import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/recent', reviewController.getRecentReviews);
router.get('/product/:productId', reviewController.getProductReviews);

// Create review
router.post('/product/:productId', reviewController.createProductReview);

export default router;
