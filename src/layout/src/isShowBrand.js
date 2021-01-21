/**
 * 监听路由变化时，是否要显示视角选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 部分路由无视角选择
  const path = $route.path
  if (path === '/Marketing/EnterpriseMessage' ||
      path === '/Marketing/EnterpriseGroupMessage' ||
      path === '/Marketing/EnterpriseMessagePush' ||
      path === '/Marketing/EnterpriseGroupMessagePush' ||
      path === '/EnterpriseExamine' ||
      path === '/EnterpriseGroupExamine' ||
      path === '/AnalysisWechatData/EnterpriseWechatFriendData' ||
      path === '/Marketing/EffectAnalysisEnterprise' ||
      path === '/Marketing/EffectAnalysisEnterpriseGroup') {
    return true
  }
  return false
}
