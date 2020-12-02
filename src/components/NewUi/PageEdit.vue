<template>
  <div class="edit-container">
    <div class="edit-header">
      <slot name="header"></slot>
    </div>
    <ScrollView className='edit-content'>
      <slot name="content"></slot>
    </ScrollView>
  </div>
</template>
<script>
import ScrollView from './ScrollView'
export default {
  components: { ScrollView }
}
</script>
<style lang="scss" scoped>
.edit-content {
  margin-top: 16px;
  max-height: calc(100vh - 172px);
  // overflow: auto;
  // &::-webkit-scrollbar-thumb {
  //   display: none;
  // }
  // &::-webkit-scrollbar-track {
  //   display: none;
  // }
  // &::-webkit-scrollbar {
  //   display: none;
  //   /*height: 4px;*/
  // }
}
@media screen and (max-width: 1625px) {
  .edit-content {
    max-height: calc(100vh - 152px);
  }
}
</style>
