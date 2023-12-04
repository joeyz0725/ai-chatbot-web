import express from 'express';
import routes from './routes';
import { connectToDatabase } from './config/database';
import dotenv from 'dotenv';
import "reflect-metadata";

dotenv.config(); // 加载 .env 文件

const app = express();

async function startServer() {
  try {
    // 建立数据库连接
    const connection = await connectToDatabase();

    // ... 其他逻辑 ...

    // Use the routes defined in routes.ts
    app.use('', routes);
    app.use('/api', routes);

    // ... 其他逻辑 ...

    app.listen(3002, () => console.log('Server is running on port 3002'));
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

startServer();