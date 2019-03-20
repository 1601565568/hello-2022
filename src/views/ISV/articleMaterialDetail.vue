<template>
  <div v-html='textContent'>
  </div>
</template>

<script>
export default {
  name: 'index',
  mixins: [],
  data: function () {
    return {
      textContent: ''
    }
  },
  mounted: function () {
    let arr = window.location.href.replace(/guideId=/g, '').replace(/materialId=/g, '').split('?')[1].split('&')
    let parms = {materialId: arr[1], guideId: arr[0]}
    this.$http.fetch(this.$api.isv.queryMaterial, parms)
          .then(resp => {
            this.textContent = resp.result.textContent
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

img {background-size:contain;
width:100%;
height: auto;
margin: 0 auto;
display: block
}
</style>
<style>
.loader-noCache{
  display: none !important
}
body{
  background: #ffffff ;
}
</style>


