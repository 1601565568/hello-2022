const prefix = 'activity/guestCode/'
export default {
  // 查询裂变大师活动列表
  findList: {
    url: `${prefix}findList`,
    method: 'post'
  },
  // 结束裂变大师活动
  closeGuestCodeActivity: {
    url: `${prefix}closeGuestCodeActivity`,
    method: 'get'
  },
  // 查询裂变大师活动下属员工列表
  findGuideList: {
    url: `${prefix}findGuideList`,
    method: 'post'
  },
  // 查询裂变大师活动
  getByGuestCodeId: {
    url: `${prefix}getByGuestCodeId`,
    method: 'get'
  },
  // 查询裂变大师活动下属员工列表
  getGuideListByGuestCodeId: {
    url: `${prefix}getGuideListByGuestCodeId`,
    method: 'post'
  },
  // 保存更新裂变大师活动
  saveOrUpdate: {
    url: `${prefix}saveOrUpdate`,
    method: 'post'
  },
  // 查询裂变大师活动分析所属员工明细列表
  getEmployeeListByGuestCodeId: {
    url: `${prefix}getEmployeeListByGuestCodeId`,
    method: 'post'
  },
  // 查询裂变大师推广大师列表文档
  getPromotionListByGuestCodeId: {
    url: `${prefix}getPromotionListByGuestCodeId`,
    method: 'post'
  },
  // 查询裂变大师领取奖励明细列表
  findAwardRecordTable: {
    url: `${prefix}findAwardRecordTable`,
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
  // 查询裂变大师列表统计总数
  getGuestStatisticsCount: {
    url: `${prefix}getGuestStatisticsCount`,
    method: 'post'
  },
  exportFriendListByExcel: { // 导出excel
    url: `${prefix}exportFriendListByExcel`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 查询优惠券列表
  findActivityCouponList: {
    url: '/guide/sgactivitycoupon/findActivityCouponList',
    method: 'post'
  },
  // 查询奖励达标推广列表
  findActivityReachStandard: {
    url: '/activity/guestCode/findActivityReachStandard',
    method: 'post'
  },
  // 会话统计导出
  employeeListExport: {
    url: `${prefix}employeeListExport`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 好友明细列表导出
  friendListExport: {
    url: `${prefix}friendListExport`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 奖励达标推广大师列表导出
  reachStandardExport: {
    url: `${prefix}reachStandardExport`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 一客一码推广大师人员列表导出
  promotionListExport: {
    url: `${prefix}promotionListExport`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 领取记录明细导出
  awardRecordTableExport: {
    url: `${prefix}awardRecordTableExport`,
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
