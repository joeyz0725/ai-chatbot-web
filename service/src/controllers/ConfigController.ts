import { ConfigService } from '../services/ConfigService'
import { isNumber } from '@/utils/is'
import type { GptState } from '@/types'
import { ChatGptConfig } from '@/config/chatgpt'
import { initializeChatGPT } from '@/chatgpt'

export class ConfigController {
  private configService: ConfigService
  private chatGptConfig: ChatGptConfig

  constructor() {
    this.configService = new ConfigService()
    this.chatGptConfig = new ChatGptConfig()
  }

  public async fetchChatgptConfig(req, res) {
    const userId = req.userId
    if (isNumber(userId)) {
      const result = await this.configService.findOrCreateGptConfig(userId)
      // 将user从result去除，只要剩下的属性全部赋值给config
      const { user, ...config } = result.data
      res.send({ status: 'Success', success: true, data: config })
    } else {
      res.send({ status: 'Fail', success: false, data: null })
    }
    res.end()
  }

  public async updateChatgptConfig(req, res) {
    const userId = req.userId
    try {
      if (isNumber(userId)) {
        const gptState: GptState = req.body.config
        const result = await this.configService.updateOrCreateGptConfig(userId, gptState)
        if (result.success) {
          // 更新ChatGPT配置项
          this.chatGptConfig.updateGptState(gptState)
          // 再刷新chatgpt/index.ts配置的部分gpt配置
          await initializeChatGPT(userId)
        }
        res.send(result)
      }
      else {
        res.send({ status: 'Fail', success: false, message: '用户不存在', data: null })
      }
    }
    catch {
      res.send({ status: 'Fail', success: false, message: '服务器错误', data: null })
    }
    res.end()
  }
}
