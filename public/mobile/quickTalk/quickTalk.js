var host = 'ecrp://send?params='
var cancelParams = '{"type":-1}'
var clikBoole = true
var listCount = 0
var sgGuideExt = {
  'wxId': getPar('wxId'),
  'chatId': getPar('chatId'),
  'content': $('.searchbar__input').val().trim()
}
var quicklyWord
var isScroll = true
/**
 * 初始加载事件
 *
 */
$(function () {
  initInterface()
})
function initInterface () {
  $('#clearSecdId').hide()
  searchWord(1)
  $('#cancelSecdId').css('display', 'none')
  // 加载更多提示
  $('.downRefreshText').hide()
  $('.refresh').hide()
  // 加载菜单
  getQuickListMenu(quicklyWord)
}

/**
 * 滚动事件控制
 */
function isFunScroll (e) {
  if (e) {
    isScroll = true
    setTimeout(function () { isScroll = false }, 1000)
  } else {
    isScroll = false
    setTimeout(function () { isScroll = true }, 1000)
  }
}

/**
 * 回车 触发事件
 */
function fn () {
  $('#groupAll').click()
}

/**
 * 搜索清除图标 处理
 */
$(function () {
  $('#searchbarValue').bind('input propertychange', function () {
    var a = $('#searchbarValue').val()
    // console.log("搜索框输入值-",a)
    if (a === '') {
      $('#clearSecdId').hide()
    } else {
      // 显示清空搜索框按钮
      $('#clearSecdId').show()
    }
  })
})
// 搜索框
function searchWord (e) {
  $('#groupAll').click()
}
// 清除搜索框
function clearSearth () {
  $('.searchbar__input').val('')
  setClearSecdButtn(1)
  $('#groupAll').click()
}
/**
 * 设置清除按钮
 */
function setClearSecdButtn (e) {
  let searchbarValue = $('#searchbarValue').val()
  if (e === 1 && searchbarValue === '') {
    $('#clearSecdId').hide()
    $('.searchbar__input').val('')
  }
}
/**
 * 是否显示列表
 */
function isShowList (e) {
  if (e) {
    $('.quick__list').show()
    $('.quick__noData').hide()
  } else {
    $('.quick__list').hide()
    $('.quick__noData').show()
  }
}

/**
 * 取消发送
 */
function cancelSend () {
  window.location.href = host + cancelParams
}
function sendWord () {
  let id = $('.item__radio--selected').attr('id').replace(/[^0-9]/ig, '')
  let content = $('#word' + id).text()
  let text = content.replace(/\n/g, '%5cn')
  let url = '{"type":1,"content":"' + text + '","exit":true}'
  window.location.href = host + url
}
/**
 * 发送
 * @param e
 */
function setSendButton (e) {
  if (e === 1) {
    $('.send').css('background', '#1876FC')
    $('.send').css({ 'pointer-events': 'auto' })
  } else {
    $('.send').css('background', '#BEBFC3')
    $('.send').css({ 'pointer-events': 'none' })
  }
}

/**
 * 当前话术元素size
 * @param e
 */
function getQuickListSize () {
  // let listSize=$('.item__radio').length;
  return $('.item__radio').length
}

// 点击单选框 选中话术
function clickWord (e) {
  let thisElement = $(e)
  // 移除所有选中的样式
  if (thisElement.hasClass('item__radio--selected')) {
    thisElement.removeClass('item__radio--selected')
    setSendButton(0)
  } else {
    $('.item__radio').removeClass('item__radio--selected')
    thisElement.addClass('item__radio--selected')
    setSendButton(1)
  }
}

// 点击话术 选中单选框
function clickWordByWord (e) {
  let thisElement = $(e)
  let radioElement = $('#radioBy' + thisElement.attr('id'))
  if (radioElement.hasClass('item__radio--selected')) {
    radioElement.removeClass('item__radio--selected')
    setSendButton(0)
  } else {
    $('.item__radio').removeClass('item__radio--selected')
    radioElement.addClass('item__radio--selected')
    setSendButton(1)
  }
}

