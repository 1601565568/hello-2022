<template>
  <div class="picture">
    <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :preview-src-list="srcList">
    </el-image>
  </div>
</template>
<script>
export default {
  props: {
    imgList: {
      default () {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
