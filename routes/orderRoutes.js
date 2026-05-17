import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/create-payment', orderController.createPayment);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/create-cod-order', orderController.createCodOrder);

export default router;
