<template>
  <div class='common-mobile_box'>
    <div class='common-mobile_content'>
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.common-mobile_box {
    width: 346px;
    height: 664px;
    margin: 0 auto 4px;
    background-image: url(../../assets/iphone7.png);
    margin-bottom: 4px;
    padding-top: 47px;
    .common-mobile_content {
      width: 318px;
      height: 567px;
      margin: 0 auto;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat
    }
  }
</style>
