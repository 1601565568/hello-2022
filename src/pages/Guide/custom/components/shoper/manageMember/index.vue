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
import managementTools from './managementTools'
import shopGuide from './shopGuide'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  components: {
    filterCondition,
    managementTools,
    shopGuide,
    banner
  }
}
</script>
<style lang="scss" scoped></style>
