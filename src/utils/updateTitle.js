/**
 * 修改页面标题
 */

export default function (text) {
  /* 隐藏加载中 */
  let title = document.getElementsByTagName('title')[0]
  if (title) {
    title.innerHTML = text
  }
}
