/**
 * 欢迎语附件消息类型
 */
export enum WelcomeMessageType {
  Pitbit = 0,
  Image,
  Video,
  Link,
  MiniProgram,
  Poster
}
/**
 * 欢迎语附件类型对应Icon和标题
 */
export const WelcomeMessageTypeTip = {
  [WelcomeMessageType.Image]: {
    tip: '图片',
    icon: 'tupianbeifen-5'
  },
  [WelcomeMessageType.Video]: {
    tip: '视频',
    icon: 'shipinbeifen-4'
  },
  [WelcomeMessageType.Link]: {
    tip: '链接',
    icon: 'lianjiebeifen-4'
  },
  [WelcomeMessageType.MiniProgram]: {
    tip: '小程序',
    icon: 'xiaochengxushouquan'
  },
  [WelcomeMessageType.Poster]: {
    tip: '二维码海报',
    icon: 'poster-1'
  },
  [WelcomeMessageType.Pitbit]: {
    tip: '坑位',
    icon: 'poster-1'
  }
}
