<template>
  <div class='page_add_coupon'>
    <ns-table-sg-coupon ref="table" @showListDialogMain="showListDialogFun" :url=$api.guide.guide.findList @add="addCoupon"></ns-table-sg-coupon>
    <list-dialog ref="listDialogDom"></list-dialog>
    <couponList ref="couponList" @closeDialog="closeDialogCouponList" v-if="couponListShow"></couponList>
  </div>
</template>

<script>
import List from './src/CouponList'
import NsTableSgCoupon from './NsTableSgCoupon'
import listDialog from './listDialog.vue'
import couponList from './components/couponList'
List.components = {
  NsTableSgCoupon,
  listDialog,
  couponList
}
export default List
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .coupon-form{
    text-align: right;
    padding-right: 80px;
  }
  .border-top{
    width:100%;
    height: 0;
    border-top:1px solid var(--theme-base-border-color-primary);
  }
  /* 优惠券样式 */
  .coupon{
    position: absolute;
    top:5px;
    right:60px;
    font-size:13px;
  }
  .coupon-preview{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-bottom-style:dashed;
    padding:10px;
  }
  .coupon-amount__large{
    font-size: 28px;
  }
  .coupon-preview-title{
    padding-left:15px;
  }
  .coupon-decorate{
    background: var(--theme-color-warning);
    color:#fff;
    margin-left: 10px;
    padding: 3px 6px 2px;
    font-size: 12px;
  }
  .coupon-preview-bottom{
    font-size: 12px;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-top-style:dashed;
    padding:3px 10px;
    color:var(--theme-font-color-secondary);
    margin-top: -1px;
  }
  .coupon-title{
    width: 20px;
    white-space:normal
  }
  .optionClass{
    height:60px;

  }
  .form-main{
    position: relative;
  }
</style>
<style scoped>
.page_add_coupon  .el-select-dropdown__wrap , .el-scrollbar__wrap {

      /* margin: 0 ! important */
  }

</style>
