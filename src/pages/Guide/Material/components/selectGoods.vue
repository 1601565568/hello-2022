
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="selectMarketbox">
  <el-dialog
  title="选择商品"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  modal-append-to-body
  append-to-body
  :before-close="handleClose">
    <div class="template-table">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px" @submit.native.prevent
            class="surround-btn" :model="searchObj.searchMap" :inline="true">
            <el-form-item label="商城：" prop="mallId" v-if="showMall">
              <el-select v-model="searchObj.searchMap.mallId" placeholder="请选择商城" required @change="selectMall">
                <el-option v-for="item in mallList"
                :key="item.mall_id"
                :label="item.mall_name"
                :value="item.mall_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="mallId" v-if="showShop">
              <el-form-grid><div style="margin-left: 20px;">工作门店：</div></el-form-grid>
              <el-form-grid >
                <ns-droptree ref="shopCateTree" :defaultExpandAll='true' :load="loadShopAreaNode" placeholder="请选择区域" :lazy="true" :multiple="false" v-model="param.shopArea" :clearable='false'></ns-droptree>
              </el-form-grid>
              <el-form-grid style="margin-left:10px">
                <el-select-load v-model="param.shopId" :options="shopOptions"  filterable  :page-sizes="20" placeholder="选择门店">
                </el-select-load>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="商品库：" prop="bankId" v-if="showMall">
              <el-select v-model="searchObj.searchMap.bankId" placeholder="请选择商品库" required @change="selectGoodBank">
                <el-option v-for="item in bankList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称：" prop="title">
              <el-input v-model="searchObj.searchMap.title" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品编号：" prop="outerId">
              <el-input v-model="searchObj.searchMap.outerId" placeholder="请输入商品编号" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn" style="margin-right:20px">
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="$resetForm('searchform')">重置</ns-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        highlight-current-row
        @current-change="selectCurrentChange"
        style="width: 100%"
        >
        <el-table-column  width="30">
          <template slot-scope="scope">
              <el-radio :label="scope.row.sysItemId" v-model="sysItemId" ></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" align="left" >
        </el-table-column>
        <el-table-column prop="outerId" label="商品编号" align="left" >
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary"  @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
export default {
  components: {
    NsDroptree,
    ElSelectLoad
  },
  mixins: [listPageMixin],
  props: {
    callBack: Function,
    showMall: {
      type: Boolean,
      default: true
    },
    showShop: {
      type: Boolean,
      default: false
    },
    areaId: {
      default: null
    },
    areaName: {}
  },
  data () {
    return {
      // outerId: '',
      sysItemId: '',
      // title: '',
      goodsCode: '',
      market: {
        sysItemId: ''
      },
      loading: false,
      searchObj: {
        searchMap: {
          mallId: null,
          bankId: null,
          title: null,
          outerId: null
        }
      },
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '优惠券', id: 3 }, { name: '营销活动', id: 4 }, { name: '自定义页面', id: 5 }],
      wechatPageUrlList: [],
      dialogImageUrl: '',
      groudList: [{ name: '多人拼团', type: 2 }, { name: '满减送', type: 3 }, { name: '秒杀', type: 4 }],
      dialogVisible: false,
      bankList: [], // 商品库
      mallList: [], // 商城列表
      param: {
        // 搜索名称
        name: '',
        shopId: '',
        shopIds: '',
        // 门店区域
        shopArea: {}
      },
      shopOptions: [],
      allShopOptions: [],
      allShops: []
    }
  },
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
  mounted () {
    this.getShopAreaAndShop()
  },
  methods: {
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
    getShopAreaAndShop: function () {
      let that = this
      that.$http.fetch(that.$api.core.sysShop.getShopTree)
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions
          that.allShops = resp.result.shopOptions
          that.param.shopId = that.allShops[0].value
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    selectCurrentChange (currentRow) {
      this.market = Object.assign({ mallId: this.searchObj.searchMap.mallId, bankId: this.searchObj.searchMap.bankId }, currentRow) || {}
    },
    showToggle (obj = {}) {
      if (obj.codeTarget && obj.codeTarget.length > 0) {
        this.sysItemId = obj.codeTarget
      }
      this.dialogVisible = true
      if (this.showMall) {
        this.findMallList()
      }
      if (this.showShop) {
        this.loadListFun()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 提交保存
    saveFun () {
      this.$props.callBack(this.market)
      this.handleClose()
    },
    handleClose () {
      this.sysItemId = ''
      this.dialogVisible = false
      this.dataList = []
      this.$refs.searchform.resetFields()
      this.param.shopId = this.allShops.length > 0 ? this.allShops[0].value : null
      // this.param.shopArea = this.areaId ? { value: this.areaId, text: this.areaName } : 0
    },
    async loadListFun () {
      let that = this
      if (that.showMall) {
        if (!that.searchObj.searchMap.mallId) {
          that.$notify.warning('请先选择商城')
          return
        }
        if (!that.searchObj.searchMap.bankId) {
          that.$notify.warning('请先选择商品库')
          return
        }
      }
      this.loading = true
      const url = this.showShop ? this.$api.guide.material.findShopGoodsList : this.$api.guide.material.findMallGoodsList
      const shopObj = {
        length: this.searchObj.length,
        start: this.searchObj.start,
        searchMap: {
          shopId: this.param.shopId,
          outerId: this.searchObj.searchMap.outerId,
          title: this.searchObj.searchMap.title
        }
      }
      const obj = this.showShop ? shopObj : this.searchObj
      await this.$http.fetch(url, obj).then(res => {
        if (res.result.data && res.result.data.length > 0) {
          that.dataList = res.result.data
          that.pagination.total = Number(res.result.total)
        } else {
          that.dataList = null
          that.pagination.total = 0
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      }).finally(() => {
        this.loading = false
      })
    },
    // 去重
    unique (arr, attribute) {
      var newarr = []
      var jsonarr = []
      for (var i = 0; i < arr.length; i++) {
        if (newarr.indexOf(arr[i][attribute]) === -1) { //  -1代表没有找到
          newarr.push(arr[i][attribute]) // 如果没有找到就把这个name放到arr里面，以便下次循环时用
          jsonarr.push(arr[i])
        }
      }
      return jsonarr
    },
    $resetForm (formName) {
      this.$refs[formName].resetFields()
      this.clearSearch()
      this.searchObj.searchMap.mallId = this.mallList.length > 0 ? this.mallList[0].mall_id : null
      if (this.showMall) {
        this.selectMall(this.searchObj.searchMap.mallId)
      }
      if (this.showShop) {
        this.loadListFun()
        this.param.shopId = this.allShops.length > 0 ? this.allShops[0].value : null
        // this.param.shopArea = this.areaId ? { value: this.areaId, text: this.areaName } : 0
      }
    },
    submitForm () {
      this.market = {}
      this.clearSearch()
      this.loadListFun()
    },
    /**
     * @msg: 选择商城
     */
    selectMall () {
      this.findGoodBankList()
    },
    /**
     * @msg: 选择商品库
     */
    selectGoodBank (value) {
      this.loadListFun()
    },
    /**
     * @msg: 获取商城列表
     */
    findMallList () {
      let that = this
      that.loading = true
      this.$http.fetch(this.$api.core.common.findLoginMallList).then(res => {
        if (res.success && res.result) {
          that.mallList = res.result
          if (that.mallList.length === 0) {
            that.$notify.error('查询不到商城信息')
            return
          }
          that.searchObj.searchMap.mallId = that.mallList[0].mall_id
          that.findGoodBankList()
        }
      }).catch((res) => {
        that.$notify.error(res.msg)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * @msg: 查询商品库列表
     */
    findGoodBankList () {
      let that = this
      if (!that.searchObj.searchMap.mallId) {
        that.$notify.warning('查询不到商城信息')
        return
      }
      this.loading = true
      this.$http.fetch(this.$api.guide.material.findGoodBankList, { mallId: that.searchObj.searchMap.mallId }).then(res => {
        if (res.success && res.result) {
          that.bankList = res.result
          if (that.bankList.length === 0) {
            that.$notify.error('查询不到商品库信息')
            return
          }
          that.searchObj.searchMap.bankId = that.bankList[0].value
          that.loadListFun()
        }
      }).catch((res) => {
        that.$notify.error(res.msg)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.selectMarketbox .current-row{
  td{
    color: #fff !important;
    background:  #0091FA !important
  }
}
</style>
