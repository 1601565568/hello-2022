<template>
  <div class="image-message">
    <div class="image-area">
      <img
        :src="content.image"
        @click="showPreview"
      >
      <span v-if="preview && total" class="image-total">{{previewList.length}}张</span>
    </div>
    <NsPreview v-if="preview" ref="NsPreview" :appendToBody="true"/>
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
          image: ''
        }
      }
    },
    preview: { // 是否支持预览
      type: Boolean,
      default: false
    },
    total: { // 是否显示总数统计
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
      // height: 100%;
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
