
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="selectMarketbox">
  <el-dialog
  title="选择商品"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="template-table">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px" @submit.native.prevent
            class="surround-btn" :model="searchObj.searchMap" :inline="true">
            <el-form-item label="商品库：" prop="bankId">
              <el-select v-model="searchObj.searchMap.bankId" placeholder="请选择商品库" clearable required>
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
            <ns-button @click="resetForm('searchform')">重置</ns-button>
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
export default {
  components: {
  },
  mixins: [listPageMixin],
  props: {
    callBack: Function
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
      bankList: []
    }
  },
  methods: {
    selectCurrentChange (currentRow) {
      this.market = currentRow || {}
    },
    showToggle (obj) {
      this.dialogVisible = true
      this.findGoodBankList()
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
    },
    async loadListFun () {
      let that = this
      this.loading = true
      await this.$http.fetch(this.$api.guide.material.findMallGoodsList, this.searchObj).then(res => {
        if (res.result.data && res.result.data.length > 0) {
          that.dataList = res.result.data
          that.pagination.total = Number(res.result.total)
        } else {
          that.dataList = null
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
    $resetForm () {
      this.searchObj.searchMap.bankId = this.bankList[0].value
    },
    submitForm () {
      this.market = {}
      this.clearSearch()
      this.loadListFun()
    },
    /**
     * @msg: 查询商品库列表
     */
    findGoodBankList () {
      this.loading = true
      let that = this
      this.$http.fetch(this.$api.guide.material.findGoodBankList).then(res => {
        if (!res.success) {
          that.$notify.error(getErrorMsg(res.msg))
        } else if (res.result) {
          that.bankList = res.result
          that.searchObj.searchMap.bankId = that.bankList[0].value
          that.loadListFun()
        }
      }).catch((res) => {
        that.$notify.error(getErrorMsg(res))
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
