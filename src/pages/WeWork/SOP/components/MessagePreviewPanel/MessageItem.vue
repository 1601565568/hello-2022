<template>
  <div class="message-item" :class="{ 'message-item2': !avatar }">
    <img v-if="avatar" src="@/assets/default-avatar.png" alt="">
    <div class="message-detail">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    avatar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {
    showPreview () {
      this.$refs.NsPreview.toggleShow(1, this.srcList, 'img')
    }
  }
}
</script>

<style lang="scss" scoped>
.message-item {
  width: 100%;
  margin-top: 16px;
  display: flex;
  img {
    margin-left: 16px;
    width: 35px;
    height: 35px;
  }
  .message-detail {
    margin-left: 8px;
  }
}

.message-item2 {
  padding-bottom: 16px;
  border-bottom: 1px solid #EEEEEE;
}
</style>
