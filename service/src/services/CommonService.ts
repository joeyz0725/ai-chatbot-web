import { getManager, FindOneOptions, getRepository  } from 'typeorm';
import { User } from '../models/User';
import { UserMessageCount } from '@/models/UserMessageCount';
import { ChatService } from './ChatService';

interface UserData {
  userId: number;
  name: string;
  email: string;
  avatar: string;
  description: string;
  leftCount: number;
}

export class CommonService {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService()
  }

  public async login(username: string, password: string) {
    const result = await this.checkBeforeLogin(username, password)
    // 查到了用户基本信息，还要查当前用户今日剩余聊天次数
    if (result.success) {
      const {id: userId} = result.data
      const leftCount = await this.chatService.getLeftCountByUserId(userId)
      if (leftCount) {
        result.data['leftCount'] = leftCount
      }
    }
    return result
  }

  public async checkBeforeLogin(username, password) {
    const entityManager = getManager();
    const options: FindOneOptions<User> = {
      where: { username: username }
    };
    try {
      // 在数据库中查找匹配的用户
      const user = await entityManager.findOne(User, options);
      // 如果用户不存在，返回账号或密码不存在的错误
      if (!user) {
        return { success: false, message: '账号不存在' };
      }
      // 检查密码是否匹配
      if (user.password !== password) {
        return { success: false, message: '账号或密码错误' };
      }
      // 返回验证成功的结果
      return { success: true, data: user}
    } catch (error) {
      // 处理错误
      throw new Error('服务器错误');
    }
  }

}