import myAxios from '@/utils/request/axios'

interface LoginField {
  username: string
  password: string
}

interface PasswordField {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
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

export function changePasswordAPI(passwordInfo: PasswordField) {
  return myAxios.post('/common/change-password',
    { passwordInfo }
  )
}
