import express from 'express';
import { authenticateUser } from '../middlewares/user/authenticateUser';
import { ChatStateController } from '../controllers/ChatStateController';

const chatRouter = express.Router();

chatRouter.use(express.static('public'));
chatRouter.use(express.json());

const chatStateController = new ChatStateController();

chatRouter.post('/chat-state', [authenticateUser], async (req, res) => {
  // await chatController.handleChatProcess(req, res);
  await chatStateController.fetchChatState(req, res)
});

chatRouter.post('/update-chat-state', [authenticateUser], async (req, res) => {
  await chatStateController.updateChatState(req, res)
});

export default chatRouter;