import qychat2 from '@/assets/qychat2.jpg'
import qychat3 from '@/assets/qychat3.jpg'
import { URL } from './const'
export default {
  data () {
    return {
      qychat2,
      qychat3,
      data: [],
      model: {
        appDomain: '',
        filename: '',
        webLink: ''
      }
    }
  },
  methods: {
    copy (msg) {
      let url = msg
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    init () {
      this.getSideList()
      this.getVerifyFileConfig()
    },
    getSideList () {
      const customerDetail = 'customerDetail'
      this.$http.fetch(this.$api.guide.operationConfig.getWeWorkSidebarConfig).then((res) => {
        if (res.result && res.msg) {
          this.data = res.result
        }
      })
    },
    getVerifyFileConfig () {
      this.$http.fetch(this.$api.guide.operationConfig.getVerifyFileConfig).then((res) => {
        if (res.result) {
          this.model = res.result
        }
      })
    },
    handleLocation (url) {
      let openUrl = URL[url]
      if (url === 'WEB_DESCRIBE_URL' || url === 'FILE_DESCRIBE_URL' || url === 'SIDE_DESCRIBE_URL' || url === 'DIY_DESCRIBE_URL') {
        openUrl = this.$isQa ? this.$qaDocs : URL[url]
      }
      window.open(openUrl)
    },
    // 上传之前钩子
    beforeUpload (file) {
      // this.fileList = [file]
      // 图片格式判断
      if (!/\.(txt|TXT)$/.test(file.name)) {
        this.$notify.error('仅支持上传txt文件')
        return false
      }
      return true
    },
    handleUploadSuccess (res) {
      if (res.success) {
        this.model.filename = res.result.filename
      } else {
        this.$notify.error(res.msg)
      }
    }
  },
  mounted () {
    this.init()
  }
}
