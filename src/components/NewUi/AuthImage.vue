<template>
  <div ref='content'>
    <img v-bind="$attrs" :src='src'/>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      required: true,
      type: String
    },
    isAuth: {
      default: true
    }
  },
  methods: {
    wxImgUrl (parent, url) {
      return new Promise((resolve, reject) => {
        const random = Date.now()
        const imgId = 'img_' + random
        const frameid = 'frameimg' + random
        window['img' + random] = '<img id=' + imgId + ' src=\'' + url + '?' + random + '\' style = "width: 100%; height: 100%; object-fit: cover;"/><script>window.onload = function() { ' +
        'parent.document.getElementById(\'' + frameid + '\').contentWindow.document.body.style.margin = 0 }<' + '/script>'
        const html = '<iframe id="' + frameid +
          '" src="javascript:parent.img' + random + ';" frameBorder="0" scrolling="no" width="100%" height="100%" style= " margin:0; height: 100%;"></iframe>'
        parent.innerHTML = html
        resolve(true)
      })
    }
  },
  mounted () {
    if (this.$refs.content && this.isAuth) {
      this.wxImgUrl(this.$refs.content, this.src)
    }
  },
  watch: {
    src: {
      handler (newVal) {
        // if (newVal && this.isAuth) {
        //   const request = new XMLHttpRequest()
        //   request.responseType = 'blob'
        //   request.open('get', newVal, true)
        //   request.setRequestHeader('Referer', 'no-referer')
        //   request.onreadystatechange = e => {
        //     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        //       // img.src = URL.createObjectURL(request.response)
        //       // img.onload = () => {
        //       //   URL.revokeObjectURL(img.src)
        //       // }
        //       console.log(URL.createObjectURL(request.response))
        //     }
        //   }
        //   request.send(null)
        // } else {
        //   this.imgSrc = newVal
        // }
        if (this.$refs.content && this.isAuth) {
          this.wxImgUrl(this.$refs.content, newVal)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
