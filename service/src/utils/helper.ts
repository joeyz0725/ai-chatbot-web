import jwt from 'jsonwebtoken'

export function extractIPv4Address(ipAddress: string): string {
  return ipAddress.replace(/^::ffff:/, '')
}

export function generateToken(payload) {
  // const secretKey = process.env.JWT_SECRET_KEY;
  // 生成 JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
  return token
}

export const getMorningTime = (nextDay: boolean): Date => {
  const morningTime = new Date()
  morningTime.setDate(morningTime.getDate() + (nextDay ? 1 : 0)) // 如果是明天则加1，否则加0
  morningTime.setHours(5, 0, 0, 0) // 设置为凌晨5点
  return morningTime
}
