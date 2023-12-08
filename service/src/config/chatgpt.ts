import * as dotenv from 'dotenv'
import { ConfigService } from '../services/ConfigService'
import type { GptState } from '@/types'

dotenv.config()

const nullGptState = {
  model: 'gpt-3.5-turbo',
  openaiAddress: '',
  openaiApiKey: '',
  reverseProxyAddress: '',
  accessToken: '',
}
class ChatGptConfig {
  private gptState: GptState | null
  private configService: ConfigService

  constructor() {
    this.gptState = nullGptState as any
    this.configService = new ConfigService()
  }

  public async initializeGptState(userId: number): Promise<void> {
    // 根据 userId 从数据库中获取相应的配置值
    const result = await this.configService.findOrCreateGptConfig(userId)
    if (result.success) {
      // 根据 userConfig 初始化 gptState 对象
      const gptConfig = result.data
      this.gptState = {
        model: gptConfig.model,
        openaiAddress: gptConfig.openaiAddress,
        openaiApiKey: gptConfig.openaiApiKey,
        reverseProxyAddress: gptConfig.reverseProxyAddress,
        accessToken: gptConfig.accessToken,
      }
    }
  }

  public updateGptState(newGptState: GptState): void {
    // 在这里根据需要更新 GptState 对象的属性
    this.gptState = {
      ...this.gptState,
      ...newGptState,
    }
  }

  public destroyGptState(): void {
    // 在这里执行销毁操作，例如将 gptState 对象置为 null
    this.gptState = nullGptState as any
  }

  public getGptState(): GptState | null {
    return this.gptState
  }
}

export const chatGptConfig = new ChatGptConfig()
