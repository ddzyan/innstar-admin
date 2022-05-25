<template>
  <div class="box">
    <div class="title">
      <div class="t">{{ !knowledgeId ? '创建' : '编辑' }}知识</div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/baseknowledge/list')">返回</el-button>
      </div>
    </div>
    <el-card v-if="pageLoading" class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="知识名称" prop="title">
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="知识分类" prop="knowledgeTypeId">
          <el-select v-model="ruleForm.knowledgeTypeId" placeholder="请选择分类">
            <el-option v-for="i in knowledgeType" :key="i.knowledgeTypeId" :label="i.name" :value="i.knowledgeTypeId" />
          </el-select>
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
        <el-form-item label="知识简介" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" autocomplete="off" rows="6" placeholder="请输入知识简介" />
        </el-form-item>

        <el-form-item label="浏览人数" prop="readers">
          <el-input v-model="ruleForm.readers" type="text" autocomplete="off" />
        </el-form-item>

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
import connectTableVue from '@/components/form-base/connect-table.vue'

import { postKnowledgeCreate, getKnowledgeTypeList, getKnowledgeByid, postKnowledgEdit } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()

const knowledgeId = ref()
const pageLoading = ref(false)
const loading = ref(false)
const knowledgeType = ref<any>([])
const ruleForm = reactive({
  title: '',
  knowledgeTypeId: '',
  rank: 1,
  describe: '',
  readers: '',
  coverUrl: '',
  videoUrl: '',
  courses: [],
  initCourses: [],
  duration: '',
})

const rules = reactive({
  title: [{ required: true, message: '请输入知识名称', trigger: 'blur' }],
  knowledgeTypeId: [{ required: true, message: '请选择知识分类', trigger: 'change' }],
  describe: [{ required: true, message: '请输入知识简介', trigger: 'blur' }],
  readers: [{ required: true, message: '请输入人数', trigger: 'blur' }],
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
      // if (ruleForm.courses.length < 1) {
      //   ElMessage.error('请选择链接课程')
      //   return
      // }
      loading.value = true

      const params = {
        title: ruleForm.title,
        knowledgeTypeId: Number(ruleForm.knowledgeTypeId),
        rank: Number(ruleForm.rank),
        describe: ruleForm.describe,
        readers: Number(ruleForm.readers),
        coverUrl: ruleForm.coverUrl,
        videoUrl: ruleForm.videoUrl,
        courses: ruleForm.courses,
        duration: ruleForm.duration,
      }
      if (knowledgeId.value) {
        postKnowledgEdit({ ...params, knowledgeId: Number(knowledgeId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postKnowledgeCreate(params)
          .then(() => {
            ElMessage.success('添加成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      }
    } else {
      return false
    }
  })
}

onMounted(() => {
  getKnowledgeTypeList({ limit: '99', page: '1' })
    .then((res) => {
      knowledgeType.value = res.data.rows
    })
    .finally(() => {
      loading.value = false
    })
  if (route.query.id) {
    knowledgeId.value = Number(route.query.id)
    getKnowledgeByid({ knowledgeId: route.query.id as string }).then((res) => {
      ruleForm.title = res.data.title
      ruleForm.knowledgeTypeId = res.data.knowledgeType.knowledgeTypeId
      ruleForm.rank = res.data.rank
      ruleForm.describe = res.data.describe
      ruleForm.readers = res.data.readers
      ruleForm.coverUrl = res.data.coverUrl

      ruleForm.videoUrl = res.data.video.url
      ruleForm.duration = res.data.video.duration
      ruleForm.courses = (res.data.courses || []).map((item: any) => {
        return {
          courseId: item.courseId,
          rank: item.rank,
        }
      })

      ruleForm.initCourses = (res.data.courses || []).map((item: any) => {
        return {
          courseId: item.courseId,
          title: item.title,
          instrument: item.instrument,
          courseType: item.courseType,
          rank: item.rank,
        }
      })

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
