<template>
  <!-- 选择店鋪结果列表 列表展开收缩切换结构-->
  <div>
    <ns-button type="primary" @click="onOpen">
      选择店铺
    </ns-button>
    已选择<b class="text-danger padding-lr-base">{{currentValue.length}}</b>家店铺
    <!-- 选择店铺弹窗结构 -->
    <el-dialog :vetically="true" title="选择店铺" :visible="visible" class="g-wrapper" :show-scroll-x="false" append-to-body width="842px"
                :before-close="onClose"  height="498px" :response-limit=false>
        <el-row class="tmp-choose__condition">
          <el-col :span="24">
            <el-form placement="right" :model="model" label-width="60px" :inline="true">
              <el-form-item label="店铺名称：">
                <el-form-grid size="md">
                  <el-input v-model="model.shopName"></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="渠道：" label-width="36px">
                <el-form-grid size="md">
                  <ns-droptree :input-disabled="channelDisabled" placeholder="" show-checkbox v-model="model.channel"
                               :url="$api.core.common.queryChannelTree4Component"></ns-droptree>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="地区：" label-width="36px">
                <el-form-grid size="md">
                  <ns-droptree :input-disabled="areaDisabled" placeholder="" ref="areaTree" show-checkbox v-model="model.area"
                               :url="$api.core.common.queryAreaTree4Component"></ns-droptree>
                </el-form-grid>
              </el-form-item>
              <el-form-item  style="margin-right: 0">
                <el-form-grid>
                  <ns-button type="primary" @click="onSearch">{{$t('operating.search')}}</ns-button>
                  <ns-button @click="onReset">{{$t('operating.reset')}}</ns-button>
                </el-form-grid>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
          <div v-loading="loading"
               :element-loading-text="$t('prompt.loading')">
        <el-row class="tmp-choose__condition" :gutter="20">
          <el-col :span="16" class="condition-left">
          <el-table ref="table" :data="tableData" stripe
                    @select="onSelectRow"
                    @select-all="onSelectAll"
                    v-loading="tableLoading"
                    :element-loading-text="$t('prompt.loading')">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column :property="props.name" label="店铺名称" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination v-if="nsPagination.enable"
                         class="template-table-pagination"
                         layout="total, prev, pager, next, jumper"
                         :page-size="nsPagination.currSize"
                         :current-page="nsPagination.currPage"
                         :total="nsPagination.total"
                         @current-change="onPageChange">
          </el-pagination>
          </el-col>
          <el-col :span="8" class="condition-right">
            <div class="tmp-choose__result">
              <p class="title">已选择了<span class="text-danger padding-lr-base">{{selectedData.length}}</span>家店铺</p>
              <div v-if="selectedData.length>0">
                <el-scrollbar style="margin-top: 5px;" wrap-class="tmp-choose__scroll">
                <ul class="tmp-choose__goods">
                  <li v-for="(data,index) in selectedData" :key="index">
                    <span class="g-name">{{data[props.name]}}</span>
                    <a @click="onDelSelected(index,data[props.unique])" class="delete-icon"><i class="g-delete el-icon-delete"></i></a>
                  </li>
              </ul>
                </el-scrollbar>
              </div>
              <ns-no-data height="335" v-else>请从左侧店铺列表中选择</ns-no-data>
            </div>
          </el-col>
        </el-row>
          </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-button type="primary" @click="onConfirm">确定</ns-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NsDroptree from '../NsDroptree'

  export default {
    name: 'NsShopSelect',
    components: {
      NsDroptree
    },
    data: function () {
      return {
        currentValue: this.value,
        selectedData: [],
        tableData: [],
        visible: false,
        loading: true,
        channelDisabled: false,
        areaDisabled: false,
        model: {
          area: {
            text: '',
            value: ''
          },
          brandId: '',
          shopName: '',
          // 渠道
          channel: {
            text: '',
            value: ''
          }
        },
        // 分页参数
        nsPagination: {
          enable: true,
          total: 0,
          currPage: 1,
          currSize: 10
        },
        // 排序
        nsOrder: {
          orderKey: '',
          orderDir: ''
        },
        custom: 'custom',
        tableLoading: true
      }
    },
    methods: {
      // 打开弹窗
      onOpen: function () {
        this.initData()
        this.visible = true
        this.loading = false
        this.$set(this, 'selectedData', JSON.parse(JSON.stringify(this.currentValue)))
        this.reload()
      },
      /**
       * 初始化数据
       */
      initData: function () {
        // 判断是否有与渠道组件数据联动
        if (this.channel) {
          if (this.channel.text && this.channel.value) {
            this.channelDisabled = true
          } else {
            this.channelDisabled = false
          }
          this.$set(this.model, 'channel', this.channel)
        }
        // 判断是否有与地区组件数据联动
        if (this.area) {
          if (this.area && this.area.text && this.area.value) {
            this.areaDisabled = true
          } else {
            this.areaDisabled = false
          }
          this.$set(this.model, 'area', this.area)
        }
      },
      onClose: function () {
        this.visible = false
        this.loading = true
        this.$set(this, 'selectedData', [])
        this.$set(this, 'model', this.$options.data().model)
      },
      onConfirm: function () {
        this.$set(this, 'currentValue', JSON.parse(JSON.stringify(this.selectedData)))
        this.callback()
        this.onReset()
        this.visible = false
      },
      // 删除已选择店铺
      onDelSelected: function (index, val) {
        this.selectedData.splice(index, 1)
        // 表格是否渲染
        if (this.$refs.table) {
          for (var i = 0; i < this.tableData.length; i++) {
            if (val === this.tableData[i][this.props.unique]) {
              this.$refs.table.toggleRowSelection(this.tableData[i], false)
              break
            }
          }
        }
      },
      /**
       * 回调
       */
      callback: function () {
        this.$emit('input', this.currentValue)
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
      // 重置数据
      resetData: function () {
        this.$set(this, 'selectedData', this.$options.data().selectedData)
      },
      // 数据回显
      toggleSelection: function (selected, rows) {
        for (var i = 0; i < rows.length; i++) {
          for (var j = 0; j < selected.length; j++) {
            if (rows[i][this.props.unique] === selected[j][this.props.unique]) {
              this.$refs.table.toggleRowSelection(rows[i], true)
              break
            }
          }
        }
      },
      // 选中某行
      onSelectRow: function (selected, row) {
        let showSelectedList = this.selectedData
        let check = false
        for (var i = 0; i < selected.length; i++) {
          // 判断是否选中
          if (selected[i][this.props.unique] === row[this.props.unique]) {
            check = true
            break
          }
        }
        if (check) {
          // 选中添加到右边列表
          showSelectedList.push(this.transSelectedData(row))
        } else {
          // 删除未勾选数据
          for (var j = 0; j < showSelectedList.length; j++) {
            if (showSelectedList[j][this.props.unique] === row[this.props.unique]) {
              this.onDelSelected(j, showSelectedList[j][this.props.unique])
              break
            }
          }
        }
      },
      // 表格勾选所有数据
      onSelectAll: function (selected) {
        if (selected.length === 0) {
          for (var i = 0; i < this.tableData.length; i++) {
            this.onSelectRow(selected, this.tableData[i])
          }
        } else {
          this.selectedData = this.uniqueArray(this.selectedData.concat(selected))
        }
      },
      /**
       * 选中数据转换
       */
      transSelectedData: function (data) {
        let transData = {}
        transData[this.props.unique] = data[this.props.unique]
        transData[this.props.name] = data[this.props.name]
        return transData
      },
      // 表格页数条数改变
      sizeChange: function (val) {
        this.nsPagination.currSize = val
        this.nsPagination.currPage = 1
        this.reload()
      },
      // 当前页改变
      onPageChange: function (val) {
        this.tableLoading = true
        this.nsPagination.currPage = val
        this.reload()
      },
      // 重置分页信息
      resetPagination: function () {
        this.nsPagination = this.$options.data().nsPagination
      },
      /**
       * 处理地区请求参数
       */
      handleAreaParam: function () {
        let checkedArea = []
        let areaParam = {}
        if (this.$refs.areaTree) {
          checkedArea = this.$refs.areaTree.getCheckedData()
          let province = []
          let city = []
          let district = []
          checkedArea.forEach(item => {
            if (item.ext2 === 2) {
              province.push(item.label)
            }
            if (item.ext2 === 3) {
              city.push(item.label)
            }
            if (item.ext2 === 4) {
              district.push(item.label)
            }
          })
          if (province.length > 0) {
            areaParam.province = province.join(',')
          }
          if (city.length > 0) {
            areaParam.city = city.join(',')
          }
          if (district.length > 0) {
            areaParam.district = district.join(',')
          }
        }
        return areaParam
      },
      /**
       * 重新加载
       */
      reload: function () {
        // 请求参数
        let model = {
          shopName: this.model.shopName,
          channelIds: this.model.channel.value,
          areas: this.model.area.text ? this.model.area.text : undefined
        }
        let params = Object.assign({}, this.nsLimit, this.nsOrder, {searchMap: Object.assign({}, model, this.params)})
        this.queryTable(params)
      },
      /**
       * 查询表格数据
       * @param params
       */
      queryTable: function (params) {
        var that = this
        that.tableLoading = true
        this.$http.fetch(this.api, params).then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            that.$set(that, 'tableData', resp.result.data)
            that.$set(that.nsPagination, 'total', parseInt(resp.result.recordsTotal))
          } else {
            that.tableData = []
            that.$set(that.nsPagination, 'total', 0)
          }
        }).finally(() => {
          that.tableLoading = false
          if (that.nsPagination.total > 0) {
            that.$set(that.nsPagination, 'enable', true)
          } else {
            that.$set(that.nsPagination, 'enable', false)
          }
          that.$nextTick(function () {
            that.toggleSelection(that.selectedData, that.tableData)
          })
        })
      },
      onSearch: function () {
        this.nsPagination.currPage = 1
        this.reload()
      },
      // 重置查询条件
      onReset: function () {
        this.$set(this, 'model', this.$options.data().model)
        this.reload()
      }
    },
    props: {
      value: Array,
      props: {
        type: Object,
        default () {
          return {
            unique: 'id',
            data: 'data',
            name: 'shopName'
          }
        }
      },
      api: {
        type: Object,
        default () {
          return this.$api.core.common.queryShopTable4Component
        }
      },
      params: {},
      channel: {},
      area: {}
    },
    created: function () {
    },
    mounted: function () {
    },
    computed: {
      'nsLimit': function () {
        return {
          start: (this.nsPagination.currPage - 1) * this.nsPagination.currSize,
          length: this.nsPagination.currSize
        }
      }
    },
    watch: {
      'value': function (val) {
        this.currentValue = val
      }
    }
  }
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  >>> .el-table th{
    line-height: 1;
  }
  .tmp-choose__result .title{
    line-height: 30px;
    background: #f3f4f4;
    padding:0 8px;
    border-bottom:1px solid var(--theme-base-border-color-primary);
  }
  .condition-left{
    width: 480px;
  }
  .condition-right{
    width:350px;
    padding-left:0 !important;
    padding-right:0 !important;
  }
  >>> .el-table--border th:first-child .cell, >>> .el-table--border td:first-child .cell{
    padding-left:12px;
  }
  >>> .el-scrollbar{
    margin-top:0 !important;
  }
  >>> .el-scrollbar__bar.is-horizontal{
    display: none;
  }
  >>> .el-scrollbar__wrap{
    height:347px;
  }
  >>> .el-loading-spinner .circular{
    height: 22px;
    width: 22px;
    position: relative;
    top: 5px;
  }
  >>> .tmp-toggles{
    margin-top:0 !important;
  }
  >>> .el-table thead th{
    background-color: #F3F4F4;
  }
  .tmp-choose__goods{
    list-style: none;
    font-size: 12px;
    padding:var(--default-padding-base);
    background: var(--default-table-tr-hover);
    li{
      display: flex;
      flex-wrap: nowrap;
      padding:0 3px;
      .delete-icon{
        padding: 3px 5px;
        position: relative;
        top: -3px;
        &:hover{
          color:var(--theme-color-warning);
        }
      }
      .g-name{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

  }
</style>
