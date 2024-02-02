import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

export const RoleTypeMaxCountRel = {
  GUEST: {
    roleType: 0,
    maxCount: 5,
  },
  USER: {
    roleType: 10,
    maxCount: 20,
  },
  VIP: {
    roleType: 20,
    maxCount: -1,
  },
  ADMIN: {
    roleType: 100,
    maxCount: -1,
  },
}

export type Model = 'gpt-3.5-turbo' | 'gpt-4'
export interface GptState {
  model: Model
  openaiAddress: string
  openaiApiKey: string
  reverseProxyAddress: string
  accessToken: string
  temperature: number
}

export interface AccountField {
  username: string
  password: string
  roleType: number
}

export interface PasswordField {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined
