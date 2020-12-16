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
import personalInformation from './personalInformation'
import managementTools from './managementTools'
import banner from '../../pageComponents/banner'
export default {
  components: { personalInformation, managementTools, banner },
  props: {
    editData: {
      type: Array
    }
  }
}
</script>
