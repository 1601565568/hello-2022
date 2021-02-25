<template>
  <div class="data-card" :style="{ background: color }">
    <div class="title">
      <span>{{ title }}</span>
      <el-tooltip class="help" :content="tip">
        <Icon type="ns-help"/>
      </el-tooltip>
    </div>
    <div class="count">
      <!-- <el-countup
        v-if="typeof count === 'number'"
        :start="0"
        :end="count"
        :duration="1.5"
      />
      <span v-else>{{count}}</span> -->
      <span>{{count}}</span>
    </div>
  </div>
</template>

<script>
// import ElCountup from '@nascent/nui/lib/countup'
/**
 * 数据卡片
 */
export default {
  // components: {
  //   ElCountup
  // },
  props: [ 'title', 'tip', 'count', 'color' ]
}
</script>

<style lang="scss" scoped>
.data-card {
  flex-grow: 1;
  min-width: 135px;
  margin: 0 8px;
  height: 120px;
  text-align: center;
  color: #FFFFFF;
  border-radius: 4px;
  // background-image: linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%);
  .title {
    margin-top: 27px;
    margin-left: 8px;
    font-size: 16px;
    position: relative;
    .help {
      margin-left: 8px;
    }
  }

  .count {
    font-size: 24px;
    line-height: 32px;
  }
}
</style>
