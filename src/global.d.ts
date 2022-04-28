// 限制路由meta
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hideTabs?: boolean
    hideClose?: boolean
    hideMenu?: boolean
    alwayShow?: boolean
    // 暂无用到
    cache?: boolean
    roles?: string[]
  }
}
