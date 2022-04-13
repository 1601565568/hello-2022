<template>
  <div class="user-card">
    <a
        class="Abox"
        :href="url"
        target="_blank"
    >
      <div class="friendPic" v-if="image">
        <img
          :src="image"
          class="scope-title_img"
        />
      </div>
    <p>
      {{title}}
    </p>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      default: ''
    },
    title: {
      default: ''
    },
    image: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.user-card {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 8px;
  height: 80px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 12px;
  max-width:380px;
  .Abox {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #606266;
    line-height: 20px;
    .friendPic {
      width: 64px;
      height: 64px;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
