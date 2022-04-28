<!-- TODO current-page以及方法 不兼容了，要改 -->
<template>
  <el-pagination
    class="page-box"
    background
    :current-page="childMsg.currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="childMsg.pageSize"
    :layout="layout"
    :pager-count="5"
    :total="childMsg.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, computed } from 'vue'
export default defineComponent({
  name: 'Pagination',
  props: {
    childMsg: {
      type: Object,
      default: () => {
        return { currentPage: 1, pageSize: 10, total: 0 }
      },
    },
  },
  emits: ['callFather'],
  setup(props, { emit }) {
    const { childMsg } = toRefs(props)
    const data = ref({
      pageparm: {
        currentPage: childMsg.value.currentPage,
        pageSize: childMsg.value.pageSize,
      },
    })

    const isMobile = computed(() => {
      return window.innerWidth < 600
    })
    const layout = computed(() => {
      if (isMobile.value) {
        return 'prev, pager, next'
      } else {
        return 'total, sizes, prev, pager, next, jumper'
      }
    })
    const handleSizeChange = (val: number) => {
      data.value.pageparm.pageSize = val
      emit('callFather', data.value.pageparm)
    }
    const handleCurrentChange = (val: number) => {
      data.value.pageparm.currentPage = val
      emit('callFather', data.value.pageparm)
    }
    return {
      ...toRefs(data.value),
      isMobile,
      layout,
      handleSizeChange,
      handleCurrentChange,
    }
  },
})
</script>

<style>
.page-box {
  margin: 10px auto;
}
</style>
