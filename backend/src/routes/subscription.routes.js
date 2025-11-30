import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  toggleSubscription,
  getSubscribers,
  getSubscribedChannels,
  isSubscribed
} from '../controllers/subscription.controllers.js';

const router = Router();

router.post('/toggle/:channelId', verifyJWT, toggleSubscription);

router.get('/subscribers/:channelId', getSubscribers);

router.get('/my/channels', verifyJWT, getSubscribedChannels);

router.get('/status/:channelId', verifyJWT, isSubscribed);

export default router;
