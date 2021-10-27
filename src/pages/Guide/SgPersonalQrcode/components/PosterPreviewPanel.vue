<template>
  <div class="poster-preview-container">
    <h3>效果展示</h3>
    <div class="mobile-panel">
      <div class="poster-content" :style='{backgroundImage:"url("+encodeURI(posterBackgroundUrl)+")"}'>
        <VueDragResize
          v-if="showQrcode"
          :w="qrcodeSize"
          :h="qrcodeSize"
          :x="qrcodeX"
          :y="qrcodeY"
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
  props: [ 'posterBackgroundUrl', 'qrcodeSize', 'qrcodeX', 'qrcodeY', 'showQrcode' ],
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
    }
  }
}
</style>
