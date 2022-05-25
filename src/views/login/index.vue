<template>
  <div class="box">
    <div class="bg">
      <div>
        <img src="/images/logo-w.png" alt="" />
        <div>让健身成为一种生活方式</div>
      </div>
    </div>
    <div class="form">
      <div>
        <div class="title">账号密码登录</div>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" size="large">
          <el-form-item prop="account">
            <el-input v-model="ruleForm.account" type="text" autocomplete="off" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" placeholder="密码" :prefix-icon="Lock" />
          </el-form-item>

          <el-form-item>
            <el-checkbox-group v-model="ruleForm.isSave">
              <el-checkbox label="记住我" name="isSave" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :style="'width: 100%'" :loading="ruleForm.loading" @click="submitForm">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store'
import { useRouter } from 'vue-router'
import { postAdminLogin } from '@/api/app/index'
const router = useRouter()
const adminStore = useAdminStore()
const ruleFormRef = ref()

const ruleForm = reactive({
  account: '',
  pwd: '',
  isSave: [],
  loading: false,
})

const rules = reactive({
  account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const submitForm = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      ruleForm.loading = true
      postAdminLogin({
        account: ruleForm.account,
        pwd: ruleForm.pwd,
      })
        .then((res) => {
          const _size = parseInt(String(Math.random() * 500), 10)
          adminStore.setUserInfo({ ...res.data, avatar: `https://source.unsplash.com/${_size}x${_size}` })
          if (ruleForm.isSave.length > 0) {
            localStorage.setItem('user-a', ruleForm.account)
            localStorage.setItem('user-p', ruleForm.pwd)
          } else {
            localStorage.removeItem('user-a')
            localStorage.removeItem('user-p')
          }
          router.push('/')
        })
        .finally(() => {
          ruleForm.loading = false
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
onMounted(() => {
  ruleForm.account = String(localStorage.getItem('user-a') || '')
  ruleForm.pwd = String(localStorage.getItem('user-p') || '')
  if (ruleForm.account) {
    ruleForm.isSave = ['记住我'] as any
  }
})
</script>

<style lang="scss" scoped>
.box {
  min-width: 1200px;
  height: 100vh;
  display: flex;
  align-items: center;
  & > div {
    width: 50%;
    height: 100%;
  }
  .bg {
    background-image: url('/images/login-bg.png');
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    font-size: 38px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    img {
      height: 123px;
      margin-bottom: 70px;
    }
  }
  .form {
    display: flex;
    align-items: center;
    justify-content: center;
    & > div {
      width: 500px;
      .title {
        font-size: 24px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 60px;
      }
    }
  }
}
</style>
