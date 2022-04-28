<template>
  <div class="logo-container">
    <img :style="!isCollapse ? 'height: 50px' : 'width: 200%'" src="/images/logo.png" alt="" />
    <!-- <h1 v-if="!isCollapse">{{ systemTitle }}</h1> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store'
export default defineComponent({
  setup() {
    const appStore = useAppStore()
    const isCollapse = computed(() => appStore.isCollapse)
    return {
      isCollapse,
      systemTitle: 'Admin',
    }
  },
})
</script>

<style lang="scss" scoped>
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--system-logo-background);
  h1 {
    font-size: 20px;
    white-space: nowrap;
    color: var(--system-logo-color);
  }
}
</style>
