export default {
  // 查询
  findWordList: {
    url: '/guide/sensitiveWord/findWordList',
    method: 'post'
  },
  // 明细
  detail: {
    url: '/guide/sgSensitiveWord/detail',
    method: 'post'
  },
  // 保存
  save: {
    url: '/guide/sgShopGroup/save',
    method: 'post'
  },
  // 踢出员工
  removeMember: {
    url: '/guide/sgShopGroup/removeMember',
    method: 'post'
  },
  // 解散
  dissolution: {
    url: '/guide/sgShopGroup/dissolution',
    method: 'post'
  },
  // 查询成员列表
  findMemberList: {
    url: '/guide/sgShopGroup/findMemberList',
    method: 'post'
  },
  // 发送AI通知
  sendMsg: {
    url: '/guide/sgShopGroup/sendMsg',
    method: 'post'
  }
}
