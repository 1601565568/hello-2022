<template>
  <div class="D-Menu__warpper" v-if="show">
    <div class="D-Menu__warpper__title">功能菜单</div>
    <div class="D-Menu__list">
      <template v-for="(item, index) in editData">
        <div class="D-Menu__list__row" :key="index" v-if="item.status === 1">
          <img
            v-if="item.isDefaultMenu === 1"
            class="D-Menu__list__row__icon"
            :src="formatImage(item.itemName)"
          />
          <img v-else class="D-Menu__list__row__icon" :src="item.info.icon" />
          <div>{{ item.itemName }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'workMenu',
  mixins: [componentData],
  methods: {
    formatImage (name) {
      var url
      switch (name) {
        case '会员招募':
          url = require(`../../../image/Memberrecruitment.png`)
          break
        case '添加会员':
          url = require(`../../../image/huiyuanzhaomu.png`)
          break
        case '商品推介':
          url = require(`../../../image/Productpromotion.png`)
          break
        case '优惠券':
          url = require(`../../../image/coupon.png`)
          break
        case '工作任务':
          url = require(`../../../image/Task.png`)
          break
        case '客户关怀':
          url = require(`../../../image/Customercare.png`)
          break
        case '素材库':
          url = require(`../../../image/Materiallibrary.png`)
          break
        case '卡券核销':
          url = require(`../../../image/verification.png`)
          break
        case '营销活动':
          url = require(`../../../image/Marketingactivities.png`)
          break
        case '订单管理':
          url = require(`../../../image/Ordermanagement.png`)
          break
        case '一客一码':
          url = require(`../../../image/custormCode.png`)
      }
      return url
    }
  }
}
</script>

<style scoped lang="scss">
.D-Menu__warpper {
  background: #fff;
  margin-bottom: 8px;
  .D-Menu__warpper__title {
    padding: 0 16px;
    height: 56px;
    line-height: 56px;
    font-size: 17px;
    color: #262626;
    font-weight: bold;
  }
  .D-Menu__list {
    display: flex;
    flex-wrap: wrap;
    .D-Menu__list__row {
      width: 25%;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .D-Menu__list__row__icon {
        width: 36px;
        height: 36px;
        margin-bottom: 8px;
      }
      .D-Menu__list__row__text {
        font-size: 13px;
        color: #595959;
      }
    }
  }
}
</style>
