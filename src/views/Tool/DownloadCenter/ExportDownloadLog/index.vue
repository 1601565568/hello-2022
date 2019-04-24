<template>
  <div class="template-page">
    <ns-table-export-log ref="table"> </ns-table-export-log>
  </div>
</template>

<script>
import index from './src/index'
import NsTableExportLog from './NsTableExportLog'
index.components = {
  NsTableExportLog
}
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .plat-item {
    border-bottom: 1px solid var(--theme-base-border-color-primary);
    .plat-item__label {
      display: inline-block;
      height: 100%;
      padding: 0 var(--default-padding-xlarger);
      background: var(--theme-color-primary);
      color: var(--theme-color-white);
      border-radius: var(--default-radius-small) var(--default-radius-small) 0 0;
    }
  }
  /* 关联店铺的样式*/
  .relevance-shop__title{
    padding:var(--default-margin-base) var(--default-margin-base) var(--default-margin-larger);
  i{
    background: var(--theme-color-primary);
    width: 24px;
    height:24px;
    border-radius: 100%;
    color:#fff;
    display: inline-block;
    margin-right: 3px;
  &:before{
     font-size: 14px;
     line-height: 22px;
     position: relative;
     left: 4px;
     top: 0;
   }
  }
  }
  .relevance-shop__main{
  >>> .el-form{
    padding:var(--default-margin-base);
  }
  width:100%;
  border:1px solid var(--theme-base-border-color-primary);
  .relevance-shop__content{
    padding:var(--default-margin-base);
    width:100%;
  >>> .el-checkbox{
    width:32.7%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right:var(--default-margin-base);
  &+.el-checkbox{
     margin-left:0;
   }
  }
  }
  .relevance-shop__footer{
    border-top:1px solid var(--theme-base-border-color-primary);
    padding:var(--default-margin-base);
  >>> .el-checkbox{
    line-height: var(--default-form-item-small-height);
  }
  >>> .el-pagination{
    padding:0;
    display: inline-block;
  }
  }
  }
  /* 关联店铺的样式-end*/
</style>
