window.onload = function () {
  var rolldate = new Rolldate({
    el: '#editDate',
    // 年月日 时分秒
    format: 'YYYY-MM-DD hh-mm-ss',
    beginYear: 2000,
    endYear: 2100,
    lang: {
      year: '',
      month: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
      confirm: '确定',
      title: '第一次购物时间'
    },
    confirm: function (date) {
      rolldate.hide()
      return false
    }
  })

  $('.tag-details__edit').click(function () {
    $('.float-layout').removeClass('hidden')
  })
  $('.float-layout__save').click(function () {
    $('.float-layout').addClass('hidden')
  })
  $('.float-layout__mask').click(function () {
    $('.float-layout').addClass('hidden')
  })
}
