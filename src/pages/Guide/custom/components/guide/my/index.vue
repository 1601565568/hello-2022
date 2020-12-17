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
import managementTools from './managementTools'
import banner from '../../pageComponents/banner'
import borderHighLight from '../../pageComponents/borderHighLight'
export default {
  components: { personalInformation, managementTools, banner, borderHighLight },
  props: {
    editData: {
      type: Array
    },
    settingCode: {
      type: String
    }
  }
}
</script>
