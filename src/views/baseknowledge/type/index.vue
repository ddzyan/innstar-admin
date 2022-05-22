<template>
  <div class="box">
    <div class="title">
      <div class="t">知识分类</div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/baseknowledge/type/edit')">创建分类</el-button>
      </div>
    </div>
    <div class="my-tables">
      <el-table
        v-loading="loading"
        :data="tableData"
        element-loading-text="Loading..."
        style="width: 100%"
        size="large"
        header-row-class-name="my-table-header"
        row-class-name="my-table-tr"
      >
        <el-table-column prop="knowledgeTypeId" label="ID" />
        <el-table-column prop="name" label="知识分类名称" />
        <el-table-column prop="rank" label="排序" />
        <el-table-column label="创建时间">
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
                  <el-dropdown-item @click="$router.push(`/baseknowledge/type/edit?id=${scope.row.knowledgeTypeId}`)">
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="delRow(scope.row.knowledgeTypeId)">
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
import { MoreFilled, Edit, Delete } from '@element-plus/icons-vue'
import { timestampToTime } from '@/utils/index'

import { getKnowledgeTypeList, postKnowledgeTypeDel } from '@/api/app'
import { ElMessageBox, ElMessage } from 'element-plus'

// const ruleForm = ref({
//   name: '',
// })

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
  getKnowledgeTypeList({ limit: pageSize, page: currentPage })
    .then((res) => {
      tableData.value = res.data.rows
      pager.total = res.data.count
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
})

const delRow = (id: number) => {
  ElMessageBox.confirm(`确认要删除id为${id}的数据吗？`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        postKnowledgeTypeDel({ knowledgeTypeId: id })
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
    margin: 40px 0;
  }
}
</style>
