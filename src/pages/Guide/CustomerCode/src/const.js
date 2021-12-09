import { defCardImg, defBanner, defRegUrl, defGoodsUrl } from '../util/Edit'
export const STEP_LIST = [
  {
    id: 0,
    name: '基础信息',
    module: 'BaseInfo',
    dataName: 'baseInfoData'
  },
  {
    id: 1,
    name: '奖品设置',
    module: 'PrizeSet',
    dataName: 'prizeSetData'
  },
  {
    id: 2,
    name: '页面装修',
    module: 'PageDecoration',
    dataName: 'pageDecorationData'
  },
  {
    id: 3,
    name: '设置裂变海报',
    module: 'SetPoster',
    dataName: 'setPosterData'
  },
  {
    id: 4,
    name: '配置欢迎语',
    module: 'SetWelcomeCode',
    dataName: 'setWelcomeCodeData'
  },
  {
    id: 5,
    name: '高级设置',
    module: 'AdvancedSetup',
    dataName: 'advancedSetupData'
  }
]

export const DEFAULT_DATA = {
  distinctType: 0, // 去重方式：0=不去重；1=全局去重；2=活动内去重；
  unfriendDeduction: 0, // 解除好友关系是否扣减好友数：0=不扣减；1扣减
  validIntervalTimeOfStatistical: 0, // 统计的有效间隔时间(统计时效)：0=立即生效；>0 =间隔该时间后生效
  repeatParticipation: 0 // 是否允许重复参与：0=允许；1=不允许
}
export const ANALYSIS_DATE = {
  DISTINC_TYPE: {
    1: '全局去重：活动外已添加过企业内员工为好友（无论是否还保持），则通过裂变大师添加好友不计入裂变好友数。',
    2: '活动内去重：活动内添加多名员工为好友时，数据去重，不计入好友数据。',
    0: '不去重：活动内用户添加员工为好友，即计入裂变数据。'
  },
  UNFRIEND_DEDUCTION: {
    0: '解除关系扣减（关闭）：活动有效期内，解除好友关系时，不扣减裂变好友数。',
    1: '解除关系扣减（开启）：活动有效期内，解除好友关系时，扣减裂变好友数。'
  },
  VALID_INTERVAL_TIME_OF_STATISTICAL (num) {
    return num === 0 ? '统计时效：添加好友后立即计入裂变好友数。' : `统计时效：好友关系保持${num}小时后计入裂变好友数。`
  },
  REPEACT_PARTICIPATION: {
    0: '允许重复参加（开启）：单个活动内，允许成为多名员工的裂变大师。',
    1: '允许重复参加（关闭）：单个活动内，不允许成为多名员工的裂变大师。'
  }
}
export const EDIT_DATA = {
  DEDUP_WAY: {
    0: {
      text: '活动内用户添加员工为好友，即计入裂变数据',
      tip: '消费者张三通过裂变大师活动添加员工小A和小B为好友，即记录为小A的好友数同时也记录为小B的好友数'
    },
    1: {
      text: '若在该活动外已添加过企业内员工为好友（无论是否还保持），则通过裂变大师添加好友不计入裂变好友数',
      tip: '消费者张三与员工小A已是好友，张三通过裂变大师活动又添加员工小B为好友，张三不会记录为员工小B的新好友数'
    },
    2: {
      text: '单个活动内添加多名员工为好友时（不论与之前员工是否还保留好友关系），数据去重，不再计入裂变数据',
      tip: '消费者张三通过裂变活动1与员工小A成为好友，张三又通过同一个裂变活动1与员工小B成为好友，张三仅记录为小A的新好友数，不会记录为小B的新好友数'
    }
  }
}

