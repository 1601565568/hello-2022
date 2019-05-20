<template>
  <div class='articleMaterialDetail'>
    <div class='text-bold text-center lh56 fz40'></div>
    <div class=' text-left mt10'>
      <span class='fz18 lh24'>我是微信回调页面</span>
      <span class='fz18 lh24 ml15'></span>
    </div>
  </div>
</template>
<script>
import loaderNoCacheClose from 'web-crm/src/utils/loaderNoCacheClose'
export default {
  data () {
    return {
      timestamp: null, // 微信回调授权字段
      nonce: null, // 微信回调授权字段
      msg_signature: null // 微信回调授权字段
    }
  },
  created: function () {
    loaderNoCacheClose()
  },
  methods: {
    async receive () { // tiket（传入微信回调原始数据）
      let _this = this
      let code = null
      await _this.$http.fetch(_this.$api.guide.sgwxaccount.receive, {
        timestamp: _this.timestamp,
        nonce: _this.nonce,
        msg_signature: _this.msg_signature
      }).then(resp => {
        code = resp.success
      }).catch((resp) => {
        _this.$notify.error(resp.msg || '授权失败!')
        setTimeout(function () {
          _this.$router.replace({
            path: 'http://test_sg.ecrpcloud.com/Guide/Others/SgWxAccount'
          })
        }, 3000)
      })
      return code
    }
  },
  mounted: function () {
    this.timestamp = this.$route.query.timestamp
    this.nonce = this.$route.query.nonce
    this.msg_signature = this.$route.query.msg_signature
    this.receive()
  },
  components: {
  }
}
</script>
<style>
  .loader-noCache{
    display: none !important
  }
</style>
