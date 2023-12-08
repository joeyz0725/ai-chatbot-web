import bcryptjs from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './types'

// 密码加密中间件
export async function encryptPassword(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction): 
Promise<Response<any, Record<string, any>> | void> {
  const { password } = req.body.user;
  // 使用 bcrypt 进行密码加密
  bcryptjs.hash(password, 10)
    .then(hashedPassword => {
      // 将加密后的密码保存到 req.body.user 中
      req.body.user.password = hashedPassword;
      next()
    })
    .catch(err => {
      res.status(500).json({ error: '加密失败' });
      res.end()
    });
};