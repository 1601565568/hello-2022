<template>
  <div class="user">
    <img class="user-pic" src="../../../image/defultheadPic.png" />
    <div>
      <div class="user-name">导购姓名</div>
      <div class="user-name__text">导购姓名<span>12345678901</span></div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.user {
  height: 96px;
  background: #0091fa;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #ffffff;
  margin-bottom: 8px;
  .user-pic {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }
  .user-name {
    font-size: 17px;
    margin-bottom: 2px;
  }
  .user-name__text {
    font-size: 13px;
    span {
      display: inline-block;
      margin-left: 4px;
    }
  }
}
</style>
