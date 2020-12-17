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
import filterCondition from './filterCondition'
import monthShopPerformance from './monthShopPerformance'
import monthShopRanking from './monthShopRanking'
import monthShopGuideRanking from './monthShopGuideRanking'
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
    filterCondition,
    banner,
    monthShopPerformance,
    monthShopRanking,
    monthShopGuideRanking,
    borderHighLight
  }
}
</script>
