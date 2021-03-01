<template>
  <!-- <iframe :src='src' /> -->
  <img v-bind="$attrs" :src='imgSrc'/>
</template>
<script>
export default {
  data () {
    return {
      imgSrc: ''
    }
  },
  props: {
    src: {
      required: true,
      type: String
    },
    isAuth: {
      default: true
    }
  },
  watch: {
    src: {
      handler (newVal) {
        if (newVal && this.isAuth) {
          const request = new XMLHttpRequest()
          request.responseType = 'blob'
          request.open('get', newVal, true)
          request.setRequestHeader('Referer', 'http://www.baidu.com')
          request.onreadystatechange = e => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
              // img.src = URL.createObjectURL(request.response)
              // img.onload = () => {
              //   URL.revokeObjectURL(img.src)
              // }
              console.log(URL.createObjectURL(request.response))
            }
          }
          request.send(null)
        } else {
          this.imgSrc = newVal
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
