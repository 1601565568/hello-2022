<template>
  <div class="pageTopWarpper">
    <div class="store">
      <img  class="storeIcon" src="../../../image/storeIcon.png" />
      <span>导购门店</span>
      <span class="triangle-down"></span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.pageTopWarpper {
  display: flex;
  justify-content: space-between;
  // height: 56px;
  padding: 0 16px;
  background: #FF532A;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-bottom: 8px;
  .store {
    height: 56px;
    display: flex;
    align-items: center;
  }
  .storeIcon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
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
