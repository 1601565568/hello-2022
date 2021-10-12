// 默认数据
export const defBanner = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/iphoneBanner.png'
export const defGoodsUrl = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/defaultGoodsImg.jpg'
export const defRegUrl = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/regUrl.png'

// 解析页面数据
export const formatePageObj = (eidtList, prizeModel) => {
  if (!eidtList && !prizeModel) return
  let pageObj = {
    activeInfo: {},
    share: {}
  }
  pageObj.headStyle = eidtList[0].value.headPortraitShape
  pageObj.bannerUrl = eidtList[1].value.pic
  pageObj.activeInfo.number = eidtList[3].value.virtualFinishedCount
  pageObj.activeInfo.getColor = eidtList[3].value.btnColor
  pageObj.rules = eidtList[5].value.content
  pageObj.regUrl = eidtList[6].value.pic
  let shareColor = eidtList[7].value.color
  if (!shareColor.includes('#')) {
    shareColor = '#' + eidtList[7].value.color
  }
  pageObj.share.color = shareColor
  pageObj.share.name = eidtList[7].value.name
  let prizeRuleListObj = prizeModel.prizeRuleList[0] || {}
  pageObj.activeInfo.goodsName = prizeRuleListObj.prizeNameSetting || ''
  pageObj.activeInfo.goodsDes = prizeRuleListObj.prizeIntro || ''
  pageObj.activeInfo.image = prizeRuleListObj.prizePic || ''
  return pageObj
}

export const formatModel = (model, eidtList, pageObj, showColor) => {
  if (model.validTimeType === 0) {
    model.time = []
    model.validTimeStart = ''
    model.validTimeEnd = ''
  }
  if (model.time.length > 0) {
    model.validTimeStart = model.time[0]
    model.validTimeEnd = model.time[1]
  }
  eidtList[0].value.headPortraitShape = pageObj.headStyle
  eidtList[1].value.pic = pageObj.bannerUrl.length > 0 ? pageObj.bannerUrl : defBanner
  eidtList[3].value.virtualFinishedCount = parseInt(pageObj.activeInfo.number)
  eidtList[3].value.btnColor = pageObj.activeInfo.getColor
  let activeItem = eidtList[3] || {}
  if (activeItem.status === 0) {
    model.prizeRuleList[0] = null
  } else {
    let prizeRuleListObj = model.prizeRuleList[0] || {}
    prizeRuleListObj.prizeNameSetting = pageObj.activeInfo.goodsName || ''
    prizeRuleListObj.prizeIntro = pageObj.activeInfo.goodsDes || ''
    prizeRuleListObj.prizePic = pageObj.activeInfo.image.length > 0 ? pageObj.activeInfo.image : defGoodsUrl
    model.prizeRuleList[0] = prizeRuleListObj
  }
  eidtList[5].value.content = pageObj.rules
  eidtList[6].value.pic = pageObj.regUrl.length > 0 ? pageObj.regUrl : defRegUrl
  eidtList[7].value.color = pageObj.share.color.replace(/#/g, '')
  eidtList[7].value.name = pageObj.share.name
  model.prizeStatus = eidtList[3].status
  model.pageDecoration = JSON.stringify(eidtList)
  model.pageColor = showColor.mainColor + ',' + showColor.bgColor + ',' + showColor.strColor
  model.nick = model.headPortrait
  return model
}

export const formatModelSave = (model, activityIntroduction, activeRules, guestCodeId, eidtList) => {
  model.activityIntroduction = activityIntroduction
  eidtList[5].value.content = activeRules
  model.pageDecoration = JSON.stringify(eidtList)
  model.guestCodeId = guestCodeId
  return model
}

export const formatPrizeModel = (result, copyGuestCodeId) => {
  let prizeModel = {}
  prizeModel = {
    prizeStatus: result.prizeStatus === 1,
    prizeRuleList: result.prizeRuleList ? result.prizeRuleList.map((item) => {
      return {
        ...item,
        addPrizeNumber: item.addPrizeNumber ? item.addPrizeNumber : 0,
        validNumber: item.prizeValidSum, // 保存回显奖品剩余数量字段不一样
        uuid: copyGuestCodeId ? null : item.uuid
      }
    }) : [],
    prizeSendPlan: result.prizeSendPlan
  }
  return prizeModel
}

// 动态组件组件
export const formatCustomComponent = (itemCode) => {
  const arr = ['HeadImg', 'Banner', 'Active', 'Rules', 'Share', 'Register']
  let setComponent
  switch (itemCode) {
    case 'masterInfo':
      setComponent = 'HeadImg'
      break
    case 'banner':
      setComponent = 'Banner'
      break
    case 'reward':
      setComponent = 'Active'
      break
    case 'activityRule':
      setComponent = 'Rules'
      break
    case 'shareButton':
      setComponent = 'Share'
      break
    case 'memberRegister':
      setComponent = 'Register'
      break
  }
  return setComponent
}
