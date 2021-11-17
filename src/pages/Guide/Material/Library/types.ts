/**
 * 欢迎语附件消息类型
 */
export enum WelcomeMessageType {
  Pitbit = 0,
  Image,
  Video,
  Link,
  MiniProgram,
  ImageCode
}
/**
 * 欢迎语附件类型对应Icon和标题
 */
export const WelcomeMessageTypeTip = {
  [WelcomeMessageType.Pitbit]: {
    tip: '坑位',
    icon: 'poster-1'
  },
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
  [WelcomeMessageType.ImageCode]: {
    tip: '附码图片',
    icon: 'fumatupian'
  }
}
