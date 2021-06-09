export default {
  getWeChatOfficialAccounts: {
    url: '/wxpay/wechatOfficial/getWeChatOfficialAccounts',
    method: 'get'
  },
  getList: {
    url: '/wxpay/method/list',
    method: 'post'
  },
  createPay: {
    url: '/wxpay/method/create',
    method: 'post'
  },
  updatePay (id) {
    return {
      url: `/wxpay/method/updateById/${id}`,
      method: 'post'
    }
  }
}
