import { Like, getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import type { AccountField } from '../types'
import { RoleTypeMaxCountRel } from '../types'
import { User } from '@/models/User'
import { UserMessageCount } from '@/models/UserMessageCount'

export class AdminService {
  public async createAccount(userId: number, account: AccountField) {
    const userRepository = getRepository(User)
    const reqUser = await userRepository.findOne({ where: { id: userId } })

    if (!reqUser || reqUser.roleType !== RoleTypeMaxCountRel.ADMIN.roleType)
      return { success: false, message: '非管理员无权限操作' }

    // 检查用户名是否已存在
    const existingUser = await userRepository.findOne({ where: { username: account.username } })
    if (existingUser)
      return { success: false, message: '用户名已存在' }

    const newUser = new User()
    newUser.username = account.username
    newUser.password = account.password
    newUser.roleType = account.roleType

    const userMessageCountRepository = getRepository(UserMessageCount)
    const newUserMessageCount = new UserMessageCount()
    newUserMessageCount.user = newUser
    if (account.roleType === RoleTypeMaxCountRel.USER.roleType) {
      newUserMessageCount.leftCount = RoleTypeMaxCountRel.USER.maxCount
    }
    else if (account.roleType === RoleTypeMaxCountRel.VIP.roleType) {
      newUserMessageCount.leftCount = RoleTypeMaxCountRel.VIP.maxCount
    }
    else if (account.roleType === RoleTypeMaxCountRel.ADMIN.roleType) {
      // 如果添加管理员，系统不能超过2个管理员
      const adminUserCount = await userRepository.count({
        where: { roleType: RoleTypeMaxCountRel.ADMIN.roleType },
      })
      if (adminUserCount >= 2)
        return { success: false, message: '管理员不能超过2个' }

      newUserMessageCount.leftCount = RoleTypeMaxCountRel.ADMIN.maxCount
    }
    try {
      await userRepository.save(newUser)
      await userMessageCountRepository.save(newUserMessageCount)
      return { success: true, message: '创建成功' }
    }
    catch (error) {
      return { success: false, message: '创建失败' }
    }
  }

  public async searchAccounts(userId: number, searchParams: string) {
    try {
      // 通过 userId 去数据库查找对应的 User 对象
      const reqUser = await this.findUserById(userId)
      // 如果 User 不存在或者 User 中的 roleType 的值小于 100，则返回无权限操作
      if (!reqUser || reqUser.roleType < 100)
        return { success: false, message: '无权限操作' }

      // 如果 User 存在且 roleType 的值等于 100
      // 查询 username 或 name 近似等于 searchParams 的所有数据
      // 如果 searchParams 为空，则查询所有 User 表中的数据
      let users
      if (searchParams)
        users = await this.queryUsersByUsernameOrName(searchParams)
      else
        users = await this.queryAllUsers()

      // 对查询到的数据进行封装，只包含 id、username 和 name 字段
      const data = users.map((user) => {
        return { success: true, data: { id: user.id, username: user.username, name: user.name } }
      })

      return { success: true, message: '查询成功', data }
    }
    catch (error) {
      return { success: false, message: `查询失败：${error.message}` }
    }
  }

  private async findUserById(userId: number) {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ where: { id: userId } })
    return user
  }

  private async queryUsersByUsernameOrName(searchParams: string) {
    const userRepository = getRepository(User)
    const users = await userRepository.find({
      where: [
        { username: Like(`%${searchParams}%`) },
        { name: Like(`%${searchParams}%`) },
      ],
    })
    return users
  }

  private async queryAllUsers() {
    const userRepository = getRepository(User)
    const users = await userRepository.find()
    return users
  }

  public async resetUserPasswords(ids: number[]) {
    try {
      const userRepository = getRepository(User)

      // 根据 ids 查询对应的用户数据项
      const users = await userRepository.findByIds(ids)
      // 遍历查询结果，修改密码并保存
      users.forEach(async (user) => {
        user.password = await bcrypt.hash('qixiaobao@2023', 10)
        await userRepository.save(user)
      })
      return { success: true, message: '密码重置成功' }
    }
    catch (error) {
      return { success: false, message: '密码重置失败' }
    }
  }
}
