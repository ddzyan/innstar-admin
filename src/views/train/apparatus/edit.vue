<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>器械列表</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ !instrumentId ? '创建' : '编辑' }}器械
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/apparatus')">返回</el-button>
      </div>
    </div>
    <el-card v-if="pageLoading" class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="器械名称" prop="name">
          <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="器械排序">
          <el-input-number v-model="ruleForm.rank" :min="0" controls-position="right" />
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
              <my-upload-vue
                :init-file="ruleForm.videoUrl"
                :init-duration="ruleForm.duration"
                file-type="video"
                @change-file="changeVideoUrl"
                @change-duration="changeDuration"
              />
            </div>
          </div>
        </div>

        <!-- <el-form-item label="浏览人数" prop="readers">
          <el-input v-model="ruleForm.readers" type="text" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="计划简介" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" autocomplete="off" rows="6" placeholder="请输入简介" />
        </el-form-item>

        <div class="advertisement">
          <div class="box-title">
            <div class="ctitle">产品运营链接</div>
            <div class="flex-items">
              <el-switch v-model="ruleForm.isOpen" size="large" />
            </div>
          </div>
          <div v-if="ruleForm.isOpen">
            <my-upload1-vue :init-file="ruleForm.adUrl" :init-shop-url="ruleForm.adLink" @change-file="changeAdUrl" @change-shopurl="changeAdLink" />
          </div>
        </div>

        <!-- <action-table-vue /> -->
        <connect-table-vue :init-data="ruleForm.initCourses" @change-data="changeCourses" />

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
import MyUpload1Vue from '@/components/base/myUpload1.vue'
import connectTableVue from '@/components/form-base/connect-table.vue'
// import actionTableVue from '@/components/form-base/action-table.vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { postInstrumentsCreate, getInstrumentsByid, postInstrumentsEdit } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()

const instrumentId = ref()
const pageLoading = ref(false)
const loading = ref(false)
const ruleForm = reactive({
  name: '',
  rank: 0,
  // readers: '',
  describe: '',
  coverUrl: '',
  videoUrl: '',
  courses: [],
  initCourses: [],
  duration: '',
  isOpen: false,
  adUrl: '',
  adLink: '',
})

const rules = reactive({
  name: [{ required: true, message: '器械名称', trigger: 'blur' }],
  describe: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  // readers: [{ required: true, message: '请输入人数', trigger: 'blur' }],
})

const changeCoverUrl = (val: string) => {
  ruleForm.coverUrl = val
}
const changeVideoUrl = (val: string) => {
  ruleForm.videoUrl = val
}
const changeCourses = (val: any) => {
  ruleForm.courses = val
}
const changeDuration = (val: string) => {
  ruleForm.duration = val
}
const changeAdUrl = (val: string) => {
  ruleForm.adUrl = val
}
const changeAdLink = (val: string) => {
  ruleForm.adLink = val
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
      if (!ruleForm.duration) {
        ElMessage.error('请输入视频时长')
        return
      }
      if (ruleForm.isOpen) {
        if (!ruleForm.adUrl) {
          ElMessage.error('请上传运营图')
          return
        }
        if (!ruleForm.adLink) {
          ElMessage.error('请输入运营链接')
          return
        }
      }

      // if (ruleForm.courses.length < 1) {
      //   ElMessage.error('请选择链接课程')
      //   return
      // }
      loading.value = true
      const params: {
        title: string
        rank: number
        describe: string
        readers: number
        coverUrl: string
        videoUrl: string
        courses: any[]
        duration: string
        adUrl?: string
        adLink?: string
      } = {
        title: ruleForm.name,
        rank: Number(ruleForm.rank),
        describe: ruleForm.describe,
        readers: 0,
        coverUrl: ruleForm.coverUrl,
        videoUrl: ruleForm.videoUrl,
        courses: ruleForm.courses,
        duration: ruleForm.duration,
      }
      if (ruleForm.isOpen) {
        params.adUrl = ruleForm.adUrl
        params.adLink = ruleForm.adLink
      }
      if (instrumentId.value) {
        postInstrumentsEdit({ ...params, instrumentId: Number(instrumentId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postInstrumentsCreate(params)
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
    instrumentId.value = Number(route.query.id)
    getInstrumentsByid({ instrumentId: route.query.id as string }).then((res) => {
      ruleForm.name = res.data.instrument.title
      ruleForm.rank = res.data.instrument.rank
      ruleForm.describe = res.data.instrument.describe
      // ruleForm.readers = res.data.instrument.readers
      ruleForm.coverUrl = res.data.instrument.coverUrl
      ruleForm.videoUrl = res.data.instrument.video.url
      ruleForm.duration = res.data.instrument.video.duration
      ruleForm.courses = (res.data.course || []).map((item: any) => {
        return {
          courseId: item.courseId,
          rank: item.rank,
        }
      })

      ruleForm.initCourses = (res.data.course || []).map((item: any) => {
        return {
          courseId: item.courseId,
          title: item.title,
          instrument: item.instrument,
          courseType: item.courseType,
          rank: item.rank,
        }
      })
      ruleForm.adUrl = res.data.instrument.adUrl
      ruleForm.adLink = res.data.instrument.adLink
      if (res.data.instrument.adUrl) {
        ruleForm.isOpen = true
      }
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
.advertisement {
  margin-bottom: 40px;
  .box-title {
    display: flex;
    align-items: center;
    .ctitle {
      width: auto;
      font-size: var(--el-form-label-font-size);
      color: var(--el-text-color-regular);
      line-height: 40px;
      text-align: right;
      padding: 0 12px 0 10px;
      box-sizing: border-box;
    }
  }
}
</style>
