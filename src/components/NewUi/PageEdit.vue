<template>
  <div class='edit-container'>
    <div class='edit-header'>
      <slot name='header'></slot>
    </div>
    <div class='edit-content'>
      <slot name='content'></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.edit-content {
  margin-top: 16px;
  max-height: calc( 100vh - 172px);
  overflow: auto;
    &::-webkit-scrollbar-thumb {
        display: none
    }
    &::-webkit-scrollbar-track {
        display: none
    }
    &::-webkit-scrollbar {
     display: none
      /*height: 4px;*/
    }
  }
  @media screen and ( max-width: 1625px ) {
    .edit-content {max-height: calc( 100vh - 152px);}
  }
</style>
