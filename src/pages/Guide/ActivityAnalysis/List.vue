
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div>
    <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
      <el-tab-pane label="联系概况" name="/Guide/ActivityAnalysis/List"></el-tab-pane>
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
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="currentMonth"
                  :picker-options="pickerOptions"
                >
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
                  range-separator="至"
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
        @sort-change="changeTableSort"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="guideName" label="导购" width="160" fixed>
          <template slot-scope="scope">
            <pop-item :detail="scope.row"></pop-item>
          </template>
        </el-table-column>
        <el-table-column prop="guideName" label="工号" width="160" fixed>
          <template slot-scope="scope">
            {{scope.row.workId ? scope.row.workId : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="门店" width="180" fixed>
          <template slot-scope="scope">
            {{scope.row.shopName ? scope.row.shopName : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="newFriendNum" :sortable="'custom'" label="新增好友" width="180" align="right">
          <template slot-scope="scope">
            {{scope.row.newFriendNum ? scope.row.newFriendNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="newCustomerNum" :sortable="'custom'" label="新增会员" width="120" align="right">
          <template slot-scope="scope">
            {{scope.row.newCustomerNum ? scope.row.newCustomerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="momentsNum" :sortable="'custom'" label="发朋友圈数" width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.momentsNum ? scope.row.momentsNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="activePrivateChatNum" :sortable="'custom'" label="主动会话数" width="240" align="right">
          <template slot-scope="scope">
            {{scope.row.activePrivateChatNum ? scope.row.activePrivateChatNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="clientReplyNum" :sortable="'custom'" label="客户回复" width="120" align="right">
          <template slot-scope="scope">
            {{scope.row.clientReplyNum ? scope.row.clientReplyNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="clientReplyRate" :sortable="'custom'" label="客户回复率" width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.clientReplyRate ? scope.row.clientReplyRate : 0}}%
          </template>
        </el-table-column>
        <el-table-column prop="receivePrivateChatNum" :sortable="'custom'" label="客户发起会话数" width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.receivePrivateChatNum ? scope.row.receivePrivateChatNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="replyNum" :sortable="'custom'" label="响应数" width="120" align="right">
          <template slot-scope="scope">
            {{scope.row.replyNum ? scope.row.replyNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="notReplayNum" :sortable="'custom'" label="未回复客户数" width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.notReplayNum ? scope.row.notReplayNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="averageReplyTime" :sortable="'custom'" label="平均首次响应时长" width="140" align="right">
          <template slot-scope="scope">
            {{scope.row.averageReplyTime ? scope.row.averageReplyTime : 0}}s
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
    <!-- 编辑弹窗 -->
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
      activeTabName: '/Guide/ActivityAnalysis/List',
      analysisType: 1, // 联系概况
      currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      searchform: {
        date: '昨天',
        dateRange: '',
        time: [],
        name: '',
        guideIds: []
      },
      sortName: 'newFriendNum', // 排序名称 默认按新增好友数降序排序
      sortType: 0, // 排序类型 1:升序 0:降序
      dataList: [],
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
      this.searchObj.sortName = this.sortName
      this.searchObj.sortType = this.sortType
      this.searchObj.guideIds = this.searchform.guideIds
      if (this.searchObj.date === '自定义') {
        if (this.searchObj.dateRange === null || this.searchObj.dateRange === '') {
          this.$notify.error('查询时间范围时间不能为空')
          this.loading = false
          return
        } else {
          let startTime = this.searchObj.dateRange[0]
          let endTime = this.searchObj.dateRange[1]
          let dateDiff = this.getDateDiff(startTime, endTime, 'day')
          if (dateDiff > 180) {
            this.$notify.error('查询时间间隔不能大于180天')
            this.loading = false
            return
          }
        }
      }
      await this.$http.fetch(this.$api.guide.sgGuideActivityAnalysis.findList, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
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
      this.searchform.guideIds = []
      this.loadListFun()
    },
    exportData () {
      this.searchObj.analysisType = this.analysisType
      this.searchObj.date = this.searchform.date
      this.searchObj.dateRange = this.searchform.dateRange
      this.searchObj.time = this.searchform.time
      this.searchObj.guideIds = this.searchform.guideIds
      var url = API_ROOT + '/guide/activityAnalysis/exportData'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('analysisType', this.searchObj.analysisType))
      form.appendChild(this.generateHideElement('date', this.searchObj.date))
      form.appendChild(this.generateHideElement('dateRange', this.searchObj.dateRange))
      form.appendChild(this.generateHideElement('time', this.searchObj.time))
      form.appendChild(this.generateHideElement('guideIds', this.searchObj.guideIds))
      form.appendChild(this.generateHideElement('sortName', this.sortName))
      form.appendChild(this.generateHideElement('sortType', this.sortType))
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
