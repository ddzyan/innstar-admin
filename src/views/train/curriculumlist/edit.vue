<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>课程列表</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ !courseId ? '创建' : '编辑' }}课程
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/curriculumlist')">列表</el-button>
      </div>
    </div>
    <el-card v-if="pageLoading" class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属器械" prop="instrumentId">
          <el-select v-model="ruleForm.instrumentId" placeholder="所属器械">
            <el-option v-for="i in instruments" :key="i.instrumentId" :label="i.title" :value="i.instrumentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属课程" prop="courseTypeId">
          <el-select v-model="ruleForm.courseTypeId" placeholder="所属课程">
            <el-option v-for="i in courseType" :key="i.courseTypeId" :label="i.title" :value="i.courseTypeId" />
          </el-select>
        </el-form-item>

        <el-form-item label="课程等级" prop="level">
          <el-input v-model="ruleForm.level" type="text" autocomplete="off" />
        </el-form-item>

        <el-form-item label="练习频次" prop="frequency">
          <el-input v-model="ruleForm.frequency" type="text" autocomplete="off" />
        </el-form-item>

        <el-form-item label="浏览人数" prop="readers">
          <el-input v-model="ruleForm.readers" type="text" autocomplete="off" />
        </el-form-item>

        <el-form-item label="课程排序" prop="rank">
          <el-input-number v-model="ruleForm.rank" :min="1" controls-position="right" />
        </el-form-item>

        <el-form-item label="课程简介" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" autocomplete="off" rows="6" placeholder="请输入课程简介" />
        </el-form-item>

        <div class="form-upload-item-div">
          <div>
            <div>课程封面</div>
            <div>
              <my-upload-vue :init-file="ruleForm.coverUrl" file-type="img" @change-file="changeCoverUrl" />
            </div>
          </div>
          <div>
            <div>课程视频</div>
            <div>
              <my-upload-vue :init-file="ruleForm.videoUrl" file-type="video" @change-file="changeVideoUrl" />
            </div>
          </div>
        </div>

        <video-table-vue :init-data="ruleForm.videoNodes" @change-data="changeVideoNodes" />
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
import videoTableVue from '@/components/form-base/video-table.vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { getCoursesByid, postCoursesCreate, postCoursesEdit, getInstrumentsList, getCourseTypeList } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()
const courseId = ref()
const pageLoading = ref(false)
const instruments = ref<any>([])
const courseType = ref<any>([])

const loading = ref(false)
const ruleForm = reactive({
  title: '',
  coverUrl: '',
  videoUrl: '',
  frequency: '',
  describe: '',
  level: '',
  readers: '',
  instrumentId: '', // 所属器械
  courseTypeId: '', // 所属课程
  videoNodes: [],
  courses: [],
  rank: 1,
  initCourses: [],
})

const rules = reactive({
  title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  instrumentId: [{ required: true, message: '请选择所属器械', trigger: 'blur' }],
  courseTypeId: [{ required: true, message: '请选择所属课程', trigger: 'blur' }],
  level: [{ required: true, message: '请输入课程等级', trigger: 'blur' }],
  frequency: [{ required: true, message: '请输入练习频次', trigger: 'blur' }],
  readers: [{ required: true, message: '请输入浏览人数', trigger: 'blur' }],
  describe: [{ required: true, message: '请输入课程简介', trigger: 'blur' }],
})

const changeCoverUrl = (val: string) => {
  ruleForm.coverUrl = val
}
const changeVideoUrl = (val: string) => {
  ruleForm.videoUrl = val
}
const changeVideoNodes = (val: any) => {
  ruleForm.videoNodes = val
}
const changeCourses = (val: any) => {
  ruleForm.courses = val
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
      if (ruleForm.courses.length < 1) {
        ElMessage.error('请选择链接课程')
        return
      }
      if (ruleForm.videoNodes.length < 1) {
        ElMessage.error('请输入视频定点')
        return
      }

      loading.value = true
      const params = {
        title: ruleForm.title,
        rank: Number(ruleForm.rank),
        coverUrl: ruleForm.coverUrl,
        videoUrl: ruleForm.videoUrl,
        frequency: ruleForm.frequency,
        describe: ruleForm.describe,
        level: ruleForm.level,
        readers: Number(ruleForm.readers),
        courseTypeId: Number(ruleForm.courseTypeId),
        instrumentId: Number(ruleForm.instrumentId),
        videoNodes: ruleForm.videoNodes,
        courses: ruleForm.courses,
      }
      if (courseId.value) {
        postCoursesEdit({ ...params, courseId: Number(courseId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postCoursesCreate(params)
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
  getInstrumentsList({ limit: '99', page: '1' })
    .then((res) => {
      instruments.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
  getCourseTypeList({ limit: '99', page: '1' })
    .then((res) => {
      courseType.value = res.data.rows
    })
    .finally(() => {
      loading.value = false
    })

  if (route.query.id) {
    courseId.value = Number(route.query.id)
    getCoursesByid({ courseId: route.query.id as string }).then((res) => {
      ruleForm.title = res.data.course.title
      ruleForm.coverUrl = res.data.course.coverUrl
      ruleForm.videoUrl = res.data.course.video.url
      ruleForm.frequency = res.data.course.frequency
      ruleForm.describe = res.data.course.describe
      ruleForm.level = res.data.course.level
      ruleForm.readers = res.data.course.readers
      ruleForm.instrumentId = res.data.course.instrumentId
      ruleForm.courseTypeId = res.data.course.courseTypeId
      ruleForm.rank = res.data.course.rank
      ruleForm.videoNodes = res.data.course?.video?.videoNodes
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
