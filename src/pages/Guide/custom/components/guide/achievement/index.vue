<template>
  <div>
    <DataTime />
    <GuideAchievement />
    <StoreData />
    <StoreGuideTop />
    <CustomerCodeData />
    <CustomerCodeChart />
    <ExtensionTop />
  </div>
</template>
<script>
import DataTime from './dataTime'
import GuideAchievement from './guideAchievement'
import StoreData from './storeData'
import StoreGuideTop from './storeGuideTop'
import CustomerCodeData from './customerCodeData'
import CustomerCodeChart from './customerCodeChart'
import ExtensionTop from './extensionTop'
export default {
  components: {
    DataTime,
    GuideAchievement,
    StoreData,
    StoreGuideTop,
    CustomerCodeData,
    CustomerCodeChart,
    ExtensionTop
  }
}
</script>
