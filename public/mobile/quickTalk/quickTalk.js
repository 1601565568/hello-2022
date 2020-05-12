var host = "ecrp://send?params=";
var cancelParams = '{"type":-1}';
var clikBoole = true;
var listCount = 0;
var sgGuideExt = {
  "wxId": getPar('wxId'),
  "chatId": getPar('chatId'),
  "content": $('.searchbar__input').val().trim()
};
var quicklyWord;
var isScroll = true;
window.onload = function () {
  window.scrollTo(document.body.scrollWidth, 500);
  searchWord(1);
  $('#cancelSecdId').css('display', 'none')
  $('.send').css("background", "#BEBFC3");
  $(".send").css({"pointer-events": "none"});
  getQuickListMenu(sgGuideExt);
  //加载更多提示
  $('.downRefreshText').hide();
  $('.refresh').hide();
};

function sendWord() {
  let id = $('.item__radio--selected').attr('id').replace(/[^0-9]/ig, '');
  let content = $('#word' + id).text();
  let url = '{"type":1,"content":"' + content + '","exit":true}';
  console.log("提交路径==》" + host + url);
  window.location.href = host + url;
}

/*
 取消发送
*/
function cancelSend() {
  window.location.href = host + cancelParams;
}

//设置清除按钮
function setClearSecdButtn(e) {
  let searchbarValue = $('#searchbarValue').val();
  if (e == 0) {
    //显示清空搜索框按钮
    $('#clearSecdId').show();
    return;
  }
  if (e == 1 && searchbarValue == '') {
    $('#clearSecdId').hide();
    $('.searchbar__input').val('');
    return;
  }
}
// 搜索框
function searchWord(e) {
  $('#groupAll').click();
}

// 清除搜索框
function clearSearth() {
  $('.searchbar__input').val('');
  setClearSecdButtn(1);
  $('#groupAll').click();
}

// 处理发送按钮
function setSendButton(e) {
  if (e == 1) {
    $('.send').css("background", "#1876FC");
    $(".send").css({"pointer-events": "auto"});
  } else {
    $('.send').css("background", "#BEBFC3");
    $(".send").css({"pointer-events": "none"});
  }
}

// 点击单选框 选中话术
function clickWord(e) {
  let thisElement = $(e);
  // 移除所有选中的样式
  if (thisElement.hasClass('item__radio--selected')) {
    thisElement.removeClass('item__radio--selected');
    setSendButton(0);
  } else {
    $('.item__radio').removeClass("item__radio--selected");
    thisElement.addClass("item__radio--selected");
    setSendButton(1);
  }
}

// 点击话术 选中单选框
function clickWordByWord(e) {
  let thisElement = $(e);
  let radioElement = $('#radioBy' + thisElement.attr('id'));
  if (radioElement.hasClass('item__radio--selected')) {
    radioElement.removeClass('item__radio--selected')
    setSendButton(0);
  } else {
    $('.item__radio').removeClass("item__radio--selected");
    radioElement.addClass("item__radio--selected");
    setSendButton(1);
  }
}

// 头部菜单点击触发
function clickEvent(e) {
  isScroll = false;
  setTimeout(function () { isScroll = true;}, 500)
  let thisE = $(e);
  listCount = 0;
  let thisElement = $(e);
  quicklyWord = {
    wordGroupId: thisElement.attr('id'),
    wxId: sgGuideExt.wxId,
    wordContent: $('#searchbarValue').val().trim(),
    start: 0
  };
  // 先切换顶部菜单 样式
  $('.tabs__pane').removeClass("tabs__pane--selected");
  thisElement.addClass("tabs__pane--selected");
  // 清空话术列表
  $('.quick__list').empty();
  setSendButton(0)
  if ($('.item__text').length == 0) {
    getQuickList(quicklyWord)
  }
}

