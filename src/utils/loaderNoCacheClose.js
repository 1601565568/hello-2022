/**
 * 将启动页面隐藏
 */

export default function () {
  /* 隐藏加载中 */
  let loaderNoCacheEl = document.getElementById('loader-noCache')
  if (loaderNoCacheEl) {
    loaderNoCacheEl.style.display = 'none'
  }
}
