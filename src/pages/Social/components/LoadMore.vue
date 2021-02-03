<template>
  <div class="loadMore" id="pageloadMore" ref="loadMore">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    scrollDistance: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  mounted () {
    // document
    //   .getElementById('pageloadMore')
    //   .addEventListener('scroll', this.scrollMoreData, false)
    document
      .getElementById('pageloadMore')
      .addEventListener(
        'scroll',
        this.throttle(this.scrollMoreData, 500, 1000),
        false
      )
  },
  destroyed () {
    document
      .getElementById('pageloadMore')
      .removeEventListener(
        'scroll',
        this.throttle(this.scrollMoreData, 500, 1000),
        false
      )
  },
  methods: {
    throttle (func, wait, mustRun) {
      var timeout
      var startTime = new Date()
      return function () {
        var context = this
        var args = arguments
        var curTime = new Date()
        clearTimeout(timeout)
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
          func.apply(context, args)
          startTime = curTime
          // 没达到触发间隔，重新设定定时器
        } else {
          timeout = setTimeout(func, wait)
        }
      }
    },
    scrollMoreData () {
      const scrollTop = this.$refs.loadMore.scrollTop
      const clientHeight = this.$refs.loadMore.clientHeight
      const scrollHeight = this.$refs.loadMore.scrollHeight
      const scroll = scrollHeight - this.scrollDistance
      if (scrollTop + clientHeight >= scroll) {
        console.log('滚动')
        this.$emit('scroll')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.loadMore {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  //   position: absolute;
  //   height: 100%;
}
</style>
