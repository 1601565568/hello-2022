
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div>
    <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
      <el-tab-pane label="联系概况" name="/Guide/SgGuide/ActivityAnalysis"></el-tab-pane>
      <el-tab-pane label="会员统计" name="/Guide/ActivityAnalysis/MemberStatistics"></el-tab-pane>
      <el-tab-pane label="销售概览" name="/Guide/ActivityAnalysis/SaleView"></el-tab-pane>
    </el-tabs>
    <div class="template-table">
      <!-- 简单搜索start -->
      <div class="template-table__bar">
        <el-row class="template-table__bar-base">
          <el-col :span="23">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" type="text" style="padding-left: 10px;opacity: 0.5;color: #002041;">
                {{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform"
                     @submit.native.prevent>
              <el-form-item>
                <el-radio-group v-model="searchform.date" class="float-right">
                  <el-radio-button label="昨天">昨天</el-radio-button>
                  <el-radio-button label="近7天">近7天</el-radio-button>
                  <el-radio-button label="自定义">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：" label-width="80px">
                <el-date-picker
                  class="float-left"
                  :disabled="searchform.date !== '自定义'"
                  v-model="searchform.dateRange"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="currentMonth"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" >搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
                <ns-button type="primary" @click="exportData" >导出</ns-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 简单搜索end -->
        <!-- 高级搜索start -->
        <div class="template-table-search" v-show="searchType.advanced">
          <div class="template-table__bar-more">
            <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
              <el-form-item>
                <el-radio-group v-model="searchform.date" class="float-right">
                  <el-radio-button label="昨天">昨天</el-radio-button>
                  <el-radio-button label="近7天">近7天</el-radio-button>
                  <el-radio-button label="自定义">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：" label-width="80px">
                <el-date-picker
                  class="float-left"
                  :disabled="searchform.date !== '自定义'"
                  v-model="searchform.dateRange"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="currentMonth"
                  :picker-options="pickerOptions"
                  >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <NsGuideDialog :auth="false" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="searchform.guideIds"></NsGuideDialog>
              </el-form-item>
              <el-form-item>
                已选择<span class="text-primary">{{searchform.guideIds? searchform.guideIds.length: 0}}</span>个导购员工
              </el-form-item>
            </el-form>
            <div class="template-table__more-btn">
              <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
              <ns-button @click="resetForm('searchform')">重置</ns-button>
              <ns-button type="primary" @click="exportData" >导出</ns-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 高级搜索end -->
    </div>
    <!-- 筛选end -->
    <!-- table start -->
    <div class="mt5">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        @sort-change=changeTableSort
        tooltip-effect="dark"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="guideName" label="导购" align="left">
          <template slot-scope="scope">
            <pop-item :detail="scope.row"></pop-item>
          </template>
        </el-table-column>
        <el-table-column prop="guideName" label="工号" align="left">
          <template slot-scope="scope">
            {{scope.row.workId ? scope.row.workId : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="工作门店" align="left">
          <template slot-scope="scope">
            {{scope.row.shopName ? scope.row.shopName : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" :sortable="'custom'" label="订单总金额" align="left">
          <template slot-scope="scope">
            {{scope.row.orderAmount ? scope.row.orderAmount : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="orderTimes" :sortable="'custom'" label="订单笔数" align="left">
          <template slot-scope="scope">
            {{scope.row.orderTimes ? scope.row.orderTimes : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="averagePrice" :sortable="'custom'" label="每笔单价" align="left">
          <template slot-scope="scope">
            {{scope.row.averagePrice ? scope.row.averagePrice : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="buyerNum" :sortable="'custom'" label="购买人数" align="left">
          <template slot-scope="scope">
            {{scope.row.buyerNum ? scope.row.buyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="priceUnit" :sortable="'custom'" label="客单价" align="left">
          <template slot-scope="scope">
            {{scope.row.priceUnit ? scope.row.priceUnit : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerNum" :sortable="'custom'" label="购买好友数" align="left">
          <template slot-scope="scope">
            {{scope.row.friendBuyerNum ? scope.row.friendBuyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerNum" :sortable="'custom'" label="平均好友购买率" align="left">
          <template slot-scope="scope">
            {{scope.row.friendBuyerRate ? scope.row.friendBuyerRate : 0}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
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
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
import NsGuideDialog from '@/components/NsGuideDialog'
import { API_ROOT } from '@/config/http.js'
import PopItem from './components/PopItem'
export default {
  mixins: [listPageMixin],
  data () {
    let nowDate = new Date()
    return {
      activeTabName: '/Guide/ActivityAnalysis/SaleView',
      selectedArr: [],
      analysisType: 3, // 销售概览
      currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      sortName: 'orderAmount', // 排序名称 默认按订单总金额降序排序
      sortType: 0, // 排序类型 1:升序 0:降序
      searchform: {
        date: '昨天',
        dateRange: '',
        time: [],
        name: '',
        guideIds: []
      },
      dataList: [
      ],
      pickerOptions: {
        disabledDate (time) {
          return time > Date.now() - 3600 * 1000 * 24
        }
      }
    }
  },
  created: function () {
    this.loadListFun()
  },

  methods: {
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      this.searchObj.analysisType = this.analysisType
      this.searchObj.date = this.searchform.date
      this.searchObj.dateRange = this.searchform.dateRange
      this.searchObj.time = this.searchform.time
      this.searchObj.guideIds = this.searchform.guideIds
      await this.$http.fetch(this.$api.guide.sgGuideActivityAnalysis.findList, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          console.log('this.dataList', this.dataList)
          this.pagination.total = parseInt(resp.result.recordsTotal)
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 提交搜索
    submitForm (formName) {
      console.log('this.searchform', this.searchform)
      this.searchObj.start = 0
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.state = this.searchform.state
      this.searchObj.searchMap.name = this.searchform.name

      // 组装搜索对象
      this.loadListFun()
    },
    exportData () {
      this.searchObj.analysisType = this.analysisType
      this.searchObj.date = this.searchform.date
      this.searchObj.dateRange = this.searchform.dateRange
      this.searchObj.time = this.searchform.time
      this.searchObj.sortOrder = this.searchform.sortOrder
      this.searchObj.sortCriteria = this.searchform.sortCriteria
      this.searchObj.guideIds = this.searchform.guideIds
      console.log('this.searchObj', this.searchObj)
      var url = API_ROOT + '/guide/activityAnalysis/exportData'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('analysisType', this.searchObj.analysisType))
      form.appendChild(this.generateHideElement('date', this.searchObj.date))
      form.appendChild(this.generateHideElement('dateRange', this.searchObj.dateRange))
      form.appendChild(this.generateHideElement('time', this.searchObj.time))
      form.appendChild(this.generateHideElement('sortOrder', this.searchObj.sortOrder))
      form.appendChild(this.generateHideElement('sortCriteria', this.searchObj.sortCriteria))
      form.appendChild(this.generateHideElement('guideIds', this.searchObj.guideIds))
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    },
    // 排序
    changeTableSort (column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order
      this.sortName = fieldName
      // 按照降序排序
      if (sortingType === 'descending') {
        this.sortType = 0
      } else {
        // 按照升序排序
        this.sortType = 1
      }
      this.loadListFun()
    }
  },
  components: {
    NsGuideDialog, PopItem
  }
}
</script>
<style scoped>

  @import "@theme/variables.pcss";

  .btn-detele {
    margin-left: var(--default-margin-base);
  }
</style>
