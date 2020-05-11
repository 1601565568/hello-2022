
  var host = "ecrp://send?params=";
  var cancelParams = '{"type":-1}';
  var sgGuideExt={
    "wxId": getPar('wxId'),
    "chatId": getPar('chatId'),
    "content":$('.searchbar__input').val().trim()
  };
  var quicklyWord;
  var isScroll=true;
    window.onload = function () {
     searchWord(1);
    //$('.searchbar__input').onkeyup();
    $('#cancelSecdId').css('display','none')
    $('.send').css("background","#BEBFC3");
    $(".send").css({"pointer-events": "none" });
    getQuickListMenu(sgGuideExt);
    //加载更多提示
    $('.downRefreshText').hide();
    $('.refresh').hide()
    // //监听回车键
    // $("form").submit(function(e){
    //   //let searchbarValue=$('#searchbarValue').val();
    //   console.log("submit事件触发")
    //   $('#groupAll').click();
    // });
  };
  /*
   * 发送消息
   * //交互协议
   * var content = '{"type":1,"content":"文本内容","exit":true}'
   * window.location.href =host+content
   */
  function sendWord(){
    let id=$('.item__radio--selected').attr('id').replace(/[^0-9]/ig,'');
    let content=$('#word'+id).text();
    let url = '{"type":1,"content":"'+content+'","exit":true}';
    console.log("提交路径==》"+host+url);
    window.location.href =host+url;
  }
   /*
    取消发送
   */
   function cancelSend() {
     window.location.href = host+cancelParams;
     console.log("取消发送=》"+host+cancelParams)
   }
   //设置清除按钮
   function setClearSecdButtn(e) {
     let searchbarValue=$('#searchbarValue').val();
     if(e==0){
       //显示清空搜索框按钮
       $('#clearSecdId').show();
       return;
     }
     if(e==1&&searchbarValue==''){
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
  function setSendButton(e){
      // let pointerEvents=$(".send").css("pointer-events");
      // console.log("pointerEvents=>"+pointerEvents)
      if(e==1){
        $('.send').css("background","#1876FC");
        $(".send").css({"pointer-events": "auto" });
      }else {
        $('.send').css("background","#BEBFC3");
        $(".send").css({"pointer-events": "none" });
      }

  }
   // 点击单选框 选中话术
  function clickWord(e) {
      let thisElement=$(e);
      // 移除所有选中的样式
      if(thisElement.hasClass('item__radio--selected')){
         thisElement.removeClass('item__radio--selected');
        setSendButton(0);
      }else{
         $('.item__radio').removeClass("item__radio--selected");
         thisElement.addClass("item__radio--selected");
        setSendButton(1);
      }
  }
  // 点击话术 选中单选框
    function clickWordByWord (e) {
       let thisElement=$(e);
       let radioElement=$('#radioBy'+thisElement.attr('id'));
       if(radioElement.hasClass('item__radio--selected')){
         radioElement.removeClass('item__radio--selected')
         setSendButton(0);
       }else{
         $('.item__radio').removeClass("item__radio--selected");
         radioElement.addClass("item__radio--selected");
         setSendButton(1);
       }
    }
   // 头部菜单点击触发
   function clickEvent(e) {
     $('.quick__list').empty();
     let thisElement=$(e);
     quicklyWord={
       wordGroupId:thisElement.attr('id'),
       wxId: sgGuideExt.wxId,
       wordContent:$('#searchbarValue').val().trim(),
       start:0
     };
     // 先切换顶部菜单 样式
     $('.tabs__pane').removeClass("tabs__pane--selected");
     thisElement.addClass("tabs__pane--selected");
     // 清空话术列表
     $('.quick__list').empty();
     setSendButton(0)
     if($('.item__text').length==0){
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
        if(result.result.length>0){
          // value数组中的当前项, index当前项的索引, array原始数组
          result.result.forEach((item,index,array)=>{
            $('.quick__list').show();
            $('.quick__noData').hide();
            $('.tabs').append("<div id="+item.id+"  class='tabs__pane' onClick='clickEvent(this)'>"+item.name+"</div>");
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
     if(quicklyWord.start==0){
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
         if(result.result.length>0){
           console.log("此次数据长度=》"+result.result.length)
           $('.quick__list').show();
           $('.quick__noData').hide();
           // // value数组中的当前项, index当前项的索引, array原始数组
           console.log("此次数据长度=》"+result.result.length)
           result.result.forEach((item,index,array)=>{
             if(item !== ''){
               $('.quick__list').append("<div class='item'>" +
                 "<div class='item__radio' id='radioByword"+item.id+"' onclick='clickWord(this)'></div>" +
                 "<div class='item__text' id='word"+item.id+"' onclick='clickWordByWord(this)'> </div> " +
                 "</div>");
               $('#word'+item.id).text(item.content.toString());
             }
           });
           isScroll=true;
         }
         if(result.result.length==0){
           var idArr=$('.item__text');
           isScroll=false;
           $('.downRefreshText').show().text('暂无您要找的快捷话术');
           setTimeout(function () { $('.downRefreshText').hide()}, 500);
           if(idArr.length<=0){
             $('.quick__list').hide();
             $('.downRefreshText').hide();
             setTimeout(function () { $('.quick__noData').show(); }, 1000);
            }
           }
       },
       error: function (result) {
         $('.quick__list').hide();
         $('.quick__noData').show();
       }
     })
   }
   // 构建话术列表
   //  function setQuickList(param) {
   //        return param;
   //  }

  function fn() {
    $('#groupAll').click();
  }
      /**
       * 移动端H5页面底部菜单被手机键盘顶起来问题
       */
      //浏览器当前的高度
      var oHeight = $(document).height();
      $(window).resize(function(){
        if($(document).height() < oHeight){
          $(".quick__btn").css("position","static");
        }else{
          $(".quick__btn").css("position","fixed");
        }
      });
    /**
     * 分页部分开始
     */
    // 滑动事件
    $(window).scroll(function(){
        // 文档内容实际高度（包括超出视窗的溢出部分）
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        // var scrollHeight = document.documentElement.scrollHeight;
        //滚动条滚动距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
       // var scrollTop =document.documentElement.scrollTop ;
        //窗口可视范围高度
        var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
        if (clientHeight + scrollTop >= scrollHeight) {
          // console.log("scrollHeight=>",scrollHeight)
          if(isScroll){
            //e.css('display','block')
            $('.downRefreshText').show().text('加载更多');
            setTimeout(function () { $('.downRefreshText').hide() }, 500);
            quicklyWord.start=quicklyWord.start+10;
            console.log("scrollHeight=>",scrollHeight)
            getQuickList(quicklyWord);
          }
          //  else {
          //   $('.downRefreshText').show().text('暂无您要找的快捷话术');
          //   setTimeout(function () { $('.downRefreshText').hide()}, 500);
          // }
        }
        if(scrollTop==0){
          console.log("文档内容实际高度   scrollHeight=>", document.documentElement.scrollHeight)
          console.log("滚动条滚动距离     scrollTop=>", document.documentElement.scrollTop)
          console.log("窗口可视范围高度   clientHeight=>", document.documentElement.clientHeight)
          quicklyWord.start=0;
          getQuickList(quicklyWord);
          //$('.refresh').css('display','block')
          $('.refresh').text('加载更多').show()
          setTimeout(function () {  $('.refresh').hide()}, 500);
          }
    });

// $(function () {
//   console.log("文档内容实际高度   scrollHeight=>", document.documentElement.scrollHeight)
//   console.log("滚动条滚动距离     scrollTop=>", document.documentElement.scrollTop)
//   console.log("窗口可视范围高度   clientHeight=>", document.documentElement.clientHeight)
//   // //document.documentElement.scrollTop=100;
//   // $('window').scrollLeft(100);
//   // console.log("scrollTop=>", document.documentElement.scrollTop)
// })
  /**
   * 分页部分结束
   */
