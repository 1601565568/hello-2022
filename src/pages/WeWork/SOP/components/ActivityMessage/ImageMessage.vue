<template>
  <div class="image-message">
    <div class="image-area">
      <img
        :src="content.mediaid"
        @click="showPreview"
      >
      <span v-if="preview" class="image-total">{{previewList.length}}张</span>
    </div>
    <NsPreview v-if="preview" ref="NsPreview"/>
  </div>
</template>

<script>
import NsPreview from '@/components/NsPreview'

export default {
  components: {
    NsPreview
  },
  props: {
    content: {
      type: Object,
      default: function () {
        return {
          type: 'image',
          mediaid: ''
        }
      }
    },
    preview: { // 是否支持预览
      type: Boolean,
      default: false
    },
    previewList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'http://taosha01-1253585015.cos.ap-shanghai.myqcloud.com/taosha/d620bec0-d61c-11ea-9c32-1172a154412d.png?imageMogr2/crop/100x100/center',
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
    }
  },
  mounted () {},
  methods: {
    showPreview () {
      if (this.preview) {
        this.$refs.NsPreview.toggleShow(0, this.previewList, 'img')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-message {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  .image-area {
    position: relative;
    height: 100%;
    img {
      max-height: 100%;
      min-height: 100%;
      max-width: 100%;
      min-width: 100%;
      // width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .image-total {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 36px;
      height: 24px;
      background: rgba(0,0,0,0.65);
      color: #FFFFFF;
      text-align: center;
      line-height: 24px;
    }
  }

}
</style>
