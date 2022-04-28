<template>
  111
  <el-button @click="showContent">console</el-button>
  <el-button @click="showContent" type="primary">console</el-button>
</template>

<script lang="ts" setup>
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
