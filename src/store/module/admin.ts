import { defineStore } from 'pinia'
import router from '@/router'

interface State {
  token: string
  userInfo: {
    account: string
    adminId: number
    headUrl: string
    tel: string
    token: string
    avatar: string
  }
}

export const useAdminStore = defineStore({
  id: 'admin',
  state: (): State => {
    return {
      token: '',
      userInfo: {
        account: '',
        adminId: 0,
        headUrl: '',
        tel: '',
        token: '',
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
      this.token = params.token
    },
    logout() {
      this.token = ''
      this.userInfo = {
        account: '',
        adminId: 0,
        headUrl: '',
        tel: '',
        token: '',
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
