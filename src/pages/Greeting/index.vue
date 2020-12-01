<template>
  <div class="greeting-main">
    <div class="greeting-start">
      <div class="greeting-start__container">
        <div class="greeting-start__container-left">
          <h3 class="container-left__title">温馨提示</h3>
          <p class="container-left__prompt">您还未配置自建应用无法使用此功能，</p>
          <div class="container-left__info">【可扫描下方二维码，联系企微专家】进行配置。</div>
          <div class="container-left__code">
            <img :src="code" class="container-left__code-img">
            <p class="container-left__code-info">添加南讯企微专家</p>
          </div>
        </div>

        <img :src="BeforeStartImg" class="greeting-start__img float-right">
      </div>
    </div>
  </div>
</template>
<script>
import BeforeStartImg from './images/smartGreeting.png'
import code from './images/code.png'

export default {
  data () {
    return {
      BeforeStartImg,
      code
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";

@component-namespace greeting {
  @b start {
    position: relative;
    width: 100%;
    height: calc(100vh - var(--head-nav-height) - 31px);
    background-color: var(--theme-color-white);
    border-radius: var(--default-radius-mini);

    @e container {
      display: flex;
      position: absolute;
      top: 180px;
      left: 50%;
      width: 100%;
      padding-right: 68px;
      transform: translate(-50%, 0);
    }
    @e container-left {
      flex: 1;
      padding-left: 8vw;
      word-break: keep-all;
      .container-left__title {
        font-size: 24px;
        color: #262626;
        line-height: 24px;
        font-weight: bold;
      }
      .container-left__prompt {
        font-size: var(--default-font-size-middle);
        color: #595959;
        line-height: 24px;
        margin-top: 32px;
      }
      .container-left__info {
        font-size: var(--default-font-size-middle);
        color: #595959;
        line-height: 24px;
        font-weight: bold;
        margin-top: 6px;
      }
      .container-left__code {
        margin-top: 53px;
        width: 157px;
        padding: 14px 14px 0;
        box-shadow: 0 4px 12px 0 rgba(42,65,95,0.10);
        border-radius: var(--default-radius-mini);
        .container-left__code-img {
          width: 128px;
          height: 128px;
        }
        .container-left__code-info {
          text-align: center;
          padding: var(--default-padding-larger) 0;
          font-size: var(--default-font-size-base);
          color: #595959;
          line-height: 24px;
        }
      }
    }

    @e img {
      display: block;
      width: 40vw;
      height: auto;
    }
  }
}
@media screen and (max-width: 1625px) {
  .greeting-start {
    height: calc(100vh - var(--head-nav-height-s) - 31px);
  }
}
@media screen and (max-height: 768px) {
  .greeting-start__container {
    top: 10vh;
  }
}
</style>
