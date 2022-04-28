import { defineStore } from 'pinia'
import elZhCn from 'element-plus/es/locale/lang/zh-cn' // 中文
import elEn from 'element-plus/es/locale/lang/en' // 英文
import elKo from 'element-plus/es/locale/lang/ko' // 韩文

interface State {
  lang: 'zh' | 'en' | 'ko'
  isCollapse: boolean
  contentFullScreen: boolean
  showLogo: boolean
  fixedTop: boolean
  showTabs: boolean
  expandOneMenu: boolean
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): State => {
    return {
      lang: 'zh', // en zh ko
      isCollapse: false, // 侧边栏是否收缩展示
      contentFullScreen: false, // 内容是否可全屏展示
      showLogo: true, // 是否显示Logo
      fixedTop: false, // 是否固定顶部, todo，暂未使用
      showTabs: true, // 是否显示导航历史
      expandOneMenu: true, // 一次是否只能展开一个菜单
    }
  },
  getters: {
    locale: (state) => {
      const lang = {
        en: elEn,
        zh: elZhCn,
        ko: elKo,
      }
      return lang[state.lang]
    },
  },
  actions: {
    changeLang(lang: 'zh' | 'en' | 'ko') {
      this.lang = lang
    },
    isCollapseChange(type: boolean) {
      this.isCollapse = type
    },
    contentFullScreenChange(type: boolean) {
      this.contentFullScreen = type
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'pinia_admin_app',
        storage: localStorage,
      },
    ],
  },
})
