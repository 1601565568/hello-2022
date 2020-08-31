<template>
  <div class="tab-wrapper">
    <div v-if="analysisType === 1" class="tab-content">
      <span>联系概况</span>
      <el-tooltip v-model="visible" placement="right-start" popper-class="table-body__tooltip" enterable manual>
        <div slot="content" class="tab-content__text">
          <p><strong>特别说明：</strong>若登录多个微信，则统计多个微信的数据总和。</p>
          <p><strong>新增好友数：</strong>筛选周期内，导购登录导购工作台，使用微信期间，新增的好友数(包含主动和被动添加)。</p>
          <p><strong>新增会员数：</strong>筛选周期内，导购登录导购工作台，使用微信期间，好友注册成为会员的数量。</p>
          <p><strong>发朋友圈数：</strong>筛选周期内，导购登录导购工作台，使用微信期间，发送朋友圈的数量。</p>
          <p><strong>主动会话数：</strong>前2小时内无任何会话数据，由导购主动发起的会话数。(自然日凌晨导购发起会话也计算为一次会话)。</p>
          <p><strong>客户回复：</strong>导购主动发起，以导购最后一条消息时间计算，2小时内收到客户回复的会话数。</p>
          <p><strong>客户回复率：</strong>客户回复/主动会话数x100%</p>
          <p><strong>客户发起会话数：</strong>前2小时内无任何会话数据，由客户主动发起的会话数。(自然日凌晨客户发起会话也计算为一次会话)。</p>
          <p><strong>响应数：</strong>客户主动发起，以客户最后一条消息时间计算，2小时内导购完成回复响应的会话数</p>
          <p><strong>未回复客户数：</strong>客户主动发起，以客户最后一条消息时间计算，2小时内导购未进行回复响应的会话数</p>
          <p><strong>平均首次响应时长：</strong>客户主动发起后，以客户第一条消息时间计算，导购在2h内首次回复的时长间隔为首次响应时长，所有会话的首次响应总时长/已响应会话数即为平均首次响应时长</p>
        </div>
        <Icon type="question-circle" @click="toggleVisble"/>
      </el-tooltip>
    </div>
    <div v-if="analysisType === 2" class="tab-content">
      <span>会员统计</span>
      <el-tooltip v-model="visible" placement="right-start" popper-class="table-body__tooltip" enterable manual>
        <div slot="content" class="tab-content__text">
          <p><strong>特别说明：</strong>若登录多个微信，则统计多个微信的数据总和。</p>
          <p><strong>招募会员总数：</strong>统计招募导购为当前导购且招募门店为当前门店的会员总数(导购工作门店为多门店时，会显示多条数据)。</p>
          <p><strong>个号招募数：</strong>导购通过好友欢迎语、发送招募链接招募的会员数。(招募时间为筛选周期，并且招募导购、招募门店为当前导购和门店。)</p>
          <p><strong>个号招募比例：</strong>个号招募数/招募会员总数x100%</p>
        </div>
        <Icon type="question-circle" @click="toggleVisble"/>
      </el-tooltip>
    </div>
    <div v-if="analysisType === 3" class="tab-content">
      <span>销售概览</span>
      <el-tooltip v-model="visible" placement="right-start" popper-class="table-body__tooltip" enterable manual>
        <div slot="content" class="tab-content__text">
          <p><strong>特别说明：</strong>订单数据范围为订单中成单导购为当前导购、成单导购门店为当前门店的全渠道订单。</p>
          <p><strong>订单总金额：</strong>以付款时间为准，全渠道订单中下单且付款的订单总金额。</p>
          <p><strong>订单笔数：</strong>以付款时间为准，全渠道订单中下单且付款的订单笔数。</p>
          <p><strong>每笔单价：</strong>订单总金额/订单笔数。</p>
          <p><strong>购买人数：</strong>以付款时间为准，全渠道订单中下单且付款的人数，同一个客户购买多次仅计算为1人。</p>
          <p><strong>客单价：</strong>订单总金额/购买人数。</p>
          <p><strong>购买好友数：</strong>以付款时间为准，筛选时间周期内，下单且付款的好友数。</p>
          <p><strong>平均好友购买率：</strong>购买好友数/全部好友数量为好友购买率。若导购登录多个微信号，则为好友购买率和/微信号数。</p>
        </div>
        <Icon type="question-circle" @click="toggleVisble"/>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    analysisType: Number
  },
  data () {
    return {
      visible: false,
      global: false
    }
  },
  mounted () {
    window.addEventListener('click', this.hide)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.hide)
  },
  methods: {
    toggleVisble (e) {
      this.visible = !this.visible
      this.global = true
      document.body.click()
      e.stopPropagation()
    },
    hide () {
      if (!this.global) {
        this.visible = false
      }
      this.global = false
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace tab {
    @b wrapper {
      position: relative;
    }
    @b content {
      > svg {
        position: absolute;
        height: 30px;
        right: -16px;
        font-size: var(--default-font-size-small);
        /* color: var(--theme-font-color-primary) */
      }
      @e text {
        line-height: var(--default-font-line-height);
        p + p {
          margin-top: var(--default-margin-small);
        }
      }
    }
  }
</style>
