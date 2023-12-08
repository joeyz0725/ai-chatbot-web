import { ConfigService } from '../services/ConfigService'
import { isNumber } from '@/utils/is'
import type { GptState } from '@/types'
import { chatGptConfig } from '@/config/chatgpt'
import { initializeChatGPT } from '@/chatgpt'

export class ConfigController {
  private configService: ConfigService

  constructor() {
    this.configService = new ConfigService()
  }

  public async fetchChatgptConfig(req, res) {
    const userId = req.userId
    if (isNumber(userId)) {
      const result = this.configService.findOrCreateGptConfig(userId)
      res.send(result)
    }
    else {
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
          // 更新单例的ChatGPT配置项
          chatGptConfig.updateGptState(gptState)
          // 再刷新chatgpt/index.ts配置的部分gpt配置
          await initializeChatGPT()
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
