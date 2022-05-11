<template>
  <el-upload v-loading="uploadLoading" class="upload-box" action="#" :before-upload="onBeforeUploadImage" :http-request="uploadFile" :show-file-list="false">
    <template v-if="fileUrl == ''">
      <el-icon class="upload-icon"><upload-filled /></el-icon>
      <div class="upload-text">{{ props.fileType == 'video' ? '添加视频' : '添加图片' }}</div>
    </template>
    <template v-else>
      <div class="preview">
        <video v-if="props.fileType == 'video'" :src="fileUrl" alt="" srcset="" />
        <img v-else :src="fileUrl" alt="" srcset="" />
        <div class="change-box">
          <div>
            <el-icon class="refresh-icon"><refresh /></el-icon>
          </div>
        </div>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { UploadFilled, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { demoApi } from '@/api/app/index'

const props = defineProps<{
  fileType: 'img' | 'video'
  initFile?: string
}>()
const emits = defineEmits(['change-file'])

const uploadLoading = ref(false)
const fileUrl = ref(props.initFile || '')
// 'https://element-plus.org/images/renren.png'
// 'https://storage.360buyimg.com/nutui/video/video_NutUI.mp4'
const onBeforeUploadImage = () => {
  // file: any
  // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
  // const isLt3M = file.size / 1024 / 1024 < 3
  // if (!isIMAGE) {
  //   ElMessage.error('上传文件只能是图片格式!')
  // }
  // if (!isLt3M) {
  //   ElMessage.error('上传文件大小不能超过 3MB!')
  // }
  // return isIMAGE && isLt3M
  return true
}

const uploadFile = ({ file, onError }: any) => {
  uploadLoading.value = true
  setTimeout(() => {
    uploadLoading.value = false
    if (props.fileType == 'video') {
      fileUrl.value = 'https://storage.360buyimg.com/nutui/video/video_NutUI.mp4'
      emits('change-file', 'https://storage.360buyimg.com/nutui/video/video_NutUI.mp4')
    } else {
      fileUrl.value = 'https://element-plus.org/images/renren.png'
      emits('change-file', 'https://element-plus.org/images/renren.png')
    }
    return ''
  }, 500)

  // s3UploadFile({ file })
  //   .then((res: any) => {
  //     uploadLoading.value = false
  //     if (res.errorCode == 21005) {
  //       ElMessage.error('文件上传失败')
  //       return false
  //     } else if (res.errorCode == 21006) {
  //       ElMessage.error('配置错误')
  //       return false
  //     } else {
  //       fileUrl.value = res.data.url as string
  //       emits('change-file', res.data.url)
  //       return res.data.url
  //     }
  //   })
  //   .catch(() => {
  //     onError()
  //     uploadLoading.value = false
  //   })
  return ''
}
</script>

<style lang="scss" scoped>
.upload-box {
  height: 180px;
  width: 180px;
  background-color: #fdfdfd;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  .upload-icon {
    font-size: 72px;
    color: #aaaaaa;
  }
  .upload-text {
    font-size: 16px;
    font-weight: 400;
    color: rgba($color: #000000, $alpha: 0.52);
    line-height: 25px;
  }
  .preview {
    position: relative;
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
</style>
