<template>
  <div class="upload">
    <el-upload
      v-loading="uploadLoading"
      class="upload-box"
      action="#"
      :before-upload="onBeforeUploadImage"
      :http-request="uploadFile"
      :show-file-list="false"
      :accept="'image/*'"
    >
      <template v-if="fileUrl == ''">
        <el-icon class="upload-icon"><upload-filled /></el-icon>
        <div class="upload-text">{{ '添加运营图' }}</div>
      </template>
      <template v-else>
        <div class="preview">
          <img :src="fileUrl" alt="" srcset="" />
          <div class="change-box">
            <div>
              <el-icon class="refresh-icon"><refresh /></el-icon>
            </div>
          </div>
        </div>
      </template>
    </el-upload>
    <div v-if="aabortCheckpoint && !uploadLoading" class="error">
      <div class="btn-box">
        <div>上传出了点问题</div>
        <div>
          <div @click="nextUpload">
            <el-icon class="refresh-icon"><upload /></el-icon>
            <div>继续上传</div>
          </div>
          <div @click="closeUpload">
            <el-icon class="refresh-icon"><icon-close /></el-icon>
            <div>取消上传</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="video-duration">
    <el-input v-model="shopUrl" placeholder="请输入链接" @input="changeShopUrl"></el-input>
  </div>
</template>

<script setup lang="ts">
import OSS from 'ali-oss'
import { UploadFilled, Refresh, Upload, Close as IconClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { getOssCredentials } from '@/api/app/index'

const props = defineProps<{
  initFile?: string
  initShopUrl?: any
}>()
const emits = defineEmits(['change-file', 'change-shopurl'])

const uploadLoading = ref(false)
const fileUrl = ref(props.initFile || '')
const onBeforeUploadImage = () => {
  return true
}

const uploadFile = ({ file }: any) => {
  uploadLoading.value = true
  afile.value = file
  ObjName.value = `${String(new Date().getTime()) + parseInt(String(Math.random() * 100), 10)}.${file.name.split('.')[file.name.split('.').length - 1]}`

  client.value
    .multipartUpload(ObjName.value, file, {
      progress: (p: any, cpt: any) => {
        // console.log(p, cpt, res)
        // 为中断点赋值。
        aabortCheckpoint.value = cpt
        // console.log(cpt, 'abortCheckpoint')
      },
    })
    .then((res: any) => {
      // 去除 oss 分片上传后返回所带的查询参数，否则访问会 403
      const ossPath = res.res.requestUrls[0].split('?')[0]

      fileUrl.value = ossPath
      emits('change-file', ossPath)
      aabortCheckpoint.value = null
      uploadLoading.value = false
      // 替换协议，统一使用 'https://'，否则 Android 无法显示图片
      // url = ossPath.replace('http://', 'https://')
    })
    .catch(() => {
      uploadLoading.value = false
      ElMessage.error('文件上传失败')
    })
  return ''
}

const afile = ref()
const ObjName = ref('')
const aabortCheckpoint = ref()
const client = ref()
const nextUpload = async () => {
  // 设置重试次数为五次。
  uploadLoading.value = true
  try {
    client.value
      .multipartUpload(ObjName.value, afile.value, {
        checkpoint: aabortCheckpoint.value,
        progress: (p: any, cpt: any) => {
          // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
          aabortCheckpoint.value = cpt
          // 获取上传进度。
          // console.log(p)
        },
      })
      .then((res: any) => {
        // 去除 oss 分片上传后返回所带的查询参数，否则访问会 403
        const ossPath = res.res.requestUrls[0].split('?')[0]

        fileUrl.value = ossPath
        emits('change-file', ossPath)
        aabortCheckpoint.value = null
        uploadLoading.value = false
        // 替换协议，统一使用 'https://'，否则 Android 无法显示图片
        // url = ossPath.replace('http://', 'https://')
      })
      .catch(() => {
        uploadLoading.value = false
        ElMessage.error('文件上传失败')
      })
  } catch (e) {
    console.log(e)
  }
}
const closeUpload = async () => {
  aabortCheckpoint.value = null
  uploadLoading.value = false
  afile.value = null
}

onMounted(() => {
  getOssCredentials().then((res) => {
    client.value = new OSS({
      region: res.data.region,
      accessKeyId: res.data.accessKeyId,
      accessKeySecret: res.data.accessKeySecret,
      bucket: res.data.bucket,
      stsToken: res.data.stsToken,
    })
    // stsToken  expiration
  })
})

const shopUrl = ref(props.initShopUrl || '')
const changeShopUrl = (val: string) => {
  emits('change-shopurl', val)
}
</script>

<style lang="scss" scoped>
.upload {
  position: relative;
  .error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cecece;
    .btn-box {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 5px 0;
      & > div {
        font-size: 14px;
        text-align: center;
        display: flex;
        justify-content: center;
        width: 100%;
      }
      & > div:nth-of-type(2) {
        margin-top: 5px;
        & > div {
          width: 50%;
        }
        .el-icon {
          font-size: 17px;
          cursor: pointer;
        }
      }
    }
  }
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.upload-box {
  width: 590px;
  height: 76px;
  background-color: #fdfdfd;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  .upload-icon {
    font-size: 30px;
    color: #aaaaaa;
  }
  .upload-text {
    font-size: 12px;
    font-weight: 400;
    color: rgba($color: #000000, $alpha: 0.52);
    line-height: 25px;
  }
  .preview {
    position: relative;
    width: 100%;
    height: 100%;
    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .change-box {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba($color: #000000, $alpha: 0.2);
      align-items: center;
      justify-content: center;
      .refresh-icon {
        color: #fff;
        font-size: 40px;
      }
    }
    &:hover {
      .change-box {
        display: flex;
      }
    }
  }
}
.video-duration {
  width: 590px;
  margin-top: 10px;
}
</style>
