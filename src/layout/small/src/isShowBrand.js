/*
 * @Date: 2022-03-31 17:14:35
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-02 10:53:44
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
    '/Social/WeComCustomerOperation/RepeatCustomer',
    '/Social/WeComCustomerOperation/FriendsAnalysis',
    '/Social/WeComCustomerOperation/ExternalContactList',
    '/Social/WeComCustomerOperation/RoomList',
    '/Social/WeComCustomerOperation/NsTableEnterpriseWeChatMember',
    '/Social/SocialOperation/CustomerCode/List',
    '/Social/SocialOperation/CustomerCode/Edit',
    '/Social/SocialOperation/CustomerCode/Analysis',
    '/Social/WeComCustomerOperation/GroupData',
    '/Social/WeComCustomerOperation/DeleteCustomers',
    '/Social/WeComCustomerOperation/BeDeleteCustomers',
    '/Social/WeWorkGroup/sensitiveWords',
    '/Customer/Group/CustomerGroup',
    '/WeWork/Customer/SessionStatistics',
    '/Social/WeWorkGroup/ChatRecord'

  ]

  return showBrandSelectPathList.indexOf($route.path) > -1
}
