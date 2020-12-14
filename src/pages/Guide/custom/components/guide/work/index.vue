<template>
  <div>
    <template v-for="(item, index) in editData">
      <component
        :is="item.settingCode"
        :key="index"
        :editData="item.itemList"
      ></component>
    </template>
    <!-- {{editData}} -->
    <!-- <DHander />
    <DAchievement />
    <DMenu /> -->
  </div>
</template>
<script>
// import personalInformation from './DHander'
// import performance from './DAchievement'
// import workMenu from './DMenu'
import banner from '../../pageComponents/banner'
export default {
  props: {
    editData: {
      type: Array
    }
  },
  components: {
    personalInformation: () => import('./personalInformation'),
    performance: () => import('./performance'),
    workMenu: () => import('./DMenu'),
    banner
  }
}
</script>
