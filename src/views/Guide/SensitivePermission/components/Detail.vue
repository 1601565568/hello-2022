<template>
  <div>
    <el-dialog
      title="查看详情"
      :visible.sync="sVisible"
      width="1000px" response-limit :show-scroll-x=false
      @closed="onClose">
      <div>
        <div class="header">
          <el-image
            :width="80" :height="80"
            :src="detailItem.head||require('./src/images/avartar.png')"
            mode="cover" :circle="true" class="header__avatar"></el-image>
          <el-form label-width="80px" class="header__form">
            <el-form-item label="个人号ID：">
              {{detailItem.wid}}
            </el-form-item>
            <el-form-item label="微信昵称：">
              {{detailItem.nick}}
            </el-form-item>
            <el-form-item label="绑定终端：">
              {{detailItem.deviceNo}}
            </el-form-item>
            <el-form-item label="绑定导购：">
              {{detailItem.guideName}}
            </el-form-item>
          </el-form>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <template v-for='(item,index) in tableList'>
            <el-tab-pane v-if='item.show' :label="`${item.name}(${detailItem[item.key + 'Quantity']})`" :name="index + ''"
                         :key='item.name'>
            </el-tab-pane>
          </template>
        </el-tabs>
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
                      <el-tooltip v-if='item.header' :content='item.header'>
                       <Icon type="question-circle"/>
                      </el-tooltip>
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
  .header {
    display: flex;
    align-items: center;
    padding: 0 20px var(--default-padding-larger);
    .header__avatar {
      flex-shrink: 0;
    }
    .header__form {
      margin-left: var(--default-margin-larger);
    }
  }
</style>
