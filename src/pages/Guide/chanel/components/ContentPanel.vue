<template>
  <div class="content-container">
    <div class="content-header">
      <h3 v-if="title">{{title}}</h3>
      <slot name="toolbar"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [ 'title' ]
}
</script>

<style lang="scss" scoped>
.content-container {
  margin: 16px auto 0;
  width: calc(100% - 12px);
  background: #fff;
  border-radius: 4px;
  .content-header {
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      margin-left: 16px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
