import { defineStore } from 'pinia'
import type { GptState } from './helper'
import { defaultConfig, getLocalConfig, setLocalConfig, removeLocalConfig } from './helper'

export const useGptStore = defineStore('gpt-store', {
  state: (): GptState => getLocalConfig(),
  actions: {
    getDefaultState(){
      return defaultConfig()
    },
    updateState(config: Partial<GptState>) {
      this.$state = { ...this.$state, ...config }
      this.recordState()
    },

    resetState() {
      this.$state = defaultConfig() as GptState
      // 调用记录状态的函数
      this.recordState()
    },

    removeState() {
      this.$state = null as any
      // 调用记录状态的函数
      removeLocalConfig()
    },

    recordState() {
      setLocalConfig(this.$state)
    },
  },
})
