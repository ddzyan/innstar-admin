<template>
  <svg class="remix" :style="`width: ${size}px; height: ${size}px`">
    <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
  </svg>
</template>

<script lang="ts" setup>
import remixiconUrl from '@/assets/svg/remixicon.symbol.svg?url'
defineProps({
  icon: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 18,
  },
})
</script>

<style lang="scss" scoped>
svg.remix {
  color: inherit;
  fill: currentColor;
}
</style>
