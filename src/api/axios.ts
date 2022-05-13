import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/store'
// import router from '@/router'

const serviceConfig = {
  baseURL: import.meta.env.VITE_APP_API_URL as string,
  timeout: 60000,
  // withCredentials: true, // 携带缓存
  // headers: {
  //   Accept: 'application/json',
  //   'Content-type': 'application/json;charset=utf-8',
  // },
}

const service = axios.create(serviceConfig)

service.interceptors.request.use(
  (config: any) => {
    const adminStore = useAdminStore()
    if (adminStore.token) {
      config.headers.Authorization = 'Bearer ' + adminStore.token || ''
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: any) => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(new Error(String(response.status) || 'Error'))
    }
  },
  (error) => {
    if (error.response) {
      const { data, status } = error.response
      if (status == 401) {
        ElMessage.error(`登录超时，重新登录`)
        useAdminStore().logout()
        // router.push('/login')
      } else {
        ElMessage.error(data.msg)
      }
    } else if (error.message.includes('timeout')) {
      ElMessage.error('网络超时，请稍后刷新页面')
    } else {
      ElMessage.error('服务器出错了！')
    }

    return Promise.reject(error)
  },
)

export default service
