/**
 * SOP活动的消息类型
 * 0 文本
 * 1 图片
 * 2 视频
 * 3 链接
 * 4 小程序
 * 5 二维码海报
 * 6 裂变大师
 */
export enum SOPActivityMessageType {
  Text,
  Image,
  Video,
  Link,
  MiniProgram,
  Poster,
  CostomCode,
  // @ts-ignore
  All = null
}

/**
 * 活动消息类型对应Icon ToolTip使用
 */
export const SOPMessageTypeToolTip = {
  [SOPActivityMessageType.Text]: {
    tip: '文本',
    icon: 'wenbenbeifen-4'
  },
  [SOPActivityMessageType.Image]: {
    tip: '图片',
    icon: 'tupianbeifen-5'
  },
  [SOPActivityMessageType.Video]: {
    tip: '视频',
    icon: 'shipinbeifen-4'
  },
  [SOPActivityMessageType.Link]: {
    tip: '链接',
    icon: 'lianjiebeifen-4'
  },
  [SOPActivityMessageType.MiniProgram]: {
    tip: '小程序',
    icon: 'xiaochengxushouquan'
  },
  [SOPActivityMessageType.Poster]: {
    tip: '二维码海报',
    icon: 'poster-1'
  },
  [SOPActivityMessageType.CostomCode]: {
    tip: '裂变大师',
    icon: 'icon-liebiandashi'
  }
}

/**
 * SOP活动的审核状态
 */
export enum SOPExamineStatus {
  Failed, // 审核失败
  UnSubmit, // 待提交
  Pending, // 待审核
  Succeed, // 审核成功
  // @ts-ignore
  All = null
}

/**
 * SOP使用权限人员类型
 * -1 未设置
 * 1 全部
 * 2 店铺
 * 3 员工
 */
export enum SOPAuthRangeType {
  UnSet = -1,
  All = 1,
  Shop,
  Guide
}
