import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'
import { useTokenStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const authToken = useAuthStore().token
    if (authToken)
      config.headers.Authorization = `Bearer ${authToken}`
    const webToken = useTokenStore().token
    if (webToken)
      config.headers['authorization-web'] = `Bearer ${webToken}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
