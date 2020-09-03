
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div style="background-color: #ffffff;">
    <ns-button type="primary" style="margin: 5px 10px">导出销售概览</ns-button>
    <!-- table start -->
    <div>
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
        <el-table-column prop="name" label="门店" align="left">
          <template slot-scope="scope">
            {{scope.row.shopName ? scope.row.shopName : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" :sortable="'custom'" label="订单总金额" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.orderAmount ? scope.row.orderAmount : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="orderTimes" :sortable="'custom'" label="订单笔数" align="right">
          <template slot-scope="scope">
            {{scope.row.orderTimes ? scope.row.orderTimes : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="averagePrice" :sortable="'custom'" label="每笔单价" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.averagePrice ? scope.row.averagePrice : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="buyerNum" :sortable="'custom'" label="购买人数" align="right">
          <template slot-scope="scope">
            {{scope.row.buyerNum ? scope.row.buyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="priceUnit" :sortable="'custom'" label="客单价" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.priceUnit ? scope.row.priceUnit : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerNum" :sortable="'custom'" label="购买好友数" align="right">
          <template slot-scope="scope">
            {{scope.row.friendBuyerNum ? scope.row.friendBuyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerRate" :sortable="'custom'" label="平均好友购买率" align="right">
          <template slot-scope="scope">
            {{scope.row.friendBuyerRate ? scope.row.friendBuyerRate : 0}}%
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
import TabPane from './components/TabPane'
import moment from 'moment'

export default {
  mixins: [listPageMixin],
  props: {
    searchform: {
      default: function () {
        return {}
      }
    },
    // 是否添加登录账号店铺数据权限
    sortName: {
      type: String,
      default: 'orderAmount'
    },
    sortType: {
      type: Number,
      default: 1
    },
    analysisType: {
      type: String,
      default: '1'
    }
  },
  data () {
    let nowDate = new Date()
    return {
      selectedArr: [],
      // currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      // sortName: 'orderAmount', // 排序名称 默认按订单总金额降序排序
      // sortType: 0, // 排序类型 1:升序 0:降序
      // searchform: {
      //   date: '昨天',
      //   dateRange: [],
      //   name: '',
      //   guideIds: []
      // },
      dataList: [],
      pickerOptions: {
        disabledDate (time) {
          return time > Date.now() - 3600 * 1000 * 24
        }
      }
    }
  },
  watch: {
    'searchform.date' (newVal) {
      if (newVal) {
        this.searchform.dateRange = this.getDateRange(newVal)
      }
    }
  },
  created: function () {
    this.searchform.date = '昨天'
    this.searchform.dateRange = this.getDateRange()
    this.loadListFun()
  },
  methods: {
    handleDateChange () {
      this.searchform.date = ''
    },
    getDateRange (rangeType = '昨天') {
      let endDay = moment().subtract('days', 1)
      let startDay = null
      switch (rangeType) {
        case '昨天':
          startDay = moment().subtract('days', 1)
          break
        case '近7天':
          startDay = moment().subtract('days', 7)
          break
        case '近30天':
          startDay = moment().subtract('days', 30)
          break
        default:
      }
      return startDay ? [startDay.startOf('days').toDate(), endDay.endOf('days').toDate()] : []
    },
    checkSearchObj () {
      const { dateRange } = this.searchObj
      if (!dateRange || dateRange.length === 0) {
        this.$notify.error('查询时间范围时间不能为空')
        this.loading = false
        return false
      }
      let dateDiff = this.getDateDiff(dateRange[0], dateRange[1], 'day')
      if (dateDiff > 180) {
        this.$notify.error('查询时间间隔不能大于180天')
        this.loading = false
        return false
      }
      return true
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      this.searchObj.analysisType = this.analysisType
      this.searchObj.date = this.searchform.date
      this.searchObj.dateRange = this.searchform.dateRange
      this.searchObj.guideIds = this.searchform.guideIds
      this.searchObj.sortName = this.sortName
      this.searchObj.sortType = this.sortType
      if (this.checkSearchObj()) {
        this.$http.fetch(this.$api.guide.sgGuideActivityAnalysis.findList, this.searchObj).then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        }).finally(() => {
          this.loading = false
        })
      }
    },
    getDateDiff (startTime, endTime, diffType) {
      diffType = diffType.toLowerCase()
      const sTime = startTime // 开始时间
      const eTime = endTime // 结束时间
      let divNum = 1 // 作为除数的数字
      if (diffType === 'second') {
        divNum = 1000
      } else if (diffType === 'minute') {
        divNum = 1000 * 60
      } else if (diffType === 'hour') {
        divNum = 1000 * 3600
      } else {
        divNum = 1000 * 3600 * 24
      }
      return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum))
    },
    // 提交搜索
    submitForm (formName) {
      this.searchObj.start = 0
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.state = this.searchform.state
      this.searchObj.searchMap.name = this.searchform.name

      // 组装搜索对象
      this.loadListFun()
    },
    resetForm () {
      this.searchform.date = '昨天'
      this.searchform.dateRange = this.getDateRange()
      this.searchform.guideIds = []
      this.loadListFun()
    },
    exportData () {
      this.searchObj.analysisType = this.analysisType
      this.searchObj.date = this.searchform.date
      this.searchObj.dateRange = this.searchform.dateRange
      this.searchObj.sortOrder = this.searchform.sortOrder
      this.searchObj.sortCriteria = this.searchform.sortCriteria
      this.searchObj.guideIds = this.searchform.guideIds
      if (this.checkSearchObj()) {
        var url = API_ROOT + '/guide/activityAnalysis/exportData'
        var form = document.createElement('form')
        form.appendChild(this.generateHideElement('analysisType', this.searchObj.analysisType))
        form.appendChild(this.generateHideElement('date', this.searchObj.date))
        form.appendChild(this.generateHideElement('dateStart', moment(this.searchObj.dateRange[0]).format('YYYY-MM-DD')))
        form.appendChild(this.generateHideElement('dateEnd', moment(this.searchObj.dateRange[1]).format('YYYY-MM-DD')))
        form.appendChild(this.generateHideElement('sortName', this.sortName))
        form.appendChild(this.generateHideElement('sortType', this.sortType))
        form.appendChild(this.generateHideElement('guideIds', this.searchObj.guideIds))
        form.setAttribute('action', url)
        form.setAttribute('method', 'post')
        document.body.appendChild(form)
        form.submit()
      }
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
    PopItem
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .btn-detele {
    margin-left: var(--default-margin-base);
  }
  .template-search__box {
    display: flex;
    > div + span {
      margin-left: var(--default-margin-small);
    }
  }
</style>
