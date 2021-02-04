<template>
  <div class="poster-preview-container">
    <h3>效果展示</h3>
    <div class="mobile-panel">
      <div class="poster-content">
        <div class="poster-qrcode">
          <img src="./images/qrcode.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.poster-preview-container {
  h3 {
    margin-top: 15px;
    text-align: center;
    font-size: 16px;
    color: #262626;
    font-weight: bold;
  }

  .mobile-panel {
    width: 350px;
    height: 660px;
    background: url('./images/iphone7.png') no-repeat;
    margin: 49px auto 65px;
    overflow: hidden;
    .poster-content {
      width: 320px;
      height: 569px;
      margin: 40px auto 0;
      background-size: cover;
      background-repeat: no-repeat;
      overflow: hidden;
      .poster-qrcode {
        margin: 349px auto 0;
        width: 172px;
        height: 172px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
