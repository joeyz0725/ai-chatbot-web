import { ss } from '@/utils/storage'
import { useTokenStore } from '../token'
import { fetchChatgptAPI } from '@/api/config'

export type Model = 'gpt-3.5-turbo' | 'gpt-4'

const LOCAL_NAME = 'gptStorage'

export interface GptState {
  model: Model
  openaiAddress: string
  openaiApiKey: string
  temperature: number
  reverseProxyAddress: string
  accessToken: string
}

const tokenStore = useTokenStore()

export function defaultConfig(): GptState {
  return {
    model: 'gpt-3.5-turbo',
    openaiAddress: '',
    openaiApiKey: '',
    temperature: 0.8,
    reverseProxyAddress: '',
    accessToken: '',
  }
}

export function getGptConfig(): GptState {
  const token = tokenStore.getToken()
  if (token) {
    fetchChatgptAPI().then((data) => {
      const serverGptConfig = data.data.data
      const result = { ...defaultConfig(), ...serverGptConfig }
      return result
    })
  }
  return { ...defaultConfig(), ...getLocalConfig() }
}

export function getLocalConfig(): GptState {
  const localSetting: GptState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultConfig(), ...localSetting }
}

export function setLocalConfig(setting: GptState): void {
  ss.set(LOCAL_NAME, setting)
}

export function removeLocalConfig() {
  ss.remove(LOCAL_NAME)
}
