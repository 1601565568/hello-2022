import MessageBox from 'nui-v2/lib/message-box.js'

/**
 * msg 所要操作的数据与类型提示语
 * `此操作将 ${msg}, 是否继续?`
 */

export default function (msg) {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(`此操作将${msg}， 是否继续?`, '您好', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'confirm-message',
      type: 'warning'
    }).then(resolve).catch(reject)
  })
}
