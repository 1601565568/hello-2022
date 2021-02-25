import { method } from 'lodash'

export default {
  // 聚合二维码列表查询
  findList: {
    url: '/Guide/PersonalQrcode/findList',
    method: 'post'
  },
  // 删除对应的聚合二维码
  deletePersonalQrcode: {
    url: '/Guide/PersonalQrcode/deletePersonalQrcode',
    method: 'post'
  },
  // 通过id查询聚合二维码信息
  findById: {
    url: '/Guide/PersonalQrcode/findById',
    method: 'post'
  },
  // 获取有二维码员工信息
  queryGuideMsg: {
    url: '/Guide/PersonalQrcode/queryGuideMsg',
    method: 'post'
  },
  // 聚合二维码保存
  save: {
    url: '/Guide/PersonalQrcode/save',
    method: 'post'
  },
  // 获取员工部门
  getDepartment: {
    url: '/Guide/PersonalQrcode/getDepartment',
    method: 'get'
  },
  // 获取有二维码的员工部门信息
  getQrcodeDepartment: {
    url: '/Guide/PersonalQrcode/getQrcodeDepartment',
    method: 'post'
  },
  getGuideMsg: {
    url: '/Guide/PersonalQrcode/getGuideMsg',
    method: 'post'
  },
  // 投放预览保存
  saveShow: {
    url: '/Guide/PersonalQrcode/saveShow',
    method: 'post'
  },
  // 获取创建聚合二维码创建者集合
  queryCreatorList: {
    url: '/Guide/PersonalQrcode/queryCreatorList',
    method: 'post'
  },
  // 聚合二维码上传头像
  uplaodWatermarkImage: {
    url: '/Guide/PersonalQrcode/uplaodWatermarkImage',
    method: 'post'
  },
  // 聚合二维码效果分析员工明细
  getQrCodeEffectList: {
    url: '/Guide/PersonalQrcode/getQrCodeEffectList',
    method: 'post'
  },
  // 聚合二维码好友明细
  getQrCodeInviteFriendDetailList: {
    url: '/Guide/PersonalQrcode/getQrCodeInviteFriendDetailList',
    method: 'post'
  },
  // 聚合二维码获取统计信息总数
  getQrcodeStatisticsCount: {
    url: '/Guide/PersonalQrcode/getQrcodeStatisticsCount',
    method: 'post'
  },
  // 聚合二维码下载统计信息EXCEL
  exportEffectByExcel: {
    url: '/Guide/PersonalQrcode/exportEffectByExcel',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 查询企业微信标签列表
  findWeWorkTagList: {
    url: 'wework/weworktag/findWeWorkTagList',
    method: 'get'
  }
}
