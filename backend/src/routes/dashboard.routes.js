import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { getDashboardStats } from '../controllers/dashboard.controllers.js';

const router = Router();

router.get('/', verifyJWT, getDashboardStats);

export default router;
