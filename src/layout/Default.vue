<template>
    <div>
        <NavHead @area-change="onReload"/>
        <router-view v-if="isReload"/>
        <Footer />
    </div>
</template>

<script>
import NavHead from './NavHead'
import isRefresh from '@nascent/ecrp-ecrm/src/utils/isRefresh'
import Footer from '@nascent/ecrp-ecrm/src/layout/small/Footer'

export default {
  components: {
    NavHead,
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
  }
}
</script>
