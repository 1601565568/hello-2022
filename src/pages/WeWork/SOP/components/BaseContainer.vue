<template>
  <div class="base-container">
    <!-- <h3 v-if="title">{{title}}</h3> -->
    <!-- <slot name="header"></slot> -->
    <slot></slot>
  </div>
</template>

<script>
export default { }
</script>

<style lang="scss" scoped>
.base-container {
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
}
</style>
