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
    <ChannelChart
      :fullScreen="true"
      :style="{ height: `${chartHeight - 44}px` }"
      :channelCodes="channelCodes"
      :searchDate="searchDate"
    />
  </el-dialog>
</template>

<script>
import ChannelChart from './ChannelChart'

export default {
  components: {
    ChannelChart
  },
  props: ['visible', 'chartHeight', 'channelCodes', 'searchDate'],
  methods: {}
}
</script>

<style scoped>
@import "./styles/channel-chart-dialog.css";
</style>
