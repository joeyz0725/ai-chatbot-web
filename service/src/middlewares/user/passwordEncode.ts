import bcryptjs from 'bcryptjs'
import type { NextFunction, Response } from 'express'
import type { AuthenticatedRequest } from './types'

// 密码加密中间件
export async function encryptPassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction):
  Promise<Response<any, Record<string, any>> | void> {
  const { password } = req.body.user
  // 使用 bcrypt 进行密码加密
  bcryptjs.hash(password, 10)
    .then((hashedPassword) => {
      // 将加密后的密码保存到 req.body.user 中
      req.body.user.password = hashedPassword
      next()
    })
    .catch((err) => {
      throw(err)
    })
}

export async function encryptChangedPassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction):
  Promise<Response<any, Record<string, any>> | void> {
  const passwordInfo= req.body.passwordInfo
  const hashedPasswords = {};
  try {
    for (const key in passwordInfo) {
      if (passwordInfo.hasOwnProperty(key)) {
        const password = passwordInfo[key];
        hashedPasswords[key] = bcryptjs.hashSync(password, 10);
      }
    }
    req.body.passwordInfo = hashedPasswords
    next()
  }
  catch(err) {
    throw(err)
  }
}
