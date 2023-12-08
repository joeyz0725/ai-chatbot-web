import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '@/models/User'
import { RoleTypeMaxCountRel } from '@/types'

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
      const adminUsername = 'admin'
      const adminPassword = 'qixiaobao@2024'
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(adminPassword, salt)

      const newAdminUser = new User()
      newAdminUser.username = adminUsername
      newAdminUser.password = hashedPassword
      newAdminUser.roleType = RoleTypeMaxCountRel.ADMIN.roleType
      newAdminUser.name = '奇小宝'
      newAdminUser.description = '高贵的管理员'

      await userRepository.save(newAdminUser)
    }
  }
  catch (error) {
    console.error('数据库初始化失败:', error)
  }
}
