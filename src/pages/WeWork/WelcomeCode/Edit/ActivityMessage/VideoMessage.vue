<template>
  <div class="video-message">
    <div class="video-area">
      <img
        :src="videoThumbUrl"
      >
      <!-- <span v-if="preview" class="video-total">3个</span> -->
      <div class="video-mask" @click="showPreview">
        <div class="play-icon">
          <Icon class="icon" type="begin" />
        </div>
      </div>
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
          type: 'video',
          video: ''
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
  computed: {
    videoThumbUrl () {
      return `${this.content.video}?x-oss-process=video/snapshot,t_0000,f_jpg,w_300,h_200,m_fast`
    }
  },
  methods: {
    showPreview () {
      if (this.preview) {
        this.$refs.NsPreview.toggleShow(0, [this.content.video], 'video')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-message {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  .video-area {
    position: relative;
    height: 100%;
    img {
      max-height: 100%;
      max-width: 100%;
      cursor: pointer;
    }
    .video-total {
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
    .video-mask {
      cursor: pointer;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .play-icon {
        text-align: center;
        padding-left: 2px;
        color: #FFFFFF;
        width: calc(60 / 242 * 100%);
        height: calc(60 / 161 * 100%);
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 50%;
          height: 50%;
        }
      }
    }
  }
}
</style>
