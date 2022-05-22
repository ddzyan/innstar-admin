<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <p>知识列表</p>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/baseknowledge/list/edit')">创建知识</el-button>
      </div>
    </div>
    <div class="my-tables">
      <el-form class="table-top-ruleForm">
        <el-form-item label="知识名称">
          <el-input v-model="ruleForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="知识分类">
          <el-select v-model="ruleForm.knowledgeTypeId" placeholder="请选择知识分类">
            <el-option :label="'全部'" :value="''" />
            <el-option v-for="i in knowledgeType" :key="i.knowledgeTypeId" :label="i.name" :value="i.knowledgeTypeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="ruleForm.createdAt" type="daterange" range-separator="~" start-placeholder="Start" end-placeholder="End" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchFn">搜索</el-button>
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
        <el-table-column prop="knowledgeId" label="ID" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="rank" label="排序" />
        <el-table-column label="知识分类">
          <template #default="scope">{{ scope.row.knowledgeType?.name }}</template>
        </el-table-column>

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
                  <el-dropdown-item @click="$router.push(`/baseknowledge/list/edit?id=${scope.row.knowledgeId}`)">
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="delRow(scope.row.knowledgeId)">
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
import { getKnowledgeList, postKnowledgeDel, getKnowledgeTypeList } from '@/api/app'

const knowledgeType = ref<any>([])
const ruleForm = ref({
  title: '',
  knowledgeTypeId: '',
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
  if (ruleForm.value.knowledgeTypeId) {
    params.knowledgeTypeId = Number(ruleForm.value.knowledgeTypeId)
  }
  if (ruleForm.value.createdAt) {
    params.startAt = ruleForm.value.createdAt[0]
    params.endAt = ruleForm.value.createdAt[1]
  }
  getKnowledgeList(params)
    .then((res) => {
      tableData.value = res.data.data
      pager.total = res.data.count
    })
    .finally(() => {
      loading.value = false
    })
}

const searchFn = () => {
  pager.currentPage = 1
  getBList()
}

function callFather(parm: any) {
  pager.currentPage = parm?.currentPage || 1
  pager.pageSize = parm?.pageSize || 10
  getBList()
}

onMounted(() => {
  getBList()
  getKnowledgeTypeList({ limit: '99', page: '1' }).then((res) => {
    knowledgeType.value = res.data.rows
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
        postKnowledgeDel({ knowledgeId: id })
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
