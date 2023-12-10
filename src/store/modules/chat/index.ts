import { defineStore } from 'pinia'
import { defaultState, getChatState, setChatState, setLocalState, setServerState } from './helper'
import { router } from '@/router'
import { t } from '@/locales'

export const useChatStore = defineStore('chat-store', {
  // 1. state: 表示在 Vue 3 组件中创建状态的声明。
  // 2. (): 表示一个匿名函数，这里没有传入参数。
  // 3. Chat.ChatState: Chat 命名空间中的 ChatState 接口，定义了组件的状态结构。
  // 4. =>: 箭头函数的语法，指定了函数体的执行逻辑。
  // 5. getLocalState(): 调用 getLocalState 函数，该函数可能返回一个符合 Chat.ChatState 接口的对象。
  state: (): Chat.ChatState => getChatState(),

  getters: {
    getActive(state) {
      return state.active
    },
    getActiveTitle(state) {
      return state.activeTitle
    },
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },
    getHistoryAndIndexByCurrentActive(state: Chat.ChatState) {
      let activeHistory = {}
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1) {
        activeHistory = {
          ...state.history[index],
          index,
        }
        return activeHistory
      }
      return null
    },
    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    getChatState(){
      const state = getChatState()
      return state
    },
    setChatState(state: Chat.ChatState){
      this.$state = { ...this.$state, ...state }
      this.recordState()
    },
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },

    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      this.history.unshift(history)
      this.chat.unshift({ uuid: history.uuid, data: chatData })
      this.active = history.uuid
      this.activeTitle = history.title
      this.reloadRoute(history.uuid)
    },

    updateHistory(uuid: number, title: string, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], title, ...edit }
        this.recordState()
      }
    },

    async deleteHistory(index: number) {
      this.history.splice(index, 1)
      this.chat.splice(index, 1)

      if (this.history.length === 0) {
        this.active = null
        this.activeTitle = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        const title = this.history[index - 1].title
        this.active = uuid
        this.activeTitle = title
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          const title = this.history[0].title
          this.active = uuid
          this.activeTitle = title
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        const title = this.history[this.history.length - 1].title
        this.active = uuid
        this.activeTitle = title
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: number, title: string) {
      this.active = uuid
      this.activeTitle = title
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChatByUuid(uuid: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.activeTitle = chat.text
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === t('chat.newChatTitle'))
            this.history[0].title = chat.text
          this.recordState()
        }
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title === t('chat.newChatTitle'))
          this.history[index].title = chat.text
        this.recordState()
      }
    },

    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
      }
    },

    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    deleteChatByUuid(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.recordState()
      }
    },

    clearHistory() {
      this.$state = { ...defaultState() }
      this.recordState()
    },

    async reloadRoute(uuid?: number) {
      await router.push({ name: 'Chat', params: { uuid } })
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    recordServerState() {
      setServerState(this.$state)
    },
  },

})
