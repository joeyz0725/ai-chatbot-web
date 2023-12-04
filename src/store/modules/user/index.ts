
// 导入 `defineStore` 函数，用于创建 Pinia store
import { defineStore } from 'pinia'
// 导入类型，这些类型定义在 './helper' 模块中
import type { Extra, UserInfo, UserState } from './helper'
// 导入一些辅助函数，包括默认设置、获取本地状态和设置本地状态
import { defaultUserState, getState, setLocalState } from './helper'

// 创建名为 `useUserStore` 的 Pinia store
export const useUserStore = defineStore('user-store', {
  // 定义 store 的状态（state）为一个函数，该函数返回从本地获取的用户状态
  state: (): UserState => getState(),
  // 定义 store 的操作（actions）
  actions: {
    // 更新用户信息的操作
    updateUserInfo(userInfo: Partial<UserInfo>) {
      // 使用对象展开操作符将新的用户信息合并到当前的用户信息中
      this.userInfo = { ...this.userInfo, ...userInfo } as UserInfo
      // 调用记录状态的函数
      this.recordState()
    },
    // 更新其他的操作
    updateExtra(extra: Partial<Extra>) {
      // 使用对象展开操作符将新的用户信息合并到当前的用户信息中
      this.extra = { ...this.extra, ...extra } as Extra
      // 调用记录状态的函数
      this.recordState()
    },
    // 重置用户信息的操作
    resetUserInfo() {
      // 将用户信息重置为默认设置中的用户信息
      this.userInfo = { ...defaultUserState().userInfo } as UserInfo
      // 调用记录状态的函数
      this.recordState()
    },
    // 重置用户信息的操作
    resetExtra() {
      // 将用户信息重置为默认设置中的用户信息
      this.extra = { ...defaultUserState().extra } as Extra
      // 调用记录状态的函数
      this.recordState()
    },
    removeUserInfo() {
      this.$state.userInfo = null
      // 调用记录状态的函数
      this.recordState()
    },
    removeExtra() {
      this.$state.extra = null
      // 调用记录状态的函数
      this.recordState()
    },
    removeUserState() {
      this.$state.userInfo = null
      this.$state.extra = null
      // 调用记录状态的函数
      this.recordState()
    },
    // 记录状态的操作
    recordState() {
      // 调用设置本地状态的函数，传入当前 store 的状态
      setLocalState(this.$state)
    }
  },
})

