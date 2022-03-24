/**
 * 监听路由变化时，是否要显示企微选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 需显示区域选择的路由数组
  const showBrandSelectPathList = [
    '/Marketing/EnterpriseMessage',
    '/Social/WeComCustomerOperation/GroupRepeat',
    '/Social/WeWorkGroup/GroupWelcomeCode',
    '/WeWork/WelcomeLog/Log',
    '/WeWork/WelcomeCode/WelcomeCodeList',
    '/Social/OperationConfig',
    '/Social/SocialOperation/RedPacket/Analysis',
    '/Social/SocialOperation/RedPacket/ReceiveRecord',
    '/Social/SocialOperation/RedPacket/SendRecord',
    '/Guide/chanel/chanel',
    '/Social/WeComCustomerOperation/LosOfFriends',
    '/Social/SocialOperation/CustomerCode/List',
    '/Social/SocialOperation/CustomerCode/Edit',
    '/Social/SocialOperation/CustomerCode/Analysis'
  ]

  return showBrandSelectPathList.indexOf($route.path) > -1
}
