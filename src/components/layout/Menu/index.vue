<template>
  <el-scrollbar>
    <el-menu
      class="layout-menu system-scrollbar"
      background-color="var(--system-menu-background)"
      text-color="var(--system-menu-text-color)"
      active-text-color="var(--system-primary-color)"
      :default-active="activeMenu"
      :class="isCollapse ? 'collapse' : ''"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="expandOneMenu"
    >
      <menu-item v-for="(menu, key) in allRoutes" :key="key" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store'
import MenuItem from './MenuItem.vue'
export default defineComponent({
  components: {
    MenuItem,
  },
  setup() {
    const appStore = useAppStore()
    const isCollapse = computed(() => appStore.isCollapse)
    const expandOneMenu = computed(() => appStore.expandOneMenu)
    const allRoutes = useRouter().options.routes
    const route = useRoute()
    const activeMenu: any = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    return {
      isCollapse,
      expandOneMenu,
      allRoutes,
      activeMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-scrollbar {
  background-color: var(--system-menu-background);
  height: calc(100% - 60px);
}
.layout-menu {
  width: 100%;
  border: 0;
  &.collapse {
    margin-left: 0px;
  }
  :deep() {
    .el-menu-item,
    .el-sub-menu {
      background-color: var(--system-menu-background) !important;
    }
    .el-menu-item i,
    .el-menu-item-group__title,
    .el-sub-menu__title svg {
      color: var(--system-menu-text-color);
    }
    .el-menu-item,
    .el-sub-menu__title {
      &.is-active {
        background-color: var(--system-primary-color) !important;
        color: var(--system-primary-text-color) !important;
        border-right: 2px solid var(--system-primary-text-color);
        i {
          color: var(--system-primary-text-color) !important;
        }
        &:hover {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
        }
      }
      &:hover {
        background-color: var(--system-menu-hover-background) !important;
      }
    }
    .el-sub-menu {
      &.is-active {
        > .el-sub-menu__title,
        > .el-sub-menu__title i {
          color: var(--system-menu-submenu-active-color) !important;
        }
      }
      .el-menu-item {
        background-color: var(--system-menu-children-background) !important;
        &.is-active {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
          &:hover {
            background-color: var(--system-primary-color) !important;
            color: var(--system-primary-text-color) !important;
          }
          &::before {
            content: '';
            left: 25px;
            top: 50%;
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            background-color: #000;
          }
        }
        &:hover {
          background-color: var(--system-menu-hover-background) !important;
        }
      }
      .el-sub-menu {
        .el-sub-menu__title {
          background-color: var(--system-menu-children-background) !important;
          &:hover {
            background-color: var(--system-menu-hover-background) !important;
          }
        }
      }
    }
  }
}
</style>
