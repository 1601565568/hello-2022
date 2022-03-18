<template>
<!-- 选择门店 wanrengang 20180818 -->
<div class="selectShopBox" :style="{display: isInlineBlock? 'inline-block': 'block'}">
  <el-dialog
    title="选择门店"
    :close-on-press-escape='true'
    :close-on-click-modal='false'
    :visible.sync="dialogVisible"
    width="928px"
    :response-limit=false
    append-to-body
    :before-close="handleClose">
      <div class="content clearfix">
        <div class="searchAction">
          <div class="searchAction_top">
            <el-form ref="table_filter_form" :model="model"  :inline="true">
                <el-form-item label="门店名称：">
                  <el-form-grid v-if='dialogVisible'>
                    <ns-droptree :defaultExpandAll='true' ref="shopCateTree" placeholder="请选择区域" :lazy="true" :load="loadShopAreaNode"  :multiple="false" v-model="param.shopArea"  :clearable='!areaId'></ns-droptree>
                  </el-form-grid>
                  <el-form-grid style="margin-left: 5px">
                    <el-select-load v-model="param.shopId" :options="shopOptions"  filterable clearable :page-sizes="20" placeholder="线下门店名称搜索">
                    </el-select-load>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="门店类型：">
                  <el-select placeholder="请选择" v-model="model.shopType" clearable>
                    <el-option v-for="shop in shopLeiXing" :label="shop.label" :value="shop.value"
                                :key="shop.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属地区：" >
                  <ns-area :props="searchform.key" @change="onAreaChange" v-model="model.area" clearable></ns-area>
                </el-form-item>
                <el-form-item label="外部店铺编码：" class="selectShopBox-form__extraLabel">
                  <ns-button type="primary" @click="taskStoreFile">选择</ns-button>
                  <span class="selectShopBox-form__extraNum">{{storeInfo.successSize}}</span>
                  <span>家</span>
                </el-form-item>
            </el-form>
            <div class="selectShopBox-form__btns">
              <ns-button type="primary" @click="searchAction(searchform)">搜索</ns-button>
              <ns-button @click="resetInputAction(searchform)">重置</ns-button>
              <ns-button @click="onSelectAllData">全选</ns-button>
            </div>
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
              @select-all="onSelectAll"
              @selection-change="changeFun" stripe>
              <el-table-column type="selection" align="center" :width="50" ></el-table-column>
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
        <div class="selecedBox" v-loading="multipleSelectionLoading"
             :element-loading-text="$t('prompt.loading')">
          <el-scrollbar class="scrollbarb">
            <div class="tit clearfix">
              <span>已选择 <em>{{multipleSelection.length}}</em> 家门店</span>
              <span class="text-primary" @click="cleanSelect()">清空</span>
            </div>
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
        <ns-button @click="closeFun">取消</ns-button>
        <ns-button  type="primary" @click="okFun">保存</ns-button>
      </div>
  </el-dialog>
  <template v-if='isDIYBtn'>
    <div  @click="openFun" style="cursor: pointer"><slot name='btnIcon'></slot></div>
  </template>
  <template v-else>
    <NsButton v-if='isInlineBlock' icon='el-icon-circle-plus-outline'  @click="openFun">选择门店</NsButton>
    <ns-button v-else  type="primary" @click="openFun">选择门店</ns-button> 已选择<span class="text-error">{{hasShopArr.length}}</span>家门店
  </template>
  <taskStoreFile ref="taskStoreFileDialog" @callBack="taskStoreFileBack" ></taskStoreFile>
