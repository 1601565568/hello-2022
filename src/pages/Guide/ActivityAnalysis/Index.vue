<template>
  <div>
    <div class="template-table">
      <!-- 简单搜索start -->
      <div class="template-table__bar">
        <el-row class="template-table__bar-base">
          <el-col :span="24">
            <el-form
              ref="searchform"
              :inline="true"
              :model="searchform"
              @submit.native.prevent
              label-width="64px"
            >
              <el-form-item>
                <el-radio-group v-model="searchform.date">
                  <el-radio-button label="昨天">昨天</el-radio-button>
                  <el-radio-button label="近7天">近7天</el-radio-button>
                  <el-radio-button label="近30天">近30天</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：">
                <el-date-picker
                  type="daterange"
                  v-model="searchform.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  :default-value="currentMonth"
                  @change="handleDateChange"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item style="float: right!important;">
                <ns-button type="primary" @click="submitForm('searchform')" >搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
              </el-form-item>
              <el-form-item style="float: right!important;">
                <ns-button type="text" @click="tabSearchType">
                  {{!searchType.advanced  ? '展开搜索' : '收起搜索'}}
                  <Icon :type="searchType.advanced ? 'up' : 'down'"/>
                </ns-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 简单搜索end -->
        <!-- 高级搜索start -->
        <div class="template-table-search" v-show="searchType.advanced">
          <div class="template-table__bar-more">
            <el-form ref="searchform" label-width="64px" :model="searchform" :inline="true">
              <el-form-item label="选择员工：" >
                <div class="template-search__box">
                  <span>
                    已选择{{searchform.guideIds? searchform.guideIds.length: 0}}个
                  </span>
                  <div style="float: right;"><NsGuideDialog :isButton="false" :auth="false" type="primary" btnTitle="选择" dialogTitle="选择员工" v-model="searchform.guideIds"></NsGuideDialog></div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 高级搜索end -->
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><tab-pane :analysisType="1"/></span>
        <list :searchform="searchform" :sortName="newFriendNum" :sortType="sortType" :analysisType="1"/>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><tab-pane :analysisType="2"/></span>
        <menber-statistics :searchform="searchform" :sortName="recruitNum" :sortType="sortType" :analysisType="2"/>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"><tab-pane :analysisType="3"/></span>
        <sale-view :searchform="searchform" :sortName="orderAmount" :sortType="sortType" :analysisType="3"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
import NsGuideDialog from '@/components/NsGuideDialog'
import { API_ROOT } from '@/config/http.js'
import PopItem from './components/PopItem'
import TabPane from './components/TabPane'
import moment from 'moment'
import list from './List'
import menberStatistics from './MemberStatistics'
import saleView from './SaleView'

export default {
  mixins: [listPageMixin],
  data () {
    let nowDate = new Date()
    return {
      activeName: 'first',
      currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      recruitNum: 'recruitNum', // 排序名称 默认按招募会员数降序排序
      newFriendNum: 'newFriendNum',
      orderAmount: 'orderAmount', // 排序名称 默认按订单总金额降序排序
      sortType: 0, // 排序类型 1:升序 0:降序
      searchform: {
        date: '昨天',
        dateRange: [],
        time: [],
        guideIds: []
      },
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
      this.searchObj.sortName = this.sortName
      this.searchObj.sortType = this.sortType
      this.searchObj.guideIds = this.searchform.guideIds
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
      this.searchObj.guideIds = this.searchform.guideIds
      if (this.checkSearchObj()) {
        var url = API_ROOT + '/guide/activityAnalysis/exportData'
        var form = document.createElement('form')
        form.appendChild(this.generateHideElement('analysisType', this.searchObj.analysisType))
        form.appendChild(this.generateHideElement('date', this.searchObj.date))
        form.appendChild(this.generateHideElement('dateStart', moment(this.searchObj.dateRange[0]).format('YYYY-MM-DD')))
        form.appendChild(this.generateHideElement('dateEnd', moment(this.searchObj.dateRange[1]).format('YYYY-MM-DD')))
        form.appendChild(this.generateHideElement('guideIds', this.searchObj.guideIds))
        form.appendChild(this.generateHideElement('sortName', this.sortName))
        form.appendChild(this.generateHideElement('sortType', this.sortType))
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
    NsGuideDialog, list, menberStatistics, saleView, TabPane
  }

}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .btn-detele {
    margin-left: var(--default-margin-base);
  }
  .template-table__bar-base .el-form {
    float: left;
    width: 100%;
  }
  .template-table__bar{
    margin-bottom: 10px;
  }
  .template-search__box {
    width: 182px;
    height: 28px;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    border-radius: 3px;;
    display: flex;
    span{
      width: 141px;
      height: 27px;
      margin-left: 10px;
      border-right: 1px solid #DCDFE6;;
    }
  > div + span {
    margin-left: var(--default-margin-small);
  }
  }
</style>
