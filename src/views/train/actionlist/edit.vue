<template>
  <div class="box">
    <div class="title">
      <div class="t">
        <div>动作列表</div>
        <span>
          <el-icon><arrow-right-bold /></el-icon>
          {{ true ? '创建' : '编辑' }}动作
        </span>
      </div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/train/actionlist')">返回</el-button>
      </div>
    </div>
    <el-card class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属器械" prop="order">
          <el-select v-model="ruleForm.name" placeholder="所属器械">
            <el-option :label="'分类1'" :value="'分类1'" />
            <el-option :label="'分类2'" :value="'分类2'" />
            <el-option :label="'分类3'" :value="'分类3'" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部位" prop="order">
          <el-select v-model="ruleForm.name" placeholder="所属部位">
            <el-option :label="'分类1'" :value="'分类1'" />
            <el-option :label="'分类2'" :value="'分类2'" />
            <el-option :label="'分类3'" :value="'分类3'" />
          </el-select>
        </el-form-item>
        <el-form-item label="器械排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="0" controls-position="right" />
        </el-form-item>

        <div class="form-upload-item-div">
          <div>
            <div>动作封面</div>
            <div>
              <my-upload-vue file-type="img" />
            </div>
          </div>
          <div>
            <div>动作视频</div>
            <div>
              <my-upload-vue file-type="video" />
            </div>
          </div>
        </div>
        <div class="form-addbox-item-div">
          <div class="ctitle">动作封面</div>
          <div v-for="(domain, index) in ruleForm.domains" :key="`${domain.key}`" class="addbox-items">
            <el-form-item
              :label="`${index + 1}、标题`"
              :prop="'domains.' + index + '.title'"
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
              :prop="'domains.' + index + '.content'"
              :rules="{
                required: true,
                message: '请输入内容',
                trigger: 'blur',
              }"
            >
              <el-input v-model="domain.content" type="textarea" autocomplete="off" rows="4" />
            </el-form-item>
            <div class="icon-remove-box">
              <el-icon><remove-filled /></el-icon>
            </div>
          </div>
          <div class="add-btn">
            <el-button @click="addItemsForm">添加描述</el-button>
          </div>
        </div>

        <div class="form-upload-item-div">
          <div>
            <div>训练部位</div>
            <div>
              <my-upload-vue file-type="img" />
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
import { demoApi } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const ruleFormRef = ref<any>()

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
  name: '',
  order: 0,
  domains: [
    {
      key: 0,
      title: '',
      content: '',
    },
  ],
})

const rules = reactive({
  // name: [{ validator: validatePass, trigger: 'blur' }],
  name: [{ required: true, message: '请输入知识分类', trigger: 'blur' }],
})

const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      demoApi({})
        .then(() => {
          console.log('sss')
          ElMessage.success('添加成功')
          router.go(-1)
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const addItemsForm = () => {
  ruleForm.domains.push({
    key: Date.now(),
    title: '',
    content: '',
  })
}
const removeItemsForm = (item: any) => {
  const index = ruleForm.domains.indexOf(item)
  if (index !== -1) {
    ruleForm.domains.splice(index, 1)
  }
}

onMounted(() => {
  console.log('mount')
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
