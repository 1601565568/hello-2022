<template>
  <el-dialog :title="title" :visible="dialogVisible" width='500px' @close='handleClose' append-to-body>
    <template v-if='type==="poster"'>
      <el-form class='normal-from' label-width="60px" label-position='left'>
        <el-form-item class='larger-item'>
          <template slot='label'>
            <span>链接</span>
            <el-tooltip content="因企业微信生成联系我二维码数量限制，请合理设置过期时间"  placement="top">
              <Icon type="question-circle" class='question-circle' />
            </el-tooltip>
          </template>
          <div class='flex-box'>
            <el-input :value='link || url' readonly/>
            <ns-button type='text' class='copy' v-copy='link || url'>复制</ns-button>
          </div>
        </el-form-item>
        <el-form-item label='海报图'>
          <div class='flex-box bottom'>
            <el-image
              class='preview-img'
              :src="url"
              :preview-src-list="[url]">
            </el-image>
            <ns-button class='copy' icon='el-icon-download' @click="handleDownload(url)">
              下载
            </ns-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template v-else-if='type==="qrcode"'>
      <el-form class='normal-from' label-width="60px" label-position='left'>
        <el-form-item label='  '>
          <div class='flex-box bottom qrcode'>
            <qr-code :value="url" :size="220" :options="{size:220}"></qr-code>
            <ns-button class='copy' icon='el-icon-download' @click="handleDownloadQrcode(url)">
              下载
            </ns-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <preview ref="preview"></preview>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="handleClose" type="primary">确定</ns-button>
    </div>
  </el-dialog>
</template>
<script>
import ElImage from '@nascent/nui/lib/image'
import Preview from '@/components/NsPreview'
import QrCode from '@xkeshi/vue-qrcode'
import api from '@/config/http'
export default {
  data () {
    return {
      downUrl: api.API_ROOT + '/chatRoomGroup/downLoad',
      qrcodeUrl: api.API_ROOT + '/upload'
    }
  },
  components: { Preview, ElImage, QrCode },
  props: {
    url: {}, // 海报链接
    link: {}, // 复制链接
    dialogVisible: {},
    type: {
      default: 'poster'
    },
    title: {
      default: '海报'
    },
    activityName: {}
  },
  methods: {
    // 下载
    handleDownload (url) {
      let requestUrl = this.downUrl
      var form = document.createElement('form')
      form.setAttribute('action', requestUrl)
      form.setAttribute('method', 'get')
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', 'url')
      input.setAttribute('value', url)
      var input2 = document.createElement('input')
      input2.setAttribute('type', 'hidden')
      input2.setAttribute('name', 'fileName')
      input2.setAttribute('value', this.activityName ? this.activityName + '海报' : '海报')
      form.appendChild(input)
      form.appendChild(input2)
      document.body.appendChild(form)
      form.submit()
    },
    handleDownloadQrcode (url) {
      location.href = this.qrcodeUrl + `/uploadUrl?fileName=${this.activityName || ''}二维码&url=${encodeURIComponent(url)}&width=430&height=430`
    },
    handleClose () {
      this.$emit('onClose')
    },
    handlePreview (url) {
      this.$refs.preview.toggleShow(0, [url])
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .box-padding {
    color:#0091FA;
    padding: 0 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .flex-box {
    display: flex;
    align-items: center;
    &.qrcode {
      padding-top: 48px
    }
    .copy {
      margin-left: 17px;
      font-size: 14px;
    }
    &.bottom {
      align-items: flex-end;
      justify-content: flex-start;
    }
    .preview-img {
      width: 122px;
      height: 216px;
      position: relative;
      &.qrcode {
        width: 221px;
        height: 221px;
      }
      img {
        height: 100%;
        width: 100%;
      }
      .hover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.45);
        display: none;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #FFFFFF;
      }
      &:hover .hover{
        display: flex
      }

    }
  }
</style>
