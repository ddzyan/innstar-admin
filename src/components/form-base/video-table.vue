<template>
  <div class="connect-item-box">
    <div class="ctitle">视频定点</div>
    <div class="flex-items">
      <div>
        <div>
          <div>
            <el-input v-model="ruleForm.title" type="text" autocomplete="off" placeholder="请输入动作名称" />
          </div>
          <div>
            <el-input v-model="ruleForm.startAt" type="text" autocomplete="off" placeholder="请输入起始时间 00:00:00" />
          </div>
          <div>
            <el-input v-model="ruleForm.endAt" type="text" autocomplete="off" placeholder="请输入结束时间 00:00:00" />
          </div>
        </div>
        <div>
          <div class="imgupload">
            <my-upload-vue v-if="resetUpload" :init-file="ruleForm.coverUrl" file-type="img" @change-file="changeCoverUrl" />
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
      <el-table-column label="序号">
        <template #default="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="动作名称" />
      <el-table-column prop="startAt" label="动作封面图">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.coverUrl" :preview-src-list="[scope.row.coverUrl]" fit="contain" />
        </template>
      </el-table-column>
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
                <el-dropdown-item @click="editTableCol(scope.row, scope.$index)">
                  <div class="flex-ac">
                    <el-icon><edit /></el-icon>
                    编辑
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
    <el-dialog v-model="dialogVisible" title="修改">
      <div v-if="dialogVisible">
        <div style="margin-bottom: 10px">
          <el-input v-model="curEditRow.data.title" type="text" autocomplete="off" placeholder="请输入动作名称" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="curEditRow.data.startAt" type="text" autocomplete="off" placeholder="请输入起始时间 00:00:00" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="curEditRow.data.endAt" type="text" autocomplete="off" placeholder="请输入结束时间 00:00:00" />
        </div>
      </div>
      <div>
        <div class="imgupload">
          <my-upload-vue :init-file="curEditRow.data.coverUrl" file-type="img" @change-file="changeCoverUrl1" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changeTableCol">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, nextTick } from 'vue'
import { MoreFilled, Delete, Bottom, Top as IconTop, Edit } from '@element-plus/icons-vue'
import MyUploadVue from '@/components/base/myUpload.vue'
import { ElMessage } from 'element-plus'
const props = defineProps<{ initData: any }>()
const resetUpload = ref(true)
const emits = defineEmits(['changeData'])
const ruleForm = reactive({
  title: '',
  startAt: '',
  endAt: '',
  coverUrl: '',
})
const changeCoverUrl = (val: string) => {
  ruleForm.coverUrl = val
}

const tableData = ref<any>(props.initData || [])

watch(tableData.value, (val) => {
  emits(
    'changeData',
    val.map((i: any) => {
      return {
        title: String(i.title),
        startAt: Number(i.startAt),
        endAt: Number(i.endAt),
        coverUrl: String(i.coverUrl),
      }
    }),
  )
})

