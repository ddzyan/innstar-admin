<template>
  111
  <el-button @click="showContent">console</el-button>
  <el-button type="primary" @click="showContent">console</el-button>
  <el-button type="text"></el-button>
</template>

<script lang="ts" setup>
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
