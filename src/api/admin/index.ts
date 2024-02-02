import myAxios from '@/utils/request/axios'

interface AccountField {
  username: string
  password: string
  roleType: number
}

export function createAccountAPI(user: AccountField) {
  return myAxios.post('/admin/create-account',
    { user }
  )
}

export function fetchAccountsAPI(searchParams?: string) {
  return myAxios.post('/admin/fetch-accounts',
    { searchParams }
  )
}

export function resetPasswordAPI(ids: number[]) {
  return myAxios.post('/admin/reset-password',
    { ids }
  )
}

export function fetchApiConfig() {
  return myAxios.get('/admin/fetch-api-config')
}

export function saveApiConfig(config: any) {
  return myAxios.post('/admin/save-api-config',
    { config }
  )
}

