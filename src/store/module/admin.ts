import { defineStore } from 'pinia'
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
      this.token = 'params'
    },
    logout() {
      this.token = ''
      this.userInfo = {
        name: '',
        avatar: '',
      }
      router.replace('/login')
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
