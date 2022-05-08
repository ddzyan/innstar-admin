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
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="ruleForm.name" autocomplete="off" />
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="id" label="手机号" />
        <el-table-column prop="id" label="昵称" />
        <el-table-column prop="id" label="ID" />
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
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item>
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
      <my-pagination :child-msg="pager" @call-father="callFather"></my-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import MyPagination from '@/components/base/Pagination.vue'
import { MoreFilled, Edit, Delete, Search } from '@element-plus/icons-vue'

import { demoApi } from '@/api/app'

const ruleForm = ref({
  name: '',
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
  demoApi({ limit: pageSize, page: currentPage })
    .then((res) => {
      tableData.value = [
        { id: (currentPage - 1) * pageSize },
        { id: (currentPage - 1) * pageSize + 1 },
        { id: (currentPage - 1) * pageSize + 2 },
        { id: (currentPage - 1) * pageSize + 3 },
      ]
      pager.total = 100
      // pager.total = res.data.count
      // tableData.value = res.data.rows
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
