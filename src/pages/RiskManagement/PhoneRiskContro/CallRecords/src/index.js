import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  data: function () {
    return {
      content: '',
      dialogFormVisible: false,
      title: '播放'
    }
  },
  methods: {
    onPlay (row) {
      // row.content = 'http://ihd.file.alimmdn.com/chat-client/messageAudio/wechat.wav'
      if (!row.content) {
        this.$notify.error('没有通话记录')
      }
      this.dialogFormVisible = true
      this.content = row.content
    },
    cleanGuide (e) {
      // 没用
      this.dialogFormVisible = false
    },
    onDownLoad (data) {
      // data.content = 'http://ihd.file.alimmdn.com/chat-client/messageAudio/wechat.wav'

      let _this = this
      _this.$http.fetch(_this.$api.riskManagement.callRecords.down, {
        url: data.content
      }).then(resp => {
        if (resp.success) {
          window.open(data.content)
        }
      }).catch(resp => {
        this.$notify.error('下载失败')
      })
    }
  }
}
