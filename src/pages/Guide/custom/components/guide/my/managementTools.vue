<template>
  <div class="setListWarpper" v-if="show">
    <template v-for="(item, index) in editData">
      <div class="setList" :key="index" v-if="item.status === 1">
        <img class="listIcon" :src="formatImage(item.itemCode)" />
        <div class="setList-content">
          <span>{{ item.itemName }}</span>
          <img class="arrowRight" src="../../../image/arrowRightIcon.png" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  mixins: [componentData],
  methods: {
    formatImage (name) {
      var url
      switch (name) {
        case 'guide-store':
          url = require(`../../../image/location.png`)
          break
        case 'guide-qrcode':
          url = require(`../../../image/qrcode.png`)
          break
        case 'member-recruit-ranking':
          url = require(`../../../image/moneyIcon.png`)
          break
        case 'setting':
          url = require(`../../../image/seticon.png`)
      }
      return url
    }
  }
}
</script>
<style lang="scss" scoped>
.setListWarpper {
  background: #fff;
  margin-bottom: 8px;
  .setList {
    margin-left: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    .listIcon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
    .setList-content {
      flex: 1;
      height: 55px;
      padding-right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      span {
        font-size: 15px;
        color: #262626;
      }
      .arrowRight {
        width: 14px;
        height: 14px;
      }
    }
    &:last-child .setList-content {
      border-bottom: 1px solid transparent;
    }
  }
}
</style>
