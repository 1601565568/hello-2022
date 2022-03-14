/*
 * @Descripttion: 企微方案 - 群欢迎语相关接口
 * @Author: jiajun.qi
 */
export default {
  // 群欢迎语列表
  getList: {
    url: '/wework/groupWelcome/findList',
    method: 'POST'
  },
  // 新建编辑群欢迎语
  saveOrUpdate: {
    url: '/wework/groupWelcome/saveOrUpdate',
    method: 'POST'
  },
  // 获取群欢迎语详情
  getByUUID: {
    url: '/wework/groupWelcome/getByUUID',
    method: 'get'
  },
  // 删除群欢迎语
  deleteByUUID: {
    url: '/wework/groupWelcome/deleteByUUID',
    method: 'POST'
  }
}