// 各个模块 默认数据
// 基础信息
export const DEFAULT_BASEINFO_DATA = {
  name: '', // 一客一码活动名称
  guideIds: [], // 使用导购ids
  guideDatas: [],
  validTimeType: 1, // 有效时间类型 0永久有效，1固定范围
  time: []
}
// 奖品设置
// 默认奖品项
export const DEFAULT_PRIZE_ITEM = {
  prizeGrade: 1,
  addPrizeNumber: 0, // 新增活动奖励总数
  prizeId: null,
  recruitment: 1, // 邀请人数
  prizeName: '', // 优惠券名称
  prizeNumber: '', // 设置活动奖励总数
  validNumber: 0 // 优惠券剩余数量
}
export const DEFAULT_SETPRIZE_DATA = {
  isOpnePrize: true, // 是否设置奖品
  prizeRuleList: [{ ...DEFAULT_PRIZE_ITEM }], // 阶梯奖励数据
  isOnlyReceiveByMember: 0, // 仅会员可领取奖励
  prizeLadderRule: 0 // 阶梯奖励规则：0：不允许奖品叠加领取；1：允许奖品叠加领取；
}
// 页面装修
export const GET_DEFAULT_ACTIVEINFO_ITEM = (prizeType = 1) => ({
  image: prizeType === 2 ? defaultRedpack : defaultCoupon,
  number: '0',
  goodsName: '',
  goodsDes: ''
})
export const DEFAULT_PAGEDECORATION_DATA = {
  pageColor: '#FFA30E,#F96C39,#FFFFFF', // 活动页面配色方案
  showColor: {
    mainColor: '#FFA30E',
    bgColor: '#F96C39',
    strColor: '#FFFFFF'
  },
  getBtnColor: '#ffa30e',
  shareBtnColor: '#ffa30e',
  eidtList: [
    { itemName: '主图模块', itemCode: 'banner', status: 1, value: {} },
    { itemName: '倒计时模块', itemCode: 'countdown', status: 1, value: {} },
    { itemName: '活动奖励模块', itemCode: 'reward', status: 1, value: {} },
    { itemName: '成功邀请好友模块', itemCode: 'invitedFriend', status: 1, value: {} },
    { itemName: '活动规则', itemCode: 'activityRule', status: 1, value: {} },
    { itemName: '注册会员模块', itemCode: 'memberRegister', status: 1, value: {} },
    { itemName: '分享按钮模块', hideImg: true, itemCode: 'shareButton', status: 1, value: {} }
  ],
  activeInfo: {},
  activeInfoList: [],
  bannerUrl: defBanner,
  rules: '',
  regUrl: defRegUrl,
  shareBtnText: '立即分享',
  virtualFinishedCount: 0
}
// 设置裂变海报
export const defBgImg = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/page/customCode/allgrey.jpg'
export const demoImg = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/page/customCode/demo.jpg'
export const defaultCoupon = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/page/customCode/defaultCoupon.png'
export const defaultRedpack = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/page/customCode/defaultRedpack.png'
export const DEFAULT_SETPOSTER_DATA = {
  backgroundPic: defBgImg, // 海报
  headPortrait: 1, // 用户头像：0无，1有
  headPortraitShape: 1, // 用户头像形状：0圆 1方
  nickColour: '#000000', // 用户昵称字体颜色：十六进制
  headerType: 1,
  qrcodeSize: 172, // 二维码大小
  qrcodeX: 74, // 二维码X轴坐标值
  qrcodeY: 349 // 二维码Y轴坐标值
}
// 设置欢迎语
export const DEFAULT_WELCOMECODE = `你好，我是{USER_NICK}\n恭喜你成功参与本次福利活动，分享活动邀请好友扫码添加{USER_NICK}为好友\n邀请5位好友即可领取奖品！奖品限量100份，先到先得哦！\n活动有效期：{ACTIVITY_VALIT_TIME}\n点击下方链接去分享吧↓↓`
export const Tools = [
  { type: 'tag', text: '插入员工微信昵称', id: 'USER_NICK', value: '员工微信昵称' },
  { type: 'tag', text: '插入活动有效时间', id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
]
export const DEFAULT_SETWELCOMECODE_DATA = {
  activityIntroduction: '', // 活动介绍
  cardCopywriting: '', // 活动消息卡片文案
  cardCoverPic: defCardImg, // 活动消息卡片封面图片
  cardTitle: '' // 活动消息卡片标题
}
// 高级设置
export const GET_DEFAULT_TAGS_ITEM = (level = 1) => ({ level, tag: '', tagGroupId: '' })
export const GET_DEFAULT_TAGS = () => ({
  count: 10,
  addValidFriendTags: [ GET_DEFAULT_TAGS_ITEM() ],
  beGuestCodeTags: [ GET_DEFAULT_TAGS_ITEM() ],
  noStandardTags: [ GET_DEFAULT_TAGS_ITEM() ],
  standardTags: [ GET_DEFAULT_TAGS_ITEM() ],
  noReceiveRewardsTags: [ GET_DEFAULT_TAGS_ITEM() ],
  receiveRewardsTags: [ GET_DEFAULT_TAGS_ITEM() ]
})
export const DEFAULT_ADVANCEDSETUP_DATA = {
  distinctType: 0, // 去重方式：0=不去重；1=全局去重；2=活动内去重；
  unfriendDeduction: 0, // 解除好友关系是否扣减好友数：0=不扣减；1扣减
  validIntervalTimeOfStatistical: 0, // 统计的有效间隔时间(统计时效)：0=立即生效；>0 =间隔该时间后生效
  repeatParticipation: 0, // 是否允许重复参与：0=允许；1=不允许
  effectiveCycle: 1,
  tags: GET_DEFAULT_TAGS()
}

// 各个模块对应的数组的下标
export const MODULE_TO_INDEX_MAP = {
  banner: 0,
  countdown: 1,
  reward: 2,
  invitedFriend: 3,
  activityRule: 4,
  memberRegister: 5,
  shareButton: 6
}
