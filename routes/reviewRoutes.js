import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/recent', reviewController.getRecentReviews);
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.post('/product/:productId', authMiddleware, reviewController.createProductReview);

export default router;
