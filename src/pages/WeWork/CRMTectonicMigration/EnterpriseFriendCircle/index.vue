<template>
  <div class="history-main">
    <div class="history-start">
      <div class="history-start__container">
        <img :src="BeforeStartImg" alt="开启前引导图" class="history-start__img">
        <div class="history-start__btn">
          <ns-button size="medium"  @click="onOpenUrl('create')">新建内容</ns-button>
          <ns-button size="medium"  @click="onOpenUrl('view')" v-show="$isShowDocs">查看教程</ns-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BeforeStartImg from './img/friendCircle.png'
export default {
  data () {
    return {
      BeforeStartImg
    }
  },
  methods: {
    onOpenUrl: function (type) {
      let url = ''
      if (type === 'create') {
        url = 'https://work.weixin.qq.com/wework_admin/frame#customer/moments/create'
      } else if (type === 'view') {
        url = this.$isQa ? this.$qaDocs : 'https://oa.nascent.cn/zhiku/detail?parent_ids=null30,45,487,&id=2493'
      }
      window.open(url, type)
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace history {
    @b start {
      position: relative;
      width: 100%;
      height: calc(100vh - var(--head-nav-height) - 31px);
      background-color: var(--theme-color-white);
      text-align: center;
      border-radius: var(--default-radius-mini);

      @e container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, calc(-50% - 20px));
      }

      @e img {
        display: block;

        @media screen and (max-width: 1400px) {
          & {
            width: 70%;
            margin: 0 auto;
          }
        }
      }

      @e btn {
        display: inline-block;
        margin-top: 50px;
      }
    }
  }
  @media screen and (max-width: 1625px) {
    .history-start {
      height: calc(100vh - var(--head-nav-height-s) - 31px);
    }
  }
</style>
