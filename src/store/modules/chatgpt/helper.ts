import { ss } from '@/utils/storage'

export type Model = 'gpt-3.5-turbo' | 'gpt-4'

const LOCAL_NAME = 'gptStorage'

export interface GptState {
  model: Model
  openaiAddress: string
  openaiApiKey: string
  reverseProxyAddress: string
  accessToken: string
}

export function defaultConfig(): GptState {
  return {
    model: 'gpt-3.5-turbo',
    openaiAddress: '',
    openaiApiKey: '',
    reverseProxyAddress: '',
    accessToken: '',
  }
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
