<template>
  <div class="pageTopWarpper" v-if="show">
    <div class="store">
      <div class="fl" v-if="editData[0] && editData[0].status === 1">
        <img class="storeIcon" src="../../../image/storeIcon.png" />
        <span>导购门店</span>
        <span class="triangle-down"></span>
      </div>
      <div v-if="editData[1] && editData[1].status === 1">
        导购端<img class="hebing" src="../../../image/hebing.png" />
      </div>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'filterCondition',
  mixins: [componentData],
  data () {
    return {}
  },
  methods: {},
  created () {}
}
</script>
<style scoped lang="scss">
.fl {
  display: flex;
  align-items: center;
}
.pageTopWarpper {
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  // height: 56px;
  padding: 0 16px;
  background: #0091fa;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-bottom: 8px;
  .store {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .time {
    display: flex;
    width: 100%;
    display: flex;
    font-size: 15px;
    line-height: 23px;
    padding-top: 4px;
    padding-bottom: 12px;
    > div {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }
  }
  .storeIcon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .hebing {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
  .triangle-down {
    display: inline-block;
    margin-left: 8px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
  }
  .screen {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    .screenIcon {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
}
</style>
