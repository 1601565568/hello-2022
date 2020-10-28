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
  },
  // 查询一客一码活动分析所属员工明细列表
  getEmployeeListByGuestCodeId: {
    url: `${prefix}getEmployeeListByGuestCodeId`,
    method: 'post'
  },
  // 查询一客一码推广大师列表文档
  getPromotionListByGuestCodeId: {
    url: `${prefix}getPromotionListByGuestCodeId`,
    method: 'post'
  },
  // 获取好友明细列表
  getFriendListByParam: {
    url: `${prefix}getFriendListByParam`,
    method: 'post'
  },
  // 获取导购的推广大师明细
  getPromotionMasterInfoList: {
    url: `${prefix}getPromotionMasterInfoList`,
    method: 'post'
  },
  // 查询一客一码列表统计总数
  getGuestStatisticsCount: {
    url: `${prefix}getGuestStatisticsCount`,
    method: 'post'
  },
  exportFriendListByExcel: { // 导出excel
    url: `${prefix}exportFriendListByExcel`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
