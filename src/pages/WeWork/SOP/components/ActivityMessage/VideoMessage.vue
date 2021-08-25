<template>
  <div class="video-message">
    <div class="video-area">
      <div v-if="videoThumbUrl.includes('http')">
        <img
          :src="videoThumbUrl"
        >
        <div class="video-mask" @click="showPreview">
          <div class="play-icon">
            <Icon class="icon" type="begin" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="video-default">
          <div class="play-icon">
            <Icon class="icon" type="begin" />
          </div>
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
  computed: {
    videoThumbUrl () {
      return `${this.content.mediaid}?x-oss-process=video/snapshot,t_0000,f_jpg,w_300,h_200,m_fast`
    }
  },
  methods: {
    showPreview () {
      if (this.preview) {
        this.$refs.NsPreview.toggleShow(0, [this.content.mediaid], 'video')
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
.video-default {
  width: 91px;
  height: 91px;
  background-color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  .play-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    position: relative;
    > svg {
      margin: 11px 0 0 14px;
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
