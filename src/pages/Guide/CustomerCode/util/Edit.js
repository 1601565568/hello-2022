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
