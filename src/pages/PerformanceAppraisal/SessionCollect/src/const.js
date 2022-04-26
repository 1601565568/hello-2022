import store from '@/store'
const cloudPlatformType = store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
// 红包类型相关
export const normalRed = 1 // 普通红包
export const luckyRed = 2 // 拼手气红包
export const diyRed = 3 // 自定义红包
export const redpacketTypeMap = { // 红包类型枚举
  [normalRed]: '普通红包', [luckyRed]: '拼手气红包', [diyRed]: '自定义红包'
}
export const redpacketTypeList = [ // 红包类型列表
  {
    label: '普通红包',
    value: normalRed
  },
  {
    label: '拼手气红包',
    value: luckyRed
  },
  {
    label: '自定义红包',
    value: diyRed
  }
]
export const normalType = 1 // 正常状态（策略和放红包同）
export const closeType = 2 // 关闭状态（策略和放红包同）
// 红包发放相关
export const staffPost = 1 // 员工发放
export const activityPost = 2 // 活动发放
export const setTypeList = [ // 红包投放类型列表
  {
    label: cloudPlatformType === 'ecrp' ? '员工发放' : '成员发放',
    value: staffPost
  },
  {
    label: '活动发放',
    value: activityPost
  }
]
export const setTypeMap = { // 红包投放类型列表
  [staffPost]: cloudPlatformType === 'ecrp' ? '员工发放' : '成员发放',
  [activityPost]: '活动发放'
}
// 时间相关
export const timeTypeForever = 2 // 永久有效的时间类型
export const timeTypeInterval = 1 // 区间时间类型
export const timeTypeList = [ // 时间类型列表
  {
    label: '区间时间',
    value: timeTypeInterval,
    nick: '有限'
  },
  {
    label: '永久有效',
    value: timeTypeForever,
    nick: '不限'
  }
]
export const BLESSING = '恭喜发财，大吉大利'
