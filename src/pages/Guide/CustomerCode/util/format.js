import { MODULE_TO_INDEX_MAP, GET_DEFAULT_TAGS, Tools, DEFAULT_PRIZE_ITEM } from '../src/const'
import TagArea from '@/components/NewUi/TagArea'

// 上传时格式化
export const submitFormat = (model) => {
  const { advancedSetupData, baseInfoData, pageDecorationData, prizeSetData, setPosterData, setWelcomeCodeData } = model
  const data = {
    activityDescription: '活动说明',
    activityIntroduction: TagArea.methods.htmlToString(setWelcomeCodeData.activityIntroduction),
    backgroundPic: setPosterData.backgroundPic,
    cardCopywriting: setWelcomeCodeData.cardCopywriting,
    cardCoverPic: setWelcomeCodeData.cardCoverPic,
    cardTitle: setWelcomeCodeData.cardTitle,
    distinctType: advancedSetupData.distinctType,
    effectiveCycle: advancedSetupData.effectiveCycle,
    guideDatas: baseInfoData.guideDatas,
    guideIds: baseInfoData.guideIds,
    headPortrait: setPosterData.headPortrait,
    headPortraitCoordinateX: setPosterData.headPortraitCoordinateX,
    headPortraitCoordinateY: setPosterData.headPortraitCoordinateY,
    headPortraitShape: setPosterData.headPortraitShape,
    headPortraitSize: setPosterData.headPortraitSize,
    headerType: setPosterData.headerType,
    isOnlyReceiveByMember: prizeSetData.isOnlyReceiveByMember,
    name: baseInfoData.name,
    nick: setPosterData.headPortrait,
    nickColour: setPosterData.nickColour.substring(1),
    nickCoordinateX: setPosterData.nickCoordinateX,
    nickCoordinateY: setPosterData.nickCoordinateY,
    nickPosition: setPosterData.nickPosition,
    nickSize: 14,
    pageColor: Object.values(pageDecorationData.showColor).join(','),
    prizeStatus: prizeSetData.isOpnePrize * 1,
    qrcodeSize: setPosterData.qrcodeSize,
    qrcodeX: setPosterData.qrcodeX,
    qrcodeY: setPosterData.qrcodeY,
    qrCodeType: setPosterData.qrCodeType,
    repeatParticipation: advancedSetupData.repeatParticipation,
    tags: advancedSetupData.tags,
    time: baseInfoData.time,
    unfriendDeduction: advancedSetupData.unfriendDeduction,
    validIntervalTimeOfStatistical: advancedSetupData.validIntervalTimeOfStatistical,
    validTimeEnd: baseInfoData.validTimeEnd,
    validTimeStart: baseInfoData.validTimeStart,
    validTimeType: baseInfoData.validTimeType,
    pageDecoration: JSON.stringify(submitPageDecorationDataFormat(pageDecorationData)),
    prizeRuleList: submitPrizeRuleListFormat(pageDecorationData.activeInfoList),
    prizeSendPlan: 1,
    prizeLadderRule: prizeSetData.prizeLadderRule
  }
  return data
}
export const submitPageDecorationDataFormat = (pageDecorationData) => {
  const pageDecoration = pageDecorationData.eidtList
  pageDecoration[MODULE_TO_INDEX_MAP.banner].value = {
    pic: pageDecorationData.bannerUrl
  }
  pageDecoration[MODULE_TO_INDEX_MAP.reward].value = {
    btnColor: pageDecorationData.getBtnColor,
    virtualFinishedCount: pageDecorationData.virtualFinishedCount
  }
  console.log(MODULE_TO_INDEX_MAP.shareButton)
  pageDecoration[MODULE_TO_INDEX_MAP.shareButton].value = {
    color: pageDecorationData.shareBtnColor,
    name: pageDecorationData.shareBtnText
  }
  pageDecoration[MODULE_TO_INDEX_MAP.memberRegister].value = {
    pic: pageDecorationData.regUrl
  }
  pageDecoration[MODULE_TO_INDEX_MAP.activityRule].value = {
    content: TagArea.methods.htmlToString(pageDecorationData.rules)
  }
  return pageDecoration
}
export const submitPrizeRuleListFormat = prizeRuleList => prizeRuleList.map(item => ({
  ...item,
  addPrizeNumber: item.addPrizeNumber,
  prizeGrade: item.prizeGrade,
  prizeId: item.prizeId,
  prizeIntro: item.goodsDes,
  prizeName: item.prizeName,
  prizeNameSetting: item.goodsName,
  prizeNumber: item.prizeNumber,
  prizePic: item.image,
  prizeType: item.prizeType,
  recruitment: item.recruitment,
  validNumber: item.validNumber
}))
// 加载时格式化
export const loadingFormat = (model) => {
  const baseInfoData = {
    name: model.name,
    guideIds: [],
    guideDatas: [],
    validTimeType: model.validTimeType,
    validTimeStart: model.validTimeType === 1 ? model.validTimeStart : '',
    validTimeEnd: model.validTimeType === 1 ? model.validTimeEnd : '',
    time: [model.validTimeStart, model.validTimeEnd]
  }
  const prizeSetData = {
    isOpnePrize: !!model.prizeRuleList.length,
    prizeRuleList: model.prizeRuleList && model.prizeRuleList.length ? loadingPrizeRuleListFormat(model.prizeRuleList) : [{ ...DEFAULT_PRIZE_ITEM }],
    isOnlyReceiveByMember: model.isOnlyReceiveByMember,
    prizeLadderRule: model.prizeLadderRule
  }
  const pageDecorationData = loadingPageDecorationDataFormat(model)
  const setPosterData = {
    backgroundPic: model.backgroundPic,
    headPortrait: model.headPortrait,
    headPortraitShape: model.headPortraitShape,
    nickColour: '#' + model.nickColour,
    headerType: model.nickPosition,
    qrcodeSize: model.qrcodeSize,
    qrcodeX: model.qrcodeX,
    qrcodeY: model.qrcodeY,
    qrCodeType: model.qrCodeType
  }
  const setWelcomeCodeData = {
    activityIntroduction: TagArea.methods.stringTohtml.call({ tools: Tools }, model.activityIntroduction),
    cardCopywriting: model.cardCopywriting,
    cardCoverPic: model.cardCoverPic,
    cardTitle: model.cardTitle
  }
  const advancedSetupData = {
    distinctType: model.distinctType,
    unfriendDeduction: model.unfriendDeduction,
    validIntervalTimeOfStatistical: model.validIntervalTimeOfStatistical,
    repeatParticipation: model.repeatParticipation,
    effectiveCycle: model.effectiveCycle,
    tags: model.tags || GET_DEFAULT_TAGS()
  }
  return { baseInfoData, prizeSetData, pageDecorationData, setPosterData, setWelcomeCodeData, advancedSetupData }
}
export const loadingPageDecorationDataFormat = (model) => {
  const colorList = model.pageColor.split(',')
  const pageDecoration = JSON.parse(model.pageDecoration)
  // 老数据兼容
  if (pageDecoration[0] && pageDecoration[0].itemCode === 'masterInfo') {
    pageDecoration.shift()
  }
  const bannerData = pageDecoration[MODULE_TO_INDEX_MAP.banner] ? pageDecoration[MODULE_TO_INDEX_MAP.banner].value : {}
  const rewardData = pageDecoration[MODULE_TO_INDEX_MAP.reward] ? pageDecoration[MODULE_TO_INDEX_MAP.reward].value : {}
  const shareData = pageDecoration[MODULE_TO_INDEX_MAP.shareButton] ? pageDecoration[MODULE_TO_INDEX_MAP.shareButton].value : {}
  const regUrlData = pageDecoration[MODULE_TO_INDEX_MAP.memberRegister] ? pageDecoration[MODULE_TO_INDEX_MAP.memberRegister].value : {}
  const activityRuleData = pageDecoration[MODULE_TO_INDEX_MAP.activityRule] ? pageDecoration[MODULE_TO_INDEX_MAP.activityRule].value : {}
  return {
    pageColor: model.pageColor,
    showColor: {
      mainColor: colorList[0],
      bgColor: colorList[1],
      strColor: colorList[2]
    },
    getBtnColor: rewardData.btnColor,
    shareBtnColor: shareData.color,
    eidtList: pageDecoration,
    activeInfo: {},
    activeInfoList: [],
    bannerUrl: bannerData.pic,
    rules: TagArea.methods.stringTohtml.call({ tools: [] }, activityRuleData.content),
    regUrl: regUrlData.pic,
    shareBtnText: shareData.name,
    virtualFinishedCount: rewardData.virtualFinishedCount
  }
}
export const loadingPrizeRuleListFormat = prizeRuleList => prizeRuleList.map(item => (
  {
    ...item,
    image: item.prizePic,
    number: item.prizePresentsNumber,
    goodsName: item.prizeNameSetting,
    goodsDes: item.prizeIntro,
    validNumber: item.prizeValidSum,
    addPrizeNumber: item.addPrizeNumber || 0
  }
))
