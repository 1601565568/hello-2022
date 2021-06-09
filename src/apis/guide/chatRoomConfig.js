export default {
  // 群聚合码url
  chatRoomGroupList: {
    url: 'chatRoomGroup/list',
    method: 'post'
  },
  chatRoomGroupDownLoad: {
    url: 'chatRoomGroup/downLoad',
    method: 'get'
  },
  chatRoomCanJoinList: {
    url: '/chatRoom/canJoinList',
    method: 'post'
  },
  canJoinChatIdList: {
    url: '/chatRoom/canJoinChatIdList',
    method: 'post'
  },
  findByChatIds: {
    url: '/chatRoom/findByChatIds',
    method: 'post'
  },
  chatRoomUserList: {
    url: '/chatRoomUser/list',
    method: 'post'
  },
  chatRoomList: {
    url: '/chatRoom/list',
    method: 'post'
  },
  chatRoomDelete: {
    url: '/chatRoom/delete',
    method: 'get'
  },
  chatRoomGroupGetByConfigId: {
    url: '/chatRoomGroup/getByConfigId',
    method: 'get'
  },
  chatRoomGroupAllOwner: {
    url: '/chatRoomGroup/getAllOwner',
    method: 'get'
  },
  chatRoomGroupCreate: {
    url: '/chatRoomGroup/create',
    method: 'post'
  },
  syncUser: {
    url: '/chatRoomUser/syncUser',
    method: 'get'
  },
  chatRoomGroupDelete: {
    url: '/chatRoomGroup/deleteByConfigId',
    method: 'get'
  }
}
