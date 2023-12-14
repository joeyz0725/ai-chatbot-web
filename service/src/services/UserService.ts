import { getRepository } from 'typeorm'
import { User } from '../models/User'
import { UserMessageCount } from '../models/UserMessageCount'
import { ChatService } from './ChatService'

export class UserService {
  private chatService: ChatService

  constructor() {
    this.chatService = new ChatService()
  }

  public async getUserStateById(userId: number) {
    const userRepository = getRepository(User)
    const userMessageCountRepository = getRepository(UserMessageCount)

    try {
      const user = await userRepository.findOne({ where: { id: userId } })
      const userMessageCount = await userMessageCountRepository.findOne({ where: { user } })

      if (user && userMessageCount) {
        return {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
          roleType: user.roleType,
          leftCount: userMessageCount.leftCount,
        }
      }
      else {
        return null
      }
    }
    catch (error) {
      throw new Error('Failed to fetch user data')
    }
  }

  public async getUserStateByIpAddress(ipAddress: string, sessionId: string) {
    // 因为未登录的用户只有LeftCount可以获得，没有用户信息
    const leftCount = await this.chatService.getLeftCountByIpAddress(ipAddress, sessionId)
    return leftCount
  }

  public async saveUserInfoById(userId: number, userInfo: Partial<User>) {
    const userRepository = getRepository(User)

    try {
    // 根据 userId 查找对应的用户
      const user = await userRepository.findOne({ where: { id: userId } })

      if (user) {
      // 更新用户的 name、avatar、description 字段
        user.name = userInfo.name || user.name
        user.avatar = userInfo.avatar || user.avatar
        user.description = userInfo.description || user.description

        // 保存更新后的用户信息到数据库
        await userRepository.save(user)
        return { success: true }
      }
    }
    catch (error) {
      throw new Error('Failed to save user information')
    }
  }
}
