import type { FindOneOptions } from 'typeorm'
import { getManager, getRepository } from 'typeorm'
import { User } from '../models/User'
import { UserMessageCount } from '../models/UserMessageCount'
import { IpAddressMessageCount } from '../models/IpAddressMessageCount'
import { CommonService } from './CommonService'
import { RoleTypeMaxCountRel } from '@/types'

export class ChatService {
  private commonService: CommonService
  constructor() {
    this.commonService = new CommonService()
  }

  public async getLeftCountByUserId(userId: number): Promise<number> {
    const reslut = await this.commonService.getUserCountByUserId(userId)
    if (reslut.success)
      return reslut.data.leftCount

    return 0
  }

  public async getLeftCountByIpAddress(ipAddress: string): Promise<number> {
    const entityManager = getManager()

    // 构建查询选项
    const options: FindOneOptions<IpAddressMessageCount> = {
      where: { ipAddress },
    }

    // 查询 ip_address_message_counts 表中的 left_count 值
    const ipAddressMessageCount = await entityManager.findOne(IpAddressMessageCount, options)

    if (ipAddressMessageCount) {
      return ipAddressMessageCount.leftCount
    }
    else {
      const newIpAddressMessageCount = new IpAddressMessageCount()
      newIpAddressMessageCount.ipAddress = ipAddress
      newIpAddressMessageCount.leftCount = RoleTypeMaxCountRel.GUEST.maxCount
      try {
        await entityManager.save(newIpAddressMessageCount)
      }
      catch (e) {
        throw (e)
      }
      return newIpAddressMessageCount.leftCount
    }
  }

  public async decreaseLeftCountByUserId(userId: number): Promise<void> {
    const userRepository = getRepository(User)
    const userMessageCountRepository = getRepository(UserMessageCount)
    const user = await userRepository.findOne({ where: { id: userId } })
    const userMessageCount = await userMessageCountRepository.findOne({ where: { user: { id: userId } } })

    // 只有roleType为0，说明是普通用户，才会减少聊天次数
    if (userMessageCount && user && user.roleType === RoleTypeMaxCountRel.USER.roleType
        && userMessageCount.leftCount > 0) {
      userMessageCount.leftCount -= 1
      await userMessageCountRepository.save(userMessageCount)
    }
  }

  public async decreaseLeftCountByIpAddress(ipAddress: string): Promise<void> {
    const ipAddressMessageCountRepository = getRepository(IpAddressMessageCount)
    const ipAddressMessageCount = await ipAddressMessageCountRepository.findOne({ where: { ipAddress } })
    if (ipAddressMessageCount && ipAddressMessageCount.leftCount > RoleTypeMaxCountRel.GUEST.maxCount) {
      ipAddressMessageCount.leftCount -= 1
      await ipAddressMessageCountRepository.save(ipAddressMessageCount)
    }
  }
}
