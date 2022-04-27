<template>
    <div>
        <NavHeadQa v-if="$isQa" @area-change="onReload"/>
        <NavHead v-else @area-change="onReload"/>
        <router-view v-if="isReload"/>
        <FooterQa v-if="$isQa" />
        <Footer v-else />
    </div>
</template>

<script>
import NavHead from './NavHead'
import NavHeadQa from '@nascent/ecrp-ecrm/src/layout/QA/NavHead'
import FooterQa from '@nascent/ecrp-ecrm/src/layout/QA/Footer'
import isRefresh from '@nascent/ecrp-ecrm/src/utils/isRefresh'
import Footer from '@nascent/ecrp-ecrm/src/layout/small/Footer'

export default {
  components: {
    NavHead,
    NavHeadQa,
    FooterQa,
    Footer
  },
  data () {
    return {
      isReload: true
    }
  },
  methods: {
    onReload () {
      this.isReload = false
      this.$nextTick(() => (this.isReload = true))
    },
    init () {
      // 禁止用F5键
      document.onkeydown = (e) => {
        if (e.key === 'F5') {
          e.preventDefault()
          e.returnValue = false
          isRefresh(this).then(() => {
            this.onReload()
          }).catch(() => {})
        }
      }
    }
  },
  created () {
    if (process.env.VUE_APP_SENTRY_SWITCH === 'true') {
      this.$sentry.addBreadcrumb({
        category: 'operationSpeed',
        message: `Start sign in: ${Date.now() - window.operationSpeed}`,
        level: 'info'
      })
    }
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      const dom = document.getElementsByClassName('nav')[0]
      document.getElementsByClassName('nav').style.display = 'none'
      console.log(document.getElementsByClassName('link-name')[0], dom, 'xxxxx')
      // dom.style.display = 'none'
    })
  }
}
</script>
