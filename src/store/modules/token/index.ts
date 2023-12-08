import { defineStore } from 'pinia'
import { getLocalToken, removeLocalToken, setLocalToken } from './helper'

export const useTokenStore = defineStore('token-store', {
  state: () => ({ token: getLocalToken() }),
  actions: {
    getToken() {
      const token = getLocalToken()
      return token
    },
    setToken(token: string) {
      this.$state.token = token
      setLocalToken(token)
    },

    removeToken() {
      this.$state.token = null
      removeLocalToken()
    },
  },
})
