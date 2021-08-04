/**
 * 欢迎语附件消息类型
 */
export enum ScWelcomeMessageType {
  Pitbit = 0,
  Image,
  Video,
  Link,
  MiniProgram
}
/**
 * 欢迎语附件类型对应Icon和标题
 */
export const WelcomeMessageTypeTip = {
  [ScWelcomeMessageType.Pitbit]: {
    tip: '坑位',
    icon: 'poster-1'
  },
  [ScWelcomeMessageType.Image]: {
    tip: '图片',
    icon: 'tupianbeifen-5'
  },
  [ScWelcomeMessageType.Video]: {
    tip: '视频',
    icon: 'shipinbeifen-4'
  },
  [ScWelcomeMessageType.Link]: {
    tip: '链接',
    icon: 'lianjiebeifen-4'
  },
  [ScWelcomeMessageType.MiniProgram]: {
    tip: '小程序',
    icon: 'xiaochengxushouquan'
  }
}
