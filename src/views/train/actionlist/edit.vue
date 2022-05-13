<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>动作列表</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ !actionId ? '创建' : '编辑' }}动作
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/actionlist')">返回</el-button>
      </div>
    </div>
    <el-card v-if="pageLoading" class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属器械" prop="instrumentId">
          <el-select v-model="ruleForm.instrumentId" placeholder="所属器械">
            <el-option v-for="i in instruments" :key="i.instrumentId" :label="i.title" :value="i.instrumentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部位" prop="muscleId">
          <el-select v-model="ruleForm.muscleId" placeholder="所属部位">
            <el-option v-for="i in musclesType" :key="i.muscleId" :label="i.title" :value="i.muscleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="动作排序" prop="rank">
          <el-input-number v-model="ruleForm.rank" :min="1" controls-position="right" />
        </el-form-item>

        <div class="form-upload-item-div">
          <div>
            <div>动作封面</div>
            <div>
              <my-upload-vue :init-file="ruleForm.coverUrl" file-type="img" @change-file="changeCoverUrl" />
            </div>
          </div>
          <div>
            <div>动作视频</div>
            <div>
              <my-upload-vue :init-file="ruleForm.videoUrl" file-type="video" @change-file="changeVideoUrl" />
            </div>
          </div>
        </div>
        <div class="form-addbox-item-div">
          <div class="ctitle">动作描述</div>
          <div v-for="(domain, index) in ruleForm.actionContents" :key="`${domain.key}`" class="addbox-items">
            <el-form-item
              :label="`${index + 1}、标题`"
              :prop="'actionContents.' + index + '.title'"
              :rules="{
                required: true,
                message: '请输入标题',
                trigger: 'blur',
              }"
            >
              <el-input v-model="domain.title" />
            </el-form-item>
            <el-form-item
              :label="`内容`"
              :prop="'actionContents.' + index + '.describe'"
              :rules="{
                required: true,
                message: '请输入内容',
                trigger: 'blur',
              }"
            >
              <el-input v-model="domain.describe" type="textarea" autocomplete="off" rows="4" />
            </el-form-item>
            <div class="icon-remove-box" @click="removeItemsForm(domain)">
              <el-icon><remove-filled /></el-icon>
            </div>
          </div>
          <div class="add-btn">
            <el-button @click="addItemsForm">添加描述</el-button>
          </div>
        </div>

        <div class="form-upload-item-div">
          <div>
            <div>锻炼部位</div>
            <div>
              <my-upload-vue :init-file="ruleForm.partUrl" file-type="img" @change-file="changePathUrl" />
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
import { ArrowRightBold, RemoveFilled } from '@element-plus/icons-vue'
import { getInstrumentsList, getMusclesTypeList, postActionsCreate, postActionsEdit, getActionsByid } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()

const actionId = ref()
const pageLoading = ref(false)
const instruments = ref<any>([])
const musclesType = ref<any>([])

const loading = ref(false)
const ruleForm = reactive({
  title: '',
  instrumentId: '',
  muscleId: '',
  rank: 1,
  coverUrl: '',
  videoUrl: '',
  actionContents: [
    {
      key: 0,
      title: '',
      describe: '',
    },
  ],
  partUrl: '',
})

const rules = reactive({
  title: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  instrumentId: [{ required: true, message: '请选择所属器械', trigger: 'blur' }],
  muscleId: [{ required: true, message: '请选择所属部位', trigger: 'blur' }],
})

const changeCoverUrl = (val: string) => {
  ruleForm.coverUrl = val
}
const changeVideoUrl = (val: string) => {
  ruleForm.videoUrl = val
}
const changePathUrl = (val: string) => {
  ruleForm.partUrl = val
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
      if (!ruleForm.partUrl) {
        ElMessage.error('请上传锻炼部位')
        return
      }
      if (ruleForm.actionContents.length < 1) {
        ElMessage.error('请填写动作描述')
        return
      }
      loading.value = true
      const params = {
        title: ruleForm.title,
        rank: Number(ruleForm.rank),
        coverUrl: ruleForm.coverUrl,
        videoUrl: ruleForm.videoUrl,
        partUrl: ruleForm.partUrl,
        muscleId: Number(ruleForm.muscleId),
        instrumentId: Number(ruleForm.instrumentId),
        actionContents: ruleForm.actionContents,
      }
      if (actionId.value) {
        postActionsEdit({ ...params, actionId: Number(actionId.value) })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postActionsCreate(params)
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

const addItemsForm = () => {
  ruleForm.actionContents.push({
    key: Date.now(),
    title: '',
    describe: '',
  })
}
const removeItemsForm = (item: any) => {
  const index = ruleForm.actionContents.indexOf(item)
  if (index !== -1) {
    ruleForm.actionContents.splice(index, 1)
  }
}

onMounted(() => {
  getInstrumentsList({ limit: '99', page: '1' })
    .then((res) => {
      instruments.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
  getMusclesTypeList({ limit: '99', page: '1' })
    .then((res) => {
      musclesType.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })

  if (route.query.id) {
    actionId.value = Number(route.query.id)
    getActionsByid({ actionId: route.query.id as string }).then((res) => {
      ruleForm.title = res.data.title
      ruleForm.instrumentId = res.data.instrumentId
      ruleForm.muscleId = res.data.muscleId
      ruleForm.rank = res.data.rank
      ruleForm.coverUrl = res.data.coverUrl
      ruleForm.videoUrl = res.data.video.url
      ruleForm.actionContents = (res.data.actionContent || []).map((item: any, k: number) => {
        return {
          ...item,
          key: k,
        }
      })
      ruleForm.partUrl = res.data.partUrl

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
    .form-addbox-item-div {
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
      .addbox-items {
        display: flex;
        & > div {
          width: 50%;
          flex-grow: 1;
        }
        .icon-remove-box {
          width: 50px;
          padding: 9px 0 10px 10px;
          color: red;
          font-size: 22px;
          cursor: pointer;
        }
      }
      .add-btn {
        text-align: right;
        .el-button {
          width: 200px;
        }
      }
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
