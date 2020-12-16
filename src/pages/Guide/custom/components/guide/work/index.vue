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
import personalInformation from './personalInformation'
import performance from './performance'
import workMenu from './workMenu'
import borderHighLight from '../../pageComponents/borderHighLight'
import banner from '../../pageComponents/banner'
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
    personalInformation,
    performance,
    workMenu,
    banner,
    borderHighLight
  }
}
</script>
