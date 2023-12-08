import myAxios from '@/utils/request/axios'

interface LoginField {
  username: string
  password: string
}

export function loginAPI(user: LoginField) {
  return myAxios.post('/common/login', { user })
}

export function logoutAPI() {
  return myAxios.post('/common/logout')
}

export function fetchTimeAPI() {
  return myAxios.post('/common/refresh-left')
}
