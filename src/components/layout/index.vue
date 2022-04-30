<template>
  <el-container style="height: 100vh">
    <div v-show="!isCollapse && !contentFullScreen" class="mask" @click="hideMenu"></div>
    <el-aside v-show="!contentFullScreen" :width="isCollapse ? '60px' : '250px'" :class="isCollapse ? 'hide-aside' : 'show-side'">
      <Logo v-if="showLogo" />
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-header v-show="!contentFullScreen">
        <Header></Header>
      </el-header>
      <!-- <Tabs v-show="showTabs" /> -->
      <el-main>
        <router-view :key="$route.fullPath" />
        <!-- <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade-transform'" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import { useAppStore } from '@/store'
// import { useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import Menu from './Menu/index.vue'
import Logo from './Logo/index.vue'
import Header from './Header/index.vue'
// import Tabs from './Tabs/index.vue'
export default defineComponent({
  components: {
    Menu,
    Logo,
    Header,
    // Tabs,
  },
  setup() {
    const appStore = useAppStore()
    // computed
    const isCollapse = computed(() => appStore.isCollapse)
    const contentFullScreen = computed(() => appStore.contentFullScreen)
    const showLogo = computed(() => appStore.showLogo)
    const showTabs = computed(() => appStore.showTabs)
    // 页面宽度变化监听后执行的方法
    const resizeHandler = () => {
      if (document.body.clientWidth <= 1000 && !isCollapse.value) {
        appStore.isCollapseChange(true)
      } else if (document.body.clientWidth > 1000 && isCollapse.value) {
        appStore.isCollapseChange(false)
      }
    }
    // 初始化调用
    resizeHandler()
    // beforeMount
    onBeforeMount(() => {
      // 监听页面变化
      useEventListener('resize', resizeHandler)
    })
    // methods
    // 隐藏菜单
    const hideMenu = () => {
      appStore.isCollapseChange(true)
    }
    return {
      isCollapse,
      showLogo,
      showTabs,
      contentFullScreen,
      hideMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 0;
  padding-right: 0;
}
.el-aside {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  transition: 0.3s;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
}
.el-main {
  background-color: var(--system-container-background);
  height: 100%;
  padding: 30px 40px;
}
.el-main-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
@media screen and (max-width: 1000px) {
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    &.hide-aside {
      left: -250px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
