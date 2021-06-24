/*
 * @Descripttion: 企微方案 - 外部联系人相关接口
 * @Author: Miracle
 * @Date: 2020-05-18 16:09:44
 */
export default {
  /**
   * @msg: 查询企微外部联系人
   */
  queryExternalContactTable: {
    url: '/wework/externalContact/queryExternalContactTable',
    method: 'post'
  },
  /**
   * @msg: 同步企微好友信息
   */
  synWeWorkFriends: {
    url: '/wework/externalContact/synWeWorkFriends',
    method: 'post'
  },
  /**
   * @msg: 查询企业标签列表
   */
  queryCorpTagList: {
    url: '/wework/externalContact/queryCorpTagList',
    method: 'post'
  },
  /**
   * @msg: 保存批量打标
   */
  saveBatchMarking: {
    url: '/wework/externalContact/saveBatchMarking',
    method: 'post'
  }
}
