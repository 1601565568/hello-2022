<template>
  <div class="vc-alpha">
    <div class="vc-alpha-checkboard-wrap">
      <checkboard></checkboard>
    </div>
    <div class="vc-alpha-gradient" :style="{ background: gradientColor }"></div>
    <div
      class="vc-alpha-container"
      ref="container"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange"
    >
      <div class="vc-alpha-pointer" :style="{ top: colors.a * 100 + '%' }">
        <div class="vc-alpha-picker"></div>
      </div>
    </div>
  </div>
</template>

<script>
import checkboard from './Checkboard.vue'

export default {
  name: 'Alpha',
  props: {
    value: Object,
    onChange: Function
  },
  components: {
    checkboard
  },
  computed: {
    colors () {
      return this.value
    },
    gradientColor () {
      var rgba = this.colors.rgba
      var rgbStr = [rgba.r, rgba.g, rgba.b].join(',')
      return (
        'linear-gradient(to bottom, rgba(' +
        rgbStr +
        ', 0) 0%, rgba(' +
        rgbStr +
        ', 1) 100%)'
      )
    }
  },
  methods: {
    handleChange (e, skip) {
      !skip && e.preventDefault()
      var container = this.$refs.container
      if (!container) {
        // for some edge cases, container may not exist. see #220
        return
      }
      var containerWidth = container.clientWidth
      var containerHeight = container.clientHeight

      // var xOffset = container.getBoundingClientRect().bottom + window.pageXOffset
      // var xOffset = container.getBoundingClientRect().left + window.pageXOffset
      // var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
      // var left = pageX - xOffset

      const xOffset = container.getBoundingClientRect().left + window.pageXOffset
      const yOffset = container.getBoundingClientRect().top + window.pageXOffset
      const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
      const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
      // const left = clamp(pageX - xOffset, 0, containerWidth)
      // const top = clamp(pageY - yOffset, 0, containerHeight)
      var top = pageY - yOffset
      var a
      if (top < 0) {
        a = 0
      } else if (top > containerHeight) {
        a = 1
      } else {
        a = Math.round((top * 100) / containerHeight) / 100
      }

      if (this.colors.a !== a) {
        this.$emit('change', {
          h: this.colors.hsl.h,
          s: this.colors.hsl.s,
          l: this.colors.hsl.l,
          a: a,
          source: 'rgba'
        })
      }
    },
    handleMouseDown (e) {
      this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp () {
      this.unbindEventListeners()
    },
    unbindEventListeners () {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>

<style>
.vc-alpha {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-checkboard-wrap {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
  border: 1px solid #979797;
border-radius: 9px;
}
.vc-alpha-gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}
.vc-alpha-pointer {
  z-index: 2;
  position: absolute;
}
.vc-alpha-picker {
  cursor: pointer;
  width: 14px;
  height: 14px;
  background: #FFFFFF;
  border: 1px solid #979797;
  border-radius: 50%;
}
</style>
