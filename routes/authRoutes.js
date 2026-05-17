import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/verify-user', authController.verifyUser);

export default router;
