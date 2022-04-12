/*
 * @Date: 2022-04-08 11:49:37
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-12 14:51:01
 * @FilePath: \ECRP-SG-WEB\src\layout\small\src\isShowBrand.js
 */
/**
 * 监听路由变化时，是否要显示企微选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 需显示区域选择的路由数组
  const showBrandSelectPathList = [
    '/Marketing/EnterpriseMessage',
    '/Marketing/EnterpriseMessagePush',
    '/Social/WeComCustomerOperation/GroupRepeat',
    '/Social/WeWorkGroup/GroupWelcomeCode',
    '/WeWork/WelcomeLog/Log',
    '/WeWork/WelcomeCode/WelcomeCodeList',
    '/Social/OperationConfig',
    '/Social/SocialOperation/RedPacket/Analysis',
    '/Social/SocialOperation/RedPacket/ReceiveRecord',
    '/Social/SocialOperation/RedPacket/SendRecord',
    '/Guide/SgPersonalQrcode/List',
    '/Guide/chanel/chanel',
    '/Social/WeComCustomerOperation/LosOfFriends',
    '/Social/WeComCustomerOperation/ExternalContactList',
    '/Social/WeComCustomerOperation/FriendsAnalysis',
    '/Social/WeComCustomerOperation/RepeatCustomer',
    '/Customer/Group/CustomerGroup',
    '/WeWork/Customer/SessionStatistics',
    '/Social/WeComCustomerOperation/RoomList',
    '/Social/WeComCustomerOperation/NsTableEnterpriseWeChatMember',
    '/Social/WeComCustomerOperation/GroupData',
    '/Social/WeWorkGroup/sensitiveWords',
    '/Social/WeWorkGroup/ChatRecord'

  ]

  return showBrandSelectPathList.indexOf($route.path) > -1
}
