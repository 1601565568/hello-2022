<template>
  <div class='empty-content'>
    <div class='empty'>
      <img class='empty-img' :src='redPacketEmpty'/>
      <p class='empty-p'>你还没有配置支付商户号哦~</p>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import redPacketEmpty from '@/assets/redpactEmpty.png'
export default {
  data () {
    return { redPacketEmpty }
  }
}
</script>
<style lang="scss" scoped>
.empty-content {
  height: calc(100vh - 228px);
  display: flex;
  justify-content: center;
  background-color: #fff;
  align-items: center;
  .empty {
    position: relative;
    top: -40px;
  }
  .empty-img {
    display: block;
    width: 220px;
    height: 220px;
    margin: 0 auto;
  }
  .empty-p {
    margin-top: 40px;
    margin-bottom: 47px;
    font-size: 14px;
    color: #8C8C8C;
    text-align: center;
    line-height: 22px;
  }
  .empty-div {
    font-size: 14px;
    color: #262626;
    text-align: center;
    line-height: 22px;
    .empty-btn {
      font-size: 14px;
      margin-left: 16px;
    }
  }
}
</style>
