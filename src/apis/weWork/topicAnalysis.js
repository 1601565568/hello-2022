/*
 * @Date: 2022-03-30 14:04:17
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-12 19:15:52
 * @FilePath: \ECRP-SG-WEB\src\apis\weWork\topicAnalysis.js
 */
export default {
  // 获取话题列表
  getKeyWordTopicList: {
    url: 'weWorkchatTopic/getKeyWordTopicList',
    method: 'post'
  },
  // 新增话题
  addKeyWordTopic: {
    url: 'weWorkchatTopic/addKeyWordTopic',
    method: 'post'
  },
  // 新增话题关键词
  addKeyWord: {
    url: 'weWorkchatTopic/addKeyWord',
    method: 'post'
  },
  // 删除话题
  deleteKeyWordTopic: {
    url: 'weWorkchatTopic/deleteKeyWordTopic',
    method: 'get'
  },
  // 删除关键字
  deleteKeyWord: {
    url: 'weWorkchatTopic/deleteKeyWord',
    method: 'get'
  },
  // 获取关键词内容
  contentList: {
    url: 'weWorkchatTopic/contentList',
    method: 'post'
  },
  // 获取关键词列表
  keyWordlist: {
    url: 'weWorkchatTopic/keyWordlist',
    method: 'post'
  }
}
