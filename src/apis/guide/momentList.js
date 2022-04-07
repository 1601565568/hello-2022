export default {
// 客户朋友圈
  // 获取朋友圈列表接口
  getList: {
    url: '/guide/merged/momentList/getList',
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
  },
  // 获取个人朋友圈详情
  getPersonalMomentInfo: {
    url: '/guide/merged/momentList/getPersonalMomentInfo',
    method: 'get'
  },
  // 获取企业朋友圈企业发表的列表
  getMomentTaskMerged: {
    url: '/guide/merged/momentList/getMomentTask',
    method: 'post'
  },
  // 可见用户数据
  getVisibleUserMerged: {
    url: '/guide/merged/momentList/getVisibleUser',
    method: 'post'
  }
}
