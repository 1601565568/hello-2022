export default {
  getEmployee: {
    url: '/wework/marketing/getEmployee',
    method: 'get'
  },
  getActivityStatus: {
    url: '/wework/marketing/getActivityStatus',
    method: 'get'
  },
  getWxStatus: {
    url: '/wework/marketing/getWxStatus',
    method: 'get'
  },
  // 好友营销列表
  queryTable: {
    url: '/wework/groupMessage/friend',
    method: 'post'
  },
  // 好友营销保存新建群发消息
  saveEnterprise: {
    url: '/wework/groupMessage/create',
    method: 'post'
  },
  // 好友营销保存编辑群发消息
  updateEnterprise: {
    url: '/wework/groupMessage/update',
    method: 'post'
  },
  // 好友营销列表删除
  deleteWxActivity: {
    url: '/wework/groupMessage/delete',
    method: 'post'
  },
  // 好友营销详情
  getMsgDetail: {
    url: '/wework/groupMessage',
    method: 'post'
  },
  getSubdivisionList: {
    url: '/wework/marketing/getSubdivisionList',
    method: 'get'
  },
  queryEmployeeTreeAndOption4Component: {
    url: '/wework/marketing/queryEmployeeTreeAndOption4Component',
    method: 'get'
  },
  queryDepartmentTreeByYun: {
    url: '/wework/marketing/queryDepartmentTreeByYun',
    method: 'get'
  },
  queryDeptAndEmpl: {
    url: '/wework/marketing/queryDeptAndEmpl',
    method: 'get'
  },
  queryEmployeeWechatInfoList: {
    url: '/wework/marketing/queryEmployeeWechatInfoList',
    method: 'get'
  },
  saveOrUpdateEnterprise4Room: {
    url: '/wework/marketing/saveOrUpdateEnterprise4Room',
    method: 'post'
  },
  updateStatus: {
    url: '/wework/marketing/updateStatus',
    method: 'get'
  },
  // 旧的好友营销详情接口
  getEnterpriseActivity: {
    url: '/wework/marketing/getEnterpriseActivity',
    method: 'get'
  },
  queryChatRoomLeadersByActivityId: {
    url: '/wework/marketing/queryChatRoomLeadersByActivityId',
    method: 'get'
  },
  queryTotal: {
    url: '/wework/marketing/queryTotal',
    method: 'get'
  },
  queryTableSendData: {
    url: '/wework/marketing/queryTableSendData',
    method: 'post'
  },
  queryTableSendDataToGroup: {
    url: '/wework/marketing/queryTableSendDataToGroup',
    method: 'post'
  },
  queryGroupEntRoomsLeaderList: {
    url: '/wework/marketing/queryGroupEntRoomsLeaderList',
    method: 'post'
  },
  getViewShopOffList: {
    url: '/wework/marketing/getViewShopOffList',
    method: 'get'
  },
  queryAuditTable: {
    url: '/wework/marketing/queryAuditTable',
    method: 'post'
  },
  queryAuditInfo: {
    url: '/wework/marketing/queryAuditInfo',
    method: 'get'
  },
  auditActivity: {
    url: '/wework/marketing/auditActivity',
    method: 'post'
  },
  queryWxPersonalFriendsAnalysisData: {
    url: '/wework/marketing/queryWxPersonalFriendsAnalysisData',
    method: 'post'
  },
  verifyProductToCRM: {
    url: '/wework/marketing/verifyProductToCRM',
    method: 'get'
  }
}
