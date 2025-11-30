import { Router } from 'express';
import { searchAll } from '../controllers/search.controllers.js';

const router = Router();

router.get('/', searchAll);

export default router;
