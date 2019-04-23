<template>
<!-- 优惠券类型展示 wanrengang 20180718 -->
<div>
  <div class="couponItem-box couponItem-styleDk" v-if="itemObj.couponType===3">
    <div class="leftInfo">
      兑
    </div>
    <div class="rightInto">
      <h5>兑换券</h5>
      <!-- <p>
        使用条件:{{itemObj.useCondition.useConditionStr}}
      </p> -->
    </div>
  </div>
  <div class="couponItem-box couponItem-styleZk" v-if="itemObj.couponType===2">
    <div class="leftInfo">
      {{itemObj.couponValue}}<span class="unit">折</span>
    </div>
    <div class="rightInto">
      <h5>折扣券</h5>
      <!-- <p>
        使用条件:{{itemObj.useConditionStr}}
      </p> -->
    </div>
  </div>
  <div class="couponItem-box couponItem-styleXj" v-if="itemObj.couponType===1">
    <div class="leftInfo">
      <span class="unit">￥</span>{{itemObj.couponValue}}
    </div>
    <div class="rightInto">
      <h5>代金券</h5>
      <!-- <p>
        使用条件:{{itemObj.useCondition.useConditionStr}}
      </p> -->
    </div>
  </div>
</div>
</template>
<script>
// import NsGoodsSelect from 'components/NsGoodsSelect'
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
    return {}
  },
  created: function () {
    // console.log(this.itemObj)
  },
  methods: {}
}
</script>
<style scoped>
@component-namespace couponItem {
  @b box {
    width: 182px;
    height: 82px;
    position: relative;

    .leftInfo {
      width: 66px;
      height: 82px;
      line-height: 82px;
      text-align: center;
      color: #fff;
      float: left;
      font-size: 16px;
    }
    .leftInfo .unit {
      font-size: 12px;
    }
    .rightInto {
      float: right;
      width: 116px;
      height: 82px;
      padding: 24px 0 0 10px;
      box-sizing: border-box;
      h5 {
        font-size: 14px;
        font-weight: normal;
        color:#333;
      }
      p{color: #999;}
    }
  }

  @b styleDk{
    background: url(./img/dkbg.png);
  }
  @b styleZk{
    background: url(./img/zkbg.png);
  }
  @b styleXj{
    background: url(./img/xjbg.png);
  }
  @b styleGq{
    background: url(./img/gqbg.png);
  }
}
</style>
