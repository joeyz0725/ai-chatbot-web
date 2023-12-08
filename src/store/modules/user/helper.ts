// 导入 `ss` 对象（假设在 '@/utils/storage' 模块中有一个名为 `ss` 的对象）
import { ss } from '@/utils/storage'
import { useTokenStore } from '../token'
import { fetchUserAPI, fetchVisitorAPI } from '@/api/user'
import { t } from '@/locales'

// 定义一个常量，表示本地存储的名称
const LOCAL_NAME = 'userStorage'
const tokenSotre = useTokenStore()

// 定义用户信息的接口
export interface UserInfo {
  avatar: string
  name: string
  description: string
}

// 定义用户相关其他信息的接口
export interface Extra {
  leftCount: number
  isLogin: boolean
  roleType: number
}

// 定义用户状态的接口
export interface UserState {
  userInfo: UserInfo | null
  extra: Extra | null
}

export function processUserState (data: any) {
  if (data) {
    const userState: UserState = {
      userInfo: {
        name: data.name,
        avatar: data.avatar,
        description: data.description
      },
      extra: {
        leftCount: data.leftCount,
        isLogin: true,
        roleType: data.roleType
      }
    }
    return userState
  }
}

// 定义一个返回默认用户状态的函数
export function defaultUserState(): UserState {
  return {
    userInfo: {
      // 默认头像链接
      avatar: '',
      // 默认用户名
      name: t('list.visitor'),
      // 默认描述，包含 HTML 链接
      description: '',
    },
    extra: {
      leftCount: 0,
      isLogin: false,
      roleType: 0
    }
  }
}

export function getState(): UserState {
  const token = tokenSotre.getToken()
  if (token) {
    return getServerState()
  }else{
    return getLocalState()
  }
}
  
// 定义一个函数，用于获取本地用户状态
export function getLocalState(): UserState {
  // 从本地存储中获取用户状态，可能返回 undefined
  const localUserState: UserState | undefined = ss.get(LOCAL_NAME)
  // 未登录用户也要从服务器获取当前IP下的消息剩余次数
  fetchVisitorAPI()
  .then((response)=>response.data.data)
    .then(data=>{
      const aleftCount = data.leftCount
      let userState = { ...defaultUserState(), ...localUserState }
      if (userState.extra) {
        userState.extra.leftCount = aleftCount
        userState.extra.isLogin = false
        userState.extra.roleType = 0
      }
      // 和浏览器同步一下
      setLocalState(userState)
      return userState
    })
  // 将获取到的用户状态与默认设置合并，并返回
    return { ...defaultUserState(), ...localUserState }
}
// 服务器
export function getServerState(): UserState {
  const localUserState: UserState | undefined = ss.get(LOCAL_NAME)
  // 从服务器中获取用户状态，可能返回 undefined
  const token = tokenSotre.getToken()
  if (token) {
    fetchUserAPI().then(response=>response.data.data).then((data)=>{
      const userState = { ...defaultUserState(), ...localUserState, ...processUserState(data) }
      // 和浏览器同步一下
      setLocalState(userState)
      return userState
    })
  }
  // 将获取到的用户状态与默认设置合并，并返回
  return { ...defaultUserState(), ...localUserState }
}

// 定义一个函数，用于设置本地用户状态
export function setLocalState(userstate: UserState): void {
  // 将传入的用户状态设置到本地存储中
  ss.set(LOCAL_NAME, userstate)
}
