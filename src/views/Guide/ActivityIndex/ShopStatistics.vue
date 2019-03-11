
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
          </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform" style='padding-top:3px'>
              <el-form-item  prop="type">
                <el-select
                clearable
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
                  v-model="searchform.date"
                  type="month"
                  placeholder="请选择月份"
                  >
                </el-date-picker>
                <el-date-picker
                    v-if="searchform.type=='2'"
                    v-model="searchform.date"
                    type="date"
                    @change="dateTiemFun"
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
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item  prop="type" label="查询类型：">
            <el-select
            clearable
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
              v-model="searchform.date"
              type="month"
              placeholder="请选择月份"
              >
            </el-date-picker>
            <el-date-picker
                v-if="searchform.type=='2'"
                v-model="searchform.date"
                type="date"
                placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店名称：" prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属地区：" style="margin-right:0;" prop="area">
            <el-form-grid width="300" prop="area">
              <ns-area  :props="searchform.key" @change="onAreaChange" change-on-select v-model="searchform.area" clearable></ns-area>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="状态：" prop="shopStatus">
            <el-select v-model="searchform.shopStatus"  placeholder="请选择" clearable>
              <el-option  v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：" prop="shopType">
            <el-select v-model="searchform.shopType" placeholder="请选择" clearable>
              <el-option v-for="item in shopTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
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
        label="门店名称"
        prop="shopName"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="区域"
        width="180"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span  v-if="scope.row.province">{{scope.row.province}}</span><span v-if="scope.row.city">-{{scope.row.city}}</span><span v-if="scope.row.district">-{{scope.row.district}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="77"
      >
      <template slot-scope="scope">
        <span>{{scope.row.shopType|shopType}}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
      >
      <template slot-scope="scope">
        <span>{{scope.row.shopStatus|shopStatus}}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="店长"
        width="180"
        align="left"
        prop="guideNames"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="门店招募/还差（人）"
        align="center"
        width="200"
      >
      <template slot-scope="scope">
        <span>{{scope.row.recruitComplete}}</span>/
        <span class="text-error">
          <span v-if="scope.row.recruitQuota-scope.row.recruitComplete<0">
            0
          </span>
          <span v-else>
            {{scope.row.recruitQuota-scope.row.recruitComplete}}
          </span>
        </span>
      </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="220">
        <template slot-scope="scope">
          <span v-if="scope.row.recruitPrice == 0">0</span>
          <a href="javascript:" @click="showRecruitDialog(scope.row.shopId, scope.row.shopName)" v-else>{{scope.row.recruitPrice}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="门店销售额/还差（元）"
        align="center"
        width="200"
      >
      <template slot-scope="scope">
        <span>{{scope.row.sellComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.sellQuota-scope.row.sellComplete<0">
            0
          </span>
          <span v-else>
            {{(scope.row.sellQuota-scope.row.sellComplete).toFixed(2)}}
          </span>
          </span>
      </template>
      </el-table-column>
      <el-table-column label="提成（元）" prop="sellPrice" width="220">
        <template slot-scope="scope">
          <span v-if="scope.row.sellPrice == 0">0</span>
          <a href="javascript:" @click="showSellDialog(scope.row.shopId, scope.row.shopName)" v-else>{{scope.row.sellPrice}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
  <!-- table end -->
      <!--        奖励弹窗开始        -->
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
            <el-table-column prop="guideName" label="导购" align="center" width="150"></el-table-column>
            <el-table-column prop="name" label="会员" align="center" width="150"></el-table-column>
            <el-table-column prop="name" label="昵称" align="center" width="150"></el-table-column>
            <el-table-column prop="createTime" label="招募时间" align="center" width="180"></el-table-column>
            <el-table-column prop="reward" label="奖励" align="center" width="150"></el-table-column>
          </el-table>
        </div>
        <!--分页开始-->
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination1.sizeOpts"
                       :total="pagination1.total"
                       :current-page="pagination1.page"
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
      <!--        奖励弹窗结束        -->


      <!--        提成弹窗开始        -->
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
            <el-table-column prop="guideName" label="导购" align="center" width="80"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" width="80"></el-table-column>
            <el-table-column prop="tradeId" label="订单编号" align="center" width="150"></el-table-column>
            <el-table-column prop="payment" label="订单实付(不含运费)" align="center" width="120"></el-table-column>
            <el-table-column prop="createTime" label="时间" align="center" width="150"></el-table-column>
            <el-table-column prop="reward" label="提成" align="center" width="80"></el-table-column>
          </el-table>
        </div>
        <!--分页开始-->
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination1.sizeOpts"
                       :total="pagination1.total"
                       :current-page="pagination1.page"
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
      <!--        提成弹窗结束        -->

</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from 'mixins/listPage'
import NsArea from 'components/NsArea'
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
      test: 'testmy',
      typeOptions: [
        /* {
          // 状态
          value: '2',
          label: '按日查询'
        }, */
        {
          value: '1',
          label: '按月查询'
        }
      ],
      statusOptions: [
        {
          // 状态
          value: '1',
          label: '正常营业'
        },
        {
          value: '-1',
          label: '暂停营业'
        },
        {
          value: '-2',
          label: '已关店'
        }
      ],
      shopTypeOptions: [
        {
          value: 'ZYD',
          label: '直营店'
        },
        {
          value: 'JMD',
          label: '加盟'
        }
      ],
      selectedArr: [],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        },
        area: [],
        shopName: '',
        date: '', // 年月份,
        type: '1' // 1按月、2按日
      },
      // 弹窗字段
      title: null,
      detailData: null,
      showRecruitDialogVisible: false,
      showSellDialogVisible: false,
      customerName: null,
      tradeNo: null,
      shopId: null,
      pagination1: pagination1
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
    showRecruitDialog (shopId, shopName) {
      var _this = this
      _this.title = shopName + '-招募明细'
      _this.showRecruitDialogVisible = true
      _this.shopId = shopId
      _this.findDetailData(shopId)
    },
    showSellDialog (shopId, shopName) {
      var _this = this
      _this.title = shopName + '-提成明细'
      _this.showSellDialogVisible = true
      _this.shopId = shopId
      _this.findDetailData(shopId)
    },
    dateTiemFun (e) {
      console.log(e)
    },
    onAreaChange (e) {
      console.log(e)
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.shopPerfList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
      this.loading = false
      // 总条数
    },
    // 提交搜索
    submitForm (formName) {
      if (this.searchform.type === '2') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM'
        )
      }
      // 组装搜索对象
      this.searchObj.searchMap.province = this.searchform.area[0]
      this.searchObj.searchMap.city = this.searchform.area[1]
      this.searchObj.searchMap.district = this.searchform.area[2]
      this.searchObj.searchMap.shopType = this.searchform.shopType
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.shopStatus = this.searchform.shopStatus
      this.loadListFun()
    },
    // 明细-------------------------------------------------------------------------------------------------  //
    formSearch () {
      this.findDetailData(this.shopId)
    },
    formReset () {
      this.customerName = null
      this.tradeNo = null
      this.findDetailData(this.shopId)
    },
    findDetailData (shopId) {
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
          shopId: shopId,
          tradeNo: _this.tradeNo,
          name: _this.customerName,
          type: this.searchform.type,
          date: _this.searchObj.searchMap.date
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.detailData = resp.result.data
          _this._data.pagination1.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 分页-页数改变
    pageChange (page) {
      var _this = this
      _this.pagination1.page = page
      _this.findDetailData(_this.shopId)
    },
    // 分页-大小改变
    sizeChange (pageSize) {
      var _this = this
      _this.pagination1.size = pageSize
      _this.pagination1.page = 1
      _this.guideId = null
      _this.findDetailData(_this.shopId)
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
      _this.customerName = null
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
      _this.detailData = null
      _this.tradeNo = null
      _this.customerName = null
      _this.shopId = null
      _this.showSellDialogVisible = false
    }
  },
  components: {
    NsArea
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
