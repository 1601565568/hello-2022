<template>
  <div class="form-main">
    testError: {{msg.testError}}<br/>
    testRestful: {{msg.testRestful}}<br/>
    testSuccess: {{msg.testSuccess}}<br/>
    testAxiosSuccess: {{msg.testAxiosSuccess}}<br/>
    testAxiosError: {{msg.testAxiosError}}<br/>
    testAxiosRestful: {{msg.testAxiosRestful}}<br/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'api',
  data () {
    return {
      msg: {
        testError: false,
        testRestful: false,
        testSuccess: false,
        testAxiosSuccess: false,
        testAxiosError: false,
        testAxiosRestful: false
      }
    }
  },
  created () {
    /*      // console.log('example.vue start')
            // console.log(this.$http)
            // console.log(this.$api)
            // console.log(this.getCommonApis)
            // console.log(this.getUserinfoApis)
            // console.log('example.vue end')
            // console.log(this.$api) */
  },
  mounted () {
    //  this.testError()
    this.testRestful()
    // this.testCallbackFalse()
    // this.testCallbackFn()
    // this.testAxiosSuccess()
    // this.testAxiosError()
    // this.testAxiosRestful()
    // this.testRequest()
    // this.testSuccess()
    // this.testSaync()
    // console.log(this.$api.test.test.url)
    // console.log(this.$http.config.API_ROOT)
  },
  computed: {
    ...mapGetters([
      'getCommonApis',
      'getUserinfoApis'
    ])
  },
  methods: {
    /**
       * 测试失败
       * @returns {Promise<void>}
       */
    testError () {
      this.$http.fetch(this.$api.test.error, {
        username: 'test',
        password: 'test'
      }).then(data => {
        window.LOG.error('api.vue async testError then data:', data)
      }).catch((err) => {
        this.msg.testError = err
        // console.info('api.vue async testError then data:', err)
      })
    },
    /**
       * 测试restful，404也没问题，你懂得。
       * @returns {Promise<void>}
       */
    testRestful () {
      this.$http.fetch(this.$api.test.axiosRestful, {
        id: '我',
        id1: '[]=>'
      }).then(data => {
        this.msg.testRestful = 4
        // console.log('api.vue async ok testRestful then data:', data)
      }).catch(() => {
        this.msg.testRestful = 404
        // console.info('api.vue async error testRestful then data:', err)
      })
    },
    /**
       * 测试成功
       * @returns {Promise<void>}
       */
    testSuccess () {
      this.$http.fetch(this.$api.test.success, {
        username: 'admin',
        password: '123456'
      }).then(data => {
        this.msg.testSuccess = data
        // console.log('api.vue async ok testSuccess then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testSuccess then data:', err)
      })
    },
    /**
       * 测试接口关闭回调
       * @returns {Promise<void>}
       */
    testCallbackFalse () {
      this.$http.fetch(this.$api.test.callbackFalse, {
        username: 'admin',
        password: '123456'
      }).then(data => {
        this.msg.testSuccess = data
        // console.log('api.vue async ok testSuccess then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testSuccess then data:', err)
      })
    },
    /**
       * 测试接口级回调
       * @returns {Promise<void>}
       */
    testCallbackFn () {
      this.$http.fetch(this.$api.test.callbackFn, {
        username: 'admin',
        password: '123456'
      }).then(data => {
        this.msg.testSuccess = data
        // console.log('api.vue async ok testSuccess then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testSuccess then data:', err)
      })
    },
    /**
       * 手写接口参数  测试成功
       * @returns {Promise<void>}
       */
    testAxiosSuccess () {
      this.$http.fetch({
        path: '/test/axiosSuccess',
        type: 'post'
      }, {
        username: 'admin',
        password: '123456'
      }).then(data => {
        this.msg.testAxiosSuccess = data
        // console.log('api.vue async testAxiosSuccess then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testAxiosSuccess then data:', err)
      })
    },
    /**
       * 手写接口参数  测试失败
       * @returns {Promise<void>}
       */
    testAxiosError () {
      this.$http.fetch({
        path: '/test/axiosError',
        type: 'post'
      }, {
        username: 'admin',
        password: '1234578'
      }).then(data => {
        // console.log('api.vue async testAxiosError then data:', data)
      }).catch((err) => {
        this.msg.testAxiosError = err
        // console.info('api.vue async error testAxiosError then data:', err)
      })
    },
    /**
       * 手写接口参数  测试restful
       * @returns {Promise<void>}
       */
    testAxiosRestful () {
      this.$http.fetch({
        path: (data) => {
          return `/test/${data.username}`
        },
        type: 'get'
      }, {
        username: 'axiosRestful'
      }).then(data => {
        this.msg.testAxiosRestful = data
        // console.log('api.vue async testAxiosRestful then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testAxiosError then data:', err)
      })
    },
    /**
       * 请求拦截器  测试restful
       * @returns {Promise<void>}
       */
    testRequest () {
      this.$http.fetch(this.$api.test.testRequestConfirmDel, {
        username: 'admin',
        password: '123456'
      }).then(data => {
        this.msg.testAxiosRestful = data
        // console.log('api.vue async testAxiosRestful then data:', data)
      }).catch(() => {
        // console.info('api.vue async error testAxiosError then data:', err)
      })
    },
    testSaync () {
      let that = this
      async function getSyncData () {
        let api1 = ''
        await that.$http.fetch(that.$api.core.common.login, {
          username: 'admin',
          password: '123456'
        }).then((data) => {
          api1 = data.name
        }).catch(() => {
        })

        let api2 = ''
        await that.$http.fetch(that.$api.core.common.login, {
          username: 'admin',
          password: '123456'
        }).then((data) => {
          api2 = data.token
        }).catch(() => {
        })
        // 等待两个API都返回
        let data = `api1 = ${api1} , api2 = ${api2}`
        return data
      }

      async function getData () {
        let data = await getSyncData()
        console.log(data)
      }

      getData()
    }
  }
}
</script>
