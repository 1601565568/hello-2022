<template>
  <div>
    <template v-for="(item, index) in editData">
      <Component
        :is="item.settingCode"
        :key="index"
        :editData="item.itemList"
      ></Component>
    </template>
    {{editData}}
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
    workMenu: () => import('./workMenu'),
    banner
  }
}
</script>
