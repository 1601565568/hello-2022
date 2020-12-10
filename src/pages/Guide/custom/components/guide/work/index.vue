<template>
  <div>
    <template v-for="(item ,index) in editData">
    <component :key="index" :is="item.settingCode" :editData="item.itemList"></component>
    </template>
    <!-- {{editData}} -->
    <!-- <DHander />
    <DAchievement />
    <DMenu /> -->
  </div>
</template>
<script>
import personalInformation from './DHander'
import performance from './DAchievement'
import workMenu from './DMenu'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  // watch: {
  //   editData: {
  //     handler (newValue) {
  //       console.log(newValue, '12312312312312313123')
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  components: {
    personalInformation,
    performance,
    workMenu,
    banner
  }
}
</script>
