import jwt from 'jsonwebtoken'
import type { NextFunction, Response } from 'express'
import type { AuthenticatedRequest } from './types'

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction):
  Promise<Response<any, Record<string, any>> | void> {
  req.userId = null
  const token = req.headers['authorization-web']?.split(' ')[1]
  if (!token) {
    // 如果没有提供JWT令牌，未登录
    return next()
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '')
    if (decoded.userId)
      req.userId = decoded.userId
  }
  catch (error) {
    // JWT验证失败或发生其他错误
    req.userId = null
  }
  finally {
    next()
  }
}
