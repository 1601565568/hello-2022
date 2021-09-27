<template>
  <div class="customer-mobile">
    <div class="customer-mobile_box">
      <div class="customer-mobile_content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'phone'
}
</script>

<style scoped lang="scss">
.customer-mobile {
  &::-webkit-scrollbar-thumb {
    display: none;
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
.customer-mobile {
  padding-bottom: 20px;
  .customer-mobile_box {
    width: 346px;
    height: 664px;
    margin: 0 auto 4px;
    background-image: url(../Images/iphone7.png);
    margin-bottom: 4px;
    padding-top: 47px;
    .customer-mobile_content {
      width: 318px;
      height: 567px;
      margin: 0 auto;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #EDEDED;
    }
  }
}
</style>
