import Message from '@nascent/nui/lib/message.js'
export default (msg) => {
  let url = msg
  let oInput = document.createElement('input')
  oInput.value = url
  document.body.appendChild(oInput)
  oInput.select() // 选择对象;
  document.execCommand('Copy') // 执行浏览器复制命令
  Message({
    message: '复制成功',
    type: 'success'
  })
  oInput.remove()
}
