<template>
  <div class="connect-item-box">
    <div class="ctitle">动作分类</div>
    <div class="flex-items">
      <div>
        <div>
          <el-select v-model="ruleForm.name" placeholder="所属部位">
            <el-option :label="'分类1'" :value="'分类1'" />
            <el-option :label="'分类2'" :value="'分类2'" />
            <el-option :label="'分类3'" :value="'分类3'" />
          </el-select>
        </div>
        <div class="sorder">
          <div>排序</div>
          <div>
            <el-input-number v-model="ruleForm.order" :min="0" controls-position="right" />
          </div>
        </div>
      </div>
      <div>
        <el-button plain @click="addTable">确认</el-button>
      </div>
    </div>
  </div>
  <div class="connect-item-table my-tables">
    <el-table :data="tableData" style="width: 100%" size="large" header-row-class-name="my-table-header" row-class-name="my-table-tr">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="id" label="所属部位" />
      <el-table-column prop="id" label="排序" />
      <el-table-column prop="id" label="部位图标">
        <template #default>
          <el-image
            style="width: 40px; height: 40px"
            :src="'https://source.unsplash.com/200x200'"
            :preview-src-list="['https://source.unsplash.com/200x200']"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column label="xxx">
        <template #default="scope">xxx{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default>
          <el-dropdown trigger="click">
            <div style="cursor: pointer">
              <el-icon><more-filled /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="flex-ac" style="color: #f24242">
                    <el-icon><delete /></el-icon>
                    删除
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { MoreFilled, Delete } from '@element-plus/icons-vue'

import { demoApi } from '@/api/app'
const emits = defineEmits(['changeData'])
const ruleForm = reactive({
  name: '',
  order: 0,
})

const tableData = ref<any>([])

watch(tableData, (val) => {
  console.log(val)
  // emits()
})

const addTable = () => {
  tableData.value = [
    ...tableData.value,
    {
      id: tableData.value.length,
    },
  ]
}

onMounted(() => {
  console.log('mount')
})
</script>

<style lang="scss" scoped>
.connect-item-box {
  margin-bottom: 40px;
  .ctitle {
    width: 80px;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
    line-height: 40px;
    text-align: right;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .flex-items {
    display: flex;
    justify-content: space-between;
    & > div:nth-of-type(1) {
      flex-grow: 1;
      margin-right: 20px;
      display: flex;
      & > div {
        width: 24%;
        padding-right: 20px;
        .el-input-number {
          width: 120px;
        }
        &.sorder {
          display: flex;
          font-size: var(--el-form-label-font-size);
          color: var(--el-text-color-regular);
          line-height: 40px;
          & > div {
            min-width: 3em;
          }
        }
      }
    }
  }
}
.connect-item-table {
  margin-bottom: 40px;
}
</style>
