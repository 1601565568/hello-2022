export default {
// 客户朋友圈
  getList: {
    url: '/guide/momentList/getList',
    method: 'post'
  },
  getInteractive: {
    url: '/guide/momentList/getInteractive',
    method: 'get'
  },
  getVisibleUser: {
    url: '/guide/momentList/getVisibleUser',
    method: 'get'
  },
  getMomentTask: {
    url: '/guide/momentList/getMomentTask',
    method: 'post'
  },
  exportMomentTask: {
    url: '/guide/momentList/exportMomentTask',
    method: 'post',
    responseType: 'blob',
    callback: false
  }
}
