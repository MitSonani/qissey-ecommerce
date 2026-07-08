import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCartItems);
router.post('/', cartController.addToCart);
router.put('/:cartItemId', cartController.updateCartQuantity);
router.delete('/:cartItemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
