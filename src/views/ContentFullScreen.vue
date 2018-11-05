<template>
  <div class="content-wrap">
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
  @import "../style/small/variables.pcss";
  .content-wrap{
    margin-left: 10px;
    margin-top: 90px;
  }
  @media screen and (max-width: 1625px){
    .content-wrap{
      margin-top: 70px;
    }
  }
  .main-content {
    height: 100%;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
