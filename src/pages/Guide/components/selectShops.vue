<template>
<!-- 选择门店 wanrengang 20180818 -->
<div class="selectShopBox">
  <el-dialog
    title="选择门店"
    :close-on-press-escape='true'
    :close-on-click-modal='false'
    :visible.sync="dialogVisible"
    width="900px" :response-limit=false append-to-body
    :before-close="handleClose">
      <div class="content">
        <div class="searchAction">
          <div class="searchAction_top">
            <el-form ref="table_filter_form" :model="model" label-width="70px" :inline="true">
              <el-form-item>
                <el-form-grid>
                  <el-form-item label="店铺名称：">
                    <el-input autofocus=true v-model="model.shopName" placeholder="请输入门店名称" clearable></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  <el-form-item label="门店类型：">
                    <el-select placeholder="请选择门店类型" v-model="model.shopType" clearable filterable>
                      <el-option v-for="shop in shopLeiXing" :label="shop.label" :value="shop.value"
                                 :key="shop.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  <el-form-item label="所属地区：" prop="area">
                    <ns-area  :props="searchform.key" @change="onAreaChange" v-model="model.area" clearable></ns-area>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  <el-form-item>
                    <ns-button type="primary" @click="searchAction(searchform)">搜索</ns-button>
                    <ns-button @click="resetInputAction(searchform)">重置</ns-button>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tableBox">
          <el-scrollbar class="scrollbara">
            <el-table
              ref="shopTable"
              :data="dataList"
              :row-key="getRowKey"
              tooltip-effect="dark"
              style="width: 100%" v-loading="tableLoading"
              :element-loading-text="$t('prompt.loading')"
              @select="onSelectRow"
              @select-all="onSelectAll" stripe>
              <el-table-column type="selection" align="center" :width="50" :reserve-selection="true"></el-table-column>
              <el-table-column prop="shopName"  label="门店名称"></el-table-column>
            </el-table>
          </el-scrollbar>
          <el-pagination v-if="pagination.enable" class="template-table-pagination"
                         :page-sizes="pagination.sizeOpts"
                         :total="pagination.total"
                         :current-page.sync="pagination.page"
                         :page-size="pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </div>
        <div class="selecedBox">
          <el-scrollbar class="scrollbarb">
            <div class="tit">已选择<em>{{multipleSelection.length}}</em>门店</div>
            <ul class="list">
              <li v-for="(item) in multipleSelection" :key="item.id">
                <span class="name">{{item.shopName}}</span>
                <span class="del text-primary" @click="toggleSelection([item])"><Icon type="delete" className="g-delete"/></span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeFun">关闭</ns-button>
        <ns-button  type="primary" @click="okFun">确定</ns-button>
      </div>
  </el-dialog>
  <ns-button  type="primary" @click="openFun">选择门店</ns-button> 已选择<span class="text-error">{{hasShopArr.length}}</span>家门店
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    api: {
      type: Object,
      default () {
        return this.$api.guide.guide.findShopListOnCondition
      }
    },
    hasShopArr: {
      type: Array,
      default () {
        return []
      }
    },
    params: {},
    callBack: Function// 选择完后的回调
  },
  mixins: [listPageMixin, tableMixin],
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      dataList: [],
      multipleSelection: [],
      selected: [],
      model: {
        shopName: null,
        shopType: null,
        children: null,
        disabled: null,
        city: null,
        area: []
      },
      models: {
        searchMap: {}
      },
      shopLeiXing: [{
        value: 'ZYD',
        label: '直营店'
      }, {
        value: 'JMD',
        label: '加盟店'
      }, {
        value: 'LYD',
        label: '联营店'
      }],
      searchform: { // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        }
      }
    }
  },
  methods: {
    resetInputAction () { // 重置功能
      this.model.shopName = null
      this.model.area = []
      this.model.shopType = null
      this.loadListFun({
        searchMap: {}
      })
    },
    searchAction () { // 搜索功能
      this.models.searchMap = this.model
      this.selected = this.multipleSelection
      this.loadListFun(this.models)
    },
    onAreaChange () { // 城市切换进行赋值
      let that = this
      that.model.district = that.model.area[2]
      that.model.city = that.model.area[1]
      that.model.province = that.model.area[0]
    },
    okFun () {
      let arr = []
      this.multipleSelection.forEach(item => {
        arr.push(item.id)
      })
      this.$props.callBack(arr)
      this.pagination.page = 1
      this.dialogVisible = false
    },
    closeFun () {
      this.pagination.page = 1
      this.dialogVisible = false
    },
    loadListFun (data) {
      this.tableLoading = true
      let searchObj = data || this.searchObj
      if (searchObj.length == null) {
        searchObj.length = 15
      }
      searchObj.searchMap.shopStatus = 1
      this.$http
        .fetch(this.api, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
          this.tableLoading = false
          this.$nextTick(function () {
            if (this.selected.length <= 0) {
              this.findShopInfo(this.hasShopArr)
            } else {
              let hasArr = []
              this.selected.forEach(hasShopItem => {
                hasArr.push(hasShopItem.id)
              })
              this.findShopInfo(hasArr)
            }
          })
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 打开弹窗回显已经选择的门店
    openFun () {
      const self = this
      let params = Object.assign({}, { searchMap: Object.assign({}, this.params) })
      this.$set(this, 'multipleSelection', undefined === this.hasShopArr ? [] : JSON.parse(JSON.stringify(this.hasShopArr)))
      self.loadListFun(params)
      self.dialogVisible = true
    },
    // 取消选择
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.shopTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.shopTable.clearSelection()
      }
    }, /*
    // 选择
    handleSelectionChange (val) {
      this.multipleSelection = val
    }, */
    // 选中某行
    onSelectRow (selected, row) {
      let showSelectedList = this.multipleSelection
      let check = false
      for (var i = 0; i < selected.length; i++) {
        // 判断是否选中
        if (selected[i].id === row.id) {
          check = true
          break
        }
      }
      if (check) {
        // 选中添加到右边列表
        showSelectedList.push(this.transSelectedData(row))
        this.multipleSelection = showSelectedList
      } else {
        // 删除未勾选数据
        for (var j = 0; j < showSelectedList.length; j++) {
          if (showSelectedList[j].id === row.id) {
            this.onDelSelected('multipleSelection', j, showSelectedList[j].id)
            break
          }
        }
      }
    },
    // 表格勾选所有数据
    onSelectAll (selected) {
      if (selected.length === 0) {
        for (var i = 0; i < this.dataList.length; i++) {
          this.onSelectRow(selected, this.dataList[i])
        }
      } else {
        this.multipleSelection = this.uniqueArray(this.multipleSelection.concat(selected))
      }
    },
    /**
     * 选中数据转换
     */
    transSelectedData (data) {
      let transData = {}
      transData.id = data.id
      transData.shopName = data.shopName
      return transData
    },
    // 数组去重
    uniqueArray: function (array) {
      var r = []
      for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (array[i].id === array[j].id) {
            j = ++i
          }
        }
        r.push(this.transSelectedData(array[i]))
      }
      return r
    },
    // 删除已选择店铺
    onDelSelected (dataName, index, val) {
      this.$data[dataName].splice(index, 1)
      // 表格是否渲染
      if (this.$refs.shopTable) {
        for (var i = 0; i < this.dataList.length; i++) {
          if (val === this.dataList[i].id) {
            this.$refs.shopTable.toggleRowSelection(this.dataList[i], false)
            break
          }
        }
      }
    },
    getRowKey (row) {
      return row.id
    },
    async findShopInfo (shopArr) {
      let obj = {}
      obj.searchMap = {
        shopIds: shopArr.join(',')
      }
      await this.$http
        .fetch(this.$api.guide.guide.findShopInfoByIds, obj)
        .then(resp => {
          let shopData = []
          shopData = resp.result.data
          this.selected = shopData
          this.multipleSelection = this.selected
          this.transData(this.selected, this.dataList)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    transData (selected, rows) {
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < selected.length; j++) {
          if (rows[i].id === selected[j].id) {
            this.$refs.shopTable.toggleRowSelection(rows[i], true)
            break
          }
        }
      }
    },
    handleClose (done) {
      done()
    }
  },
  components: {
    NsArea
  },
  computed: {}
}
</script>
<style scoped>
@import "@theme/variables.pcss";
@component-namespace selectShopBox {
  .tableBox {
    width: 480px;
    float: left;
  }
  .selecedBox {
    float: right;
    width: 390px;
    .tit {
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #f2f2f2;
      em {
        font-style: normal;
        color: #f00;
      }
    }
    .list {
      padding: 3px 0;
      margin: 0;
      list-style: none;
      li {
        line-height: 26px;
        color: #999;
        height: 26px;
        margin-bottom: 3px;
        border-bottom: 1px dashed #f2f2f2;
        .name {
          float: left;
        }
        .del {
          font-size: var(--default-font-size-middle);
          float: right;
          cursor: pointer;
        }
        &:hover {
          border-bottom: 1px dashed #41a2e8;
        }
      }
    }
  }
}
</style>
<style scoped>
  .searchAction{
    display: flex;
    justify-content: space-between;
    padding-right:20px
  }
  .searchAction_top{
    margin-top:6px
  }
  /*.scrollbara >>> .el-scrollbar__view {*/
  /*  max-height: 400px;*/
  /*}*/
  /*.scrollbarb >>> .el-scrollbar__view {*/
  /*  max-height: 300px;*/
  /*}*/
  >>> .el-dialog__body {
    height: 440px;
  }
  >>> .el-scrollbar__wrap {
    height: 380px;
    padding-right: 10px;
  }
  >>> .el-icon-circle-check {
    display: none;
  }
</style>
