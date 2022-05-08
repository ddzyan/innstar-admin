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
    path: '/baseknowledge',
    component: loadView('components/layout/index'),
    redirect: '/baseknowledge/type',
    meta: { title: '基础知识', icon: 'book-2-fill', alwayShow: true },
    children: [
      {
        path: 'type',
        component: loadView('views/baseknowledge/type/index'),
        meta: { title: '知识分类' },
      },
      {
        path: 'type/edit',
        component: loadView('views/baseknowledge/type/edit'),
        meta: { title: '知识分类编辑', hideMenu: true },
      },
      {
        path: 'list',
        component: loadView('views/baseknowledge/list/index'),
        meta: { title: '知识列表' },
      },
      {
        path: 'list/edit',
        component: loadView('views/baseknowledge/list/edit'),
        meta: { title: '知识编辑', hideMenu: true },
      },
    ],
  },
  {
    path: '/train',
    component: loadView('components/layout/index'),
    redirect: '/train/type',
    meta: { title: '训练器械', icon: 'run-fill', alwayShow: true },
    children: [
      {
        path: 'apparatus',
        component: loadView('views/train/apparatus/index'),
        meta: { title: '器械列表' },
      },
      {
        path: 'apparatus/edit',
        component: loadView('views/train/apparatus/edit'),
        meta: { title: '器械编辑', hideMenu: true },
      },
      {
        path: 'actiontype',
        component: loadView('views/train/actiontype/index'),
        meta: { title: '动作分类' },
      },
      {
        path: 'actiontype/edit',
        component: loadView('views/train/actiontype/edit'),
        meta: { title: '动作分类编辑', hideMenu: true },
      },
      {
        path: 'actionlist',
        component: loadView('views/train/actionlist/index'),
        meta: { title: '动作列表' },
      },
      {
        path: 'actionlist/edit',
        component: loadView('views/train/actionlist/edit'),
        meta: { title: '动作列表编辑', hideMenu: true },
      },
      {
        path: 'curriculumtype',
        component: loadView('views/train/curriculumtype/index'),
        meta: { title: '课程分类' },
      },
      {
        path: 'curriculumtype/edit',
        component: loadView('views/train/curriculumtype/edit'),
        meta: { title: '课程分类编辑', hideMenu: true },
      },
      {
        path: 'curriculumlist',
        component: loadView('views/train/curriculumlist/index'),
        meta: { title: '课程列表' },
      },
      {
        path: 'curriculumlist/edit',
        component: loadView('views/train/curriculumlist/edit'),
        meta: { title: '课程列表编辑', hideMenu: true },
      },
    ],
  },
  {
    path: '/user',
    component: loadView('components/layout/index'),
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'account-circle-fill', alwayShow: false },
    children: [
      {
        path: 'list',
        component: loadView('views/user/list/index'),
        meta: { title: '用户列表' },
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
