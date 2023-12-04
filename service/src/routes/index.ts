import { Router } from 'express';
import coreRoutes from './core';
import chatRoutes from './chat';
import userRoutes from './user';
import commonRoutes from './common';

const router = Router();
router.use('', coreRoutes);
router.use('/chat', chatRoutes);
router.use('/user', userRoutes);
router.use('/common', commonRoutes);

export default router;