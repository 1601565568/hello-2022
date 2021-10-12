<template>
  <CardTitle title="裂变大师活动效果数据">
    <img
      slot="image"
      class="dataIcon"
      src="../../../image/customerCodeIcon.png"
    />
    <span slot="cardTitleother"></span>
    <div slot="content" class="customerCodeData">
      <div class="customerCode-list">
        <div class="customerCode-list__title">裂变大师 （人）</div>
        <div class="customerCode-list__num">0</div>
      </div>
      <div class="customerCode-list">
        <div class="customerCode-list__title">邀请好友 （人）</div>
        <div class="customerCode-list__num">0</div>
      </div>
      <div class="customerCode-list">
        <div class="customerCode-list__title">今日新增裂变大师 （人）</div>
        <div class="customerCode-list__num">0</div>
      </div>
      <div class="customerCode-list">
        <div class="customerCode-list__title">今日新增邀请好友 （人）</div>
        <div class="customerCode-list__num">0</div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  name: 'guestCodeEffect',
  components: { CardTitle }
}
</script>
<style lang="scss" scoped>
.customerCodeData {
  padding-top: 12px;
  display: flex;
  flex-wrap: wrap;
  .customerCode-list {
    width: 50%;
    height: 58px;
    margin-bottom: 8px;
    padding-left: 16px;
    &:nth-of-type(2n) {
      position: relative;
      &::before {
        position: absolute;
        content: '';
        left: 0px;
        top: 10px;
        // top: 50%;
        // transform: translate(0%, -50%);
        width: 1px;
        height: 32px;
        background: #e8e8e8;
      }
    }
    .customerCode-list__title {
      font-size: 12px;
      color: #8c8c8c;
    }
    .customerCode-list__num {
      font-size: 20px;
      color: #262626;
    }
  }
}
</style>
