<template>
  <div>
    <el-dialog
      title="查看详情"
      :visible.sync="sVisible"
      width="1000px"
      @closed="onClose">
      <div :style='{height}'>
      <div>
        <el-row>
          <el-col :span='4'>
            <img style='height:160px;width: 160px' :src='detailItem.head' />
          </el-col>
          <el-col :offset='1' :span='19'>
            <el-row style='height: 40px' align='middle' type='flex'>
              <span>个人号ID： {{detailItem.wid}}</span>
            </el-row>
            <el-row style='height: 40px' align='middle' type='flex'>
              <span>微信昵称： {{detailItem.nick}}</span>
            </el-row>
            <el-row style='height: 40px' align='middle' type='flex'>
              <span>绑定终端： {{detailItem.deviceNo}}</span>
            </el-row>
            <el-row style='height: 40px' align='middle' type='flex'>
              <span>绑定导购： {{detailItem.guideName}}</span>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <template v-for='(item,index) in tableList'>
            <ns-button v-if='item.show'
                       :key='item.name'
                       @click='onSwitchTable(index)'
                       :type="showTableIndex === index ? 'primary' : 'default'"
                       :plain='showTableIndex === index'>{{`${item.name}（${detailItem[item.key + 'Quantity']}）`}}</ns-button>
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
                <el-table-column :key='tableList[showTableIndex].key + item.name' :show-overflow-tooltip="true" type="default" :prop="item.key"
                                 :label="item.name" :sortable="item.sortable || false" :align='item.align || "left"'
                                 :width='item.width'>
                  <template slot-scope='scope'>
                    <span v-if='item.html' v-html='item.formatContent ? item.formatContent(scope.row) : defaultContent(scope.row,item,tableList[showTableIndex])'>
                    </span>
                    <span v-else>
                      {{item.formatContent ? item.formatContent(scope.row) : defaultContent(scope.row,item,tableList[showTableIndex])}}
                    </span>
                  </template>
                  <template slot='header' scope='header'>
                    <span>
                      <span>{{item.name}}</span>
                      <el-popover v-if='item.header' placement='bottom' width='220' trigger='hover' :content='item.header'>
                        <i slot='reference' class='table-header-icon'><Icon type="question-circle" /></i>
                      </el-popover>
                    </span>
                  </template>
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
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="sVisible = false">关闭</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/detail'

export default Index
</script>
<style scoped>
  @import "@theme/variables.pcss";
  >>> .table-header-icon {
    color: var(--theme-font-color-info);
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
</style>
