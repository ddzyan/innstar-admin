<template>
  <div class="tags-view-item" :class="active ? 'active' : ''">
    <router-link v-if="menu.meta.title" :to="menu.path">
      {{ (menu.meta.title as string) }}
    </router-link>
    <!-- <RemixIcon :size="12" icon="refresh-line" @click.stop="reload" v-if="active" /> -->
    <RemixIcon v-if="!menu.meta.hideClose" :size="12" icon="close-line" alt="关闭当前标签页" @click.stop="closeTab" />
  </div>
</template>

<script lang="ts">
import RemixIcon from '@/components/remixicon/index.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    RemixIcon,
  },
  props: {
    menu: {
      type: Object,
      default: () => {
        return {
          path: '',
          meta: {
            label: '',
            hideClose: false,
          },
        }
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    // 关闭按钮
    function closeTab() {
      emit('close')
    }
    // 刷新按钮
    // function reload() {
    //   emit('reload')
    // }
    return {
      closeTab,
      // reload,
    }
  },
})
</script>

<style lang="scss" scoped>
.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 24px;
  line-height: 26px;
  border: 1px solid var(--system-header-border-color);
  color: var(--system-header-text-color);
  background: var(--system-header-tab-background);
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
  border-radius: 2px;
  a {
    color: var(--system-header-text-color);
    height: 26px;
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
  }
  .el-icon-refresh-right {
    display: inline-block;
    margin-right: 5px;
  }
  .el-icon-close {
    display: inline-block;
    height: 26px;
  }
  &:first-of-type {
    margin-left: 15px;
  }
  &:last-of-type {
    margin-right: 15px;
  }
  &.active {
    background: var(--system-primary-color);
    border-color: var(--system-primary-color);
    color: var(--system-primary-text-color);
    a {
      color: var(--system-primary-text-color);
    }
    &:hover {
      background: var(--system-primary-color);
    }
  }
  &:hover {
    background-color: var(--system-header-item-hover-color);
  }
}
</style>
