<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <p>动作列表</p>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/actionlist/edit')">创建动作</el-button>
      </div>
    </div>
    <div class="my-tables">
      <el-form class="table-top-ruleForm">
        <el-form-item label="动作名称">
          <el-input v-model="ruleForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属器械" prop="instrumentId">
          <el-select v-model="ruleForm.instrumentId" placeholder="所属器械">
            <el-option v-for="i in instruments" :key="i.instrumentId" :label="i.title" :value="i.instrumentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部位" prop="muscleId">
          <el-select v-model="ruleForm.muscleId" placeholder="所属部位">
            <el-option v-for="i in musclesType" :key="i.muscleId" :label="i.title" :value="i.muscleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="ruleForm.createdAt" type="datetimerange" range-separator="~" start-placeholder="Start" end-placeholder="End" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        element-loading-text="Loading..."
        style="width: 100%"
        size="large"
        header-row-class-name="my-table-header"
        row-class-name="my-table-tr"
      >
        <el-table-column prop="actionId" label="ID" />
        <el-table-column prop="title" label="动作名称" />
        <el-table-column label="所属器械">
          <template #default="scope">{{ scope.row.instrument?.title }}</template>
        </el-table-column>
        <el-table-column label="所属部位">
          <template #default="scope">{{ scope.row.muscle?.title }}</template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" />
        <el-table-column label="创建时间" :min-width="'120'">
          <template #default="scope">{{ timestampToTime(scope.row.createdAt) }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-dropdown trigger="click">
              <div style="cursor: pointer">
                <el-icon><more-filled /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push(`/train/actionlist/edit?id=${scope.row.actionId}`)">
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="delRow(scope.row.actionId)">
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
      <my-pagination :child-msg="pager" @call-father="callFather"></my-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import MyPagination from '@/components/base/Pagination.vue'
import { MoreFilled, Edit, Delete, Search } from '@element-plus/icons-vue'
import { timestampToTime } from '@/utils/index'
import { ElMessageBox, ElMessage } from 'element-plus'

import { getActionsList, postActionsDel, getInstrumentsList, getMusclesTypeList } from '@/api/app'

const instruments = ref<any>([])
const musclesType = ref<any>([])
const ruleForm = ref({
  title: '',
  instrumentId: '',
  muscleId: '',
  createdAt: '',
})

const tableData = ref<any>([])
const loading = ref<any>(false)
const pager = reactive<any>({
  // 页码
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
const getBList = () => {
  const { currentPage, pageSize } = pager
  loading.value = true
  const params: any = {
    limit: pageSize,
    page: currentPage,
  }
  if (ruleForm.value.title) {
    params.title = ruleForm.value.title
  }
  if (ruleForm.value.instrumentId) {
    params.instrumentId = Number(ruleForm.value.instrumentId)
  }
  if (ruleForm.value.muscleId) {
    params.muscleId = Number(ruleForm.value.muscleId)
  }
  // if (ruleForm.value.createdAt) {
  //   params.startAt = ruleForm.value.createdAt[0]
  //   params.endAt = ruleForm.value.createdAt[1]
  // }
  getActionsList(params)
    .then((res) => {
      pager.total = res.data.count
      tableData.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
}

function callFather(parm: any) {
  pager.currentPage = parm?.currentPage || 1
  pager.pageSize = parm?.pageSize || 10
  getBList()
}

onMounted(() => {
  getBList()
  getInstrumentsList({ limit: '99', page: '1' })
    .then((res) => {
      instruments.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
  getMusclesTypeList({ limit: '99', page: '1' })
    .then((res) => {
      musclesType.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
})
const delRow = (id: number) => {
  ElMessageBox.confirm(`确认要删除id为${id}的数据吗？`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        postActionsDel({ actionId: id })
          .then(() => {
            done()
          })
          .finally(() => {
            instance.confirmButtonLoading = false
          })
      } else {
        done()
      }
    },
  }).then(() => {
    getBList()
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  })
}
</script>

<style lang="scss" scoped>
.box {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    font-size: 28px;
    font-weight: bold;
    color: #000000;
    .plain-btn {
      background-color: transparent;
      border-color: #000000;
      color: #000000;
    }
  }
  .my-tables {
    margin: 50px 0;
  }
}
</style>
