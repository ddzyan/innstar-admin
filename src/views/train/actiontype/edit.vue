<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>动作分类</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ !muscleId ? '创建' : '编辑' }}分类
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/actiontype')">返回</el-button>
      </div>
    </div>
    <el-card v-if="pageLoading" class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类排序" prop="rank">
          <el-input-number v-model="ruleForm.rank" :min="1" controls-position="right" />
        </el-form-item>

        <div class="form-upload-item-div">
          <div>
            <div>上传封面</div>
            <div>
              <my-upload-vue :init-file="ruleForm.coverUrl" file-type="img" @change-file="changeCoverUrl" />
            </div>
          </div>
          <div>
            <div>上传视频</div>
            <div>
              <my-upload-vue :init-file="ruleForm.videoUrl" file-type="video" @change-file="changeVideoUrl" />
            </div>
          </div>
        </div>

        <el-form-item style="text-align: right">
          <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import MyUploadVue from '@/components/base/myUpload.vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { getMusclesTypeByid, postMusclesTypeCreate, postMusclesTypeEdit } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()
const muscleId = ref()
const pageLoading = ref(false)

// const validatePass = (rule: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('Please input the password'))
//   } else {
//     if (ruleForm.checkPass !== '') {
//       if (!ruleFormRef.value) return
//       ruleFormRef.value.validateField('checkPass', () => null)
//     }
//     callback()
//   }
// }
const loading = ref(false)
const ruleForm = reactive({
  title: '',
  rank: 1,
  coverUrl: '',
  videoUrl: '',
})

const rules = reactive({
  // name: [{ validator: validatePass, trigger: 'blur' }],
  name: [{ required: true, message: '请输入动作分类', trigger: 'blur' }],
})

const changeCoverUrl = (val: string) => {
  ruleForm.coverUrl = val
}
const changeVideoUrl = (val: string) => {
  ruleForm.videoUrl = val
}

const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      if (!ruleForm.coverUrl) {
        ElMessage.error('请上传封面')
        return
      }
      if (!ruleForm.videoUrl) {
        ElMessage.error('请上传视频')
        return
      }
      loading.value = true

      const params = {
        title: ruleForm.title,
        rank: Number(ruleForm.rank),
        coverUrl: ruleForm.coverUrl,
        videoUrl: ruleForm.videoUrl,
      }
      if (muscleId.value) {
        postMusclesTypeEdit({ ...params, muscleId: Number(muscleId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postMusclesTypeCreate(params)
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
    muscleId.value = Number(route.query.id)
    getMusclesTypeByid({ muscleId: route.query.id as string }).then((res) => {
      ruleForm.title = res.data.title
      ruleForm.rank = res.data.rank
      ruleForm.coverUrl = res.data.coverUrl
      ruleForm.videoUrl = res.data.video.url

      pageLoading.value = true
    })
  } else {
    pageLoading.value = true
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
