<template>
  <div class='skew-content'>
    <img class='hot-pre' src="@/assets/hot.png">
    <template v-for='(item,index) in hotNum'>
      <img class='hot-img' src='@/assets/sohot.png' :key='index'/>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    hotNum: {
      default: 5
    }
  }
}
</script>
<style lang="scss" scoped>
.skew-content {
  background: #F3F3F3;
  border-radius: 1px;
  transform: skew(-15deg);
  display: inline-block;
  padding: 4px 16px;
  .hot-pre {
    height: 18px;
    margin-right: 8px;
    transform: skew(15deg);
  }
  .hot-img {
    height: 24px;
    margin-right: 8px;
    transform: skew(15deg);
  }
}
</style>
