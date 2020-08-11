<template>
  <div>
    <el-popover
      ref="popoverRef"
      placement="right"
      width="200"
      trigger="click"
    >
      <div class="analysis-popover">
        <div class="analysis-popover__title">{{ name }}</div>
        <div class="analysis-popover__item">
          <span>工号</span>
          <span>{{ workId ? workId : '-' }}</span>
        </div>
        <div class="analysis-popover__item">
          <span>手机</span>
          <span>{{ phoneNum }}</span>
        </div>
        <div class="analysis-popover__item">
          <span>微信</span>
          <span>{{ wxNick }}({{ wxAccount }})</span>
        </div>
      </div>
    </el-popover>
    <span v-popover:popoverRef class="analysis-content" @click="getData">
      <span>{{detail.name || '-'}}</span>
      <Icon type="begin"/>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      phoneNum: '-',
      wxNick: '-',
      wxAccount: '-',
      name: null,
      workId: null,
      popData: {}
    }
  },
  methods: {
    getData () {
      this.name = this.detail.name
      this.workId = this.detail.workId
      this.$http.fetch(this.$api.guide.sgGuideActivityAnalysis.getGuideMsg, { guideId: this.detail.guideId })
        .then(resp => {
          let wxMsg = resp.result
          this.phoneNum = wxMsg.mobile === null ? '-' : wxMsg.mobile
          this.wxNick = wxMsg.weChatNick === null ? '-' : wxMsg.weChatNick
          this.wxAccount = wxMsg.weChatNum === null ? '-' : wxMsg.weChatNum
        }).catch(resp => {
          this.$notify.error('查询失败', resp)
        })
    }
  }
}
</script>
<style scoped>
@component-namespace analysis{
  @b popover {
    padding: 5px 10px;
    font-size: 12px;
    color: #303133;
    line-height: 20px;
    @e title {
      margin-bottom: 10px;
    }
    @e item {
      margin-top: 5px;
      span:first-child {
        margin-right: 15px;
        color: #606266;
      }
    }
  }
  @b content {
    cursor: pointer;
    font-size: 12px;
    line-height: 20px;
    svg {
      margin-left: 5px;
      color: #909399;
    }
  }
}
</style>
