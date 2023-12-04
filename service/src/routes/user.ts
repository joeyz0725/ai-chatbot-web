import express from 'express';
import { authenticateUser } from '../middlewares/user/authenticateUser';
import { UserController } from '@/controllers/UserController'



const userRouter = express.Router();

userRouter.use(express.static('public'));
userRouter.use(express.json());

const userController = new UserController();

userRouter.post('/user-state', [authenticateUser], async (req, res) => {
  await userController.getUserState(req, res)
});

userRouter.post('/visitor-state', [authenticateUser], async (req, res) => {
  await userController.getVisitorState(req, res)
});

userRouter.post('/save-user', [authenticateUser], async (req, res) => {
  await userController.saveUserInfo(req, res)
});
export default userRouter;