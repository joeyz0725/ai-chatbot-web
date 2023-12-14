import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '@/models/User'
import { RoleTypeMaxCountRel } from '@/types'
import { generateRandomKey } from '@/utils/generate'
import fs from 'fs'
import session from 'express-session'

export async function createAAdmin() {
  const userRepository = getRepository(User)
  try {
    // 执行查询操作
    const adminUser = await userRepository.find(
      {
        where:
      { roleType: RoleTypeMaxCountRel.ADMIN.roleType },
      })
    if (!adminUser || adminUser.length === 0) {
      const adminUsername = process.env.ADMIN_USERNAME
      const adminPassword = process.env.ADMIN_PASSWORD
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(adminPassword, salt)

      const newAdminUser = new User()
      newAdminUser.username = adminUsername
      newAdminUser.password = hashedPassword
      newAdminUser.roleType = RoleTypeMaxCountRel.ADMIN.roleType
      newAdminUser.name = process.env.ADMIN_NAME
      newAdminUser.description = process.env.ADMIN_DESCRIPTION

      await userRepository.save(newAdminUser)
    }
  }
  catch (error) {
    console.error('数据库初始化失败:', error)
  }
}

export function initializeSecretKeys() {
  // 读取 .env 文件
  let envContents = fs.readFileSync('.env', 'utf-8');

  // 生成或更新 JWT_SECRET_KEY
  if (!process.env.JWT_SECRET_KEY) {
    const jwtSecretKey = generateRandomKey();
    envContents = envContents.replace(/JWT_SECRET_KEY=.*/, `JWT_SECRET_KEY=${jwtSecretKey}`);
    fs.writeFileSync('.env', envContents);
    process.env.JWT_SECRET_KEY = jwtSecretKey;
  }

  // 生成或更新 SESSION_SECRET_KEY
  if (!process.env.SESSION_SECRET_KEY) {
    const sessionSecretKey = generateRandomKey();
    envContents = envContents.replace(/SESSION_SECRET_KEY=.*/, `SESSION_SECRET_KEY=${sessionSecretKey}`);
    fs.writeFileSync('.env', envContents);
    process.env.SESSION_SECRET_KEY = sessionSecretKey;
  }
}

export function createSession() {
  return session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
}