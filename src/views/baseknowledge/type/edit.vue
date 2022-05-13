<template>
  <div class="box">
    <div class="title">
      <div class="t">{{ !knowledgeTypeId ? '创建' : '编辑' }}知识分类</div>
      <div>
        <el-button class="plain-btn" @click="$router.push('/baseknowledge/type')">返回</el-button>
      </div>
    </div>
    <el-card class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="知识分类" prop="typename">
          <el-input v-model="ruleForm.typename" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="1" controls-position="right" />
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

import { postKnowledgeTypeCreate, postKnowledgeTypeEdit, getKnowledgeTypeByid } from '@/api/app'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<any>()
const knowledgeTypeId = ref(0)

const loading = ref(false)
const ruleForm = reactive({
  typename: '',
  order: 1,
})

const rules = reactive({
  typename: [{ required: true, message: '请输入知识分类', trigger: 'blur' }],
})

const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      if (knowledgeTypeId.value) {
        postKnowledgeTypeEdit({
          knowledgeTypeId: knowledgeTypeId.value,
          name: ruleForm.typename,
          rank: Number(ruleForm.order),
        })
          .then(() => {
            ElMessage.success('修改成功')
            router.go(-1)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        postKnowledgeTypeCreate({
          name: ruleForm.typename,
          rank: Number(ruleForm.order),
        })
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
  if (route.query.id) {
    knowledgeTypeId.value = Number(route.query.id)
    getKnowledgeTypeByid({ knowledgeTypeId: route.query.id as string }).then((res) => {
      ruleForm.typename = res.data.name
      ruleForm.order = res.data.rank
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
  }
  .el-button {
    min-width: 120px;
  }
  .form-box {
    margin: 50px 0;
    padding: 20px 0;
    .el-form-item {
      margin-bottom: 40px;
    }
  }
}
</style>
