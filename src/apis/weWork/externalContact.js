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
   * @msg: 好友列表中获取好友基础信息
   */
  getCustomerDetail: {
    url: '/wework/externalContact/getCustomerDetail',
    method: 'get'
  },
  /**
   * @msg: 好友列表中获取好友会员信息
   */
  isFriendActivate: {
    url: '/wework/externalContact/isFriendActivate',
    method: 'get'
  },
  /**
   * @msg: 好友列表中获取好友所属员工列表
   */
  findExternalUserRelationList: {
    url: '/wework/externalContact/findExternalUserRelationList',
    method: 'get'
  },
  /**
   * @msg: 保存批量打标
   */
  saveBatchMarking: {
    url: '/wework/externalContact/saveBatchMarking',
    method: 'post'
  }
}
