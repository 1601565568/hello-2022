<template>
  <div>
    <template v-for="(item, index) in editData">
      <borderHighLight
        :key="index"
        v-if="item.status === 1"
        :settingCode="settingCode"
        :code="item.settingCode"
      >
        <Component :is="item.settingCode" :editData="item.itemList"></Component>
      </borderHighLight>
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
import borderHighLight from '../../pageComponents/borderHighLight'
export default {
  props: {
    editData: {
      type: Array
    },
    settingCode: {
      type: String
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
    banner,
    borderHighLight
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
