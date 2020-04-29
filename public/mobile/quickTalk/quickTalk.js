
  var host = "ecrp://send?params=";
  var cancelParams = '{"type":-1}';
  var sgGuideExt={
    "wxId": getPar('wxId'),
    "chatId": getPar('chatId'),
    "content":$('.searchbar__input').val().trim()
  };
  window.onload = function () {
    $('.searchbar__input').change();
    $('.send').css("background","#BEBFC3");
    $(".send").css({"pointer-events": "none" });
    getQuickListMenu(sgGuideExt);
  };
  //交互协议

  /*
   *发送消息
   *var content = '{"type":1,"content":"文本内容","exit":true}'
   *window.location.href =host+content
   */
  function sendWord(){
    let id=$('.item__radio--selected').attr('id').replace(/[^0-9]/ig,'');
    let content=$('#word'+id).text();
    let url = '{"type":1,"content":"'+content+'","exit":true}';
    console.log("提交路径==》"+host+url);
    window.location.href =host+url
  }
   /*
    取消发送
   */
   function cancelSend() {
     window.location.href = host+cancelParams
     console.log("取消发送=》"+host+cancelParams)
   }

   // 搜索框
   function searchWord(e) {
      let searchElement=$(e);
      $('#groupAll').click();
   }
   // 清除搜索框
   function clearSearth() {
     $('.searchbar__input').val('');
     $('#groupAll').click();
   }
   // 点击单选框 选中话术
  function clickWord(e) {
      $('.send').css("background","#1876FC");
      $(".send").css({"pointer-events": "auto" });
      let thisElement=$(e);
      // 移除所有选中的样式
      if(thisElement.hasClass('item__radio--selected')){
         thisElement.removeClass('item__radio--selected')
      }else{
         $('.item__radio').removeClass("item__radio--selected");
         thisElement.addClass("item__radio--selected");
      }
  }
  // 点击话术 选中单选框
  function clickWordByWord (e) {
     $('.send').css("background","#1876FC");
     $(".send").css({"pointer-events": "auto" });
     let thisElement=$(e);
     let radioElement=$('#radioBy'+thisElement.attr('id'));
     if(radioElement.hasClass('item__radio--selected')){
       radioElement.removeClass('item__radio--selected')
     }else{
       $('.item__radio').removeClass("item__radio--selected");
       radioElement.addClass("item__radio--selected");
     }
  }
   // 头部菜单点击触发
   function clickEvent(e) {
     let thisElement=$(e);
     let quicklyWord={
       wordGroupId:thisElement.attr('id'),
       wxId: sgGuideExt.wxId,
       wordContent:$('.searchbar__input').val().trim()
     };
     // 先切换顶部菜单 样式
     $('.tabs__pane').removeClass("tabs__pane--selected");
     thisElement.addClass("tabs__pane--selected");
     // 清空话术列表
     $('.quick__list').empty();
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
             // value数组中的当前项, index当前项的索引, array原始数组
             result.result.forEach((item,index,array)=>{
               $('.quick__list').show();
               $('.quick__noData').hide();
               $('.quick__list').append("<div class='item'>" +
                                           "<div class='item__radio' id='radioByword"+item.id+"' onclick='clickWord(this)'></div>" +
                                           "<div class='item__text' id='word"+item.id+"' onclick='clickWordByWord(this)'>"+item.content+" </div> " +
                                         "</div>");
           }) }else{
             $('.quick__list').hide();
             $('.quick__noData').show();
           }
       },
       error: function (result) {
         $('.quick__list').hide();
         $('.quick__noData').show();
       }
     })
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
