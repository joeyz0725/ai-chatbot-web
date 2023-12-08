import { ChatStateService } from '../services/ChatStateService'

export class ChatStateController {
  private chatStateService: ChatStateService
  private userId: number
  private chatState

  constructor() {
    this.chatStateService = new ChatStateService()
  }

  public async fetchChatState(req, res) {
    // let responseObj: any = {}; // 创建一个空对象用于保存响应内容
    try {
      const chatState = await this.getChatStateByUserId(this.userId)
      res.write(chatState
        ? JSON.stringify(chatState)
        : `\n${JSON.stringify(chatState)}`)
      res.end()
      return
    }
    catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat state' })
    }
  }

  private async getChatStateByUserId(userId: number): Promise<string | null> {
    try {
      // 调用 ChatStateService 中的方法获取 chatState
      const chatState = await this.chatStateService.getChatStateByUserId(userId)
      return chatState
    }
    catch (error) {
      throw new Error('Failed to fetch chat state')
    }
  }

  public async updateChatState(req, res) {
    this.userId = req.userId || null
    this.chatState = req.body.chatState || null
    try {
      await this.chatStateService.addOrUpdateChatState(this.userId, this.chatState)
      res.send({ status: 'Success' })
      return
    }
    catch (error) {
      throw new Error('Failed to update chat state')
    }
  }
}
