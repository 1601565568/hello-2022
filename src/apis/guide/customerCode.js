const prefix = 'activity/guestCode/'
export default {
  // 查询一客一码活动列表
  findList: {
    url: `${prefix}findList`,
    method: 'post'
  },
  // 结束一客一码活动
  closeGuestCodeActivity: {
    url: `${prefix}closeGuestCodeActivity`,
    method: 'get'
  },
  // 查询一客一码活动下属员工列表
  findGuideList: {
    url: `${prefix}findGuideList`,
    method: 'post'
  },
  // 查询一客一码活动
  getByGuestCodeId: {
    url: `${prefix}getByGuestCodeId`,
    method: 'get'
  },
  // 查询一客一码活动下属员工列表
  getGuideListByGuestCodeId: {
    url: `${prefix}getGuideListByGuestCodeId`,
    method: 'post'
  },
  // 保存更新一客一码活动
  saveOrUpdate: {
    url: `${prefix}saveOrUpdate`,
    method: 'post'
  }
}
