<template>
  <div>
    <template v-for="(item, index) in editData">
      <Component
        :key="index"
        :is="item.settingCode"
        :editData="item.itemList"
      ></Component>
    </template>
  </div>
</template>
<script>
import Datetime from './dataTime'
import performance from './guideAchievement'
import shopDataStatistics from './storeData'
import guideRanking from './storeGuideTop'
import guestCodeEffect from './customerCodeData'
import guestCodeTrending from './customerCodeChart'
import promotionMasterRanking from './extensionTop'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  components: {
    Datetime,
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
