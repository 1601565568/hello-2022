<template>
  <div class="template-page">
    <div class="page-header fl_c">
      <div><slot name="Col-l" /></div>
      <div><slot name="Col-R" /></div>
    </div>
    <!-- 内容 -->
    <div>
      <el-row class="fl">
        <el-col class="pageContent pageContentLeft" :span="24"
          ><slot name="pageContentLeft"
        /></el-col>
        <el-col class="pageContent pageContentright" :span="24"
          ><slot name="pageContentright"
        /></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    Col: {
      default: 21
    }
  }
}
</script>
<style lang="scss" scoped>
.template-page {
}
.fl {
  display: flex;
}
.fl_c {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pageContentLeft {
  // width: 19%;
  border-radius: 4px 0px 0px 4px;
  // border-right: 1px solid #e8e8e8;
}
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 0px 16px;
  min-height: 66px;
  margin-bottom: 16px;
}
.pageContent {
  background: #ffffff;
  height: calc(100vh - 183px);
}
@media screen and (max-width: 1625px) {
  .pageContent {
    height: calc(100vh - 163px);
  }
}
</style>
