<template>
  <div ref="loadingContent" class="loading-content">
    <div class="loading-content-main">
      <img alt="CRM-Enterprise" src="@/assets/logo.png" width="150"/>
      <div class="loading-animation">
        <div class="dot">
          <div class="first"></div>
        </div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      Loading in...
    </div>
  </div>
</template>

<script>
  export default {
    name: 'example',
    data () {
      return {
      }
    },
    mounted () {
      let heightMain = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.$refs.loadingContent.style.height = heightMain + 'px'
    }
  }
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  .loading-content {
    height: 100%;
    background-color: #0f62c7;
    .loading-content-main {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -180px;
      margin-left: -75px;
      width: 150px;
      height: 80px;
      font-family: "Lato", sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: var(--theme-color-white);
      text-align: center;
      -webkit-font-smoothing: antialiased;
      .loading-animation {
        width: 80px;
        height: 80px;
        position: relative;
        margin: auto;
        margin-top: 60px;
        margin-bottom: 70px;
        .dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          animation: 1.7s dotrotate cubic-bezier(0.775, 0.005, 0.310, 1.000) infinite;
          &:nth-child(1) {
            animation-delay: 0.2s;
          }
          &:nth-child(2) {
            animation-delay: 0.35s;
          }
          &:nth-child(3) {
            animation-delay: 0.45s;
          }
          &:nth-child(4) {
            animation-delay: 0.55s;
          }
          &:after, .first {
            content: "";
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            left: 50%;
            margin-left: -4px;
          }
          .first {
            background: var(--theme-color-white);
            margin-top: -4px;
            animation: 1.7s dotscale cubic-bezier(0.775, 0.005, 0.310, 1.000) infinite;
            animation-delay: 0.2s;
          }
        }
      }
    }
  }

  @keyframes dotrotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes dotscale {
    0%, 10% { width: 16px; height: 16px; margin-left: -8px;  margin-top: -4px; }
    50% { width: 8px; height: 8px; margin-left: -4px; margin-top: 0; }
    90%, 100% { width: 16px; height: 16px;  margin-left: -8px;  margin-top: -4px; }
  }
</style>
