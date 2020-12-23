<template>
  <div
    :class="'scroll-view ' + className"
    :style="{ height: height ? height + 'px' : 'auto' }"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: ['className', 'height']
}
</script>

<style lang="scss" scoped>
.scroll-view {
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar-thumb {
    display: none;
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
