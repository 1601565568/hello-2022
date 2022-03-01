export interface THIRD_ROUTER {
  [key: string]: any,
};
export const setPortals = () => (
  {
    type: 'isPortals',
    value: true
  }
)
export const setAddress = () => (
  {
    type: 'isAddress',
    value: true
  }
)
export const setChat = () => (
  {
    type: 'isChat',
    value: true
  }
)
export const thirdRouter:THIRD_ROUTER = {
  // 企业接入  type:isThird
  '/Social/WeComCustomerOperation/ExternalContactList': setPortals(),
  '/Social/WeComCustomerOperation/RepeatCustomer': setPortals(),
  '/Social/WeComCustomerOperation/RoomList': setPortals(),
  '/Guide/SgPersonalQrcode/List': setPortals(),
  '/WeWork/WelcomeCode/WelcomeCodeList': setPortals(),
  '/Social/SocialOperation/CustomerCode/List': setPortals(),
  '/Guide/LBS/Friends/Index': setPortals(),
  '/Guide/LBS/Group/Index': setPortals(),
  '/Social/WeWorkGroup/chatRoomGroup': setPortals(),
  '/Marketing/EnterpriseMessage': setPortals(),
  '/Marketing/EnterpriseGroupMessage': setPortals(),
  '/Marketing/SOP': setPortals(),
  '/EnterpriseExamine': setPortals(),
  '/EnterpriseGroupExamine': setPortals(),
  '/Marketing/SOP/Examine': setPortals(),
  '/AnalysisWechatData/EnterpriseWechatFriendData': setPortals(),
  '/Social/WeComCustomerOperation/DeleteCustomers': setPortals(),
  '/Social/WeComCustomerOperation/FriendsAnalysis': setPortals(),
  '/Social/OperationData/CircleOfFriends': setPortals(),
  '/Social/WeComCustomerOperation/LosOfFriends': setPortals(),
  // 通讯录配置 type:isAddress
  '/Marketing/FriendsCircle/OutList': setAddress(),
  '/Marketing/FriendsCircle/List': setAddress(),
  '/Marketing/FriendsCircle/Analysis': setAddress(),
  // 会话存档配置 type:isChat
  '/Social/WeWorkGroup/ChatRecord': setChat(),
  '/Social/OperationConfig/topicAnalysis': setChat(),
  '/Social/WeWorkGroup/sensitiveWords': setChat()
}