// 头部菜单点击触发
function clickEvent (e) {
  isScroll = false
  setTimeout(function () { isScroll = true }, 500)
  listCount = 0
  let thisElement = $(e)
  quicklyWord = {
    wordGroupId: thisElement.attr('id'),
    wxId: sgGuideExt.wxId,
    wordContent: $('#searchbarValue').val().trim(),
    start: 0
  }
  // 先切换顶部菜单 样式
  $('.tabs__pane').removeClass('tabs__pane--selected')
  thisElement.addClass('tabs__pane--selected')
  // 清空话术列表
  $('.quick__list').empty()
  setSendButton(0)
  if ($('.item__text').length === 0) {
    getQuickList(quicklyWord)
  }
}
// 获取集团id下的所有话术类别 并显示
function getQuickListMenu (sgGuideExt) {
  $.ajax({
    url: backstageURL() + '/quicklyword/findQuicklyWordGroupListByBrandId',
    type: 'post',
    dataType: 'JSON',
    data: JSON.stringify(sgGuideExt),
    cache: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (result) {
      if (result.result.length > 0) {
        // value数组中的当前项, index当前项的索引, array原始数组
        result.result.forEach((item, index, array) => {
          $('.tabs').append('<div id=' + item.id + "  class='tabs__pane' onClick='clickEvent(this)'>" + item.name + '</div>')
        })
      }
    },
    error: function (result) {
      isShowList(false)
    }
  })
}
function codeCompile (str) {
  return str.replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] })
}
// 获取分页数据
function getQuickList (quicklyWord) {
  // debugger
  isFunScroll(false)
  if (quicklyWord.start === 0) {
    $('.quick__list').empty()
  }
  // 获取对应分组下的话术
  $.ajax({
    url: backstageURL() + '/quicklyword/findQuicklyWordListByWordGroupId',
    type: 'post',
    dataType: 'JSON',
    data: JSON.stringify(quicklyWord),
    cache: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (result) {
      let resultSize = result.result.length
      if (resultSize > 0) {
        result.result.forEach((item, index, array) => {
          if (item !== '') {
            $('.quick__list').append("<div class='item'>" +
              "<div class='item__radio' id='radioByword" + item.id + "' onclick='clickWord(this)'></div>" +
              "<div class='item__text' id='word" + item.id + "'onclick='clickWordByWord(this)'> <pre style='font-size: 14px; white-space: pre-wrap; color:rgb(38, 38, 38);font-family: Microsoft YaHei'>" + codeCompile(item.content) + '</pre></div></div>')
          }
        })
        isShowList(true)
        isFunScroll(false)
      }
      if (resultSize <= 0) {
        isScroll = false
        if (getQuickListSize() > 0) {
          isShowList(true)
          controlLoad('暂无您要找的快捷话术')
        } else {
          isShowList(false)
        }
      }
    },
    error: function (result) {
      isShowList(false)
    }
  })
}

/**
 * 移动端H5页面底部菜单被手机键盘顶起来问题
 */
// 浏览器当前的高度
var oHeight = $(document).height()
$(window).resize(function () {
  // console.log('浏览器高度发生变化')
  if ($(document).height() < oHeight) {
    $('.quick__btn').css('position', 'static')
  } else {
    $('.quick__btn').css('position', 'fixed')
  }
})
/**
 * 分页部分开始
 *  // var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    // var scrollHeight = document.documentElement.scrollHeight;
   // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
   // var scrollTop =document.documentElement.scrollTop ;
   // var scrollTop =$('body').scrollTop()+$('html').scrollTop();
  // var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
  // var clientHeight = document.documentElement.clientHeight;
 *
 */
/**
 * 加载更多 提示信息控制
 */
function controlLoad (text) {
  $('.downRefreshText').show().text(text)
  setTimeout(function () { $('.downRefreshText').hide() }, 800)
}

/**
 * 刷新列表 提示信息控制
 */
function controlRefres (text) {
  $('.refresh').text(text).show()
  setTimeout(function () { $('.refresh').hide() }, 300)
}
// 滑动事件
$(window).scroll(function () {
  // 文档内容实际高度（包括超出视窗的溢出部分） 当前页面的高度
  var scrollHeight = $(document).height()
  // 滚动条距离顶部的 高度
  var scrollTop = $(this).scrollTop()
  // 可视页面的高度
  var clientHeight = $(this).height()
  // debugger
  if (scrollTop + clientHeight >= scrollHeight - 1) {
    if (isScroll) {
      controlLoad('加载更多')
      quicklyWord.start = quicklyWord.start + 10
      // console.log("加载更多方法执行=>", 'scrollHeight', scrollHeight, 'scrollTop', scrollTop, 'clientHeight', clientHeight)
      getQuickList(quicklyWord)
    }
  }
  if (scrollTop === 0) {
    if (isScroll) {
      controlRefres('刷新列表')
      // console.log("刷新方法执行=>", 'scrollHeight', scrollHeight, 'scrollTop', scrollTop, 'clientHeight', clientHeight)
      quicklyWord.start = 0
      getQuickList(quicklyWord)
    }
  }
})
/**
 * 分页部分结束
 */
