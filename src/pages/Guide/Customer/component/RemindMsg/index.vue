<template>
  <div class="remind-view" v-if="isShow">
    <div class="msg-view">
      <div class="msg">
        <div class="lf">
          <i class="iconfont icon-ns-info-cricle"></i>
        <!-- <img src="./image/remidMsg.gif" style="width:20px;height:20px;margin-right:5px"> -->
        <span>转移会员以任务形式进行，需要一段时间处理...</span>
        </div>
        <i class="iconfont icon-ns-close" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remindMsg',
  data: function () {
    return {
      isShow: false
    }
  },
  methods: {
    showMsg () {
      this.isShow = true
      setTimeout(() => {
        this.isShow = false
      }, 3000)
    },
    close () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.remind-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.msg-view {
  position: relative;
  width: 100%;
  height: 100%;
}
.msg {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 382px;
  height: 40px;
  padding: 0 16px;
  background: #FFF4E6;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.04);
  border-radius: 2px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span{
    font-size: 14px;
    color: rgba(0,0,0,0.85);
  }
  .lf{
    i{
      color: #FA8500;
      margin-right: 8px;
    }
  }
}
</style>
