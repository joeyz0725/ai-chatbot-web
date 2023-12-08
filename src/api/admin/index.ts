import myAxios from '@/utils/request/axios'

interface AccountField {
  username: string
  password: string
  roleType: number
}

export function createAccountAPI(user: AccountField) {
  return myAxios.post('/admin/create-account', 
  { user: user })
}

export function fetchAccountsAPI(searchParams?: string) {
  return myAxios.post('/admin/fetch-accounts', 
  { searchParams: searchParams })
}

export function resetPasswordAPI(ids: number[]) {
  return myAxios.post('/admin/reset-password', 
  { ids: ids })
}