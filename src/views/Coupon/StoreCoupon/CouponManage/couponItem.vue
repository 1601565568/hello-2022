<template>
<!-- 优惠券类型展示 wanrengang 20180718 -->
  <div class="couponItemBox">
      <span v-if="itemObj.couponType===1">代金券</span>
      <span v-if="itemObj.couponType===2">折扣券</span>
      <span v-if="itemObj.couponType===3">兑换券</span>
  </div>
</template>
<script>
// import NsGoodsSelect from 'web-crm/src/components/NsGoodsSelect'
// import NsShopSelect from 'components/NsShopSelect'
// index.components = {
//   NsGoodsSelect,
//   NsShopSelect
//
export default {
  props: {
    itemObj: Object
  },
  data () {
    return {

    }
  },
  created: function () {
    // console.log(this.itemObj)
  },
  methods: {

  }
}
</script>
<style scoped>

</style>
