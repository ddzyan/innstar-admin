import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAdminStore } from '@/store'
// 只对 views 和 components 中的vue文件进行懒加载，如需加载全部，用 ../**/*.vue
const modules = import.meta.glob('../{views,components}/**/*.vue')
const loadView = (view: string) => () => {
  return modules[`../${view}.vue`]()
}

/**
 * @description 所有人可使用的参数配置列表
 * @params title: xx
 * @params icon: remix icon
 * @params hideClose: x x
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/home',
  // },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: loadView('views/home/index'),
  // },
  {
    path: '/',
    component: loadView('components/layout/index'),
    redirect: '/home',
    meta: { title: 'home', icon: 'home-line' },
    children: [
      {
        path: 'home',
        component: loadView('views/home/index'),
        meta: { title: '首页', icon: 'home-line', hideClose: true },
      },
    ],
  },
  {
    path: '/pages',
    component: loadView('components/layout/index'),
    redirect: '/pages/crudTable',
    meta: { title: '页面', icon: 'home-line', alwayShow: true },
    children: [
      {
        path: 'crudTable',
        component: loadView('views/home/sss'),
        meta: { title: '业务表格1', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable2',
        component: loadView('views/home/index'),
        meta: { title: '业务表格2', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable3',
        component: loadView('views/home/index'),
        meta: { title: '业务表格3', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable4',
        component: loadView('views/home/index'),
        meta: { title: '业务表格4', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable5',
        component: loadView('views/home/index'),
        meta: { title: '业务表格5', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable6',
        component: loadView('views/home/index'),
        meta: { title: '业务表格6', cache: false, roles: ['admin', 'editor'] },
      },
      {
        path: 'crudTable7',
        component: loadView('views/home/index'),
        meta: { title: '业务表格7', cache: false, roles: ['admin', 'editor'] },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideTabs: true,
      hideMenu: true,
    },
    component: loadView('views/login/index'),
  },
  {
    path: '/:catchAll(.*)',
    meta: { hideMenu: true },
    name: '404',
    component: loadView('views/404'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // if (to.path !== '/login') {
  //   const adminStore = useAdminStore()
  //   if (adminStore.token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // } else {
  //   next()
  // }
  next()
})

export default router
