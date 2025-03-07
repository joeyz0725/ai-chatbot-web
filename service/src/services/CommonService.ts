import type { FindOneOptions } from 'typeorm'
import { getManager, getRepository } from 'typeorm'
import bcryptjs from 'bcryptjs'
import { User } from '../models/User'
import { generateRandomUsername, generateSpecificPassword } from '../utils/generate'
import { UserMessageCount } from '@/models/UserMessageCount'
import type { PasswordField } from '@/types'
import { RoleTypeMaxCountRel } from '@/types'

interface UserData {
  userId: number
  name: string
  email: string
  avatar: string
  description: string
  leftCount: number
}

export class CommonService {
  public async login(username: string, password: string) {
    const result = await this.checkBeforeLogin(username, password)
    const newResult = {
      user: result.data,
      leftCount: RoleTypeMaxCountRel.USER.maxCount,
      success: result.success,
      message: result.message,
    }
    // 查到了用户基本信息，还要查当前用户今日剩余聊天次数和权限
    if (result.success) {
      const { id: userId } = result.data
      const UserCountResult = await this.getUserCountByUserId(userId)
      if (UserCountResult.success)
        newResult.leftCount = UserCountResult.data.leftCount
    }
    return newResult
  }

  public async checkBeforeLogin(username, password) {
    const entityManager = getManager()
    const options: FindOneOptions<User> = {
      where: { username },
    }
    try {
      // 在数据库中查找匹配的用户
      const user = await entityManager.findOne(User, options)
      // 如果用户不存在，返回账号或密码不存在的错误
      if (!user)
        return { success: false, message: '账号不存在', data: null }

      // 检查密码是否匹配
      const isPasswordMatch = await bcryptjs.compare(password, user.password)
      if (!isPasswordMatch)
        return { success: false, message: '账号或密码错误', data: null }

      // 返回验证成功的结果
      return { success: true, data: user }
    }
    catch (error) {
      // 处理错误
      throw new Error('服务器错误')
    }
  }

  public async getUserCountByUserId(userId: number) {
    const entityManager = getManager()

    // 查询 user_message_counts 表中的 left_count 值
    const userMessageCount = await entityManager.findOne(UserMessageCount, {
      where: { user: { id: userId } },
    })
    try {
      if (userMessageCount) {
        return { success: true, data: userMessageCount }
      }
      else {
        let user = await entityManager.findOne(User, { where: { id: userId } })
        // 如果没有匹配的行，则创建一条新记录并关联用户
        if (!user) {
          const newUser = this.createNewUser()
          user = await entityManager.save(newUser)
        }
        const newUserMessageCount = new UserMessageCount()
        newUserMessageCount.user = user
        // 设置 leftCount 的初始值，根据role
        newUserMessageCount.leftCount = this.getLeftCountByRole(user.roleType)
        await entityManager.save(newUserMessageCount)
        return { success: true, data: userMessageCount }
      }
    }
    catch (error) {
      return { success: false, data: null, message: '查询失败' }
    }
  }

  private getLeftCountByRole(roleType: number) {
    if (roleType === RoleTypeMaxCountRel.GUEST.roleType)
      return RoleTypeMaxCountRel.GUEST.maxCount
    else if (roleType === RoleTypeMaxCountRel.USER.roleType)
      return RoleTypeMaxCountRel.USER.maxCount
    else if (roleType === RoleTypeMaxCountRel.VIP.roleType)
      return RoleTypeMaxCountRel.VIP.maxCount
    else if (roleType === RoleTypeMaxCountRel.ADMIN.roleType)
      return RoleTypeMaxCountRel.ADMIN.maxCount

    return RoleTypeMaxCountRel.GUEST.maxCount
  }

  private createNewUser() {
    const newUser = new User()
    const password = generateSpecificPassword()
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)
    newUser.username = generateRandomUsername()
    newUser.password = hashedPassword
    newUser.roleType = RoleTypeMaxCountRel.USER.roleType
    return newUser
  }

  public async changePassword(userId: number, passwordInfo: PasswordField) {
    const userRepository = getRepository(User); 
    // 根据 userId 查询 User 表中的用户对象
    const user = await userRepository.findOne({where: { id :userId }});
    // 如果用户不存在，返回错误信息
    if (!user) {
      return { success: false, message: '用户不存在' };
    }
    // 判断提供的旧密码是否与数据库中的密码一致
    const isOldPasswordCorrect = await bcryptjs.compare(passwordInfo.oldPassword, user.password);
    // 如果旧密码不正确，返回错误信息
    if (!isOldPasswordCorrect) {
      return { success: false, message: '旧密码错误' };
    }

    // 判断新密码和确认密码是否一致
    if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      return { success: false, message: '确认密码和新的密码不一致' };
    }

    // 将新密码加密并保存到数据库中
    const saltRounds = 10; // 设置盐值的轮数（根据实际需求进行调整）
    const hashedNewPassword = await bcryptjs.hash(passwordInfo.newPassword, saltRounds);
    user.password = hashedNewPassword;
    await userRepository.save(user);

    // 返回成功信息
    return { success: true, message: '密码修改成功' };
  }
}
