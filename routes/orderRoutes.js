import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment', orderController.createPayment);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/create-cod-order', orderController.createCodOrder);

// Authenticated routes
router.use(authMiddleware);
router.get('/', orderController.getUserOrders);
router.get('/:orderId', orderController.getOrderById);

export default router;
