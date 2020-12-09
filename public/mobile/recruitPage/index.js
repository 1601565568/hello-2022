var app = {
  originWidth: 320, // 后台定义宽度
  windowWidth: null, // 页面宽度
  resultData: {
    mpFollowBackground: null, // 会员招募>跳转关注公众号>结果页>背景图片
    mpFollowQrcodeSize: null, // 会员招募>跳转关注公众号>结果页>二维码大小
    mpFollowQrcodeX: null, // 会员招募>跳转关注公众号>结果页>二维码X坐标
    mpFollowQrcodeY: null, // 会员招募>跳转关注公众号>结果页>二维码Y坐标
    qrCode: null
  }, // 原始数据
  init: function () {
    var originData = localStorage.getItem('recruitData')
    this.resultData = JSON.parse(originData)
    this.windowWidth = document.documentElement.clientWidth
    this.setCalcData()
  },
  // 根据手机屏幕宽度重新计算数据
  setCalcData: function () {
    var originData = this.resultData
    var scale = this.windowWidth / this.originWidth
    var data = Object.assign({}, this.resultData, {
      mpFollowQrcodeSize: originData.mpFollowQrcodeSize * scale,
      mpFollowQrcodeX: originData.mpFollowQrcodeX * scale,
      mpFollowQrcodeY: originData.mpFollowQrcodeY * scale
    })
    this.setTemplate(data)
  },
  // 组装数据
  setTemplate: function (data) {
    var template = `
        <div class='img-container'>
          <img src='${data.mpFollowBackground}' class='background-image'/>
          <img src='${data.qrCode}' class='qrcode-image' style='width:${data.mpFollowQrcodeSize}px;height:${data.mpFollowQrcodeSize}px;left:${data.mpFollowQrcodeX}px;top:${data.mpFollowQrcodeY}px' />
        </div>
    `
    this.render(template)
  },
  // 渲染
  render: function (template) {
    var app = document.getElementById('appContainer')
    app.innerHTML = template
  }
}
window.onload = app.init()
