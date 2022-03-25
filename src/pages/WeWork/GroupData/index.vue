<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">群分析</div>
      </div>
      <div style="margin-left:16px;margin-right:16px">
        <ColorfulDisplay :dataList='dataList'/>
      </div>
    </div>
    <div class="material-show">
      <div class="material-chat">
        <div class="chat-select">
          <div class="left-select">
            <div class="day-view">
              <span
                :class="
                  showTodaySelect
                    ? selectToday
                      ? [bases==='QA'?baseAselectQA:baseAselect]
                      : ''
                    : 'base-un-active'
                "
                class="base-text"
                @click="selectTodayClick('seven')"
                >近7天</span
              >
              <span
                :class="
                  showTodaySelect
                    ? selectToday
                      ? ''
                      : [bases==='QA'?baseAselectQA:baseAselect]
                    : 'base-un-active'
                "
                class="base-text"
                @click="selectTodayClick('thirty')"
                >近30天</span
              >
            </div>
            <div class="date-view">
              <el-date-picker
                v-model="datePickerValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                align="center"
                @change="datePickerChange"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
            <div class="item-down">
              <div class="name">群主：</div>
              <div class="item-select">
                <GuideDialog
                  :validNull="true"
                  :selfBtn='true'
                  :appendToBody='true'
                  :onlyOwner='true'
                  :isButton="false"
                  :auth="true"
                  type="primary"
                  btnTitle=""
                  dialogTitle="选择群主"
                  v-model="guideIds"
                  @input="owenerChange"
                >
                  <template slot='selfBtn'>
                    <div class='self-btn'>
                      {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个群主`:'全部'}}
                      <Icon type="geren" class='guideIds-icon'></Icon>
                    </div>
                  </template>
                </GuideDialog>
              </div>
            </div>
          </div>
          <!-- <ns-button @click="onResetSearch">{{$t('operating.reset')}}</ns-button> -->
          <div class="drawer-output" @click="outputCsvFile" id="exportButton">
            导出文件
          </div>
        </div>
      </div>
    </div>
    <div class="chat-view">
      <div class="title">数据分析</div>
      <NsEcharts :options="option" />
    </div>
    <div class="material-list">
      <div class="title">数据报表</div>
      <div  :class="[bases==='QA'? eltabQA:eltab]">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按日期显示" name="first" >
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  v-loading='loadingData'
                  :data="listDate"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="stat_time" label="日期">
                  </el-table-column>
                  <el-table-column prop="chat_totals" label="总群数">
                  </el-table-column>
                  <el-table-column prop="member_totals" label="群管理好友数">
                  </el-table-column>
                  <el-table-column prop="new_member_cnts" label="群新增好友数">
                  </el-table-column>
                  <el-table-column prop="member_loss_cnts" label="群流失好友数">
                  </el-table-column>
                </el-table>
              </template>
              <template slot="pagination">
                <el-pagination
                  class="label-dialog__pagination"
                  :page-sizes="paginationToDate.sizeOpts"
                  :total="paginationToDate.total"
                  :current-page.sync="paginationToDate.page"
                  :page-size="paginationToDate.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChangeForDate"
                  @current-change="handleCurrentChangeForDate"
                >
                </el-pagination>
              </template>
            </page-table>
          </el-tab-pane>
          <el-tab-pane :label="cloudPlatformType === 'ecrp' ? '按员工显示' : '按成员显示'" name="second">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  v-loading="loading"
                  :data="listPerson"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="user_name" :label="cloudPlatformType === 'ecrp' ? '员工' : '成员'">
                  </el-table-column>
                  <el-table-column prop="chat_totals" label="总群数">
                  </el-table-column>
                  <el-table-column prop="member_totals" label="群管理好友数">
                  </el-table-column>
                  <el-table-column prop="new_member_cnts" label="群新增好友数">
                  </el-table-column>
                  <el-table-column prop="member_loss_cnts" label="群流失好友数">
                  </el-table-column>
                </el-table>
              </template>
              <template slot="pagination">
                <el-pagination
                  class="label-dialog__pagination"
                  :page-sizes="paginationToPerson.sizeOpts"
                  :total="paginationToPerson.total"
                  :current-page.sync="paginationToPerson.page"
                  :page-size="paginationToPerson.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChangeForPerson"
                  @current-change="handleCurrentChangeForPerson"
                >
                </el-pagination>
              </template>
            </page-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import moment from 'moment'
import ColorfulDisplay from '@/pages/Guide/CustomerGroup/components/ColorfulDisplay'
import GuideDialog from '@/components/NewUi/GuideDialog'
export default {
  name: 'GroupData',
  components: { PageTable, NsEcharts, ColorfulDisplay, GuideDialog },
  data () {
    return {
      // 判断客道、ecrp环境
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      loading: false,
      loadingData: false,
      checkId: 1,
      endTime: '',
      startTime: '',
      dataList: [
        {
          key: 'chat_totals',
          nick: '昨日总群数',
          value: 0
        },
        {
          key: 'member_totals',
          nick: '昨日群管理好友数',
          value: 0
        },
        {
          key: 'new_member_cnts',
          nick: '昨日群新增好友数',
          value: 0
        },
        {
          key: 'member_loss_cnts',
          nick: '昨日群流失好友数',
          value: 0
        }
      ],
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
      //   }
      // },
      pickerOptions2: {
        disabledDate (time) {
          if (new Date(time).getTime() > new Date().getTime() - 1 * 8.64e7) {
            return time.getTime() > Date.now() - 2 * 8.64e7
          } else {
            return time.getTime() < Date.now() - 181 * 8.64e7
          }
        }
      },
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '昨日总群数',
            '群管理好友数',
            '群新增好友数',
            '群流失好友数'
          ],
          left: '0',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          left: 16,
          right: 16,
          bottom: 0,
          containLabel: true,
          top: '40',
          height: 291
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.25)',
            lineHeight: 24
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.25)'
            }
          }
        },
        color: ['#4287FF', '#F7B586', '#95DA73', '#7962EC'],
        yAxis: {
          name: '数量',
          nameTextStyle: {
            color: 'rgba(0,0,0,0.25)',
            padding: [4, 4, 4, 24],
            verticalAlign: 'bottom',
            lineHeight: 24
          },
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.25)',
            inside: true,
            margin: 0,
            verticalAlign: 'bottom',
            lineHeight: 24
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.25)'
            }
          }
        },
        series: this.setDefaultChartData()
      },
      datePickerValue: [],
      activeName: 'first',
      changeList: [{
        name: 'first',
        text: '按日期显示'
      }, {
        name: 'second',
        text: '按员工显示'
      }],
      options: [],
      paginationToPerson: {
        size: 15,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0
      },
      paginationToDate: {
        size: 15,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0
      },
      selectToday: true,
      listDate: [],
      listPerson: [],
      chatRoomOwner: [],
      chatOwnerName: '不限', // 群主名字
      guideIds: [], // 群主id
      actionValue: '',
      today: '',
      last7: '',
      lart30: '',
      datePickerArr: [],
      showTodaySelect: true,
      bases: process.env.VUE_APP_THEME,
      baseAselect: 'base-text-select',
      baseAselectQA: 'base-text-selectQA',
      eltabQA: 'elTabQA',
      eltab: 'elTab'
    }
  },
  computed: {
    xAxisDate () { // 根据时间区间计算出每一日期
      let dateList = []
      const startTime = this.getDate(this.startTime)
      const endTime = this.getDate(this.endTime)
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        const year = startTime.getFullYear()
        const month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
        const day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateList.push(year + '-' + month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateList
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.dealTime()
      await this.dealInitTime()
      this.loadTopData()
      this.loadChatList()
      this.loadDateList()
      this.loadPersonList()
      // this.queryChatroomLeaderOptions()
    },
    // 重置
    onResetSearch () {
      this.checkId = 1
      this.endTime = ''
      this.startTime = ''
      this.datePickerValue = []
      this.activeName = 'first'
      this.options = []
      this.selectToday = true
      this.listDate = []
      this.listPerson = []
      this.chatRoomOwner = []
      this.chatOwnerName = '不限'
      this.actionValue = ''
      this.today = ''
      this.last7 = ''
      this.lart30 = ''
      this.datePickerArr = []
      this.showTodaySelect = true
      this.init()
    },
    dealInitTime () {
      this.datePickerValue = [this.last7, this.today]
    },
    initPageData () {
      this.paginationToDate = {
        ...this.paginationToDate,
        size: 15,
        page: 1
      }
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size: 15,
        page: 1
      }
    },
    /**
   * 格式化日期格式
   * @param {*} datestr
   * @return {*}
   */
    getDate (datestr) {
      const noTime = datestr.split(' ')[0]
      const temp = noTime.split('-')
      const date = new Date(temp[0], temp[1] - 1, temp[2])
      return date
    },
    outputCsvFile () {
      let that = this
      if (this.listPerson.length <= 0) {
        that.$notify.error('当前没有匹配的数据项')
        return false
      }
      if (this.datePickerArr.length > 0) {
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      } else {
        this.startTime = this.selectToday ? this.last7 : this.lart30
        this.endTime = this.today
      }
      const parms = {
        chatRoomId: '',
        endTime: this.endTime,
        guideIds: this.guideIds,
        // owner: this.chatOwnerName === '不限' ? '' : this.chatOwnerName,
        startTime: this.startTime,
        exportType: 21
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, parms).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: rect.top,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    },
    owenerChange (val) {
      this.guideIds = val.map(el => +el)
      this.initPageData()
      this.loadChatList()
      // if (this.checkId === 1) {
      //   this.loadDateList()
      // } else {
      //   this.loadPersonList()
      // }
      this.loadDateList()
      this.loadPersonList()
      // this.queryWeWorkRoomsNameOptions()
    },
    datePickerChange (val) {
      this.datePickerArr = val || []
      let startTime
      let endTime
      if (this.datePickerArr.length === 0) {
        this.showTodaySelect = false
        startTime = ''
        endTime = ''
      } else {
        this.showTodaySelect = false
        startTime = this.datePickerArr[0]
        endTime = this.datePickerArr[1]
      }
      this.selectToday = false
      this.datePickerValue = [startTime, endTime]
      this.initPageData()
      // if (this.checkId === 1) {
      //   this.loadDateList()
      // } else {
      //   this.loadPersonList()
      // }
      this.loadChatList()
      this.loadDateList()
      this.loadPersonList()
    },
    selectTodayClick (val) {
      this.datePickerArr = []
      this.selectToday = val === 'seven'
      const startTime = this.selectToday ? this.last7 : this.lart30
      this.showTodaySelect = true
      this.datePickerValue = [startTime, this.today]
      this.initPageData()
      this.loadChatList()
      // if (this.checkId === 1) {
      //   this.loadDateList()
      // } else {
      //   this.loadPersonList()
      // }
      this.loadDateList()
      this.loadPersonList()
    },
    lookNoStatistical () {
      this.$router.push({
        path: '/Social/OperationData/NoStatistical'
      })
    },
    // 点击tab切换
    handleClick (tab) {
      if ((this.activeName === 'first' && this.checkId === 1) || (this.activeName === 'second' && this.checkId === 2)) {
        return false
      }
      if (tab.name === 'second') {
        this.checkId = 2
        this.loadPersonList()
        this.actionValue = ''
        // this.options = []
        // this.queryChatroomLeaderOptions()
      } else {
        this.checkId = 1
        this.loadDateList()
        // this.queryWeWorkRoomsNameOptions()
      }
    },
    showMoreData () {
      // this.$refs.timeList.closeDeawer()
      this.$refs.detaList.closeDeawer()
    },
    loadTopData () {
      this.$http.fetch(this.$api.weWork.weWorkRooms.analysis_general, {}).then(res => {
        if (res.success && res.result) {
          this.dataList = this.dataList.map(item => ({
            ...item,
            value: res.result[item.key] || 0,
            isMoney: false
          }))
        }
      })
    },
    loadDateList () {
      if (this.datePickerArr.length > 0) {
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      } else {
        this.startTime = this.selectToday ? this.last7 : this.lart30
        this.endTime = this.today
      }
      const parms = {
        searchMap: {
          chatRoomId: '',
          endTime: this.endTime,
          guideIds: this.guideIds,
          startTime: this.startTime
        },
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      if (this.paginationToDate.page === 1) {
        this.listDate = []
        this.paginationToDate.total = 0
      }
      this.loadingData = true
      this.$http
        .fetch(this.$api.weWork.weWorkRooms.analysis_page_list_by_date, parms)
        .then(res => {
          if (res.success) {
            const json = res.result
            const arr = json.data || []
            this.loadingData = false
            this.listDate = arr
            this.paginationToDate.total = parseInt(res.result.recordsTotal)
          }
        })
    },
    loadPersonList () {
      if (this.datePickerArr.length > 0) {
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      } else {
        this.startTime = this.selectToday ? this.last7 : this.lart30
        this.endTime = this.today
      }
      const parms = {
        searchMap: {
          chatRoomId: '',
          endTime: this.endTime,
          guideIds: this.guideIds,
          startTime: this.startTime
        },
        start: (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      if (this.paginationToPerson.page === 1) {
        this.listPerson = []
        this.paginationToPerson.total = 0
      }
      this.loading = true
      this.$http
        .fetch(this.$api.weWork.weWorkRooms.analysis_page_list_by_user, parms)
        .then(res => {
          if (res.success) {
            const json = res.result
            const arr = json.data || []
            this.loading = false
            this.listPerson = arr
            this.paginationToPerson.total = parseInt(res.result.recordsTotal)
          }
        })
    },
    handleSizeChangeForDate (size) {
      this.paginationToDate = {
        ...this.paginationToDate,
        size,
        page: 1
      }
      this.loadDateList()
    },
    handleCurrentChangeForDate (page) {
      this.paginationToDate.page = page
      this.loadDateList()
    },
    handleSizeChangeForPerson (size) {
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size,
        page: 1
      }
      this.loadPersonList()
    },
    handleCurrentChangeForPerson (page) {
      this.paginationToPerson.page = page
      this.loadPersonList()
    },
    setDefaultChartData () {
      return [
        {
          name: '昨日总群数',
          type: 'line',
          data: []
        },
        {
          name: '群管理好友数',
          type: 'line',
          data: []
        },
        {
          name: '群新增好友数',
          type: 'line',
          data: []
        },
        {
          name: '群流失好友数',
          type: 'line',
          data: []
        }
      ]
    },
    /**
   * 格式化图表数据 没有值的天数默认0
   * @param {*} list
   * @param {*} dateList
   * @return {*}
   */
    formatChart (resList, dateList) {
      const data = this.setDefaultChartData()
      const list = [...resList].reverse()
      dateList.map(item => {
        if (list.length) {
          if (item === list[0].stat_time) {
            this.setChartData(list[0].chat_totals, list[0].member_totals, list[0].new_member_cnts, list[0].member_loss_cnts, data)
            list.shift()
          } else {
            this.setChartData(0, 0, 0, 0, data)
          }
        } else {
          this.setChartData(0, 0, 0, 0, data)
        }
      })
      return data
    },
    setChartData (item1, item2, item3, item4, list) {
      list[0].data.push(item1)
      list[1].data.push(item2)
      list[2].data.push(item3)
      list[3].data.push(item4)
    },
    // 获取图表信息
    loadChatList () {
      if (this.datePickerArr.length > 0) {
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      } else {
        this.startTime = this.selectToday ? this.last7 : this.lart30
        this.endTime = this.today
      }
      const parms = {
        chatRoomId: '',
        endTime: this.endTime,
        guideIds: this.guideIds,
        startTime: this.startTime
      }
      this.$http.fetch(this.$api.weWork.weWorkRooms.analysis_list, parms).then(res => {
        if (res.success) {
          this.option.xAxis.data = this.xAxisDate
          this.option.series = this.formatChart(res.result, this.xAxisDate)
        }
      })
    },
    // 获取群主列表
    // queryChatroomLeaderOptions () {
    //   this.$http
    //     .fetch(this.$api.weWork.weWorkRooms.analysis_owner, { chatId: '' })
    //     .then(resp => {
    //       this.chatRoomOwner = resp.result
    //       this.chatRoomOwner.unshift({ value: '不限', label: '不限' })
    //     })
    //     .catch(resp => {})
    // },
    // 废弃接口 暂留以防后续使用
    // queryWeWorkRoomsNameOptions () {
    //   this.$http
    //     .fetch(this.$api.weWork.weWorkRooms.queryWeWorkRoomsNameOptions, { owner: this.chatOwnerName === '不限' ? '' : this.chatOwnerName })
    //     .then(resp => {
    //       this.options = resp.result
    //     })
    //     .catch(resp => {})
    // },
    dealTime () {
      this.today = moment()
        .subtract('days', 1)
        .format('YYYY-MM-DD')
      this.last7 = moment()
        .subtract('days', 7)
        .format('YYYY-MM-DD')
      this.lart30 = moment()
        .subtract('days', 30)
        .format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.chat-view {
  background-color: white;
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 4px;
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
  }
}
.material-data {
  border-radius: 4px;
  background-color: white;
  padding-bottom: 24px;
  .top-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    height: 56px;
  }
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
    padding-left: 16px;
  }
  .unDoneData {
    width: 116px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    font-size: 14px;
    color: #595959;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    line-height: 32px;
    margin-right: 16px;
  }
}
.material-show {
  margin-top: 16px;
  background-color: white;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  .material-chat {
    .title {
      font-size: 16px;
      color: #262626;
      line-height: 56px;
      font-weight: 500;
      height: 56px;
    }
  }
}
.material-list {
  background-color: white;
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
    height: 56px;
    margin-left: 16px;
  }
  .select-data-view {
    margin: 0;
  }
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.chat-select {
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .left-select {
    display: flex;
    flex-direction: row;
  }
}

.day-view {
  border-right: 1px solid #e8e8e8;
  .base-text {
    font-size: 14px;
    color: #595959;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    margin-right: 16px;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 9px;
    cursor: pointer;
  }
  .base-text-select {
    color: #0091fa;
    background: #f5fbff;
  }
  .base-text-selectQA {
   color: #2153D4;
    background: #f5fbff;
  }
  .base-un-active {
    color: #595959;
    background-color: white;
  }
}

.drawer-output {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.date-view {
  margin-left: 16px;
}

.item-down {
  width: 180px;
  height: 32px;
  padding-right: 4px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  margin-left: 16px;
  .name {
    width: 90px;
  }
}
.al{
  width: 171px;
  .nameNext{
    width: 104px;
  }
}
.name {
  width: 60px;
  margin-left: 8px;
}
.nameNext {
  width: 90px;
  margin-left: 8px;
}
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.self-btn {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color:#C0C4CC;
  }
}
</style>
<style scoped>
.elTab >>> .el-tabs__item.is-active{
    color: #0094fc;
}
.elTabQA >>> .el-tabs__item.is-active{
    color: #2153D4;
}
</style>
