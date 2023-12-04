import express from 'express';
import path from 'path';
import { RequestProps } from '../types';
import type { ChatMessage } from '../chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from '../chatgpt';
import { auth } from '../middlewares/auth';
import { limiter } from '../middlewares/limiter';
import { authenticateUser } from '../middlewares/user/authenticateUser';
import { isNotEmptyString } from '../utils/is';
import { ChatController } from '../controllers/ChatController';

const router = express.Router();

router.use(express.static('public'));
router.use(express.json());

router.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

const chatController = new ChatController();

router.post('/chat-process', [auth, limiter, authenticateUser], async (req, res) => {
  await chatController.handleChatProcess(req, res);
});

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY);
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } });
  } catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) throw new Error('Secret key is empty');

    if (process.env.AUTH_SECRET_KEY !== token) throw new Error('密钥无效 | Secret key is invalid');

    res.send({ status: 'Success', message: 'Verify successfully', data: null });
  } catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null });
  }
});

export default router;
