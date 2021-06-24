import qychat2 from '@/assets/qychat2.jpg'
import qychat3 from '@/assets/qychat3.jpg'
export default {
  data () {
    return {
      qychat2,
      qychat3,
      data: [],
      file: ''
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
      const customerDetail = 'customerDetail'
      this.$http.fetch(this.$api.guide.operationConfig.getWeWorkSidebarConfig).then((res) => {
        if (res.result && res.msg) {
          this.data = res.result.filter(item => item.key !== customerDetail)
          console.log(this.data)
        }
      })
    },
    // 删除文件
    handleDeleteFile () {

    }
  },
  mounted () {
    this.init()
  }
}
