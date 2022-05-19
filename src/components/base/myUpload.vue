<template>
  <div class="upload">
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
    <div v-if="false" class="error">
      <div class="btn-box">
        <div>上传出了点问题</div>
        <div>
          <div>
            <el-icon class="refresh-icon"><upload /></el-icon>
            <div>继续上传</div>
          </div>
          <div>
            <el-icon class="refresh-icon"><close /></el-icon>
            <div>取消上传</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="props.fileType == 'video'" class="video-duration">
    <el-input v-model="duration" placeholder="请输入视频时长（秒数）" @input="changeDuration">
      <template #append>S</template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import OSS from 'ali-oss'
import { UploadFilled, Refresh, Upload, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { getOssCredentials } from '@/api/app/index'

const props = defineProps<{
  fileType: 'img' | 'video'
  initFile?: string
  initDuration?: any
}>()
const emits = defineEmits(['change-file', 'change-duration'])

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

  const ObjName = 'test.png'

  // const url = client.value.signatureUrl(ObjName)
  // console.log(url)

  // client.value
  //   .multipartUpload(ObjName, file, {
  //     // progress: (p, cpt, res) => {
  //     //   console.log(p, cpt, res)
  //     //   // 为中断点赋值。
  //     //   aabortCheckpoint.value = cpt
  //     //   console.log(cpt, 'abortCheckpoint')
  //     //   // 获取上传进度。
  //     // },
  //   })
  //   .then((r) => console.log(r, 'error'))

  // client.value
  //   .put(ObjName, file)
  //   .then((e) => {
  //     console.log(e, '----')
  //     fileUrl.value = e.url as string
  //     uploadLoading.value = false
  //     // client.putACL(ObjName, 'public-read')
  //   })
  //   .catch((x) => {
  //     console.log(x, '=-=-=-=')
  //   })

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

const afile = ref()
const aabortCheckpoint = ref()
const client = ref()
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

const duration = ref(props.initDuration || '')
const changeDuration = (val: string) => {
  emits('change-duration', val)
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
      & > div {
        font-size: 14px;
        text-align: center;
        display: flex;
        justify-content: center;
        width: 100%;
      }
      & > div:nth-of-type(2) {
        margin-top: 25px;
        & > div {
          width: 50%;
        }
        .el-icon {
          font-size: 25px;
          cursor: pointer;
        }
      }
    }
  }
}
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
.video-duration {
  width: 180px;
  margin-top: 10px;
}
</style>
