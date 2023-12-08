import type { Request } from 'express'

// 定义一个接口，扩展 Request 类型
export interface AuthenticatedRequest extends Request {
  userId?: string // 或者根据实际情况指定 userId 的类型
}
