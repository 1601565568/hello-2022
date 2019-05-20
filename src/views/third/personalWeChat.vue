<template>
<div class='person-page'>
  <div class='card flex flex-between'>
    <div>
      <div class='fz28'>南讯软件</div>
      <div class='fz36'>{{query.name}}</div>
      <div class='fz28'>{{query.shopName}}  {{query.job==1?'店长':query.job==0?'导购':''}}</div>
      <div class='fz28'>{{query.mobile}}</div>
    </div>
    <div class='person-img'>
      <img :src="query.image" alt="" class='img'>
    </div>
  </div>
  <div class='flex flex-center' style='flex-direction:column;padding-top:1.04rem'>
    <img :src="wxCodeUrl" alt="" class='wx-img'>
    <img src="../../assets/longPress.png" alt="" class='longPress-img'>
  </div>
</div>

</template>

<script>
import loaderNoCacheClose from 'web-crm/src/utils/loaderNoCacheClose'
import updateTitle from '../../utils/updateTitle.js'
(function (doc, win) {
  var docEl = doc.documentElement
  var clientWidth = docEl.clientWidth
  docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
  docEl.style.background = '#fff'
})(document, window)
export default {
  name: 'index',
  mixins: [],
  data: function () {
    return {
      wxCodeUrl: '',
      query: {}
    }
  },
  beforeCreate () {
    loaderNoCacheClose()
    updateTitle('个人微信')
  },
  methods: {

  },
  mounted: function () {
    if (this.$route.query.image === 'null') {
      this.$route.query.image = require('../../assets/default-guide-side.png')
    }
    this.query = this.$route.query
    let parms = { brandId: this.query.brandId }
    this.$http.fetch(this.$api.getMoreAccountByWeight, parms)
      .then(res => {
        this.wxCodeUrl = res.result.wxCodeUrl || require('../../assets/personWX.png')
      })
      .catch(resp => {
      })
  }
}
</script>
<style scoped>
.loader-noCache{
  display :none
}
.fz28{
  color:#fff;
  font-size: 0.28rem;
  line-height: 0.42rem;
}
.fz36{
  color:#fff;
  font-size: 0.36rem;
  line-height: 0.55rem;
  margin-bottom: 0.4rem;
}
.person-page{
  width: 7.5rem;
  padding-top: 0.3rem;
  background: #fff;
}
.card{
  padding: 0 0.45rem;
  width: 6.93rem;
  height : 3.03rem;
  background: #0091FA;
  border-radius: 0.15rem;
  margin: 0 auto;
  box-sizing: border-box;
}
.person-img{
  padding: 0.09rem;
  border: 2px solid #57AFEF;
  border-radius: 50%;
  .img{
    width : 1.73rem;
    height : 1.73rem;
    border-radius : 50%;
    display: block;
  }

}
.wx-img{
  width: 3.75rem;
  height: 3.75rem;
  display: block;
}
.longPress-img{
  width: 4.18rem;
  height: 1.12rem;
  display: block;
  margin-top: 0.33rem;
}
</style>
