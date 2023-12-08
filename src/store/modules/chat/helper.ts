import { useTokenStore } from '../token'
import { ss } from '@/utils/storage'
import { t } from '@/locales'
import { getChatStateAPI, pushChatStateAPI } from '@/api/chat'

const LOCAL_NAME = 'chatStorage'

const tokenStore = useTokenStore()

export function defaultState(): Chat.ChatState {
  const uuid = 10000
  return {
    // newChatTitle
    active: uuid,
    activeTitle: t('chat.newChatTitle'),
    usingContext: true,
    history: [{ uuid, title: t('chat.newChatTitle'), isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getChatState(): Chat.ChatState {
  const token = tokenStore.getToken()
  if (token) {
    getChatStateAPI().then(() => {
      const serverState = getLocalState()
      const result = { ...defaultState(), ...serverState }
      return result
    })
  }
  return { ...defaultState(), ...getLocalState() }
}

export function setChatState(state: Chat.ChatState) {
  setLocalState(state)
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return localState
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}

export async function getServerState() {
  const serverState = await getChatStateAPI()
  return serverState
}

export function setServerState(state: Chat.ChatState) {
  pushChatStateAPI(state)
}
