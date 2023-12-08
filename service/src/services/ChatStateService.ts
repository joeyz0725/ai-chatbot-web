import { getRepository } from 'typeorm'
import { ChatDialogue } from '../models/ChatDialogue'
import { User } from '../models/User'

export class ChatStateService {
  public async getChatStateByUserId(userId: number): Promise<string | null> {
    try {
      const chatDialogueRepository = getRepository(ChatDialogue)
      const chatDialogue = await chatDialogueRepository.findOne({ where: { user: { id: userId } } })

      if (chatDialogue)
        return chatDialogue.chatState
      else
        return null
    }
    catch (error) {
      throw new Error('Failed to get chat state by user ID')
    }
  }

  public async addOrUpdateChatState(userId: number, chatState) {
    if (chatState != null) {
      const chatStateStr = JSON.stringify(chatState)
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({ where: { id: userId } })
      if (!user) {
        // 用户不存在，创建新用户
        const newUser = userRepository.create()
        // 设置 newUser 的属性...
        // ...

        // 保存新用户到数据库
        await userRepository.save(newUser)

        // 创建 ChatDialogue
        const newChatDialogue = new ChatDialogue()
        newChatDialogue.user = newUser
        newChatDialogue.chatState = chatStateStr
        // 设置其他 ChatDialogue 的属性...
        // ...

        // 保存 ChatDialogue 到数据库
        return await getRepository(ChatDialogue).save(newChatDialogue)
      }
      // 用户已存在，查找对应的 ChatDialogue
      const chatDialogueRepository = getRepository(ChatDialogue)
      const existingChatDialogue = await chatDialogueRepository.findOne({ where: { user } })

      if (existingChatDialogue) {
        // 更新现有 ChatDialogue 的 chatState
        existingChatDialogue.chatState = chatStateStr
        // 设置其他 ChatDialogue 的属性...
        // ...

        // 保存更新后的 ChatDialogue 到数据库
        return await chatDialogueRepository.save(existingChatDialogue)
      }
      // 用户存在，但没有对应的 ChatDialogue，创建新的 ChatDialogue
      const newChatDialogue = chatDialogueRepository.create({
        user,
        chatState: chatStateStr,
        // 设置其他 ChatDialogue 的属性...
        // ...
      })
      // 保存新的 ChatDialogue 到数据库
      return await chatDialogueRepository.save(newChatDialogue)
    }
  }
}
