<template>
  <div>
    <el-dialog
      title="查看详情"
      :visible.sync="sVisible"
      width="1000px"
      height='500px'
      @closed="onClose">
      <div>
        <el-row>
          <template v-for='(item,index) in tableList'>
            <ns-button v-if='item.show'
                       :key='item.name'
                       @click='onSwitchTable(index)'
                       :type="showTableIndex === index ? 'primary' : 'default'"
                       :plain='showTableIndex === index'>{{`${item.name}（${item.quantity}）`}}</ns-button>
          </template>
        </el-row>
      </div>
      <div>
        <ns-page-table>
          <template slot="table">
            <el-table ref="table" :data="_data._table.data" class="template-table__main"
                      stripe
                      resizable v-loading.lock="_data._table.loadingtable"
                      :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$"
                      row-key="id"
                      @selection-change="$selectionChange">
              <template v-for='item of tableList[showTableIndex].columns'>
                <el-table-column :key='item.name' :show-overflow-tooltip="true" type="default" :prop="item.key"
                                 :label="item.name" :sortable="item.sortable || false" align='right'
                                 :render-header="renderHeader(item)">
                </el-table-column>
              </template>
            </el-table>
          </template>
          <template slot="pagination">
            <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                           :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                           :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                           layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                           @current-change="$pageChange$">
            </el-pagination>
          </template>
        </ns-page-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/detail'

export default Index
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
  >>> .table-header-icon {
    color: var(--theme-font-color-info);
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
</style>
