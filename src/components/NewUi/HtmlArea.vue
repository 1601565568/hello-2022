<template>
  <div class='html-area' @click='handleClick'>
    <div class="html-area_context">
      <slot></slot>
    </div>
    <div class="suffix">
      <slot name='suffix'></slot>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick () {
      this.$emit('onOpen')
    }
  }
}
</script>
<style lang="scss" scoped>
.html-area {
  display: flex;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  position: relative;
  padding-right: 30px;
  .html-area_context {
    min-height: 32px;
    max-height: 80px;
    overflow-y: auto;
    word-break: break-all;
  }
  /*滚动条样式*/
  .html-area_context::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
  }
  .html-area_context::-webkit-scrollbar-thumb {
      display: none
  }
  .html-area_context::-webkit-scrollbar-track {
      display: none
  }
  .suffix {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 1px;
    right: 1px;
    bottom: 1px;
    overflow: hidden;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
}
</style>