<!--  <importQuota ref="importQuotaDialog" :callBack="loadListFun"></importQuota>-->
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
import { getErrorMsg } from '@/utils/toast'
import taskStoreFile from './taskStoreFile'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import moment from 'moment'
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
    isInlineBlock: {
      type: Boolean,
      default: false
    },
    // 选择按钮样式是否自定义
    isDIYBtn: {
      type: Boolean,
      default: false
    },
    // 请求店铺状态，默认只请求正常营业
    shopStatus: {
      type: String,
      default: '1'
    },
    params: {},
    areaId: {
      default: null
    },
    areaName: {},
    // 选择完后的回调
    callBack: Function,
    // 是否对外透出1：是；0：否 默认为null
    penetrate: {
      type: String
    }
  },
  mixins: [listPageMixin, tableMixin],
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      storeInfo: {
        successSize: 0,
        failSize: 0,
        fileIds: null
      },
      dataList: [],
      multipleSelection: [],
      selected: [],
      model: {
        children: null,
        disabled: null,
        city: null,
        shopType: null,
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
      },
      multipleSelectionLoading: false,
      // 门店区域树
      shopAreaTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
      param: {
        // 搜索名称
        name: '',
        shopId: '',
        shopIds: '',
        // 门店区域
        shopArea: {}
      },
      multipleSelectionArray: []
    }
  },
  /**
   * 级联改造 start
   * 选中工作门店 分类
   */
  watch: {
    'param.shopArea': function (o1, o2) {
      let shopOptions = []
      this.param.shopId = ''
      this.param.shopIds = ''
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.shopOptions = this.allShopOptions
          return
        }
        let areaIdStr = '/' + o1.value + '/'
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    },
    areaId: function (o1, o2) {
      if (o1 !== o2) {
        this.multipleSelection = []
      }
    },
    areaName: {
      handler (newVal) {
        if (newVal) {
          this.param.shopArea = { value: this.areaId, text: newVal }
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 级联改造 start
     * 获取门店分类，所有门店选项
     */
    changeFun (val) {
      this.multipleSelectionArray = val // 返回的是选中的列的数组集合
    },
    getShopAreaAndShop: function () {
      let that = this
      that.$http.fetch(that.$api.core.sysShop.getShopTree, { penetrate: this.penetrate })
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          if (this.areaId) {
            that.shopOptions = resp.result.shopOptions.filter(item => item.ext && item.ext.indexOf(this.areaId) > -1)
          } else {
            that.shopOptions = resp.result.shopOptions
          }
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.loadListFun()
    },
    /**
     * 门店分类树点击事件(懒加载)
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadShopAreaNode (node, resolve) {
      let shopAreaTree = this.shopAreaTree
      if (node.level === 0) { // 第一次调用
        return resolve(this.getRootTree(this.shopAreaTree, this.areaId))
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = shopAreaTree.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    /**
     * 如果父组件传入areaId 则此areaId 作为最大的父级
     */
    getRootTree (shopAreaTree, areaId = null) {
      const rootTree = []
      for (let item of shopAreaTree) {
        let parentId = item.parentId // 每一项的父级id
        let flag = false
        for (let item of shopAreaTree) {
          if (parentId === item.id) {
            flag = true
            break
          }
        }
        if (!flag && !areaId) {
          rootTree.push(item)
        } else if (areaId && item.id === areaId) {
          rootTree.push(item)
        }
      }
      return rootTree
    },
    /**
     * 全选
     */
    onSelectAllData () {
      this.tableLoading = true
      this.multipleSelectionLoading = true
      let param = {
        length: 99999999,
        searchMap: {
          shopStatus: this.shopStatus,
          shopIds: this.storeInfo.fileIds,
          shopArea: this.param.shopArea.value,
          shopId: this.param.shopId,
          shopType: this.model.shopType,
          district: this.model.area[2],
          city: this.model.area[1],
          province: this.model.area[0],
          penetrate: this.penetrate
        }
      }
      this.$http
        .fetch(this.api, param)
        .then(resp => {
          this.multipleSelection = resp.result.data
          this.dataList.forEach(data => this.$refs.shopTable.toggleRowSelection(data, true))
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
        .finally(() => {
          this.multipleSelectionLoading = false
          this.tableLoading = false
        })
    },
    /**
     * 清空
     * */
    cleanSelect () {
      this.$refs.shopTable.clearSelection()
      this.multipleSelection = []
    },
    /**
     * 级联改造 end
     * */
    resetInputAction () { // 重置功能
      this.param.shopId = null
      this.param.shopArea = this.areaId ? { value: this.areaId, text: this.areaName } : 0
      this.model.shopName = null
      this.model.area = []
      this.model.shopType = null
      this.storeInfo.successSize = 0
      this.storeInfo.failSize = 0
      this.storeInfo.fileIds = null
      this.loadListFun()
    },
    taskStoreFileBack (val) {
      this.storeInfo = val
    },
    taskStoreFile () {
      this.$nextTick(() => {
        this.$refs.taskStoreFileDialog.onOpendialog()
      })
    },
    searchAction () { // 搜索功能
      this.pagination.page = 1
      this.loadListFun()
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
      this.$emit('callBack', arr)
      this.pagination.page = 1
      this.dialogVisible = false
    },
    closeFun () {
      this.$refs.shopTable.clearSelection()
      this.multipleSelection = []
      this.selected = []
      this.pagination.page = 1
      this.dialogVisible = false
    },
    loadListFun (searchObj, hasShopReq) {
      /* 加载表格 */
      this.tableLoading = true
      if (hasShopReq) {
        this.multipleSelectionLoading = true
      }
      let param = {
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size,
        searchMap: {
          shopStatus: this.shopStatus,
          shopIds: this.storeInfo.fileIds,
          shopArea: this.param.shopArea.value,
          shopId: this.param.shopId,
          shopType: this.model.shopType,
          district: this.model.area[2],
          city: this.model.area[1],
          province: this.model.area[0],
          penetrate: this.penetrate
        }
      }
      this.$http
        .fetch(this.api, param)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
          this.$nextTick(() => {
            for (let data of this.dataList) {
              const index = this.multipleSelection.findIndex(d => d['id'] === data['id'])
              if (index > -1) {
                this.$refs.shopTable.toggleRowSelection(data, true)
              }
            }
          })
          // this.selected = resp.result.data
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
        .finally(() => {
          if (!hasShopReq) {
            this.tableLoading = false
            this.multipleSelectionLoading = false
            return
          }
          /* 渲染数据 */
          let templateParamsHasArr = this.hasShopArr
          let obj = { searchMap: { shopIds: null } }
          if (!templateParamsHasArr || templateParamsHasArr.length === 0) {
            this.tableLoading = false
            this.multipleSelectionLoading = false
            return
          } else {
            obj.searchMap = {
              shopIds: templateParamsHasArr.join(',')
            }
          }
          this.$http
            .fetch(this.$api.guide.guide.findShopInfoByIds, obj)
            .then(resp => {
              this.$nextTick(function () {
                this.multipleSelection = resp.result.data
                for (let data of this.dataList) {
                  const index = this.multipleSelection.findIndex(d => d['id'] === data['id'])
                  if (index > -1) {
                    this.$refs.shopTable.toggleRowSelection(data, true)
                  }
                }
              })
            })
            // .catch(resp => {
            //   this.$notify.error(getErrorMsg('查询失败', resp))
            // })
            .finally(() => {
              // this.hasShopArr.length = 0
              this.tableLoading = false
              this.multipleSelectionLoading = false
            })
        })
    },
    // 打开弹窗回显已经选择的门店
    openFun () {
      this.param.shopId = null
      this.param.shopArea = this.areaId ? { value: this.areaId, text: this.areaName } : 0
      this.model.shopName = null
      this.model.area = []
      this.model.shopType = null
      this.storeInfo.successSize = 0
      this.storeInfo.failSize = 0
      this.storeInfo.fileIds = null
      this.loadListFun(null, true)
      this.dialogVisible = true
    },
    // 取消选择
    toggleSelection (rows) {
      var that = this
      if (rows) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          rows.forEach(row => {
            if (row.id === that.multipleSelection[i].id) {
              that.multipleSelection.splice(i, 1)
            }
            that.dataList.forEach(data => {
              if (row.id === data.id) {
                that.$refs.shopTable.toggleRowSelection(data, false)
              }
            })
          })
        }
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
    onSelectAll (selectedVaule) {
      if (selectedVaule.length === 0) {
        for (let data of this.dataList) {
          const index = this.multipleSelection.findIndex(d => d['id'] === data['id'])
          if (index > -1) {
            this.multipleSelection.splice(index, 1)
          }
        }
      } else {
        for (let data of selectedVaule) {
          const index = this.multipleSelection.findIndex(d => d['id'] === data['id'])
          if (index === -1) {
            this.multipleSelection.push(data)
          }
        }
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
      this.selected = this.dataList
    },
    getRowKey (row) {
      return row.id
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
      this.$refs.shopTable.clearSelection()
      this.multipleSelection = []
      this.selected = []
      this.pagination.page = 1
      this.dialogVisible = false
    }
  },
  mounted: function () {
    this.getShopAreaAndShop()
  },
  components: {
    ElSelectLoad,
    taskStoreFile,
    NsDroptree,
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
      >>> .text-primary {
        float: right;
        cursor: pointer;
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
  @b form {
    @e extraLabel {
      margin-left: 5px;
      >>> .el-form-item__label {
        width: auto !important;
      }
    }
    @e extraNum {
      padding: 0 6px;
      color: #ff3d45;
    }
    @e btns {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
<style scoped>
  .searchAction{
    display: flex;
    justify-content: space-between;
  }
  .searchAction_top{
    position: relative;
    margin-top: 6px;
    padding-right: 230px;
    padding-bottom: 10px;
  }
  >>> .el-scrollbar__wrap {
    height: 380px;
    padding-right: 10px;
  }
  >>> .el-icon-circle-check {
    display: none;
  }
</style>
