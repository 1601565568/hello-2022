<template>
  <div class="table-video">
    <video
      :poster="posterUrl" :src="videoUrl"
    >
      您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
    </video>
    <div class="tableItem-video__mask">
      <div class="tableItem-video__wrapper">
        <Icon type="begin" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    videoUrl: {
      default: ''
    },
    posterUrl: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
