window.onload = function () {
  var rolldate = new Rolldate({
    el: '#editDate',
    format: 'YYYY-MM-DD',
    beginYear: 2000,
    endYear: 2100,
    lang: {
      year: '',
      month: '',
      day: '',
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
