<template>
<!-- 选择门店 wanrengang 20180818 -->
<div class="selectShopBox">
<el-dialog
  title="选择门店"
  :close-on-press-escape='true'
  :close-on-click-modal='false'
  :visible.sync="dialogVisible"
  width="80%" append-to-body
  :before-close="handleClose">
      <div class="content">
        <div class="searchAction">
          <div class="searchAction_top">
            <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
              <el-form-item label="店铺名称：">
                <el-form-grid size="xmd">
                  <el-input autofocus=true v-model="model.shopName" placeholder="请输入门店名称" clearable></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="门店类型：">
                <el-form-grid>
                  <el-select placeholder="请选择门店类型" v-model="model.shopType" clearable filterable>
                    <el-option v-for="shop in shopLeiXing" :label="shop.label" :value="shop.value"
                              :key="shop.value"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="所属地区：" style="margin-right:0;" prop="area">
                <el-form-grid width="220" prop="area">
                  <ns-area  :props="searchform.key" @change="onAreaChange" change-on-select v-model="model.area" clearable></ns-area>
                </el-form-grid>
              </el-form-item>
            </el-form>
          </div>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="searchAction(searchform)">搜索</ns-button>
            <ns-button @click="resetInputAction(searchform)">重置</ns-button>
          </div>
        </div>
        <div class="tableBox">
          <el-table
            ref="shopTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%" v-loading="tableLoading"
            :element-loading-text="$t('prompt.loading')"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" :width="50"></el-table-column>
            <el-table-column prop="shopName" label="门店名称"></el-table-column>
          </el-table>
        </div>
        <div class="selecedBox">
            <div class="tit">已选择<em>{{multipleSelection.length}}</em>门店</div>
            <ul class="list">
                <li v-for="(item) in multipleSelection" :key="item.id">
                    <span class="name">{{item.shopName}}</span>
                    <span class="del" @click="toggleSelection([item])"><i class="g-delete el-icon-delete"></i></span>
                </li>
            </ul>
        </div>
      </div>
    <span slot="footer" class="dialog-footer">
    <ns-button @click="dialogVisible = false">关闭</ns-button>
    <ns-button  type="primary" @click="okFun">确定</ns-button>
  </span>
</el-dialog>
  <ns-button  type="primary" @click="openFun">选择门店</ns-button> 已选择<span class="text-error">{{hasShopArr.length}}</span>家门店
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import tableMixin from 'web-crm/src/mixins/table'
import NsArea from 'web-crm/src/components/NsArea'
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
        value: 'B',
        label: '天猫'
      }, {
        value: 'C',
        label: '淘宝店'
      }, {
        value: 'ZYD',
        label: '直营店'
      }, {
        value: 'JMD',
        label: '加盟店'
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
      this.loadListFun()
    },
    searchAction () { // 搜索功能
      this.models.searchMap = this.model
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
      this.dialogVisible = false
    },
    loadListFun (data) {
      this.tableLoading = true
      let searchObj = data || this.searchObj
      searchObj.length = 1000
      searchObj.searchMap.shopStatus = 1
      this.$http
        .fetch(this.api, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.tableLoading = false
          this.$nextTick(function () {
            let hasArr = []
            this.hasShopArr.forEach(hasShopItem => {
              for (let i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].id === hasShopItem) {
                  hasArr.push(this.dataList[i])
                  break
                }
              }
            })
            // 回显
            this.toggleSelection(hasArr)
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
    },
    // 选择
    handleSelectionChange (val) {
      this.multipleSelection = val
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
@component-namespace selectShopBox {
  .tableBox {
    width: 400px;
    float: left;
  }
  .selecedBox {
    float: right;
    width: 320px;
    padding-right: 20px;
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
<style>
.searchAction{
  display: flex;
  justify-content: space-between;
  padding-right:20px
}
.searchAction_top{
  margin-top:6px
}
</style>
