import { getRepository } from 'typeorm'
import { ChatgptConfig } from '../models/ChatGPTConfig'
import type { User } from '../models/User'
import type { GptState } from '@/types'

export class ConfigService {
  public async findOrCreateGptConfig(userId: number) {
    const configRepository = getRepository(ChatgptConfig)

    try {
      let config = await configRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] })
      if (!config) {
        config = new ChatgptConfig()
        config.user = { id: userId } as User
        await configRepository.save(config)
      }
      return { success: true, data: config }
    }
    catch {
      return { success: false, message: '服务器错误', data: null }
    }
  }

  public async updateOrCreateGptConfig(userId: number, gptState: GptState) {
    const configRepository = getRepository(ChatgptConfig)
    let existingConfig: ChatgptConfig | undefined

    try {
      existingConfig = await configRepository.findOne({ where: { user: { id: userId } } })
    }
    catch (error) {
      return { success: false, message: '服务器错误', data: null }
    }
    if (existingConfig) {
      existingConfig.model = gptState.model
      existingConfig.openaiAddress = gptState.openaiAddress
      existingConfig.openaiApiKey = gptState.openaiApiKey
      existingConfig.temperature = Number(gptState.temperature)
      existingConfig.reverseProxyAddress = gptState.reverseProxyAddress
      existingConfig.accessToken = gptState.accessToken
      try {
        await configRepository.save(existingConfig)
      }
      catch (error) {
        return { success: false, message: '服务器错误', data: null }
      }
    }
    else {
      const newConfig = new ChatgptConfig()
      newConfig.model = gptState.model
      newConfig.openaiAddress = gptState.openaiAddress
      newConfig.openaiApiKey = gptState.openaiApiKey
      newConfig.temperature = Number(gptState.temperature)
      newConfig.reverseProxyAddress = gptState.reverseProxyAddress
      newConfig.accessToken = gptState.accessToken
      newConfig.user = { id: userId } as User

      try {
        await configRepository.save(newConfig)
      }
      catch (error) {
        return { success: false, message: '服务器错误', data: null }
      }
    }
    return { success: true, message: '修改配置成功', data: null }
  }
}
