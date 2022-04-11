<template>
  <div class="picture">
    <div class="user-sharePic">
      <img
        v-for="(picitem, picindex) in imgList"
        :key="picindex"
        :src="picitem || defaultPic"
        @click="togglePreview(0, imgList, 'img')"
      />
    </div>
    <Preview ref="preview" />
  </div>
</template>
<script>
import Preview from '@/components/NsPreview'
export default {
  props: {
    imgList: {
      default () {
        return []
      }
    }
  },
  components: { Preview },
  methods: {
    /**
     * 图片、视频预览
     */
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-sharePic {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  img {
    width: 122px;
    height: 122px;
    margin-bottom: 4px;
    margin-right: 4px;
    object-fit: cover;
    &:nth-of-type(3n) {
      margin-right: 0px;
    }
  }
}
</style>
