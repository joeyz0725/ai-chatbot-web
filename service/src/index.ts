import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import { connectToDatabase } from './config/database'
import 'reflect-metadata'
import { createAAdmin, initializeSecretKeys, createSession } from './config/init'

// 加载 .env 文件
dotenv.config() 

const app = express()

async function startServer() {
  try {
    // 建立数据库连接
    await connectToDatabase()
    // 如果是首次启动，判断创建一个管理员账号
    createAAdmin()
    // 初始化.env中的JWT_SECRET_KEY和SESSION_SECRET_KEY
    initializeSecretKeys()

    app.use(createSession())
    // Use the routes defined in routes.ts
    app.use('', routes)
    app.use('/api', routes)

    // ... 其他逻辑 ...

    app.listen(3000, () => console.log('Server is running on port 3000'))
  }
  catch (error) {
    console.error('Failed to start the server:', error)
  }
}

startServer()
