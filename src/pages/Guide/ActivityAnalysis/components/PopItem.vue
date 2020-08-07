<template>
  <div>
    <el-popover
      ref="popoverRef"
      placement="right"
      width="200"
      trigger="click"
    >
      <div class="analysis-popover">
        <div class="analysis-popover__title">吴俊涵</div>
        <div class="analysis-popover__item">
          <span>工号</span>
          <span>0610006871</span>
        </div>
        <div class="analysis-popover__item">
          <span>手机</span>
          <span>18765492809</span>
        </div>
        <div class="analysis-popover__item">
          <span>微信</span>
          <span>sfsfa(26333533142)</span>
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
      popData: {}
    }
  },
  methods: {
    getData () {
      console.log('这里请求接口赋值给this.popData')
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
