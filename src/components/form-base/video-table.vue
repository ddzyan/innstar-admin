<template>
  <div class="connect-item-box">
    <div class="ctitle">视频定点</div>
    <div class="flex-items">
      <div>
        <div>
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" placeholder="请输入动作名称" />
        </div>
        <div>
          <el-input v-model="ruleForm.startAt" type="text" autocomplete="off" placeholder="请输入起始秒数" />
        </div>
        <div>
          <el-input v-model="ruleForm.endAt" type="text" autocomplete="off" placeholder="请输入结束秒数" />
        </div>
      </div>
      <div>
        <el-button plain @click="addTable">确认</el-button>
      </div>
    </div>
  </div>
  <div class="connect-item-table my-tables">
    <el-table :data="tableData" style="width: 100%" size="large" header-row-class-name="my-table-header" row-class-name="my-table-tr">
      <el-table-column label="序号">
        <template #default="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="动作名称" />
      <el-table-column prop="startAt" label="起始时间">
        <template #default="scope">{{ formatTime(scope.row.startAt) }}</template>
      </el-table-column>

      <el-table-column prop="endAt" label="结束时间">
        <template #default="scope">{{ formatTime(scope.row.endAt) }}</template>
      </el-table-column>
      <el-table-column label="总时间">
        <template #default="scope">{{ Number(scope.row.endAt) - Number(scope.row.startAt) }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-dropdown trigger="click">
            <div style="cursor: pointer">
              <el-icon><more-filled /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="movePosition(scope.row, 1)">
                  <div class="flex-ac">
                    <el-icon><icon-top /></el-icon>
                    上移
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="movePosition(scope.row, 2)">
                  <div class="flex-ac">
                    <el-icon><bottom /></el-icon>
                    下移
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="removeTableCol(scope.row)">
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
import { ref, watch, reactive } from 'vue'
import { MoreFilled, Delete, Bottom, Top as IconTop } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const props = defineProps<{ initData: any }>()

const emits = defineEmits(['changeData'])
const ruleForm = reactive({
  title: '',
  startAt: '',
  endAt: '',
})

const tableData = ref<any>(props.initData || [])

watch(tableData.value, (val) => {
  emits(
    'changeData',
    val.map((i: any) => {
      return {
        title: String(i.title),
        startAt: Number(i.startAt),
        endAt: Number(i.endAt),
      }
    }),
  )
})

const addTable = () => {
  if (isNaN(Number(ruleForm.startAt)) || isNaN(Number(ruleForm.endAt))) {
    ElMessage.error('时间格式不对')
    return
  }
  if (!ruleForm.title || !ruleForm.startAt || !ruleForm.endAt) {
    ElMessage.error('请输入内容')
    return
  }
  tableData.value.push({
    title: ruleForm.title,
    startAt: ruleForm.startAt,
    endAt: ruleForm.endAt,
  })
  ruleForm.title = ''
  ruleForm.startAt = ''
  ruleForm.endAt = ''
}

const removeTableCol = (item: any) => {
  const index = tableData.value.indexOf(item)
  if (index !== -1) {
    tableData.value.splice(index, 1)
  }
}

const swapItem = (arr: any, fromIndex: number, toIndex: number) => {
  arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0]
  return arr
}
const movePosition = (item: any, type: 1 | 2) => {
  // 1: 上移
  // 2: 下移
  const index = tableData.value.indexOf(item)
  if (type == 1) {
    if (index == 0) {
      return
    }
    swapItem(tableData.value, index, index - 1)
  } else {
    if (index == tableData.value.length - 1) {
      return
    }
    swapItem(tableData.value, index, index + 1)
  }
}
const formatTime = (n: any) => {
  const a = [parseInt(String(n / 60 / 60), 10) % 10000, parseInt(String(n / 60), 10) % 60, n % 60]
  return a
    .map((i) => {
      return ('00' + String(i)).substring(String(i).length, String(i).length + 2)
    })
    .join(':')
}
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
