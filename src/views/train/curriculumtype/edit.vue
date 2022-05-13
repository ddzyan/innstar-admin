<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>课程分类</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ !courseTypeId ? '创建' : '编辑' }}分类
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/curriculumtype')">返回</el-button>
      </div>
    </div>
    <el-card class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="分类标题" prop="title">
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类排序" prop="rank">
          <el-input-number v-model="ruleForm.rank" :min="1" controls-position="right" />
        </el-form-item>

        <el-form-item style="text-align: right">
          <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { postCourseTypeCreate, postCourseTypeEdit, getCourseTypeByid } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()
const courseTypeId = ref()

const loading = ref(false)
const ruleForm = reactive({
  title: '',
  rank: 1,
})

const rules = reactive({
  title: [{ required: true, message: '请输入分类标题', trigger: 'blur' }],
})

const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      const params = {
        title: ruleForm.title,
        rank: Number(ruleForm.rank),
      }
      if (courseTypeId.value) {
        postCourseTypeEdit({ ...params, courseTypeId: Number(courseTypeId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postCourseTypeCreate(params)
          .then(() => {
            ElMessage.success('添加成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

onMounted(() => {
  if (route.query.id) {
    courseTypeId.value = Number(route.query.id)
    getCourseTypeByid({ courseTypeId: route.query.id as string }).then((res) => {
      ruleForm.title = res.data.title
      ruleForm.rank = res.data.rank
    })
  }
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
    .t {
      display: flex;
      line-height: 1;
      div {
        cursor: pointer;
      }
      span {
        display: flex;
        align-items: flex-end;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        .el-icon {
          font-size: 20px;
          margin: 0 10px;
        }
      }
    }
  }
  .el-button {
    min-width: 120px;
  }
  .form-box {
    margin: 50px 0;
    padding: 20px 0;
    overflow-x: auto;
    .el-form-item {
      margin-bottom: 40px;
    }
    .form-upload-item-div {
      display: flex;
      margin-bottom: 40px;
      & > div {
        width: 30%;
        min-width: 500px;
        display: flex;
        & > div:nth-of-type(1) {
          width: 80px;
          text-align: right;
          font-size: var(--el-form-label-font-size);
          color: var(--el-text-color-regular);
          line-height: 40px;
          padding: 0 12px 0 0;
          box-sizing: border-box;
        }
      }
    }
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
  }
}
</style>
