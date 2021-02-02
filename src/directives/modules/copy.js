import Message from '@nascent/nui/lib/message.js'
export default {
  bind (el, { value }) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        return
      }
      const oInput = document.createElement('input')
      oInput.value = el.$value
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      Message({
        message: '复制成功',
        type: 'success'
      })
      document.body.removeChild(oInput)
    }
    el.addEventListener('click', el.handler)
  },
  // 当传进来的值更新的时候触发
  componentUpdated (el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind (el) {
    el.removeEventListener('click', el.handler)
  }
}