// 获取集团id下的所有话术类别 并显示
function getQuickListMenu(sgGuideExt) {
  $.ajax({
    url: backstageURL() + '/quicklyword/findQuicklyWordGroupListByBrandId',
    type: "post",
    dataType: 'JSON',
    data: JSON.stringify(sgGuideExt),
    cache: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (result) {
      if (result.result.length > 0) {
        // value数组中的当前项, index当前项的索引, array原始数组
        result.result.forEach((item, index, array) => {
          $('.quick__list').show();
          $('.quick__noData').hide();
          $('.tabs').append("<div id=" + item.id + "  class='tabs__pane' onClick='clickEvent(this)'>" + item.name + "</div>");
          // $('.tabs').append("<div id="+item.id+"  class='tabs__pane'>"+item.name+"</div>");
        })
      }
    },
    error: function (result) {
      $('.quick__list').hide();
      $('.quick__noData').show();
    }
  })
}

// 获取分页数据
function getQuickList(quicklyWord) {
  isScroll = false;
  if (quicklyWord.start == 0) {
    $('.quick__list').empty();
  }
  // 获取对应分组下的话术
  $.ajax({
    url: backstageURL() + '/quicklyword/findQuicklyWordListByWordGroupId',
    type: "post",
    dataType: 'JSON',
    data: JSON.stringify(quicklyWord),
    cache: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (result) {
      if (result.result.length > 0) {
        // // value数组中的当前项, index当前项的索引, array原始数组
        console.log('请求后台数据', "数据长度=》", result.result.length)
        result.result.forEach((item, index, array) => {
          if (item !== '') {
            $('.quick__list').append("<div class='item'>" +
              "<div class='item__radio' id='radioByword" + item.id + "' onclick='clickWord(this)'></div>" +
              "<div class='item__text' id='word" + item.id + "' onclick='clickWordByWord(this)'> </div> " +
              "</div>");
            $('#word' + item.id).text(item.content);
          }
        });
        $('.quick__noData').hide();
        $('.quick__list').show();
        setTimeout(function () {isScroll=true},1000)
      }
      if (result.result.length == 0) {
        var idArr = $('.item__text');
        setTimeout(function () {isScroll=true},1000)
        if (idArr.length <= 0) {
          setTimeout(function () {$('.quick__noData').show();}, 500);
          $('.quick__list').hide();
          $('.downRefreshText').hide();
        }
      }
    },
    error: function (result) {
      $('.quick__list').hide();
      $('.quick__noData').show();
    }
  })
}
function fn() {
  $('#groupAll').click();
}

/**
 * 移动端H5页面底部菜单被手机键盘顶起来问题
 */
  //浏览器当前的高度
var oHeight = $(document).height();
$(window).resize(function () {
  console.log('浏览器高度发生变化')
  if ($(document).height() < oHeight) {
    $(".quick__btn").css("position", "static");
  } else {
    $(".quick__btn").css("position", "fixed");
  }
});
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
// 滑动事件
  $(window).scroll(function () {
    // 文档内容实际高度（包括超出视窗的溢出部分） 当前页面的高度
    var scrollHeight = $(document).height();
    // 滚动条距离顶部的 高度
    var scrollTop = $(this).scrollTop();
    // 可视页面的高度
    var clientHeight = $(this).height();
    // debugger
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      $('.downRefreshText').show().text('加载更多');
      setTimeout(function () { $('.downRefreshText').hide()}, 500);
      if (isScroll) {
        quicklyWord.start = quicklyWord.start + 10;
        console.log("加载更多方法执行=>", 'scrollHeight', scrollHeight, 'scrollTop', scrollTop, 'clientHeight', clientHeight)
        getQuickList(quicklyWord);
      }
    }
    if (scrollTop == 0) {
      $('.refresh').text('刷新列表').show()
      setTimeout(function () { $('.refresh').hide()}, 300);
      if (isScroll) {
        console.log("刷新方法执行=>", 'scrollHeight', scrollHeight, 'scrollTop', scrollTop, 'clientHeight', clientHeight)
        quicklyWord.start = 0;
        getQuickList(quicklyWord);
      }
    }
 });
/**
 * 分页部分结束
 * $(function () {
  console.log("文档内容实际高度   scrollHeight=>", document.documentElement.scrollHeight)
  console.log("滚动条滚动距离     scrollTop=>", document.documentElement.scrollTop)
  console.log("窗口可视范围高度   clientHeight=>", document.documentElement.clientHeight)
  // //document.documentElement.scrollTop=100;
  // $('window').scrollLeft(100);
  // console.log("scrollTop=>", document.documentElement.scrollTop)
})
 *
 *
 */
