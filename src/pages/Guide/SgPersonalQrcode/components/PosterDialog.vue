<template>
  <el-dialog title="海报" width="492px" :visible.sync="visible">
    <div class="poster-content">
      <div class="poster-content-item">
        <span>
        链接
        <el-tooltip class="item" content="因企业微信生成联系我二维码数量限制，请合理设置过期时间" placement="top">
          <Icon type="question-circle"></Icon>
        </el-tooltip>
        </span>
        <span class="noposter-tip" v-if="!linkUrl">请至编辑页上传海报</span>
        <div v-else>
          <el-input class="link-input" autofocus=true placeholder="" :value="linkUrl" readonly></el-input>
          <ns-button type='text' size="medium"  class="copy-button" data-clipboard-text="你好" @click="copyLink(linkUrl)">复制</ns-button>
        </div>
      </div>
      <div class="poster-content-item">
        <span class="poster-title">海报图</span>
        <span class="noposter-tip" v-show="!linkUrl">请至编辑页上传海报</span>
        <img v-show="linkUrl" :src="linkUrl" alt="">
        <ns-button v-show="linkUrl" class="download-button"  size="medium" @click="downloadPoster"><Icon type="xiazai"/>下载</ns-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button size="mideum" type="primary" @click="visible = false">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/config/http'
import clipboard from 'clipboard'

/**
 * 海报
 */
export default {
  name: 'PosterDialog',
  data () {
    return {
      visible: false,
      linkUrl: ''
    }
  },
  computed: {
    downloadUrl () {
      return `${api.API_ROOT}/upload/uploadImg?fileName=海报&imgUrl=${this.linkUrl}&width=750&height=1344`
    }
  },
  watch: {
    visible (val) {
      if (val === false && this.linkUrl) {
        this.linkUrl = ''
      }
    }
  },
  methods: {
    getPosterUrl (dataRow) {
      this.visible = true
      this.linkUrl = dataRow.posterBackgroundQrcodeUrl
    },
    copyLink (msg) {
      let oInput = document.createElement('input')
      oInput.value = msg
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      // console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    downloadPoster () {
      const imageDom = document.createElement('a')
      imageDom.href = this.downloadUrl
      imageDom.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.poster-content {
  .poster-content-item {
    display: flex;
    align-items: center;
    margin-top: 24px;
    span {
      display: inline-block;
      width: 47px;
      margin-left: 6px;
      margin-right: 18px;
      font-size: 14px;
      color: #595959;
    }

    span.poster-title {
      padding-top: 5px;
      align-self: flex-start;
    }

    span.noposter-tip {
      width: 200px;
      color: #8C8C8C;
    }

    .link-input {
      width: 348px;
      margin-right: 16px;
    }

    img {
      width: 122px;
      height: 216px;
    }

    .download-button {
      width: 80px;
      margin-left: 24px;
      height: 32px;
      align-self: flex-end;
    }
  }
}

</style>
