/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 限制路由meta
// import 'vue-router'
// declare module 'vue-router' {
//   interface RouteMeta {
//     title?: string
//     icon?: string
//     hideTabs?: boolean
//     hideClose?: boolean
//     hideMenu?: boolean
//     alwayShow?: boolean
//     // 暂无用到
//     cache?: boolean
//     roles?: string[]
//   }
// }

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // 更多环境变量...
  readonly VITE_APP_API_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
