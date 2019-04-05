<template>
<div class='articleMaterialDetail'>
  <div class='text-bold text-center lh56 fz40' style='font-weight:600'>{{title}}</div>
  <div class=' text-left mt10'>

    <span class='fz18 lh24'>{{brandName}}</span>
    <span class='fz18 lh24 ml15'>{{createTime}}</span>
  </div>
  <div v-html='textContent' >
  </div>
</div>

</template>

<script>
export default {
  name: 'index',
  mixins: [],
  data: function () {
    return {
      textContent: '',
      title: '',
      brandName: '',
      createTime: ''
    }
  },
  mounted: function () {
    let arr = window.location.href.replace(/guideId=/g, '').replace(/materialId=/g, '').split('?')[1].split('&')
    let parms = {id: arr[1], guideId: arr[0]}
    this.$http.fetch(this.$api.isv.openQueryMaterial, parms)
          .then(resp => {
            this.title = resp.result.title
            this.brandName = resp.result.brandName
            this.textContent = resp.result.textContent.replace(new RegExp('<img', 'gi'), `<img style="background-size:contain;width:100%;height: auto;margin: 0 auto;display: block;"`)
            let newTime = new Date().getTime()
            let createTime = new Date(resp.result.createTime).getTime()
            let time = (newTime - createTime) / 1000
            if (time < (60 * 60 * 24)) {
              this.createTime = parseInt(time / 3600) + '小时前'
            } else if (time < (60 * 60 * 24 * 7)) {
              this.createTime = parseInt(time / (3600 * 24)) + '天前'
            } else {
              this.createTime = resp.result.createTime
            }
          })
          .catch(resp => {
            // that.$notify.error('提示：' + resp.msg)
          })
  },
  methods: {

  }
}
</script>
<style scoped>
img{
background-size:contain;
width:90% !important;
height: auto !important;
margin: 0 auto;
display: block
}
.articleMaterialDetail{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2006;
  background: white;
  min-width: 100%;
  min-height: 100%;
  padding: 0 5%;

}
</style>


