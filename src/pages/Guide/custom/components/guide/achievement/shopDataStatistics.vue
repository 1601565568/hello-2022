<template>
  <CardTitle title="店铺数据统计">
    <img slot="image" class="dataIcon" src="../../../image/dataIcon.png" />
    <div slot="content" class="storeData"  v-if="show">
      <div class="storeData">
        <template v-for="(item, index) in editData">
          <div v-if="item.status === 1" class="storeData-list" :key="index">
            <div class="storeData-list__name">
              {{ item.itemName }}（{{ formatCompany(item.itemName) }}）
            </div>
            <div class="storeData-list__number">
              0
              <img src="../../../image/ns-arrow-left.png" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
import componentData from '../../mixins/componentData.js'
export default {
  name: 'shopDataStatistics',
  components: { CardTitle },
  mixins: [componentData],
  methods: {
    formatCompany (itemName) {
      var name
      switch (itemName) {
        case '新增订单':
          name = '笔'
          break
        case '卖出商品':
          name = '件'
          break
        case '新增会员':
          name = '人'
          break
        case '新增好友':
          name = '人'
          break
        default:
          name = '元'
          break
      }
      return name
    }
  }
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
    display: flex;
    justify-content: space-between;
    padding-right: 12px;
    font-size: 20px;
    img {
      transform: rotate(180deg);
      width: 14px;
      height: 14px;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
    // color: #0091fa;
  }
}
</style>
