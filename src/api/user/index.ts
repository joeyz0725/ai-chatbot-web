import myAxios from '@/utils/request/axios'

interface UserInfo {
  name: string
  avatar: string
  description: string
}

export function fetchUserAPI() {
  return myAxios.post('/user/user-state')
}

export function fetchVisitorAPI() {
  return myAxios.post('/user/visitor-state')
}

export function saveUserAPI(userInfo: UserInfo) {
  return myAxios.post('/user/save-user', { userInfo: userInfo })
}
