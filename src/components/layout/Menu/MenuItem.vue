<template>
  <template v-if="!menu.meta?.hideMenu">
    <el-sub-menu v-if="showMenuType === 2" :index="pathResolve">
      <template #title>
        <div class="svgdiv">
          <remix-icon v-if="menu.meta.icon" :icon="menu.meta.icon"></remix-icon>
        </div>
        <span>{{ (menu.meta.title as string) }}</span>
      </template>
      <menu-item v-for="(item, key) in menu.children" :key="key" :menu="item" :base-path="pathResolve" />
    </el-sub-menu>
    <app-link v-else-if="showMenuType === 1" :to="pathResolve">
      <el-menu-item v-if="!menu.children[0].children || menu.children[0].children.length === 0" :index="pathResolve">
        <div class="svgdiv">
          <remix-icon v-if="menu.children[0].meta.icon || menu.meta.icon" :icon="menu.children[0].meta.icon || menu.meta.icon"></remix-icon>
        </div>
        <template #title>{{ (menu.children[0].meta.title as string) }}</template>
      </el-menu-item>
      <el-sub-menu v-else :index="pathResolve">
        <template #title>
          <div class="svgdiv">
            <remix-icon v-if="menu.children[0].meta.icon || menu.meta.icon" :icon="menu.children[0].meta.icon || menu.meta.icon"></remix-icon>
          </div>
          <span>{{ (menu.children[0].meta.title as string) }}</span>
        </template>
        <menu-item v-for="(item, key) in menu.children[0].children" :key="key" :menu="item" :base-path="pathResolve" />
      </el-sub-menu>
    </app-link>
    <app-link v-else :to="pathResolve">
      <el-menu-item :index="pathResolve">
        <div class="svgdiv">
          <remix-icon v-if="menu.meta?.icon" :icon="menu.meta?.icon"></remix-icon>
        </div>
        <template #title>{{ menu.meta?.title }}</template>
      </el-menu-item>
    </app-link>
  </template>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import appLink from './Link.vue'
import remixIcon from '@/components/remixicon/index.vue'
export default defineComponent({
  name: 'MenuItem',
  components: {
    remixIcon,
    appLink,
  },
  props: {
    menu: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const menu = props.menu
    // todo: 优化if结构
    const showMenuType = computed(() => {
      // 0: 无子菜单， 1：有1个子菜单， 2：显示上下级子菜单
      if (menu.children && (menu.children.length > 1 || (menu.children.length === 1 && menu.meta.alwayShow))) {
        return 2
      } else if (menu.children && menu.children.length === 1 && !menu.meta.alwayShow) {
        return 1
      } else {
        return 0
      }
    })
    // todo: 优化多层if
    const pathResolve = computed(() => {
      let path = ''
      if (showMenuType.value === 1) {
        if (menu.children[0].path.charAt(0) === '/') {
          path = menu.children[0].path
        } else {
          let char = '/'
          if (menu.path.charAt(menu.path.length - 1) === '/') {
            char = ''
          }
          path = menu.path + char + menu.children[0].path
        }
      } else {
        path = menu.path
      }
      path = props.basePath ? props.basePath + '/' + path : path
      return path
    })
    return {
      showMenuType,
      pathResolve,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-sub-menu {
  text-align: left;
}
.el-menu-item {
  text-align: left;
}
:deep() {
  svg {
    margin-right: 5px;
  }
}
.svgdiv {
  display: flex;
  align-items: center;
}
.collapse {
  .svgdiv {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
