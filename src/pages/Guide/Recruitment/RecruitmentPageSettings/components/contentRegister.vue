<template>
  <div class="message_msg">
    <img :src='registerPostersImage' class='recruiting-posters__image'/>
    <div class="background_title"></div>
  </div>
</template>
<script>

export default {
  props: {
    // 注册页面背景图片
    registerPostersImage: {
      type: String
    },
    // 注册页面按钮颜色
    registerColor: {
      type: String
    },
    // 注册页面按钮文案
    registerText: {
      type: String
    },
    // 按钮文案颜色
    registerTxtColor: {
      type: String
    },
    // 隐私政策上传
    registerConceal: {
      type: String
    },
    // 会员规则上传
    registerRule: {
      type: String
    }
  },
  data () {
    return {
      // 头像
    }
  }
}
</script>

<style scoped lang='scss'>
  .message_msg{
    .recruiting-posters__image {
      width: 100%;
      height: 514px;
    }
  }
</style>
