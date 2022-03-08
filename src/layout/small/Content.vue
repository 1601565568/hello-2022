<template>
  <div class="layout-content" ref="J_layout">
    <MenuLeft/>
    <div ref="J_layout-main" :class="showFooter">
      <iframe-router-view></iframe-router-view>
    </div>
  </div>
</template>
<script>
import MenuLeft from '@nascent/ecrp-ecrm/src/layout/small/MenuLeft'
import iframeRouterView from '@/components/iframe-router-view'
export default {
  components: {
    MenuLeft,
    iframeRouterView
  },
  methods: {
    /**
     * 计算可展示区域的真实宽高
     **/
    calSidebarScreenLayoutWH () {
      const copyrightInfo = this.$store.state.user.copyright_info
      this.$store.dispatch('common/calSidebarScreenLayoutWH', {
        height: window.innerHeight - this.$refs['J_layout-main'].offsetTop - (copyrightInfo && copyrightInfo.isShow ? (16 + 5) : 10), // margin-bottom: 10px;
        width: document.body.clientWidth - this.$refs.J_layout.offsetLeft - 10 // margin-right: 10px;
      })
    }
  },
  mounted () {
    this.calSidebarScreenLayoutWH()
    window.addEventListener('resize', this.calSidebarScreenLayoutWH)
  },
  computed: {
    showFooter () {
      const copyrightInfo = this.$store.state.user.copyright_info
      return copyrightInfo && copyrightInfo.isShow ? 'hasFooter layout-content__main' : 'layout-content__main'
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calSidebarScreenLayoutWH)
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace layout {
    @b content {
      margin-left: 200px;
      padding-top: calc(var(--content-padding) + var(--head-nav-height));
      @e main {
        height: 100%;
        margin-right: var(--content-margin);
        margin-bottom: 10px;
        &.hasFooter {
          margin-bottom: 5px;
        }
      }
    }
    @media screen and (max-width: 1625px) {
      @b content {
        margin-left: calc(var(--content-margin-s) + var(--menu-second-width-s));
        padding-top: calc(var(--content-padding-s) + var(--head-nav-height-s));
        @e main {
          margin-right: var(--content-margin-s);
        }
      }
    }
  }
</style>
