<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <p>动作分类</p>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/actiontype/edit')">创建分类</el-button>
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
        <el-table-column prop="muscleId" label="ID" />
        <el-table-column prop="title" label="分类名称" />

        <el-table-column label="视频地址">
          <template #default="scope">
            <a :href="scope.row.video.url" target="_blank">查看视频</a>
          </template>
        </el-table-column>
        <el-table-column label="动作图标">
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.coverUrl" :preview-src-list="[scope.row.coverUrl]" fit="contain" />
          </template>
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
                  <el-dropdown-item @click="$router.push(`/train/actiontype/edit?id=${scope.row.muscleId}`)">
                    <div class="flex-ac">
                      <el-icon><edit /></el-icon>
                      编辑
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="delRow(scope.row.muscleId)">
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
import { ElMessageBox, ElMessage } from 'element-plus'

import { getMusclesTypeList, postMusclesTypeDel } from '@/api/app'

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
  getMusclesTypeList({ limit: pageSize, page: currentPage })
    .then((res) => {
      pager.total = res.data.res.count
      tableData.value = res.data.res.data
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
        postMusclesTypeDel({ muscleId: id })
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
