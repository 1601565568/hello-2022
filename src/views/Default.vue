<template>
  <div>
    <NavHead @brand-change="onReload"/>
    <router-view v-if="isReload"></router-view>
  </div>
</template>
<script>
  import loaderNoCacheClose from 'utils/loaderNoCacheClose'
  import NavHead from 'components/layout/NavHead'
  export default {
    components: {
      NavHead
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
            this.onReload()
            e.preventDefault()
            e.returnValue = false
          }
        }
        // 15分钟自动登陆续签
        window.setInterval(() => {
          this.$store.dispatch('user/login').catch(() => {
            this.$store.dispatch('user/regainSession')
          })
        }, 15 * 60 * 1000)

        // if (process.env.NODE_ENV === 'production') {
        //   window.setTimeout(() => {
        //     window.PreloadWebpackPlugin.install()
        //   }, 500)
        // }
      },
      loginGo () {
        this.$store.dispatch('user/login')
          .then((data) => {
            return data
          })
          .then((data) => {
            // if (process.env.VUE_APP_SENTRY_SWITCH === 'true') {
            //   try {
            //     this.$sentry.configureScope((scope) => {
            //       scope.setUser({
            //         'userName': data.remumber.remumber_login_info.name,
            //         'companyName': data.remumber.remumber_login_info.companyName
            //       })
            //     })
            //     this.$sentry.addBreadcrumb({
            //       category: 'operationSpeed',
            //       message: `login successful:${Date.now() - window.operationSpeed}`,
            //       level: 'info'
            //     })
            //   } catch (err) {
            //     //
            //   } finally {
            //     this.$sentry.captureMessage(`operationSpeed`)
            //   }
            // }
          })
          .catch((data) => {
            if (data.code === '999') {
              this.$store.dispatch('user/regainSession')
            } else {
              this.$router.push({ name: 'Errors', query: { msg: data.msg || '' } })
            }
          })
      }
    },
    created () {
      loaderNoCacheClose()
      this.loginGo()
      this.init()
    }
  }
</script>
