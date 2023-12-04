import { post } from '@/utils/request'
import { setLocalState } from '@/store/modules/chat/helper'

export function getChatStateAPI() {
  let serverState = {}
  return post<string>({
    url: '/chat/chat-state',
    data: {}
  }).then(response=>{
    serverState = JSON.parse(response as any)
    setLocalState(serverState as Chat.ChatState)
  })
}

export function pushChatStateAPI(chatState: Chat.ChatState) {
  return post<Chat.ChatState>({
    url: '/chat/update-chat-state',
    data: { chatState }
  })
}