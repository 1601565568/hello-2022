<template>
  <div>
    <template v-for="(item, index) in editData">
      <Component
        v-if="item.status === 1"
        :key="index"
        :is="item.settingCode"
        :editData="item.itemList"
      ></Component>
    </template>
  </div>
</template>
<script>
import datetime from './dataTime'
import performance from './performance'
import shopDataStatistics from './shopDataStatistics'
import guideRanking from './guideRanking'
import guestCodeEffect from './guestCodeEffect'
import guestCodeTrending from './guestCodeTrending'
import promotionMasterRanking from './promotionMasterRanking'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  components: {
    datetime,
    performance,
    shopDataStatistics,
    guideRanking,
    guestCodeEffect,
    guestCodeTrending,
    promotionMasterRanking,
    banner
  }
}
</script>
<style scoped>
img {
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
</style>
