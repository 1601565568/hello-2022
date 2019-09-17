<template>
  <div>
    <!--选择商品结果列表-->
    <div  v-show="showBtn">
      <el-row class="tmp-choose">
        <el-col :span="24">
          <div class="tmp-choose__title">
            <ns-button type="primary" @click="onShow"><i class="bui-select-goods"></i>选择商品</ns-button>
            <span class="total">已选择<b class="text-danger padding-lr-base">{{confirmData.length}}</b>件商品</span></div>
        </el-col>
      </el-row>
    </div>
    <!-- 选择商品弹窗结构 -->
    <el-dialog title="选择商品" :visible="visible" class="g-wrapper" width="960px" :show-scroll-x="false" append-to-body
               height="500px" :response-limit=false :before-close="onClose">
      <el-row class="tmp-choose__condition" :gutter="20">
        <el-col :span="24">
          <el-form ref="form" :model="model" :inline="true">
            <el-form-item label="商品名称：">
              <el-form-grid size="sm">
                <el-input v-model="model.title"></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="商家编码：">
              <el-form-grid size="sm">
                <el-input v-model="model.outerId"></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="商品价格：">
              <el-form-grid>
                <el-form-grid size="sm">
                  <el-input :min="0" v-model="model.minPrice" :max="model.maxPrice"
                            class="text-right"></el-input>
                </el-form-grid>
                ~
                <el-form-grid size="sm">
                  <el-input type="" :min="model.minPrice" v-model="model.maxPrice"
                            class="text-right"></el-input>
                </el-form-grid>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="商品分类：">
              <el-form-grid size="sm">
                <ns-droptree @node-click="nodeClick" :url="$api.guide.goods.findCategoryTreeList"></ns-droptree>
              </el-form-grid>
            </el-form-item>
            <el-form-item style="margin-right: 0">
              <el-form-grid>
                <ns-button type="primary" @click="onSearch">{{$t('operating.search')}}</ns-button>
                <ns-button @click="onResetSearch">{{$t('operating.reset')}}</ns-button>
              </el-form-grid>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="tmp-choose__condition" :gutter="20">
        <el-col :span="16" class="condition-left">
          <el-table ref="table" :data="table.data" stripe
                    @select="onSelectRow"
                    @select-all="onSelectAll"
                    :key="pagination.currPage"
                    v-loading="tableLoading"
                    :element-loading-text="$t('prompt.loading')">
            <el-table-column type="selection" align="center" :width="50"></el-table-column>
            <el-table-column property="title" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column property="goods_code" label="商家编码" show-overflow-tooltip width="120">
              <template slot-scope="{row}">
                {{row.goods_code ? row.goods_code : '-'}}
              </template>
            </el-table-column>
            <el-table-column property="price" align="right" label="商品价格" show-overflow-tooltip
                             width="80"></el-table-column>
          </el-table>
          <el-pagination v-if="pagination.enable"
                         class="template-table-pagination"
                         layout="total, prev, pager, next, jumper"
                         :page-size="pagination.currSize"
                         :current-page.sync="pagination.currPage"
                         :total="pagination.total"
                         @current-change="onPageChange">
          </el-pagination>
        </el-col>
        <el-col :span="8" class="condition-right">
          <div class="tmp-choose__result">
            <p class="title">已选择了<span class="text-danger padding-lr-base">{{selectedData.length}}</span>件商品</p>
            <div v-if="selectedData.length>0">
              <el-scrollbar style="margin-top: 5px;">
                <ul class="tmp-choose__goods">
                  <li v-for="(item,index) in selectedData" :key='index'>
                    <span class="g-name">{{item[props.name]}}</span>
                    <a @click="onDelSelected('selectedData',index,item[props.unique])" class="delete-icon">
                      <i class="g-delete"><Icon fontType="el-icon-delete"/></i></a>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
            <ns-no-data height="335" v-else>请从左侧商品列表中选择</ns-no-data>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-button type="primary" @click="onConfirm">确定</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NsDroptree from 'web-crm/src/components/NsDroptree'
