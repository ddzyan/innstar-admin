<template>
  <component :is="type" v-bind="linkProps(to)" @click="hideMenu">
    <slot></slot>
  </component>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store'
export default defineComponent({
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup() {
    const appStore = useAppStore()
    const isCollapse = computed(() => appStore.isCollapse)
    const linkProps = (to: any) => {
      return {
        to: to,
      }
    }
    const hideMenu = () => {
      if (document.body.clientWidth <= 1000 && !isCollapse.value) {
        appStore.isCollapseChange(true)
      }
    }
    return {
      type: 'router-link',
      linkProps,
      hideMenu,
    }
  },
})
</script>
<style lang=""></style>
