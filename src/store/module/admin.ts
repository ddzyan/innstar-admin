import { defineStore } from 'pinia'
import { demoApi } from '@/api/app/index'
import router from '@/router'

interface State {
  token: string
  userInfo: {
    name: string
    avatar: string
  }
}

export const useAdminStore = defineStore({
  id: 'admin',
  state: (): State => {
    return {
      token: '',
      userInfo: {
        name: '',
        avatar: '',
      },
    }
  },
  getters: {
    getToken(state: State) {
      return state.token
    },
  },
  actions: {
    setUserInfo(params: State['userInfo']) {
      this.userInfo = params
    },
    setToken(params: string) {
      this.token = params
    },
    logout() {
      this.token = ''
      this.userInfo = {
        name: '',
        avatar: '',
      }
      router.replace('/login')
    },
    async login(params: any) {
      const res = (await demoApi(params)) as any
      const _size = parseInt(String(Math.random() * 500), 10)
      this.setToken(res.data || '')
      this.setUserInfo({
        name: params.name,
        avatar: `https://source.unsplash.com/${_size}x${_size}`,
      })
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'pinia_admin_admin',
        storage: localStorage,
      },
    ],
  },
})
