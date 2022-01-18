/**
 * 监听路由变化时，是否要显示区域选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 需显示区域选择的路由数组
  const showAreaSelectPathList = [
    '/Marketing/EnterpriseMessage',
    '/Marketing/EnterpriseGroupMessage',
    '/Marketing/EnterpriseMessagePush',
    '/Marketing/EnterpriseGroupMessagePush',
    '/EnterpriseExamine',
    '/EnterpriseGroupExamine',
    '/AnalysisWechatData/EnterpriseWechatFriendData',
    '/Marketing/EffectAnalysisEnterprise',
    '/Marketing/EffectAnalysisEnterpriseGroup',
    '/Social/WeComCustomerOperation/ExternalContactList',
    '/Social/WeComCustomerOperation/GroupData',
    '/Customer/Group/CustomerGroup',
    '/Social/OperationData/MaterialChat',
    '/Social/OperationData/MaterialOperationChat',
    '/Social/WeComCustomerOperation/FriendsAnalysis',
    '/WeWork/Customer/SessionStatistics',
    '/Guide/ActivityIndex/WorkStatistics'
  ]

  return showAreaSelectPathList.indexOf($route.path) > -1
}
