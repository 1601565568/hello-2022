const piexl = '/weChat/qrCodePlacard/'
export default {
  findList: {
    url: `${piexl}findList`,
    method: 'post'
  },
  deleteByConfigId: {
    url: `${piexl}deleteByConfigId`,
    method: 'get'
  },
  getByConfigId: {
    url: `${piexl}getByConfigId`,
    method: 'get'
  },
  getWeChatOfficialAccounts: {
    url: `${piexl}getWeChatOfficialAccounts`,
    method: 'get'
  },
  saveOrUpdate: {
    url: `${piexl}saveOrUpdate`,
    method: 'post'
  }
}
