<template>
  <div>
    <borderHighLight
      v-for="(item, index) in editData"
      :key="index"
      :settingCode="settingCode"
      :code="item.settingCode"
    >
      <Component
        :is="item.settingCode"
        :editData="item.itemList"
        v-if="item.status === 1"
      ></Component>
    </borderHighLight>
  </div>
</template>
<script>
import filterCondition from './filterCondition'
import managementTools from './managementTools'
import shopGuide from './shopGuide'
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
    managementTools,
    shopGuide,
    banner,
    borderHighLight
  }
}
</script>
<style lang="scss" scoped></style>
