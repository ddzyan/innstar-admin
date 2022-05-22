<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <p>用户列表</p>
      </div>
      <div>
        <!-- <el-button class="plain-btn" @click="$router.push('/baseknowledge/list/edit')">创建知识</el-button> -->
      </div>
    </div>
    <div class="my-tables">
      <el-form class="table-top-ruleForm">
        <el-form-item label="手机号">
          <el-input v-model="ruleForm.tel" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="ruleForm.nickname" autocomplete="off" />
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
        <!-- <el-table-column label="序号">
          <template #default="scope">{{ (pager.currentPage - 1) * pager.pageSize + scope.$index + 1 }}</template>
        </el-table-column> -->
        <el-table-column prop="userId" label="ID" />
        <el-table-column prop="tel" label="手机号" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-image v-if="scope.row.avatar" style="width: 30px; height: 30px" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" fit="contain" />
          </template>
        </el-table-column>
        <el-table-column label="注册时间">
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
                  <!-- <el-dropdown-item>
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item> -->
                  <el-dropdown-item @click="delRow(scope.row.userId)">
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
import { MoreFilled, Delete, Search } from '@element-plus/icons-vue'
import { timestampToTime } from '@/utils/index'

import { getUserList, postUserDel } from '@/api/app'
import { ElMessage, ElMessageBox } from 'element-plus'

const ruleForm = ref({
  tel: '',
  nickname: '',
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
  if (ruleForm.value.tel) {
    params.tel = ruleForm.value.tel
  }
  if (ruleForm.value.nickname) {
    params.nickname = ruleForm.value.nickname
  }
  getUserList(params)
    .then((res) => {
      pager.total = res.data.count
      tableData.value = res.data.data
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
})

const delRow = (id: number) => {
  ElMessageBox.confirm(`确认要删除id为${id}的数据吗？`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        postUserDel({ userId: id })
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
