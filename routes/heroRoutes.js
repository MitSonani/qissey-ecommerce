import express from 'express';
import * as heroController from '../controllers/heroController.js';

const router = express.Router();

router.get('/', heroController.getHeroSlides);

export default router;