const addTable = () => {
  if (!ruleForm.startAt) {
    ElMessage.error('请输入起始时间')
    return
  }
  if (!ruleForm.endAt) {
    ElMessage.error('请输入结束时间')
    return
  }
  let _start = 0
  let _end = 0
  const startArr = ruleForm.startAt.split(':')
  const endArr = ruleForm.endAt.split(':')
  if (startArr.length != 3) {
    ElMessage.error('起始时间格式不对')
    return
  }
  if (endArr.length != 3) {
    ElMessage.error('结束时间格式不对')
    return
  }
  _start = Number(startArr[0]) * 60 * 60 + Number(startArr[1]) * 60 + Number(startArr[2])
  _end = Number(endArr[0]) * 60 * 60 + Number(endArr[1]) * 60 + Number(endArr[2])

  if (isNaN(_start) || isNaN(_end)) {
    ElMessage.error('时间格式不对')
    return
  }
  if (!ruleForm.title || !ruleForm.startAt || !ruleForm.endAt) {
    ElMessage.error('请输入内容')
    return
  }
  if (!ruleForm.coverUrl) {
    ElMessage.error('请上传封面')
    return
  }
  tableData.value.push({
    title: ruleForm.title,
    startAt: _start,
    endAt: _end,
    coverUrl: ruleForm.coverUrl,
  })
  ruleForm.title = ''
  ruleForm.startAt = ''
  ruleForm.endAt = ''
  ruleForm.coverUrl = ''
  resetUpload.value = false
  nextTick(() => {
    resetUpload.value = true
  })
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
const dialogVisible = ref(false)
const curEditRow = ref({
  data: {
    title: '',
    startAt: '',
    endAt: '',
    coverUrl: '',
  },
  index: 0,
})
const changeCoverUrl1 = (val: string) => {
  curEditRow.value.data.coverUrl = val
}
const editTableCol = (row: any, ind: any) => {
  const _data: any = {}
  _data.title = row.title
  _data.startAt = formatTime(row.startAt)
  _data.endAt = formatTime(row.endAt)
  _data.coverUrl = row.coverUrl
  curEditRow.value.data = _data
  curEditRow.value.index = ind
  dialogVisible.value = true
}
const changeTableCol = () => {
  const _ruleForm = curEditRow.value.data
  // 校验
  if (!_ruleForm.startAt) {
    ElMessage.error('请输入起始时间')
    return
  }
  if (!_ruleForm.endAt) {
    ElMessage.error('请输入结束时间')
    return
  }
  let _start = 0
  let _end = 0
  const startArr = _ruleForm.startAt.split(':')
  const endArr = _ruleForm.endAt.split(':')
  if (startArr.length != 3) {
    ElMessage.error('起始时间格式不对')
    return
  }
  if (endArr.length != 3) {
    ElMessage.error('结束时间格式不对')
    return
  }
  _start = Number(startArr[0]) * 60 * 60 + Number(startArr[1]) * 60 + Number(startArr[2])
  _end = Number(endArr[0]) * 60 * 60 + Number(endArr[1]) * 60 + Number(endArr[2])

  if (isNaN(_start) || isNaN(_end)) {
    ElMessage.error('时间格式不对')
    return
  }
  if (!_ruleForm.title || !_ruleForm.startAt || !_ruleForm.endAt) {
    ElMessage.error('请输入内容')
    return
  }
  if (!_ruleForm.coverUrl) {
    ElMessage.error('请上传封面')
    return
  }
  tableData.value.splice(curEditRow.value.index, 1, { ..._ruleForm, startAt: _start, endAt: _end })
  dialogVisible.value = false
  curEditRow.value = {
    data: {
      title: '',
      startAt: '',
      endAt: '',
      coverUrl: '',
    },
    index: 0,
  }
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
    height: 130px;
    // flex-wrap: wrap;
    .imgupload {
      transform: scale(0.75);
      transform-origin: left top;
    }
    & > div:nth-of-type(1) {
      display: flex;
      height: 130px;
      & > div:nth-of-type(1) {
        margin-right: 10px;
        min-width: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        & > div {
          margin-bottom: 10px;
        }
      }
      // & > div {
      //   margin-bottom: 10px;
      //   .el-input {
      //     width: 100%;
      //   }
      // }
    }
    // & > div:nth-of-type(1) {
    //   flex-grow: 1;
    //   margin-right: 20px;
    //   display: flex;
    //   & > div {
    //     width: 24%;
    //     padding-right: 20px;
    //     .el-input-number {
    //       width: 120px;
    //     }
    //     &.sorder {
    //       display: flex;
    //       font-size: var(--el-form-label-font-size);
    //       color: var(--el-text-color-regular);
    //       line-height: 40px;
    //       & > div {
    //         min-width: 3em;
    //       }
    //     }
    //   }
    // }
  }
}
.connect-item-table {
  margin-bottom: 40px;
}
</style>
