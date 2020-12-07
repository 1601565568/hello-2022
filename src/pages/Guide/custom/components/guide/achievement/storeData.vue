<template>
  <CardTitle title="店铺数据统计">
    <img slot="image" class="dataIcon" src="../../../image/dataIcon.png" />
    <div slot="content" class="storeData">
      <div class="storeData">
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
        <div class="storeData-list">
          <div class="storeData-list__name">交易金额（元）</div>
          <div class="storeData-list__number">0</div>
        </div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  components: { CardTitle }
}
</script>

<style scoped lang="scss">
.storeData {
  margin-top: 12px;
  padding-bottom: 4px;
  display: flex;
  flex-wrap: wrap;
  .storeData-list {
    padding-left: 16px;
    height: 58px;
    width: 50%;
    &:nth-of-type(2n) {
      position: relative;
      &::before {
        position: absolute;
        background: #e8e8e8;
        content: '';
        top: 10px;
        // top: 50%;
        // transform: translate(0%, -50%);
        left: 0;
        width: 1px;
        height: 32px;
      }
    }
  }
  .storeData-list__name {
    font-size: 12px;
    color: #8c8c8c;
  }
  .storeData-list__number {
    font-size: 20px;
    color: #0091fa;
  }
}
</style>
