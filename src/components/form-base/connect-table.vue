<template>
  <div class="connect-item-box">
    <div class="ctitle">链接课程</div>
    <div class="flex-items">
      <div>
        <div>
          <el-select v-model="ruleForm.instrumentId" placeholder="请选择所属器械">
            <el-option v-for="i in instruments" :key="i.instrumentId" :label="i.title" :value="i.instrumentId" />
          </el-select>
        </div>
        <div>
          <el-select v-model="ruleForm.courseTypeId" placeholder="请选择课程分类">
            <el-option v-for="i in courseType" :key="i.courseTypeId" :label="i.title" :value="i.courseTypeId" />
          </el-select>
        </div>
        <div>
          <el-select v-if="courses.length == 0" placeholder="请选择课程"></el-select>
          <el-select v-else v-model="ruleForm1.courseObj" placeholder="请选择课程">
            <el-option v-for="i in courses" :key="i.courseId" :label="i.title" :value="i" />
          </el-select>
        </div>
        <div class="sorder">
          <div>排序</div>
          <div>
            <el-input-number v-model="ruleForm.rank" :min="1" controls-position="right" />
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
      <el-table-column prop="courseId" label="ID" />
      <el-table-column prop="title" label="课程名称" />
      <el-table-column prop="rank" label="排序" />
      <el-table-column label="所属器械">
        <template #default="scope">{{ scope.row.instrument?.title }}</template>
      </el-table-column>
      <el-table-column label="所属课程">
        <template #default="scope">{{ scope.row.courseType?.title }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-dropdown trigger="click">
            <div style="cursor: pointer">
              <el-icon><more-filled /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
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
import { onMounted, ref, watch, reactive } from 'vue'
import { MoreFilled, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { getInstrumentsList, getCourseTypeList, getCoursesList } from '@/api/app'
const instruments = ref<any>([])
const courseType = ref<any>([])
const courses = ref<any>([])
const props = defineProps<{ initData: any }>()
const emits = defineEmits(['changeData'])
const ruleForm = reactive<any>({
  instrumentId: '',
  courseTypeId: '',
  rank: 1,
})

const ruleForm1 = reactive<any>({
  courseObj: {},
})

const tableData = ref<any>(props.initData || [])

watch(tableData.value, (val) => {
  emits(
    'changeData',
    val.map((i: any) => {
      return {
        courseId: Number(i.courseId),
        rank: Number(i.rank),
      }
    }),
  )
})
watch(ruleForm, () => {
  if (ruleForm.instrumentId && ruleForm.courseTypeId) {
    getCoursesList1()
  }
})

const getCoursesList1 = () => {
  getCoursesList({
    limit: '99',
    page: '1',
    instrumentId: Number(ruleForm.instrumentId),
    courseTypeId: Number(ruleForm.courseTypeId),
  }).then((res) => {
    if (res.data.data.length > 0) {
      ruleForm1.courseObj = res.data.data[0]
    }
    courses.value = res.data.data
  })
}

const addTable = () => {
  if (ruleForm1.courseObj?.courseId) {
    tableData.value.push({
      ...ruleForm1.courseObj,
      rank: Number(ruleForm.rank),
    })
    ruleForm.instrumentId = ''
    ruleForm.courseTypeId = ''
    ruleForm1.courseObj = {}
    ruleForm.rank = 1
    courses.value = []
  } else {
    ElMessage.error('请选择课程')
  }
}

const removeTableCol = (item: any) => {
  const index = tableData.value.indexOf(item)
  if (index !== -1) {
    tableData.value.splice(index, 1)
  }
}

onMounted(() => {
  getInstrumentsList({ limit: '99', page: '1' }).then((res) => {
    instruments.value = res.data.data
  })
  getCourseTypeList({ limit: '99', page: '1' }).then((res) => {
    courseType.value = res.data.rows
  })
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
