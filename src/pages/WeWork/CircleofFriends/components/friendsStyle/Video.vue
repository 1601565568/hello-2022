<template>
  <div>
    <div
      class="user-video"
      @click="
        togglePreview(
          0,
          [
            `${videoUrl}`
          ],
          'video'
        )
      "
    >
      <video
          :src="videoUrl"
          :poster="posterUrl"
      >
        您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
      </video>
      <div class="tableItem-video__mask">
        <div class="tableItem-video__wrapper">
          <Icon type="begin" />
        </div>
      </div>
    </div>

      <Preview ref="preview" />
  </div>
</template>
<script>
import Preview from '@/components/NsPreview'
export default {
  props: {
    videoUrl: {
      default: ''
    },
    posterUrl: {
      default: ''
    }
  },
  components: { Preview },
  methods: {
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-video {
  position: relative;
  width: 214px;
  height: 160px;
  margin-bottom: 12px;
  > video {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    -o-object-fit: cover;
    object-fit: cover;
  }
  .tableItem-video__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
    border-radius: 3px;
  }
  .tableItem-video__wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -11px;
    margin-top: -11px;
    width: 22px;
    height: 22px;
    border-radius: 22px;
    background-color: rgba(255, 255, 255, 0.4);
    > svg {
      margin: 5px 0 0 6px;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
