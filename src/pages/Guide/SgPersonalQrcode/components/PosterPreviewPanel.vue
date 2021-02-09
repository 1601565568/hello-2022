<template>
  <div class="poster-preview-container">
    <h3>效果展示</h3>
    <div class="mobile-panel">
      <div class="poster-content" :style='{backgroundImage:"url("+posterImage+")"}'>
        <!-- <div class="poster-qrcode">
          <img src="./images/qrcode.png" alt="">
        </div> -->
         <!-- :isActive="!isStating"
          :isDraggable='!isStating'
          :isResizable='!isStating' -->
        <VueDragResize
          :w="width"
          :h="height"
          :x="x"
          :y="y"
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
  props: [ 'posterImage' ],
  data () {
    return {
      width: 172,
      height: 172,
      x: 67,
      y: 349
    }
  },
  methods: {
    onDragResize () {
      window.console.log('onDragResize')
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
