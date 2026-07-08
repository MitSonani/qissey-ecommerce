import express from 'express';
import * as addressController from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // All address routes require authentication

router.get('/', addressController.getUserAddresses);
router.post('/', addressController.createAddress);
router.delete('/:addressId', addressController.deleteAddress);

export default router;
