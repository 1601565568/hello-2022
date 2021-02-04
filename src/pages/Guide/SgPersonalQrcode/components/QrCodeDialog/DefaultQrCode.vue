<template>
  <el-form>
    <div class="qrcode-content">
      <img :src="qrcodeUrl" alt="">
      <div class="qrcode-operate">
        <el-upload
          action="test"
          :show-file-list="false"
          :on-success="changeQrcodeAvatarSuccess"
          :before-upload="changeQrcodeAvatarBefore"
          size="medium"
        >
          <ns-button size="medium" class="qrcode-button">更换头像</ns-button>
        </el-upload>
        <ns-button size="medium" class="qrcode-button" @click="downloadQrCode"><Icon type="xiazai"/>下载</ns-button>
      </div>
      <p class='prompt-text'>
        <span class='yellow-point'></span>
        请上传jpg或png图片，大小不超过100kb
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
  props: [ 'visible', 'baseUrl', 'qrcodeUrl' ],
  data () {
    return {}
  },
  computed: {
    downloadUrl () {
      return `${this.baseUrl}/uploadImg?fileName=聚合二维码&imgUrl=${this.qrcodeUrl}&width=430&height=430`
    }
  },
  methods: {
    changeQrcodeAvatarSuccess () {
      console.log('上传成功')
    },
    changeQrcodeAvatarBefore () {
      console.log('上传前')
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
