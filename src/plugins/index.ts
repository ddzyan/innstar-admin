import { App } from 'vue'
import store from '@/store'
import router from '@/router'
import 'normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './global.scss'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default (app: App<Element>) => {
  app.use(store)
  app.use(router)
  app.use(ElementPlus, {
    locale: zhCn,
  })
}
