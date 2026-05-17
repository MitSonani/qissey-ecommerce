import express from 'express';
import * as productController from '../controllers/productController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (with optional auth for saved products check)
router.get('/', optionalAuthMiddleware, productController.getProducts);
router.get('/new-arrivals', optionalAuthMiddleware, productController.getNewArrivals);
router.get('/collections', productController.getAllCollections);
router.get('/collections/:id', productController.getCollectionById);
router.get('/collections/:collectionId/products', optionalAuthMiddleware, productController.getProductsByCollection);
router.get('/related', optionalAuthMiddleware, productController.getRelatedProducts);
router.post('/complete-the-look', optionalAuthMiddleware, productController.getCompleteTheLook);
router.get('/slug/:slug', optionalAuthMiddleware, productController.getProductBySlug);
router.get('/:id', optionalAuthMiddleware, productController.getProductById);

// Protected routes
router.get('/saved/list', authMiddleware, productController.getSavedProducts);
router.post('/saved', authMiddleware, productController.saveProduct);
router.delete('/saved/:productId', authMiddleware, productController.unsaveProduct);

export default router;
