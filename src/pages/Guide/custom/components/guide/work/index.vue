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
  components: {
    personalInformation,
    performance,
    workMenu,
    banner
  }
}
</script>