var tableMixin = {
  methods: {
    // 表格页数条数改变
    onSizeChange: function (val) {
      this.$set(this.pagination, 'currSize', val)
      this.$set(this.pagination, 'currPage', 1)
      this.reload()
    },
    // 当前页改变
    onPageChange: function (val) {
      this.$set(this.pagination, 'currPage', val)
      this.reload()
    },
    /**
       *  加载表格数据
       */
    reload: function () {
      let searchParams = {
        'searchMap': this.table.searchMap || {}
      }
      if (this.shopIds) {
        if (searchParams.searchMap === undefined) {
          searchParams.searchMap = {}
        }
        searchParams.searchMap.shopIds = this.shopIds
      }
      if (this.params) {
        searchParams.searchMap = Object.assign({}, searchParams.searchMap, this.params)
      }
      let params = Object.assign({}, this.limit, this.table.order, searchParams)
      this.queryTable(params)
    },
    /**
       * 查询表格数据
       * @param params
       */
    queryTable: function (params) {
      var that = this
      // 加载中
      that.tableLoading = true
      that.$http.fetch(that.tableApi, params).then(resp => {
        if (resp.result && resp.result.data && resp.result.data.length > 0) {
          that.$set(that.table, 'data', resp.result.data)
          that.$set(that.pagination, 'total', parseInt(resp.result.recordsTotal))
        } else {
          that.$set(that.table, 'data', [])
          that.$set(that.pagination, 'total', 0)
        }
      }).catch(() => {
        that.$notify.error('网络异常，获取数据失败！')
      }).finally(() => {
        if (that.pagination.total > 0) {
          that.$set(that.pagination, 'enable', true)
        } else {
          that.$set(that.pagination, 'enable', false)
        }
        that.tableLoading = false
        that.$nextTick(function () {
          that.toggleSelection(that.selectedData, that.table.data)
        })
      })
    }
  }
}
export default {
  name: 'NsGoodsSelectDialog',
  mixins: [tableMixin],
  components: {
    NsDroptree
  },
  data () {
    return {
      visible: false,
      table: {
        // 表格数据
        data: [],
        // 排序
        order: {
          orderKey: '',
          orderDir: ''
        },
        searchMap: {}
      },
      // 分页对象
      pagination: {
        enable: true,
        total: 0,
        currPage: 1,
        currSize: 10
      },
      model: {
        title: null,
        outerId: null,
        cate: {
          ext1: null
        },
        minPrice: null,
        maxPrice: null
      },
      selectedData: [],
      // 确认选择的数据
      confirmData: this.value || [],
      custom: 'custom',
      tableLoading: false
    }
  },
  props: {
    props: {
      type: Object,
      default: function () {
        return {
          unique: 'sys_item_id',
          name: 'title'
        }
      }
    },
    transSelectedData: {
      type: Function,
      default (data) {
        let transData = {}
        transData[this.props.unique] = data.sys_item_id
        transData[this.props.name] = data.title
        return transData
      }
    },
    maxSelectCount: {
      type: Number,
      default: function () {
        return 500
      }
    },
    showBtn: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    tableApi: {
      type: Object,
      default: function () {
        return this.$api.guide.goods.findGoodsList
      }
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    shopIds: String,
    params: {}
  },
  methods: {
    // 商品分类点击事件
    nodeClick: function (nodeData, node, instance) {
      this.model.cate.ext1 = nodeData.ext1
    },
    /**
       *  删除已选择
       */
    onDelSelected: function (dataName, index, unique) {
      // 删除
      this.$data[dataName].splice(index, 1)
      // 表格是否渲染
      if (this.$refs.table) {
        for (var i = 0; i < this.table.data.length; i++) {
          if (unique === this.table.data[i].sys_item_id) {
            // 删除表格选中
            this.$refs.table.toggleRowSelection(this.table.data[i], false)
            break
          }
        }
      }
    },
    // 数组去重
    uniqueArray: function (array) {
      var r = []
      for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (array[i][this.props.unique] === array[j][this.props.unique]) {
            j = ++i
          }
        }
        r.push(this.transSelectedData(array[i]))
      }
      return r
    },
    /**
       * 重置数据
       */
    resetData: function () {
      this.$set(this.table, 'pagination', this.$options.data().pagination)
      this.$set(this.table, 'order', this.$options.data().order)
      this.$set(this.table, 'searchMap', this.$options.data().searchMap)
      this.$set(this, 'selectedData', this.$options.data().selectedData)
      this.$set(this, 'model', this.$options.data().model)
    },
    /**
       * 勾选表格选中
       */
    toggleSelection: function (selected, rows) {
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < selected.length; j++) {
          if (rows[i].sys_item_id === selected[j][this.props.unique]) {
            this.$refs.table.toggleRowSelection(rows[i], true)
            break
          }
        }
      }
    },
    // 选中某行
    onSelectRow: function (selected, row) {
      var check = false
      for (var i = 0; i < selected.length; i++) {
        if (selected[i].sys_item_id === row.sys_item_id) {
          check = true
          break
        }
      }
      this.setSelectedData(check, row)
    },
    /**
       *
       * 设置选中的数据
       **/
    setSelectedData: function (check, row) {
      var showSelectedList = this.selectedData
      // 选中
      if (check) {
        showSelectedList.push(this.transSelectedData(row))
      } else {
        // 删除未勾选商品数据
        for (var j = 0; j < showSelectedList.length; j++) {
          if (showSelectedList[j][this.props.unique] === row.sys_item_id) {
            this.onDelSelected('selectedData', j, showSelectedList[j][this.props.unique])
            break
          }
        }
      }
    },
    /**
       * 表格勾选所有数据
       */
    onSelectAll: function (selected) {
      if (selected.length === 0) {
        for (var i = 0; i < this.table.data.length; i++) {
          // 选中表格某行
          this.setSelectedData(false, this.table.data[i])
        }
      } else {
        this.selectedData = this.uniqueArray(this.selectedData.concat(selected))
      }
    },
    /**
       * 显示弹窗
       */
    onShow: function () {
      // 设置选中
      this.$set(this, 'selectedData', JSON.parse(JSON.stringify(this.confirmData)))
      this.visible = true
      this.reload()
    },
    /**
       * 关闭弹窗
       */
    onClose: function () {
      this.visible = false
      this.resetData()
    },
    /**
       * 搜索
       */
    onSearch: function () {
      let searchMap = {
        title: this.model.title,
        goods_code: this.model.outerId,
        min_price: this.model.minPrice,
        max_price: this.model.maxPrice,
        goods_cids: this.model.cate.ext1
      }
      this.$set(this.table, 'searchMap', searchMap)
      this.pagination.currPage = 1
      this.reload()
    },
    /**
       * 重置搜索条件
       */
    onResetSearch: function () {
      this.$set(this, 'model', this.$options.data().model)
      this.$set(this.table, 'searchMap', {})
      this.pagination.currPage = 1
      this.reload()
    },
    /**
       * 确认选择
       */
    onConfirm: function () {
      if (this.selectedData.length > this.maxSelectCount) {
        this.$notify.warning('最多选择' + this.maxSelectCount + '件商品')
      } else {
        this.confirmData = JSON.parse(JSON.stringify(this.selectedData))
        this.visible = false
        this.callbackData()
        this.onResetSearch()
      }
    },
    /**
       * 返回数据
       */
    callbackData: function () {
      this.$emit('input', this.confirmData)
      this.$emit('change', this.confirmData)
    }
  },
  watch: {
    value: function (val) {
      this.confirmData = JSON.parse(JSON.stringify(val))
    },
    confirmData: function (val) {
      this.selectedData = JSON.parse(JSON.stringify(val))
    }
  },
  computed: {
    'limit': function () {
      return {
        start: (this.pagination.currPage - 1) * this.pagination.currSize,
        length: this.pagination.currSize
      }
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
.el-table th {
    line-height: 1;
  }
  .tmp-choose__result .title {
    line-height: 30px;
    background: #f3f4f4;
    padding: 0 8px;
    border-bottom: 1px solid var(--theme-base-border-color-primary);
  }
  .condition-left {
    width: 604px;
  }
  .condition-right {
    width: 346px;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  >>> .el-table--border th:first-child .cell, >>> .el-table--border td:first-child .cell {
    padding-left: 12px;
  }
  >>> .el-scrollbar {
    margin-top: 0 !important;
  }
  >>> .tmp-toggles {
    margin-top: 0 !important;
  }
  >>> .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  >>> .el-scrollbar__wrap {
    height: 347px;
  }
  >>> .el-loading-spinner .circular {
    height: 22px;
    width: 22px;
    position: relative;
    top: 5px;
  }
  >>> .el-table thead th {
    background-color: #F3F4F4;
  }
  .tmp-choose__goods {
    list-style: none;
    font-size: 12px;
    padding: var(--default-padding-base);
    background: var(--default-table-tr-hover);
  li {
    display: flex;
    flex-wrap: nowrap;
    padding: 0 3px;
  .delete-icon {
    padding: 3px 5px;
    position: relative;
    top: -3px;
  &
  :hover {
    color: var(--theme-color-warning);
  }
  }
  .g-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  }
  }
</style>
