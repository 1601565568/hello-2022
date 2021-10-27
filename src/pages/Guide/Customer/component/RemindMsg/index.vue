<template>
  <div class="remind-view" v-if="isShow">
    <div class="msg-view">
      <div class="msg">
        <img src="./image/remidMsg.gif" style="width:20px;height:20px;margin-right:5px">
        <span>转移会员以任务形式进行，需要一段时间处理...</span>
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
  top: 30px;
  left: 40%;
  padding: 16px;
  background: #FFFFFF;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.04);
  border-radius: 2px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
