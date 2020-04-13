import { API_ROOT } from '@/config/http.js'
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
      var url = API_ROOT + '/callRecords/down'
      var fileName = 'testAjaxDownload.3gpp'
      var form = document.createElement('form')
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', 'url')
      input.setAttribute('value', data.content)
      var filename = document.createElement('input')
      filename.setAttribute('type', 'hidden')
      filename.setAttribute('name', 'filename')
      let endFileName = '.3gpp'
      filename.setAttribute('value', data.phone + '-' + data.startTime + endFileName)
      form.appendChild(input)
      form.appendChild(filename)
      document.body.appendChild(form)
      form.submit()
    }
  }
}
