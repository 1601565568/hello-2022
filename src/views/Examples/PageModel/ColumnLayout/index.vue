<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-input placeholder="搜索"  @keyup.enter.native="">
          <i class="el-icon-search el-input__icon" slot="suffix" name="target" @click=""></i>
        </el-input>
        <el-scrollbar ref="pageLeft">
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            @node-collapse="onCloseNode"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="template-page__row-right">
        <column-table></column-table>
      </div>
    </div>
  </div>
</template>

<script>
  import index from './src/index'
  import ColumnTable from './ColumnTable'
  index.components = {
    ColumnTable
  }
  export default index
</script>
