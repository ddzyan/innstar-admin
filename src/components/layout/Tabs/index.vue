<template>
  <div class="tabs">
    <el-scrollbar class="scroll-container tags-view-container">
      <Item v-for="menu in menuList" :key="menu.meta.title" :menu="menu" :active="activeMenu.path === menu.path" @close="delMenu(menu)" />
      <!-- <Item v-for="menu in menuList" :key="menu.meta.title" :menu="menu" :active="activeMenu.path === menu.path" @close="delMenu(menu)" @reload="pageReload" /> -->
    </el-scrollbar>
    <div class="handle">
      <el-dropdown placement="bottom">
        <div class="el-dropdown-link">
          <RemixIcon :size="18" icon="arrow-down-s-line" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="handle-dropdown-menu">
            <!-- <el-dropdown-item @click="pageReload">
              <RemixIcon :size="12" icon="refresh-line" />
              重新加载
            </el-dropdown-item> -->
            <el-dropdown-item :disabled="currentDisabled" @click="closeCurrentRoute">
              <RemixIcon :size="12" icon="close-circle-line" />
              关闭当前
            </el-dropdown-item>
            <el-dropdown-item :disabled="menuList.length < 3" @click="closeOtherRoute">
              <RemixIcon :size="12" icon="close-circle-line" />
              关闭其他页
            </el-dropdown-item>
            <el-dropdown-item :disabled="menuList.length <= 1" @click="closeAllRoute">
              <RemixIcon :size="12" icon="close-circle-line" />
              关闭所有
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip class="item" :content="contentFullScreen ? '退出全屏' : '内容全屏'" placement="bottom">
        <RemixIcon :size="18" :icon="!contentFullScreen ? 'fullscreen-line' : 'fullscreen-exit-line'" @click="onFullscreen" />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import RemixIcon from '@/components/remixicon/index.vue'
import type { Ref } from 'vue'
import Item from './item.vue'
import { defineComponent, computed, watch, reactive, ref, nextTick } from 'vue'
import { useAppStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import tabsHook from './tabsHook'
interface ElScrollbar {
  scrollbar: HTMLDivElement
  [propName: string]: any
}
export default defineComponent({
  components: {
    Item,
    RemixIcon,
  },
  setup() {
    const appStore = useAppStore()
    const route = useRoute()
    const router = useRouter()
    const scrollbarDom: Ref<ElScrollbar | null> = ref(null)
    const defaultMenu = {
      path: '/baseknowledge/list',
      meta: { title: '知识列表', hideClose: true },
    }
    const contentFullScreen = computed(() => appStore.contentFullScreen)
    const currentDisabled = computed(() => route.path === defaultMenu.path)

    let activeMenu: any = reactive({ path: '' })
    let menuList = ref(tabsHook.getItem())
    if (menuList.value.length === 0) {
      // 判断之前有没有调用过
      addMenu(defaultMenu)
    }
    watch(menuList.value, (newVal: []) => {
      tabsHook.setItem(newVal)
    })
    watch(menuList, (newVal: []) => {
      tabsHook.setItem(newVal)
    })
    router.afterEach(() => {
      addMenu(route)
      initMenu(route)
    })

    // 全屏
    function onFullscreen() {
      appStore.contentFullScreenChange(!contentFullScreen.value)
    }
    // 当前页面组件重新加载
    // function pageReload() {
    //   const self: any = route.matched[route.matched.length - 1].instances.default
    //   self.handleReload()
    // }

    // 关闭当前标签，首页不关闭
    function closeCurrentRoute() {
      if (route.path !== defaultMenu.path) {
        delMenu(route)
      }
    }
    // 关闭除了当前标签之外的所有标签
    function closeOtherRoute() {
      menuList.value = [defaultMenu]
      if (route.path !== defaultMenu.path) {
        addMenu(route)
      }
    }

    // 关闭所有的标签，除了首页
    function closeAllRoute() {
      menuList.value = [defaultMenu]
      router.push(defaultMenu.path)
    }

    // 添加新的菜单项
    function addMenu(menu: any) {
      let { path, meta, name } = menu
      if (meta.hideTabs) {
        return
      }
      let hasMenu = menuList.value.some((obj: any) => {
        return obj.path === path
      })
      if (!hasMenu) {
        menuList.value.push({
          path,
          meta,
          name,
        })
      }
    }

    // 删除菜单项
    function delMenu(menu: any) {
      let index = 0
      if (!menu.meta.hideClose) {
        index = menuList.value.findIndex((item: any) => item.path === menu.path)
        menuList.value.splice(index, 1)
      }
      if (menu.path === activeMenu.path) {
        index - 1 > 0 ? router.push(menuList.value[index - 1].path) : router.push(defaultMenu.path)
      }
    }

    // 初始化activeMenu
    function initMenu(menu: object) {
      activeMenu = menu
      nextTick(() => {
        setPosition()
      })
    }
    // 设置当前滚动条应该在的位置
    function setPosition() {
      const scrollbarDom1 = document.querySelector('.scroll-container')
      if (scrollbarDom1) {
        const domBox: any = {
          scrollbar: scrollbarDom1.querySelector('.el-scrollbar__wrap ') as HTMLDivElement,
          activeDom: scrollbarDom1.querySelector('.active') as HTMLDivElement,
          activeFather: scrollbarDom1.querySelector('.el-scrollbar__view') as HTMLDivElement,
        }
        for (let i in domBox) {
          if (!domBox[i]) {
            return
          }
        }
        const domData = {
          scrollbar: domBox.scrollbar.getBoundingClientRect(),
          activeDom: domBox.activeDom.getBoundingClientRect(),
          activeFather: domBox.activeFather.getBoundingClientRect(),
        }
        const num = domData.activeDom.x - domData.activeFather.x + (1 / 2) * domData.activeDom.width - (1 / 2) * domData.scrollbar.width
        domBox.scrollbar.scrollLeft = num
      }
    }

    // 初始化时调用：1. 新增菜单 2. 初始化activeMenu
    addMenu(route)
    initMenu(route)
    return {
      contentFullScreen,
      onFullscreen,
      // pageReload,
      scrollbarDom,
      // 菜单相关
      menuList,
      activeMenu,
      delMenu,
      closeCurrentRoute,
      closeOtherRoute,
      closeAllRoute,
      currentDisabled,
    }
  },
})
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: var(--system-header-background);
  border-bottom: 1px solid var(--system-header-border-color);
  border-top: 1px solid var(--system-header-border-color);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  .handle {
    min-width: 95px;
    height: 100%;
    display: flex;
    align-items: center;
    .el-dropdown-link {
      margin-top: 5px;
      border-left: 1px solid var(--system-header-border-color);
      height: 25px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    i {
      color: var(--system-header-text-color);
    }
  }
}
.handle-dropdown-menu {
  font-size: 12px;
  :deep(.el-dropdown-menu__item) {
    font-size: 12px;
    display: flex;
    align-items: center;
    svg {
      margin-right: 5px;
    }
  }
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep() {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
.tags-view-container {
  height: 34px;
  flex: 1;
  width: 100%;
  display: flex;
}
.el-icon-full-screen {
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
  &:focus {
    outline: none;
  }
}
</style>
