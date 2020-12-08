<template>
  <div class="setListWarpper">
    <div class="setList">
      <img class="listIcon" src="../../../image/location.png" />
      <div class="setList-content">
        <span>导购门店</span>
        <img class="arrowRight" src="../../../image/arrowRightIcon.png" />
      </div>
    </div>
    <div class="setList">
      <img class="listIcon" src="../../../image/qrcode.png" />
      <div class="setList-content">
        <span>导购二维码</span>
        <img class="arrowRight" src="../../../image/arrowRightIcon.png" />
      </div>
    </div>
    <div class="setList">
      <img class="listIcon" src="../../../image/moneyIcon.png" />
      <div class="setList-content">
        <span>我的收益</span>
        <img class="arrowRight" src="../../../image/arrowRightIcon.png" />
      </div>
    </div>
    <div class="setList">
      <img class="listIcon" src="../../../image/seticon.png" />
      <div class="setList-content">
        <span>设置</span>
        <img class="arrowRight" src="../../../image/arrowRightIcon.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.setListWarpper {
  background: #fff;
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
