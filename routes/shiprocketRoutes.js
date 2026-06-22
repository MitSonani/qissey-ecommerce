import express from 'express';
import * as shiprocketController from '../controllers/shiprocketController.js';

const router = express.Router();

// Middleware to verify Shiprocket API key if configured
// const shiprocketAuthMiddleware = (req, res, next) => {
//     const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;

//     // Skip authorization checks if key is not configured or is the default template value
//     if (!apiKey || apiKey.includes('your_shiprocket_checkout_api_key_here')) {
//         return next();
//     }

//     const reqKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

//     if (reqKey !== apiKey) {
//         return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
//     }

//     next();
// };

// // Apply auth middleware to all Shiprocket routes
// router.use(shiprocketAuthMiddleware);

router.get('/products', shiprocketController.getProducts);
router.get('/collections', shiprocketController.getCollections);
router.get('/collections/:collectionId/products', shiprocketController.getProductsByCollection);

export default router;
