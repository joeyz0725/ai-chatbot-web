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

export function getEnvApiConfig() {
  const envContents = fs.readFileSync('.env', 'utf-8');

  let openaiApiKey;
  let openaiApiBaseUrl;

  const lines = envContents.split('\n');
  for (const line of lines) {
    // 忽略带注释的行
    if (line.trim().startsWith('#')) {
      continue;
    }

    const [key, value] = line.split('=');
    if (key === 'OPENAI_API_KEY') {
      openaiApiKey = value.trim();
    } else if (key === 'OPENAI_API_BASE_URL') {
      openaiApiBaseUrl = value.trim();
    }
  }
  const config = {
    openaiApiKey: openaiApiKey,
    openaiApiBaseUrl: openaiApiBaseUrl
  }
  console.log(config)
  return config
}

export function saveEnvApiConfig(config) {
  try {
    // 读取 .env 文件内容
    const envContents = fs.readFileSync('.env', 'utf8');

    // 将每一行拆分成数组
    const lines = envContents.split('\n');

    // 寻找需要更新的行索引
    let keyTargetIndex = -1;
    let urlTargetIndex = -1;

    lines.forEach((line, index) => {
      if (line.trim().startsWith('OPENAI_API_KEY=') && !line.includes('#')) {
        keyTargetIndex = index;
      } else if (line.trim().startsWith('OPENAI_API_BASE_URL=') && !line.includes('#')) {
        urlTargetIndex = index;
      }
    });

    // 如果找到需要更新的行
    if (keyTargetIndex !== -1 && urlTargetIndex !== -1) {
      // 替换行中的值
      lines[keyTargetIndex] = `OPENAI_API_KEY=${config.apiKey}`;
      lines[urlTargetIndex] = `OPENAI_API_BASE_URL=${config.apiBaseUrl}`;

      // 更新 .env 文件内容
      const updatedEnvContents = lines.join('\n');
      fs.writeFileSync('.env', updatedEnvContents);

      // 同时更新环境变量
      process.env.OPENAI_API_KEY = config.apiKey;
      process.env.OPENAI_API_BASE_URL = config.apiBaseUrl;

      return true; // 修改成功
    }

    return false; // 没有找到需要更新的行
  } catch (err) {
    // console.error('无法更新 .env 文件:', err);
    return false; // 修改失败
  }
}