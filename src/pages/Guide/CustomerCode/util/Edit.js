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
  pageObj.share.color = eidtList[7].value.color
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
    model.validTimeStart = this.model.time[0]
    model.validTimeEnd = this.model.time[1]
  }
  eidtList[0].value.headPortraitShape = pageObj.headStyle
  eidtList[1].value.pic = pageObj.bannerUrl
  eidtList[3].value.virtualFinishedCount = parseInt(pageObj.activeInfo.number)
  eidtList[3].value.btnColor = pageObj.activeInfo.getColor
  let prizeRuleListObj = model.prizeRuleList[0] || {}
  prizeRuleListObj.prizeNameSetting = pageObj.activeInfo.goodsName || ''
  prizeRuleListObj.prizeIntro = pageObj.activeInfo.goodsDes || ''
  prizeRuleListObj.prizePic = pageObj.activeInfo.image || ''
  model.prizeRuleList[0] = prizeRuleListObj
  eidtList[5].value.content = pageObj.rules
  eidtList[6].value.pic = pageObj.regUrl
  eidtList[7].value.color = pageObj.share.color
  eidtList[7].value.name = pageObj.share.name
  model.prizeStatus = eidtList[3].status
  model.pageDecoration = JSON.stringify(eidtList)
  model.pageColor = showColor.mainColor + ',' + showColor.bgColor + ',' + showColor.strColor
  return model
}
