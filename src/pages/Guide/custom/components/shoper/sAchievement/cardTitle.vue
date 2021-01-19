<template>
  <div class="cardTitle">
    <div class="cardTitle-title">
      <div class="cardTitle-title__left">
        <slot name="image"></slot>
        <span>{{ title }}</span>
      </div>
      <div class="cardTitle-title__right">
        <slot name="cardTitleother"></slot>
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
.cardTitle {
  margin-bottom: 8px;
  color: #262626;
  background: #fff;
  .cardTitle-title__left {
    display: flex;
    align-items: center;
  }
  .cardTitle-title {
    font-weight: bold;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    font-size: 17px;
    border-bottom: 1px solid #e8e8e8;
    // margin-bottom: 8px;
    .dataIcon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    span {
      font-size: 17px;
    }
  }
  .cardTitle-title__right {
    height: 100%;
  }
}
</style>
