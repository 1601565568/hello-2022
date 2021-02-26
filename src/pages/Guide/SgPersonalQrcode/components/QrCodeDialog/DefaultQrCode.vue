<template>
  <el-form>
    <div class="qrcode-content">
      <img :src="successUrl || qrcodeUrl" alt="">
      <div class="qrcode-operate">
        <el-upload
          :action="uploadUrl"
          :data="{ guid: guid }"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png"
          :on-success="changeQrcodeAvatarSuccess"
          :on-error="changeQrcodeAvatarError"
          :before-upload="changeQrcodeAvatarBefore"
          size="medium"
          :disabled="changeAvatarLoading"
        >
          <ns-button size="medium" class="qrcode-button" :loading="changeAvatarLoading">更换头像</ns-button>
        </el-upload>
        <ns-button size="medium" class="qrcode-button" @click="downloadQrCode"><Icon type="xiazai"/>下载</ns-button>
      </div>
      <p class='prompt-text'>
        <span class='yellow-point'></span>
        请上传jpg、jpeg或png图片，大小不超过100kb
      </p>
    </div>
  </el-form>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'

/**
 * 默认聚合二维码
 */
export default {
  name: 'DefaultQrCode',
  components: {
    ElUpload
  },
  props: [ 'visible', 'baseUrl', 'qrcodeUrl', 'guid', 'uploadUrl' ],
  watch: {
    visible (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.successUrl = ''
      }
    }
  },
  data () {
    return {
      changeAvatarLoading: false,
      successUrl: '',
      maxWidth: 750,
      maxHeight: 1334
    }
  },
  computed: {
    downloadUrl () {
      return `${this.baseUrl}/uploadImg?fileName=聚合二维码&imgUrl=${this.successUrl || this.qrcodeUrl}&width=430&height=430`
    }
  },
  methods: {
    changeQrcodeAvatarSuccess (uploadRes, file) {
      const { success, msg, result } = uploadRes

      if (success) {
        this.successUrl = result
        this.$message.success(msg || '上传成功')

        this.$emit('uploadSuccess')
      } else {
        this.$message.error('上传失败')
      }

      this.changeAvatarLoading = false
    },
    changeQrcodeAvatarError (errRes) {
      this.$message.error('上传失败')
      this.changeAvatarLoading = false
    },
    changeQrcodeAvatarBefore (file) {
      this.changeAvatarLoading = true

      const isPngOrJpg = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
      const isLt100K = file.size / 1024 < 100
      if (!isPngOrJpg || !isLt100K) {
        this.$message.error('请上传jpg、jpeg或png图片，大小不超过100kb')
        this.changeAvatarLoading = false
        return false
      }

      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = () => {
          const { width, height } = img
          let valid = true
          if ((width / height) !== 1) {
            valid = false
          }
          if (valid) {
            return resolve(file)
          } else {
            this.$message.error('上传图片尺寸比例只能是1:1')
            this.changeAvatarLoading = false
            return reject(msg)
          }
        }
      })
    },
    downloadQrCode () {
      const imageDom = document.createElement('a')
      imageDom.href = this.downloadUrl
      imageDom.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    margin-top: 28px;
    width: 222px;
    height: 222px;
  }

  .qrcode-operate {
    margin-top: 16px;
    display: flex;
    .qrcode-button {
      width: 103px;
    }
    .qrcode-button:last-child {
        margin-left: 16px;
    }
  }

  .prompt-text {
    display: flex;
    align-items: center;
    margin-top: 2px;
    .yellow-point {
      background: #F2AA18;
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}
</style>
