<template>
  <div class="greeting-main">
    <div class="container-code">
      <img :src="redPacketEmpty" class="container-left__code-img">
      <p class="container-left__code-info">未进行企业微信授权配置哦～<ns-button v-if='!isThird' type='text' size='large' @click='handleJump'>去配置</ns-button></p>
    </div>
  </div>
</template>
<script>
import redPacketEmpty from '@/assets/redpactEmpty.png'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      redPacketEmpty
    }
  },
  computed: mapState({
    isThird: state => state.companyPlan.isThird
  }),
  methods: {
    handleJump () {
      window.open('https://sandboxecloudv5.vecrp.com/basic/workWx/index')
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";
.greeting-main {
  width: 100%;
  height: calc(100vh - var(--head-nav-height) - 31px);
  background-color: #fff;
}
.container-left__code-img {
  display: block;
  margin: 0 auto;
  height: 220px;
  width: 220px;
}
.container-left__code-info {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #8C8C8C;
}
.container-code {
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  top: 50%;
}
</style>
