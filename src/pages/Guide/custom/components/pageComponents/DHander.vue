<template>
  <!-- 导购工作台头部 -->
  <div class="D-head">
    <img class="D-head-useImage"
      src="../../image/defultheadPic.png"
    />
    <div class="D-head-text">
      <div class="D-head-text__user">用户名</div>
      <div class="D-head-text__user__number">
         <img class="D-head-Jobnumber" src="../../image/Jobnumber.png">工号<span class="number">0001</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.D-head {
  display: flex;
  align-items: center;
  height: 96px;
  padding: 0 16px;
  background: #0091fa;
  margin-bottom: 8px;
  .D-head-useImage {
    width: 48px;
    margin-right: 16px;
    height: 48px;
    overflow: hidden;
    border-radius: 4px;
  }
  .D-head-text {
    color: #fff;
    .D-head-text__user {
      font-size: 17px;
      line-height: 25px;
    }
    .D-head-text__user__number {
      font-size: 13px;
      .D-head-Jobnumber {
         width: 14px;
         height: 14px;
         margin-right: 5px;
      }
      .number {
         display: inline-block;
         margin-left: 5px;
      }
    }
  }
}
</style>
