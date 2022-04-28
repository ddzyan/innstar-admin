<template>
  <div :title="isFullscreen ? '退出全屏' : '全屏'">
    <RemixIcon :size="20" :icon="!isFullscreen ? 'fullscreen-line' : 'fullscreen-exit-line'" @click="toggle"></RemixIcon>
  </div>
</template>

<script lang="ts">
import RemixIcon from '@/components/remixicon/index.vue'
import { defineComponent } from 'vue'
import { useFullscreen } from '@vueuse/core'

export default defineComponent({
  name: 'Fullscreen',
  components: {
    RemixIcon,
  },
  setup() {
    const { isFullscreen, toggle } = useFullscreen()
    return {
      isFullscreen,
      toggle,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep() {
  svg {
    fill: #000;
    cursor: pointer;
  }
}
</style>
