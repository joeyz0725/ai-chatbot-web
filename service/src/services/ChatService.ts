import { getManager, FindOneOptions, getRepository  } from 'typeorm';
import { User } from '../models/User';
import { UserMessageCount } from '../models/UserMessageCount';
import { IpAddressMessageCount } from '../models/IpAddressMessageCount';
import { MaxMessageCount } from'@/types'

export class ChatService {
  public async getLeftCountByUserId(userId: number): Promise<number> {
    const entityManager = getManager();

    // 查询 user_message_counts 表中的 left_count 值
    const userMessageCount = await entityManager.findOne(UserMessageCount, {
      where: { user: { id: userId } },
    });

    if (userMessageCount) {
      return userMessageCount.leftCount;
    } else {
      let user = await entityManager.findOne(User, { where: {id: userId }});
      // 如果没有匹配的行，则创建一条新记录并关联用户
      if (!user) {
        const newUser = new User();
        user = await entityManager.save(newUser);
      }
      const newUserMessageCount = new UserMessageCount();
      newUserMessageCount.user = user;
      newUserMessageCount.leftCount = MaxMessageCount.USER; // 设置 leftCount 的初始值
      await entityManager.save(newUserMessageCount);
      return newUserMessageCount.leftCount;
    }
  }

  public async getLeftCountByIpAddress(ipAddress: string): Promise<number> {
    const entityManager = getManager();

    // 构建查询选项
    const options: FindOneOptions<IpAddressMessageCount> = {
      where: { ipAddress: ipAddress },
    };

    // 查询 ip_address_message_counts 表中的 left_count 值
    const ipAddressMessageCount = await entityManager.findOne(IpAddressMessageCount, options);

    if (ipAddressMessageCount) {
      return ipAddressMessageCount.leftCount;
    } else {
      const newIpAddressMessageCount = new IpAddressMessageCount()
      newIpAddressMessageCount.ipAddress = ipAddress
      newIpAddressMessageCount.leftCount = MaxMessageCount.GUEST
      await entityManager.save(newIpAddressMessageCount)
      return newIpAddressMessageCount.leftCount
    }
  }

  public async decreaseLeftCountByUserId(userId: number): Promise<void> {
    const userMessageCountRepository = getRepository(UserMessageCount);
    const userMessageCount = await userMessageCountRepository.findOne({ where: { user: { id: userId } } });

    // 只有roleType为0，说明是普通用户，才会减少聊天次数
    if (userMessageCount && userMessageCount.roleType === 0 
        && userMessageCount.leftCount > 0) {
      userMessageCount.leftCount -= 1;
      await userMessageCountRepository.save(userMessageCount);
    }
  }

  public async decreaseLeftCountByIpAddress(ipAddress: string): Promise<void> {
    const ipAddressMessageCountRepository = getRepository(IpAddressMessageCount);
    const ipAddressMessageCount = await ipAddressMessageCountRepository.findOne({ where: { ipAddress } });
    if (ipAddressMessageCount && ipAddressMessageCount.leftCount > 0) {
      ipAddressMessageCount.leftCount -= 1;
      await ipAddressMessageCountRepository.save(ipAddressMessageCount);
    }
  }
}