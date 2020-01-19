import storage from 'store/dist/store.legacy.min.js'

/**  storageControl 获取并判断 VUE_APP_VERSION 是否为最新版本，如果已过期，则清除全部缓存数据，并更新 VUE_APP_VERSION 版本 */
function storageControl () {
  const storageObj = JSON.parse(window.VUE_APP_VERSION)
  const storageVersion = storage.get('DS_APP_INFO')
  if (storageVersion && storageVersion.buildTime !== storageObj.buildTime) {
    storage.clearAll()
    storage.set('DS_APP_INFO', storageObj)
  } else if (!storageVersion) {
    storage.set('DS_APP_INFO', storageObj)
  }
}
if (window && window.VUE_APP_VERSION) {
  // console.log('window.VUE_APP_VERSION', window.VUE_APP_VERSION)
  // storageControl()
}
