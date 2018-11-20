<template>
<!-- 选择门店 wanrengang 20180818 -->
<div class="selectShopBox">
<el-dialog
  title="选择门店"
  :close-on-press-escape='true'
  :close-on-click-modal='false'
  :visible.sync="dialogVisible"
  width="800px" append-to-body
  :before-close="handleClose">
      <div class="content">
          <div class="tableBox">
              <el-table
                ref="shopTable"
                :data="dataList"
                tooltip-effect="dark"
                style="width: 100%" v-loading="tableLoading"
                :element-loading-text="$t('prompt.loading')"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="shopName" label="门店名称"></el-table-column>
            </el-table>
          </div>
          <div class="selecedBox">
              <div class="tit">已选择<em>{{multipleSelection.length}}</em>门店</div>
              <ul class="list">
                  <li v-for="(item, index) in multipleSelection" :key="item.id">
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
import listPageMixin from 'mixins/listPage'
export default {
  props: {
    api: {
      type: Object,
      default () {
        return this.$api.guide.shop.findBrandShopList
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
  mixins: [listPageMixin],
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      dataList: [],
      multipleSelection: []
    }
  },
  methods: {
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
      this.$http
        .fetch(this.api, searchObj)
        .then(resp => {
          this.dataList = resp.result
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
          this.$notify.error(resp.msg)
        })
    },
    // 打开弹窗回显已经选择的门店
    openFun () {
      const self = this
      let params = Object.assign({}, {searchMap: Object.assign({}, this.params)})
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

