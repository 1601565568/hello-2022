<template>
  <el-dialog title="海报" width="492px" :visible.sync="visible">
    <div class="poster-content">
      <div class="poster-content-item">
        <span>
        链接
        <!-- <el-tooltip class="item" content="我是疑问" placement="top">
          <Icon type="question-circle"></Icon>
        </el-tooltip> -->
        </span>
        <el-input class="link-input" autofocus=true placeholder="" v-model="linkUrl"></el-input>
        <ns-button type='text' size="medium"  class="copy-button" data-clipboard-text="你好" @click="copyLink(linkUrl)">复制</ns-button>
      </div>
      <div class="poster-content-item">
        <span class="poster-title">海报图</span>
        <img src="https://wework.qpic.cn/wwpic/953817_-QCMxs-HSaGIDz__1612251504/0" alt="">
        <ns-button class="download-button"  size="medium"><Icon type="xiazai"/>下载</ns-button>
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
  methods: {
    getQrCode (dataRow) {
      // window.console.log('海报数据', dataRow)
      this.visible = true
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
      width: 42px;
      margin-left: 6px;
      margin-right: 18px;
      font-size: 14px;
      color: #595959;
    }

    span.poster-title {
      padding-top: 5px;
      align-self: flex-start;
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
