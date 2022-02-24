<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">群会话统计</div>
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
                      ? 'base-text-select'
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
                      : 'base-text-select'
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
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions1"
                align="center"
                @change='datePickerChange'
              >
              </el-date-picker>
            </div>
            <div>
              <el-form :inline="true" class="form-inline_top">
                <el-form-item label="员工：">
                  <NsGuideDialog
                    :selfBtn='true'
                    :appendToBody='true'
                    :isButton="false"
                    :echoStore='true'
                    :auth="true"
                    :switchAreaFlag='1'
                    :isNeedLink='true'
                    type="primary"
                    btnTitle="" dialogTitle="员工" v-model="guideIds" @input="(value)=>{this.changeSearchfrom({ guideIds: value })}" :showTitleTip='false'>
                    <template slot='selfBtn'>
                      <div class='self-btn'>
                        {{(guideIds && guideIds.length)?`已选择${guideIds.length}个员工`:'不限'}}
                        <Icon type="geren" class='guideIds-icon'></Icon>
                      </div>
                    </template>
                  </NsGuideDialog>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <ns-button @click="onResetSearch">{{$t('operating.reset')}}</ns-button> -->
          <div class="outputCsvFile" @click="outputCsvFile">
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
      <div class="select-data-view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按日期显示" name="first">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  v-loading='loadingData'
                  :data="listDate"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="stat_time" label="日期"> </el-table-column>
                  <el-table-column prop="chat_totals" label="好友群总数"> </el-table-column>
                  <el-table-column prop="new_chat_cnts" label="新增群聊数"> </el-table-column>
                  <el-table-column prop="chat_has_msgs" label="有过消息的好友群数"> </el-table-column>
                  <el-table-column prop="member_has_msgs" label="发过消息的群成员数"> </el-table-column>
                  <el-table-column prop="msg_totals" label="好友群消息总数"> </el-table-column>
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
          <el-tab-pane label="按员工显示" name="second">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  v-loading='loading'
                  :data="listPerson"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="user_name" label="员工"> </el-table-column>
                  <el-table-column prop="chat_totals" label="好友群总数"> </el-table-column>
                  <el-table-column prop="new_chat_cnts" label="新增群聊数"> </el-table-column>
                  <el-table-column prop="chat_has_msgs" label="有过消息的好友群数"> </el-table-column>
                  <el-table-column prop="member_has_msgs" label="发过消息的群成员数"> </el-table-column>
                  <el-table-column prop="msg_totals" label="好友群消息总数"> </el-table-column>
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
import NsGuideDialog from '@/components/NsGuideDialog'
import ColorfulDisplay from './components/ColorfulDisplay'
export default {
  name: 'GroupData',
  components: { PageTable, NsEcharts, NsGuideDialog, ColorfulDisplay },
  data () {
    return {
      loading: false,
      loadingData: false,
      checkId: 1,
      endTime: '',
      startTime: '',
      dataList: [
        {
          key: 'chat_totals',
          nick: '好友群总数',
          value: 0
        },
        {
          key: 'chat_has_msgs',
          nick: '有过消息的好友群数',
          value: 0
        },
        {
          key: 'member_has_msgs',
          nick: '发过消息的群成员数',
          value: 0
        },
        {
          key: 'msg_totals',
          nick: '好友群消息总数',
          value: 0
        }
      ],
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
      //   }
      // },
      pickerOptions1: {
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
            '好友群总数',
            '有过消息的好友群数',
            '发过消息的群成员数',
            '好友群消息总数'
          ],
          left: '0',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          left: 46,
          right: 46,
          top: 50,
          bottom: 50,
          containLabel: true
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
      options: [
        {
          value: '选项1',
          label: '全部动作'
        },
        {
          value: '选项2',
          label: '下载'
        },
        {
          value: '选项3',
          label: '发送'
        }
      ],
      actionValue: '全部动作',
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
      listDate: [],
      listPerson: [],
      selectToday: true,
      today: '',
      last7: '',
      lart30: '',
      guideIds: [],
      datePickerArr: [],
      showTodaySelect: true
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
  methods: {
    async init () {
      this.dealTime()
      await this.dealInitTime()
      this.loadTopData()
      this.loadChatList()
      this.loadDateList()
      this.loadPersonList()
    },
    // 重置
    onResetSearch () {
      this.checkId = 1
      this.endTime = ''
      this.startTime = ''
      this.datePickerValue = []
      this.activeName = 'first'
      this.actionValue = '全部动作'
      this.listDate = []
      this.listPerson = []
      this.selectToday = true
      this.today = ''
      this.last7 = ''
      this.lart30 = ''
      this.guideIds = []
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
    setDefaultChartData () {
      return [
        {
          name: '好友群总数',
          type: 'line',
          data: []
        },
        {
          name: '有过消息的好友群数',
          type: 'line',
          data: []
        },
        {
          name: '发过消息的群成员数',
          type: 'line',
          data: []
        },
        {
          name: '好友群消息总数',
          type: 'line',
          data: []
        }
      ]
    },
    setChartData (item1, item2, item3, item4, list) {
      list[0].data.push(item1)
      list[1].data.push(item2)
      list[2].data.push(item3)
      list[3].data.push(item4)
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
      let arrList = this.guideIds.length > 0 ? this.guideIds : []
      const param = {
        guideIds: arrList.join(','),
        endTime: this.endTime,
        startTime: this.startTime,
        exportType: 10
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, param).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 330,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
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
      } else {
        this.checkId = 1
        this.loadDateList()
      }
    },
    showMoreData () {
      this.$refs.detaList.closeDeawer()
    },
    loadTopData () {
      this.$http.fetch(this.$api.weWork.weWorkRooms.general, {}).then(res => {
        if (res.success) {
          this.dataList = this.dataList.map(item => ({
            ...item,
            value: res.result[item.key],
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
      let arrList = this.guideIds.length > 0 ? this.guideIds : []
      const parms = {
        searchMap: {
          guideIds: arrList.join(','),
          endTime: this.endTime,
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
        .fetch(this.$api.weWork.weWorkRooms.page_list_by_date, parms)
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
      let arrList = this.guideIds.length > 0 ? this.guideIds : []
      const parms = {
        searchMap: {
          guideIds: arrList.join(','),
          endTime: this.endTime,
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
        .fetch(this.$api.weWork.weWorkRooms.page_list_by_user, parms)
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
    },
    // 时间选择筛选
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
    // 选择日期
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
    // 选择员工之后的图标刷新请求
    changeSearchfrom (value) {
      this.guideIds = value.guideIds
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
            this.setChartData(list[0].chat_totals, list[0].chat_has_msgs, list[0].member_has_msgs, list[0].msg_totals, data)
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
    // 获取图表数据
    loadChatList () {
      if (this.datePickerArr.length > 0) {
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      } else {
        this.startTime = this.selectToday ? this.last7 : this.lart30
        this.endTime = this.today
      }
      let arrList = this.guideIds.length > 0 ? this.guideIds : []
      const parms = {
        guideIds: arrList.join(','),
        endTime: this.endTime,
        startTime: this.startTime
      }
      this.$http.fetch(this.$api.weWork.weWorkRooms.list, parms).then(res => {
        if (res.success) {
          this.option.xAxis.data = this.xAxisDate
          this.option.series = this.formatChart(res.result, this.xAxisDate)
        }
      })
    }
  },
  mounted () {
    this.init()
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
  /* width: 1206px; */
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
  .data-view {
    display: flex;
    flex-direction: row;
    margin-left: 16px;
    margin-right: 16px;
    /* justify-content: space-between; */
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
  /* width: 1206px; */
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
  /* width: 1206px; */
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
    height: 56px;
    margin-left:16px;
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
  .base-un-active {
    color: #595959;
    background-color: white;
  }
}
.outputCsvFile {
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
  width: 171px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  margin-left: 16px;
  .name {
    width: 70px;
    margin-left:8px;
  }
}
.form-inline_top {
  margin-left: 16px;
  display: flex;
  align-items: center;
}
.form-inline_top .el-form-item.addgroup-btn {
  padding: 0 16px;
  line-height: 30px;
  height: 30px;
  border-radius: 2px;
  >>> .el-button--small {
    font-size: 14px;
    padding: 7px 0 !important;
  }
}
.form-inline_top .el-form-item {
  height: 32px;
}
.self-btn {
  width: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
</style>
