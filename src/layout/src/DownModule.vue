<template>
  <div>
    <div class="dowm-module" id="dowm-module" @click="getDownIconInfo">
      <Icon type="down-file" class="down-icon"  className="nav-avatar__icon--svg" />
    </div>
    <div class="run-icon-view" id="run-icon-view" v-show="showFile">
      <span class="iconfont icon-wenben2x red-file-view"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'downModule',
  data () {
    return {
      timer: null,
      showFile: false
    }
  },
  methods: {
    getDownIconInfo () {
      const ball = document
        .querySelector('#run-icon-view')
      this.showFile = true
      const run = ball.animate([
        // keyframes
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-340px)' }
      ], {
        // timing options
        duration: 1000,
        iterations: 1
      })
      run.onfinish = () => {
        this.showFile = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dowm-module {
  margin-right: calc(15px + 8px);
  width: 32px;
  height: 32px;
  background: #5BA5F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  .down-icon {
    font-size: 20px;
  }
}
.run-icon-view {
  width: 32px;
  height:32px;
  border-radius: 50%;
  position: fixed;
  top: 350px;
  right: 112px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5BA5F5;
  .red-file-view {
    color: white;
  }
}
</style>
