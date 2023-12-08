import myAxios from '@/utils/request/axios'
import type { GptState } from '@/store/modules/chatgpt/helper'

export function fetchChatgptAPI() {
  return myAxios.post('/config/gpt')
}

export function saveChatgptAPI(gptConfig: GptState) {
  return myAxios.post('/config/save-gpt', { config: gptConfig })
}
