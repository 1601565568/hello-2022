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
