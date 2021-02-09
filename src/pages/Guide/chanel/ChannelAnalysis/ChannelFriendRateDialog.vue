<template>
  <el-dialog
    :fullscreen="true"
    :visible="visible"
    :close-on-press-escape="true"
    @close="$emit('close')"
    center
  >
    <template v-slot:title>
      <h2>渠道好友占比</h2>
    </template>
    <ChannelChart :style="{ height: `${chartHeight - 44}px` }"/>
  </el-dialog>
</template>

<script>
import ChannelChart from './ChannelChart'

export default {
  components: {
    ChannelChart
  },
  props: ['visible', 'chartHeight'],
  data () {
    return {
      checkedCities: ['上海', '北京'],
      cities: [
        '上海',
        '北京',
        '广州',
        '深圳',
        '哈哈我的名字比较长哈哈哈',
        '哈哈2',
        '哈哈3',
        '哈哈4',
        '哈哈5',
        '哈哈6',
        '哈哈7',
        '哈哈8',
        '哈哈9',
        '哈哈我的名字比较长哈哈哈2',
        '哈哈11',
        '哈哈14',
        '哈哈15'
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>
@import "./styles/channel-chart-dialog.css";
</style>
