<template>
  <div>
    <template v-for="(item, index) in editData">
      <Component
        :is="item.settingCode"
        :key="index"
        :editData="item.itemList"
      ></Component>
    </template>
  </div>
</template>
<script>
import filterCondition from './filterCondition'
import monthShopPerformance from './monthShopPerformance'
import monthShopRanking from './monthShopRanking'
import monthShopGuideRanking from './monthShopGuideRanking'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  components: {
    filterCondition,
    banner,
    monthShopPerformance,
    monthShopRanking,
    monthShopGuideRanking
  }
}
</script>
