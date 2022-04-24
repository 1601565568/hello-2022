<!--
 * @Author: your name
 * @Date: 2022-04-24 17:17:08
 * @LastEditTime: 2022-04-24 19:14:22
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ECRP-SG-WEB\src\layout\Default.vue
-->
<template>
    <div>
        <NavHeadQa v-if="$isQa" @area-change="onReload"/>
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
  }
}
</script>
