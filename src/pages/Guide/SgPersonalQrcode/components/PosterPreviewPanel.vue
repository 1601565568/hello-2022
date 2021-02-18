<template>
  <div class="poster-preview-container">
    <h3>效果展示</h3>
    <div class="mobile-panel">
      <div class="poster-content" :style='{backgroundImage:"url("+posterBackgroundUrl+")"}'>
         <!-- :isActive="isStating"
          :isDraggable='isStating'
          :isResizable='isStating' -->
        <VueDragResize
          :w="qrcodeSize || size"
          :h="qrcodeSize || size"
          :x="qrcodeX || x"
          :y="qrcodeY || y"
          :parentLimitation="true"
          :aspectRatio="true"
          @dragstop="onDragResize"
          @resizestop="onDragResize"
          :sticks="['tl','tr','bl','br']"
        >
          <img src='./images/qrcode.png' style="width: 100%; height: 100%">
        </VueDragResize>
      </div>
    </div>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize'

export default {
  components: {
    VueDragResize
  },
  props: [ 'posterBackgroundUrl', 'qrcodeSize', 'qrcodeX', 'qrcodeY' ],
  computed: {
    isStating () {
      if (this.posterBackgroundUrl) {
        return true
      }
      return false
    }
  },
  data () {
    return {
      size: 172,
      x: 67,
      y: 349
    }
  },
  methods: {
    onDragResize (info) {
      this.$emit('posterQrcode', {
        size: info.width,
        x: info.left,
        y: info.top
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.poster-preview-container {
  h3 {
    margin-top: 15px;
    text-align: center;
    font-size: 16px;
    color: #262626;
    font-weight: bold;
  }

  .mobile-panel {
    width: 350px;
    height: 660px;
    background: url('./images/iphone7.png') no-repeat;
    background-size: cover;
    margin: 49px auto 65px;
    overflow: hidden;
    .poster-content {
      position: relative;
      width: 320px;
      height: 569px;
      margin: 40px auto 0;
      background-size: cover;
      background-repeat: no-repeat;
      overflow: hidden;
      // .poster-qrcode {
      //   margin: 349px auto 0;
      //   width: 172px;
      //   height: 172px;
      //   img {
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
    }
  }
}
</style>
