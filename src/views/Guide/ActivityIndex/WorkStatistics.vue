
<template>
<!-- 导购工作统计  wanrengang 20180716 -->
<div>
  <div class="template-table">
    <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">  </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}
                <Icon className="el-icon--right" v-if="searchType.advanced" fontType="el-icon-arrow-up"/>
                <Icon className="el-icon--right" v-else fontType="el-icon-arrow-down"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform" style='padding-top:3px'>
              <el-form-item  prop="type">
                <el-select
                style="width:100px"
                v-model="searchform.type" placeholder="请选择">
                  <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="date">
                <el-date-picker
                  v-if="searchform.type=='1'"
                  :clearable = "false" :editable = "false"
                  v-model="searchform.date"
                  type="month"
                  placeholder="请选择月份"
                  >
                </el-date-picker>
                <el-date-picker
                    v-if="searchform.type=='2'"
                    :clearable = "false" :editable = "false"
                    v-model="searchform.date"
                    type="date"
                    placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  <!-- 简单搜索end -->
  <!-- 高级搜索start -->
  <div class="template-table-search" v-if="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item  prop="type" label="查询类型：">
            <el-select
            style="width:100px"
            v-model="searchform.type" placeholder="请选择">
            <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
            </el-select>
            </el-form-item>
            <el-form-item  prop="date">
            <el-date-picker
                v-if="searchform.type=='1'"
                :clearable = "false" :editable = "false"
                v-model="searchform.date"
                type="month"
                placeholder="请选择月份"
                >
            </el-date-picker>
            <el-date-picker
                v-if="searchform.type=='2'"
                :clearable = "false" :editable = "false"
                v-model="searchform.date"
                type="date"
                placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店名称："  prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="工号："  prop="workId">
            <el-input v-model="searchform.workId" placeholder="请输入工号" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名："  prop="name">
            <el-input v-model="searchform.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
          <ns-button @click="resetForm('searchform')">重置</ns-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 高级搜索end -->
  </div>
   <!-- 筛选end -->
   <!-- table start -->
  <div class="mt10">
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%">
      <el-table-column
        label="工号"
        prop="workId"
        width="120"
      >
      <template slot-scope="scope">
        {{scope.row.workId?scope.row.workId:'-'}}
      </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="200">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 2">
            {{scope.row.name }}<span style="color: red">(已离职)</span>
          </p>
          <p v-else-if="scope.row.gsState == 0 || scope.row.gsShopId == null || (scope.row.shopId && `,${scope.row.shopId},`.indexOf(`,${scope.row.gsShopId},`) < 0)">
            {{scope.row.name}}<span style="color: red">(已更换门店)</span>
          </p>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="门店名称"
        prop="shopName"
        width="220"
        >
      </el-table-column>
      <el-table-column
        label="导购招募/还差（人）"
        align="center"
      >
      <template slot-scope="scope">
        <span width="220">{{scope.row.recruitComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.recruitQuota-scope.row.recruitComplete<=0">
            -
          </span>
          <span v-else>
            {{scope.row.recruitQuota-scope.row.recruitComplete}}
          </span>
          </span>
      </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="220" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.recruitPrice == 0">0.00</span>
          <a href="javascript:" @click="showRecruitDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)" v-else>{{$numeral(scope.row.recruitPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="销售额/还差（元）"
        align="right"
        width="200"
      >
      <template slot-scope="scope">
        <span>{{$numeral(scope.row.sellComplete).format('0,0.00')}}</span>/<span class="text-error">
          <span v-if="scope.row.sellQuota-scope.row.sellComplete<=0">-</span>
          <span v-else>{{$numeral(scope.row.sellQuota-scope.row.sellComplete).format('0,0.00')}}</span>
          </span>
      </template>
      </el-table-column>
      <el-table-column label="提成（元）" prop="sellPrice" width="220" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.sellPrice == 0">0.00</span>
          <a href="javascript:" @click="showSellDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)" v-else>{{$numeral(scope.row.sellPrice).format('0,0.00')}}</a>
        </template>
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
  <!-- table end -->

  <!--奖励弹窗开始-->
  <el-dialog :title="title" :visible.sync="showRecruitDialogVisible" width="800px" :before-close="onCancleRecruitDialog" :vetically=true>
    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
      <el-form-item label="姓名：">
        <el-form-grid size="xmd">
          <el-input  type="text" v-model="customerName">
          </el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
        <ns-button @click="formReset('searchform')">重置</ns-button>
      </el-form-item>
    </el-form>
    <!-- 高级搜索-结束 -->
    <div style="overflow-x:hidden;overflow-y:auto;">
      <el-table :data="detailData">
        <el-table-column prop="name" label="会员" align="center" width="180"></el-table-column>
        <el-table-column prop="name" label="昵称" align="center" width="180"></el-table-column>
        <el-table-column prop="createTime" label="招募时间" align="center" width="200"></el-table-column>
        <el-table-column prop="reward" label="奖励" align="center" width="180"></el-table-column>
      </el-table>
    </div>
    <!--分页开始-->
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
                   :page-sizes="pagination1.sizeOpts"
                   :total="pagination1.total"
                   :current-page.sync="pagination1.page"
                   :page-size="pagination1.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="sizeChange"
                   @current-change="pageChange"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onCancleRecruitDialog">关闭</ns-button>
    </div>
  </el-dialog>
  <!--奖励弹窗结束-->

  <!--提成弹窗开始-->
  <el-dialog :title="title" :visible.sync="showSellDialogVisible" width="800px" :before-close="onCancleSellDialog" :vetically=true>
    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
      <el-form-item label="姓名：">
        <el-form-grid size="xmd">
          <el-input  type="text" v-model="customerName">
          </el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="订单号：">
        <el-form-grid size="xmd">
          <el-input  type="text" v-model="tradeNo">
          </el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
        <ns-button @click="formReset('searchform')">重置</ns-button>
      </el-form-item>
    </el-form>
    <!-- 高级搜索-结束 -->
    <div style="overflow-x:hidden;overflow-y:auto;">
      <el-table :data="detailData">
        <el-table-column prop="name" label="名称" align="center" width="100"></el-table-column>
        <el-table-column prop="tradeId" label="订单编号" align="center" width="150"></el-table-column>
        <el-table-column prop="payment" label="订单实付(含运费)" align="center" width="150"></el-table-column>
        <el-table-column prop="createTime" label="时间" align="center" width="150"></el-table-column>
        <el-table-column prop="reward" label="提成" align="center"></el-table-column>
      </el-table>
    </div>
    <!--分页开始-->
    <el-pagination v-if="pagination1.enable" class="template-table-pagination"
                   :page-sizes="pagination1.sizeOpts"
                   :total="pagination1.total"
                   :current-page.sync="pagination1.page"
                   :page-size="pagination1.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="sizeChange"
                   @current-change="pageChange"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onCancleSellDialog">关闭</ns-button>
    </div>
  </el-dialog>
  <!--提成弹窗结束-->
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [listPageMixin],
  data () {
    var pagination1 = {
      enable: true,
      size: 10,
      sizeOpts: [10, 20, 50],
      page: 1,
      total: 0
    }
    return {
      selectedArr: [],
      typeOptions: [
        {
          value: '2',
          label: '按日查询'
        },
        {
          value: '1',
          label: '按月查询'
        }
      ],
      searchform: {
        shopName: '',
        date: '', // 年月份,
        type: '1', // 1按月、2按日
        workId: '',
        name: ''
      },
      // 弹窗字段
      type: null,
      title: null,
      guideId: null,
      detailData: null,
      showRecruitDialogVisible: false,
      showSellDialogVisible: false,
      customerName: null,
      tradeNo: null,
      pagination1: pagination1,
      shopId: null
    }
  },
  created: function () {
    // 初始化默认查询本年当月
    this.searchObj.searchMap = Object.assign(this.searchObj.searchMap, {
      type: '1', // 1按月、2按日
      date: moment(new Date()).format('YYYY-MM') // 年月份,
    })
    // 获取当前年份---默认加载当前年
    this.searchform.date = moment(new Date()).format('YYYY-MM')
    this.loadListFun()
  },
  methods: {
    showRecruitDialog (guideId, name, shopId) {
      var _this = this
      _this.title = name + '-招募明细'
      _this.showRecruitDialogVisible = true
      _this.guideId = guideId
      _this.shopId = shopId
      _this.type = 1
      _this.findDetailData(guideId)
    },
    showSellDialog (guideId, name, shopId) {
      var _this = this
      _this.title = name + '-提成明细'
      _this.guideId = guideId
      _this.type = 0
      _this.shopId = shopId
      _this.showSellDialogVisible = true
      _this.findDetailData(guideId)
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.guideperfList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      if (this.searchform.type === '2') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM'
        )
      }
      this.clearSearch()
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.name = this.searchform.name
      this.searchObj.searchMap.workId = this.searchform.workId
      this.searchObj.searchMap.type = this.searchform.type
      this.loadListFun()
    },
    // 重置搜索
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.submitForm()
    },
    // 明细//
    formSearch () {
      this.pagination1.page = 1
      this.findDetailData(this.guideId)
    },
    formReset () {
      this.pagination1.page = 1
      this.customerName = null
      this.tradeNo = null
      this.type = null
      this.findDetailData(this.guideId)
    },
    findDetailData (guideId) {
      var _this = this
      // 组装搜索对象
      if (_this.searchform.type === '2') {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format(
          'YYYY-MM'
        )
      }
      _this.$http.fetch(_this.$api.guide.guide.guidePerfDetailList, {
        start: (_this.pagination1.page - 1) * _this.pagination1.size,
        length: _this.pagination1.size,
        searchMap: {
          guideId: guideId,
          shopId: _this.shopId,
          name: _this.customerName,
          tradeNo: _this.tradeNo,
          type: _this.searchform.type,
          rewardType: _this.type,
          date: _this.searchObj.searchMap.date
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.detailData = resp.result.data
          _this._data.pagination1.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 关闭自定义转移弹窗
    onCancleDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerData = null
      _this.showCustomerDialogVisible = false
    },
    // 分页-页数改变
    pageChange (page) {
      var _this = this
      _this.pagination1.page = page
      _this.findDetailData(_this.guideId)
    },
    // 分页-大小改变
    sizeChange (pageSize) {
      var _this = this
      _this.pagination1.size = pageSize
      _this.pagination1.page = 1
      // _this.guideId = null
      _this.findDetailData(_this.guideId)
    },
    // 关闭奖励弹窗
    onCancleRecruitDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.detailData = null
      _this.tradeNo = null
      _this.customerName = null
      _this.guideId = null
      _this.shopId = null
      _this.showRecruitDialogVisible = false
    },
    // 关闭提成弹窗
    onCancleSellDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerName = null
      _this.tradeNo = null
      _this.detailData = null
      _this.guideId = null
      _this.shopId = null
      _this.showSellDialogVisible = false
    }
  }
}
</script>
<style scoped>
.el-input.el-input--small .el-input__inner {
  text-indent: 25rpx !important;
}
.topTip {
  line-height: 32px;
  height: 32px;
}
.topTip .tipInfo {
  padding-left: 15px;
  color: #333;
}
.topTip span {
  font-size: 13px;
  color: #f00;
}
.mt10 {
  margin-top: 10px;
}
</style>
