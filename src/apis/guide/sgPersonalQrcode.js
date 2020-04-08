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
  // 投放预览保存
  saveShow: {
    url: '/Guide/PersonalQrcode/saveShow',
    method: 'post'
  }
}
