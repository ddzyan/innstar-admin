<template>
  111
  <el-button @click="showContent">console</el-button>
  <el-button type="primary" @click="showContent">console</el-button>
  <el-button type="text"></el-button>
  <!-- <myUploadVue /> -->
</template>

<script lang="ts" setup>
// import myUploadVue from '@/components/base/myUpload.vue';
import { onMounted } from 'vue'
const showContent = () => {
  console.log(11)
}
</script>

<style lang="scss" scoped>
.a {
  height: 10px;
  padding: 0%;
}
</style>
