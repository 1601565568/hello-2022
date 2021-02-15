/*
 * @Descripttion: 企微方案 - 员工相关接口
 * @Author: yuye.huang
 * @Date: 2020-05-18 16:09:44
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-05-18 16:19:02
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
