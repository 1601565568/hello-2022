<template>
  <div>
    <!-- 自定义新的搜索工具栏结构 toolbar=false-->
    <slot name="custom-toolbar"></slot>
    <!-- 搜索工具栏结构 -->
    <bus-multi-filter v-if="toolbar"
                      :btns-info="toolbarBtnsInfo"
                      :grid="toolbarGrid"
                      :trisect="toolbarTrisect"
                      @submit-search="onSubmitSearch"
                      @reset-search="onResetSearch"
                      @recover-search="onRecoverSearch"
                      @clean-search="onCleanSearch"
                      @toolbar-btns-methods="onToolbarBtnsMethods">
      <template slot="btns">
        <slot name="toolbarBtns"></slot>
      </template>
      <template slot="singleform">
        <slot name="toolbarSingleform"></slot>
      </template>
      <template slot="multiform" v-if="$slots.toolbarMultiform">
        <slot name="toolbarMultiform"></slot>
      </template>
      <template slot="result">
        <slot name="toolbarResult"></slot>
      </template>
      <template slot="middle">
        <slot name="toolbarMiddle"></slot>
      </template>
    </bus-multi-filter>
    <el-table ref="temTable" class="template-table"
              :data="data"
              :class="tableParam.class"
              :width="tableParam.width"
              :height="tableParam.height"
              :maxHeight="tableParam.maxHeight"
              :fit="tableParam.fit"
              stripe
              :rowKey="tableParam.rowKey"
              :context="tableParam.context"
              :show-header="tableParam.showHeader"
              :show-summary="tableParam.showSummary"
              :sum-text="tableParam.sumText"
              :summary-method="tableParam.summaryMethod"
              :row-class-name="tableParam.rowClassName"
              :row-style="tableParam.rowStyle"
              :highlight-current-row="tableParam.highlightCurrentRow"
              :current-row-key="tableParam.currentRowKey"
              :empty-text="tableParam.emptyText"
              :expand-row-keys="tableParam.expandRowKeys"
              :default-expand-all="tableParam.defaultExpandAll"
              :default-sort="tableParam.defaultSort"
              :tooltip-effect="tableParam.tooltipEffect"
              v-loading.lock="loadingMask"
              :element-loading-text="loadingParam.text"
              @select="onSelect"
              @select-all="onSelectAll"
              @selection-change="onSelectionChange"
              @cell-mouse-enter="onCellMouseEnter"
              @cell-mouse-leave="onCellMouseLeave"
              @cell-click="onCellClick"
              @cell-dblclick="onCellDblclick"
              @row-click="onRowClick"
              @row-contextmenu="onRowContextmenu"
              @row-dblclick="onRowDblclick"
              @header-click="onHeaderClick"
              @sort-change="onSortChange"
              @filter-change="onFilterChange"
              @current-change="onCurrentChange"
              @header-dragend="onHeaderDragend"
              @expand="onExpand">
      <el-table-column v-if="selection"
                       :width="selectionColWidth"
                       type="selection"
                       align="center">
      </el-table-column>
      <template v-for='(column,index) in columnParam'>
        <el-table-column
          :type="column.type"
          :column-key="column.columnKey"
          :label="column.label"
          :prop="column.key"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sort || false"
          :formatter='column.formatter'
          :align="column.align || 'center'"
          :filters='column.filterList'
          :filter-method="column.filterMethod"
          :filter-multiple="column.filterMultiple"
          :style='column.style'
          :resizable="column.resizable"
          :show-overflow-tooltip="column.showTooltip">
        </el-table-column>
      </template>
      <!-- 预留标签 模板配置 -->
      <slot></slot>
      <!-- 操作列按钮组 配置 -->
      <el-table-column
        v-if="columnBtnsParam"
        align="center"
        :label="columnBtnsParam.label || '操作'"
        :width="columnBtnsParam.width || 50">
        <template slot-scope="scope">
          <div class="tmp-cell__buttons">
            <!-- 一个及两个操作项 -->
            <template v-if="columnBtnsParam.list.length < 3" v-for="(btn,index) in columnBtnsParam.list">
              {{(index === 1) ? '|' : ''}}
              <ns-button :key="btn.text"
                         type="text"
                         @click.native.prevent='onCustomBtnEvent({data: data, dataRow: scope.row, dataRowIndex: scope.$index, btnIndex: index, btnInfo: btn})'>
                {{btn.text}}
              </ns-button>
            </template>
            <!-- 两个以上操作项 -->
            <template v-if="columnBtnsParam.list.length >= 3">
              <ns-button v-for="(btn,index) in columnBtnsParam.list"
                         v-if="index === 0"
                         :key="btn.text"
                         type="text"
                         @click.native.prevent='onCustomBtnEvent({data: data, dataRow: scope.row, dataRowIndex: scope.$index, btnIndex: index, btnInfo: btn})'>
                {{btn.text}}
              </ns-button>
              <el-dropdown trigger="click" menu-align="end"
                           @command="onCustomBtnEvent">
                <span class="el-dropdown-link">  更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(btn,index) in columnBtnsParam.list"
                                    v-if="index !== 0"
                                    :key="btn.text"
                                    :command="{data: data, dataRow: scope.row, dataRowIndex: scope.$index, btnIndex: index, btnInfo: btn}">
                    {{btn.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </div>
        </template>
      </el-table-column>
      <template slot="append">
        <slot name="append"></slot>
      </template>
    </el-table>
    <el-pagination
      ref="temPagination"
      class="template-table-pagination"
      v-if='pagination  && ( (pagination.total!==undefined && pagination.total>0) || (pagination["page-count"]!==undefined && pagination["page-count"]>0) )'
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync='pagination.currentPage'
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      :page-count="pagination['pageCount']"
      :total="pagination.total"
      @current-change='currentPageChange'
      @size-change='pageSizeChange'>
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'NsTable',
    data () {
      return {
        loadingMask: false
      }
    },
    props: {
      toolbar: Boolean,
      toolbarTrisect: Boolean,
      toolbarBtnsInfo: Array,
      toolbarGrid: {
        type: Array,
        default () {
          return [16, 8]
        }
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      tableParam: {
        type: Object,
        default () {
          return {}
        }
      },
      columnParam: Array,
      // 操作列配置
      columnBtnsParam: {
        type: Object,
        default () {
        }
      },
      selection: {
        type: Boolean,
        default: true
      },
      selectionColWidth: {
        type: Number,
        default: 34
      },
      loadingParam: {
        type: Object,
        default () {
          return {
            text: '正在加载...'
          }
        }
      },
      pagination: {
        type: Object,
        default () {
          return {
            currentPage: 1
          }
        }
      },
      layout: 'total, sizes, prev, pager, next, jumper'
    },
    methods: {
      /**
       * 自定义搜索工具栏按钮组事件
       * @param btn
       */
      onToolbarBtnsMethods (btn) {
        // 数据中有配置fn时，使用数据中的fn，否则对事件进行派发出去
        if (btn.fn) {
          btn.fn(btn)
        } else {
          this.$emit('toolbar-btns-methods', btn)
        }
      },
      /**
       * 自定义表格操作列按钮事件
       * @param opts
       */
      onCustomBtnEvent (opts) {
        // 数据中有配置fn时，使用数据中的fn，否则对事件进行派发出去
        if (opts.btnInfo.fn) {
          opts.btnInfo.fn(opts)
        } else {
          this.$emit('column-btns-methods', opts)
        }
      },
      /**
       * 改变当前页码事件
       * @param  {number} page 当前页面
       */
      currentPageChange (page) {
        this.$emit('current-page-change', page)
      },

      /**
       * 改变每页显示的数量事件
       * @param  {number} page_size 每页显示的数量
       */
      pageSizeChange (pageSize) {
        this.$emit('page-size-change', pageSize)
      },
      // 提交筛选
      onSubmitSearch () {
        this.$emit('submit-search')
      },
      // 重置筛选条件
      onResetSearch () {
        this.$emit('reset-search')
      },
      // 清空筛选条件
      onCleanSearch () {
        this.$emit('clean-search')
      },
      // 修改筛选条件
      onRecoverSearch () {
        this.$emit('recover-search')
      },
      /**
       * 表格原事件 event派发
       */
      onSelect (selection, row) {
        this.$emit('select', selection, row)
      },
      onSelectAll (selection, row) {
        this.$emit('select-all', selection, row)
      },
      onSelectionChange (rows) {
        this.$emit('selection-change', rows)
      },
      onCellMouseEnter (row, column, cell, event) {
        this.$emit('cell-mouse-enter', row, column, cell, event)
      },
      onCellMouseLeave (row, column, cell, event) {
        this.$emit('cell-mouse-leave', row, column, cell, event)
      },
      onCellClick (row, column, cell, event) {
        this.$emit('cell-click', row, column, cell, event)
      },
      onCellDblclick (row, column, cell, event) {
        this.$emit('cell-dblclick', row, column, cell, event)
      },
      onRowClick (row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      onRowContextmenu (row, event) {
        this.$emit('row-contextmenu', row, event)
      },
      onRowDblclick (row, event) {
        this.$emit('row-dblclick', row, event)
      },
      onHeaderClick (column, event) {
        this.$emit('header-click', column, event)
      },
      onSortChange ({column, prop, order}) {
        this.$emit('sort-change', {column, prop, order})
      },
      onFilterChange (filters) {
        this.$emit('filter-change', filters)
      },
      onCurrentChange (currentRow, oldCurrentRow) {
        this.$emit('current-change', currentRow, oldCurrentRow)
      },
      onHeaderDragend (newWidth, oldWidth, column, event) {
        this.$emit('header-dragend', newWidth, oldWidth, column, event)
      },
      onExpand (row, expanded) {
        this.$emit('expand', row, expanded)
      },
      /**
       * /end 表格原事件 event派发
       */
      /**
       * 表格原方法methods
       */
      clearSelection (selection) {
        return this.$refs.temTable.clearSelection(selection)
      },

      toggleRowSelection (row, selected) {
        return this.$refs.temTable.toggleRowSelection(row, selected)
      },

      setCurrentRow (row) {
        return this.$refs.temTable.setCurrentRow(row)
      }
      /**
       * end/表格原事件
       */
    },
    watch: {
      data (data) {
        if (data) {
          this.loadingMask = false
        }
      }
    }
  }
</script>
