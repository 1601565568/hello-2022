<template>
  <div class='articleMaterialDetail'>
    <div class='text-bold text-center lh56 fz40'></div>
    <div class=' text-left mt10'>
      <span class='fz18 lh24'></span>
      <span class='fz18 lh24 ml15'></span>
    </div>
  </div>
</template>

<script>
import loaderNoCacheClose from 'web-crm/src/utils/loaderNoCacheClose'
export default {
  data () {
    return {
      auth_code: null, // 微信回调授权字
      timestamp: null, // 微信回调授权字段
      nonce: null, // 微信回调授权字段
      msg_signature: null // 微信回调授权字段
    }
  },
  created: function () {
    loaderNoCacheClose()
  },
  methods: {
    async appletAuth () { // 授权（传入微信回调原始数据）
      let _this = this
      await _this.$http.fetch(_this.$api.guide.sgwxaccount.appletAuth, {
        auth_code: _this.auth_code
      }).then(resp => {
        return resp.msg
      }).catch((resp) => {
        _this.$notify.error(resp.msg || '授权失败!')
        setTimeout(function () {
          _this.$router.replace({
            path: 'http://test_sg.ecrpcloud.com/Guide/Others/SgWxAccount'
          })
        }, 3000)
      })
    },
    async getMsg () { // msg（传入微信回调原始数据）
      let _this = this
      await _this.$http.fetch(_this.$api.guide.sgwxaccount.getMsg, {
        timestamp: _this.timestamp,
        nonce: _this.nonce,
        msg_signature: _this.msg_signature
      }).then(resp => {
        return resp.msg
      }).catch((resp) => {
        _this.$notify.error(resp.msg || '授权失败!')
        setTimeout(function () {
          _this.$router.replace({
            path: 'http://test_sg.ecrpcloud.com/Guide/Others/SgWxAccount'
          })
        }, 3000)
      })
    },
    async receive () { // tiket（传入微信回调原始数据）
      let _this = this
      await _this.$http.fetch(_this.$api.guide.sgwxaccount.receive, {
        timestamp: _this.timestamp,
        nonce: _this.nonce,
        msg_signature: _this.msg_signature
      }).then(resp => {
        return resp.msg
      }).catch((resp) => {
        _this.$notify.error(resp.msg || '授权失败!')
        setTimeout(function () {
          _this.$router.replace({
            path: 'http://test_sg.ecrpcloud.com/Guide/Others/SgWxAccount'
          })
        }, 3000)
      })
    }
  },
  mounted: function () {
    let _this = this
    _this.auth_code = this.$route.query.auth_code
    _this.timestamp = this.$route.query.timestamp
    _this.nonce = this.$route.query.nonce
    _this.msg_signature = this.$route.query.msg_signature
    _this.appletAuth()
    _this.receive()
    _this.getMsg()
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
