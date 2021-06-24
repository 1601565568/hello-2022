<template>
  <div class="message_msg">
    <img v-if="rgBackground" :src='rgBackground' class='recruiting-posters__image'/>
    <div :style='{color: rgButtonTextColor, background: rgButtonColor}' class="u_btn">
      <div class="v_1">{{rgButtonText}}</div>
    </div>
    <div class="u_context">
      <span class="u_box"></span><span class="u_1">我已阅读同意</span><span class="u_text">《隐私政策》《会员规则》</span></div>
  </div>
</template>
<script>

export default {
  props: {
    // 注册页面背景图片
    rgBackground: {
      type: String
    },
    // 注册页面按钮颜色
    rgButtonColor: {
      type: String
    },
    // 注册页面按钮文案
    rgButtonText: {
      type: String
    },
    // 按钮文案颜色
    rgButtonTextColor: {
      type: String
    },
    // 隐私政策上传
    rgPrivacyPolicyUrl: {
      type: String
    },
    // 会员规则上传
    rgMemberRuleUrl: {
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
    position: relative;
    .recruiting-posters__image {
      width: 100%;
      height: 514px;
      position: absolute;
      top: 0;
    }
    .u_btn{
      width: 294.4px;
      height: 43.5px;
      line-height: 43.5px;
      text-align: center;
      position: absolute;
      border-radius: 4px;
      font-weight: 500;
      top: 406px;
      left: 12.8px;
      .v_1{
        max-width: 264px;
        margin: 0 auto;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .u_context{
      position: absolute;
      top: 463.2px;
      left: 12.8px;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      color: #595959;
      display: flex;
      align-items: center;
      .u_box{
        width: 11.65px;
        display: inline-block;
        height: 11.65px;
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        margin-right: 3.5px;
      }
      .u_text{
        color: #0094FC;
      }
      .u_1, .u_text{
        transform:scale(0.95);
      }
    }
  }
</style>
