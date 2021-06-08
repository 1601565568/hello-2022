<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">
          客户会话统计
        </div>
      </div>
      <div class="data-view">
        <el-row :gutter="15">
          <template v-for="item in dataList">
            <el-col :key="item.name" :span="6">
              <div class="base-cell" :class="item.claseName">
                <div class="text">{{ item.name }}</div>
                <div class="number">{{ item.data }}</div>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <div class="material-show">
      <div class="material-chat">
        <div class="chat-select">
          <div class="xxxx">
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
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="center"
                  @change="datePickerChange"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </div>
            </div>
            <div class='shop-content'>
              <span>选择员工：</span>
              <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="guideIds" @input="guideClick">
                <template slot='selfBtn'>
                  <div class='self-btn'>
                    {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个员工`:'全部'}}
                    <Icon type="geren" class='guideIds-icon'></Icon>
                  </div>
                </template>
              </NsGuideDialog>
            </div>
          </div>
          <div class="drawer-output" @click="outputClick">
            导出CSV文件
          </div>
        </div>
        <div class="title">数据分析</div>
        <div v-if="echartList.length" class="charts-view">
          <NsEcharts :options="option" />
        </div>
        <div class="no-data" v-else>
          <ns-no-data>{{$t('prompt.noData')}}</ns-no-data>
        </div>
      </div>
    </div>
    <div class="material-list">
      <div class="title">数据报表</div>
      <div class="select-data-view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按日期显示" name="first">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  :data="listDate"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="time" label="日期">
                  </el-table-column>
                  <el-table-column prop="chatCnt" label="聊天次数">
                  </el-table-column>
                  <el-table-column prop="messageCnt" label="发送消息次数">
                  </el-table-column>
                </el-table>
              </template>
              <template slot="pagination">
                <el-pagination
                  background
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
                  :data="listMaterial"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="guideName" label="员工姓名">
                  </el-table-column>
                  <el-table-column prop="chatCnt" label="聊天次数">
                  </el-table-column>
                  <el-table-column prop="messageCnt" label="发送消息次数">
                  </el-table-column>
                </el-table>
              </template>
              <template slot="pagination">
                <el-pagination
                  background
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
import NsGuideDialog from '@/components/NsGuideDialog'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import moment from 'moment'
export default {
  name: 'MaterialCahat',
  components: { PageTable, NsGuideDialog, NsEcharts },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
      dataList: [
        { name: '昨天聊天次数', data: 0, claseName: 'one' },
        { name: '昨日发送消息数', data: 0, claseName: 'two' },
        { name: '昨日聊天回复占比（%）', data: 0, claseName: 'three' },
        { name: '昨日平均首次回复时长（分）', data: 0, claseName: 'four' }
      ],
      listData: [],
      option: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '聊天总数',
            '发送消息数'
          ],
          left: '0',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
        },
        color: [
          '#4287FF',
          '#F5AD34'
        ],
        grid: {
          left: '2%',
          right: '3%',
          bottom: 0,
          containLabel: true,
          top: '4%',
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
            fontsize: 12,
            color: '#BFBFBF',
            lineHeight: 20
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontsize: 12,
            color: '#BFBFBF',
            lineHeight: 20
          }
        },
        series: []
      },
      activeName: 'first',
      today: '',
      last7: '',
      lart30: '',
      paginationToDate: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      listDate: [],
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      listMaterial: [],
      selectToday: true,
      datePickerArr: [],
      echartList: [],
      showTodaySelect: true,
      startTime: '',
      endTime: '',
      guideIds: [],
      outputClickState: true,
      datePickerValue: []
    }
  },
  methods: {
    initPageData () {
      this.paginationToDate = {
        ...this.paginationToDate,
        size: 10,
        page: 1
      }
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size: 10,
        page: 1
      }
    },
    datePickerChange (val) {
      this.datePickerArr = val || []
      if (this.datePickerArr.length === 0) {
        this.showTodaySelect = false
        this.startTime = ''
        this.endTime = ''
      } else {
        this.showTodaySelect = false
        this.startTime = this.datePickerArr[0]
        this.endTime = this.datePickerArr[1]
      }
      this.selectToday = false
      this.datePickerValue = [this.startTime, this.endTime]
      this.initPageData()
      this.loadDateList()
      this.loadMaterialList()
      this.loadChartData()
    },
    outputClick () {
      if (!this.listMaterial.length) {
        this.$notify.info('导出失败，列表暂无数据')
        return
      }
      if (!this.outputClickState) {
        this.$notify.info('正在导出中，请不要重复操作')
        return
      }
      this.outputClickState = false
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 00:00:00',
          startTime: this.startTime + ' 00:00:00',
          guideIds: this.guideIds.toString()
        }
      }
      const csvStartTime = this.startTime.replace(/-/g, '')
      const csvEndTime = this.endTime.replace(/-/g, '')
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.weWork.sessionStatistics.export, parms)
        .then(resp => {
          that.outputClickState = true
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          that.outputClickState = true
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let fileName =
              '客户会话统计' + csvStartTime + '-' + csvEndTime + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    selectTodayClick (val) {
      this.selectToday = val === 'seven'
      if (this.selectToday) {
        this.startTime = this.last7
      } else {
        this.startTime = this.lart30
      }
      this.endTime = this.today
      this.datePickerValue = [this.startTime, this.endTime]
      this.showTodaySelect = true
      this.initPageData()
      this.loadDateList()
      this.loadMaterialList()
      this.loadChartData()
    },
    guideClick () {
      this.initPageData()
      this.loadDateList()
      this.loadMaterialList()
      this.loadChartData()
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
      this.loadMaterialList()
    },
    handleCurrentChangeForPerson (page) {
      this.paginationToPerson.page = page
      this.loadMaterialList()
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
      this.startTime = this.last7
      this.endTime = this.today
      this.datePickerValue = [this.startTime, this.endTime]
    },
    handleClick () {},
    loadTopData () {
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 00:00:00',
          startTime: this.startTime + ' 00:00:00'
        }
      }
      this.$http
        .fetch(this.$api.weWork.sessionStatistics.queryAnalysisOverview, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result || {}
            this.dataList = [
              {
                name: '昨日聊天总数',
                data: json.chatCnt || 0,
                claseName: 'one'
              },
              {
                name: '昨日发送消息数',
                data: json.messageCnt || 0,
                claseName: 'two'
              },
              {
                name: '昨日聊天回复占比（%）',
                data: json.replyPercentage || 0,
                claseName: 'three'
              },
              {
                name: '昨日平均首次回复时长（分）',
                data: json.avgReplyTime || 0,
                claseName: 'four'
              }
            ]
          }
        })
        .catch(resp => {})
        .finally(() => {})
    },
    loadDateList () {
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 00:00:00',
          startTime: this.startTime + ' 00:00:00',
          guideIds: this.guideIds.toString()
        },
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      if (this.paginationToDate.page === 1) {
        this.listDate = []
        this.paginationToDate.total = 0
      }
      this.$http
        .fetch(this.$api.weWork.sessionStatistics.queryAnalysisListByDate, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result
            const arr = json.data || []
            this.listDate = arr
            this.paginationToDate.total = parseInt(json.recordsTotal)
          }
        })
        .catch(resp => {})
        .finally(() => {})
    },
    loadMaterialList () {
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 00:00:00',
          startTime: this.startTime + ' 00:00:00',
          guideIds: this.guideIds.toString()
        },
        start:
          (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      if (this.paginationToPerson.page === 1) {
        this.listMaterial = []
        this.paginationToPerson.total = 0
      }
      this.$http
        .fetch(this.$api.weWork.sessionStatistics.queryAnalysisListByUser, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result
            const arr = json.data || []
            this.listMaterial = arr
            this.paginationToPerson.total = parseInt(json.recordsTotal)
          }
        })
        .catch(resp => {})
        .finally(() => {})
    },
    loadChartData () {
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 00:00:00',
          startTime: this.startTime + ' 00:00:00',
          guideIds: this.guideIds.toString()
        }
      }
      this.$http
        .fetch(this.$api.weWork.sessionStatistics.queryAnalysisListByDateReturnList, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result || []
            const arr = json.reverse()
            this.echartList = arr
            const times = []
            const chatCnt = []
            const messageCnt = []
            for (const item of arr) {
              times.push(item.time)
              chatCnt.push(item.chatCnt)
              messageCnt.push(item.messageCnt)
            }
            this.option.xAxis.data = times
            this.option.series = [
              {
                name: '聊天总数',
                type: 'line',
                stack: '聊天总数',
                data: chatCnt
              },
              {
                name: '发送消息数',
                type: 'line',
                stack: '发送消息总数',
                data: messageCnt
              }
            ]
          }
        })
        .catch(resp => {})
        .finally(() => {})
    }
  },
  mounted () {
    this.dealTime()
    this.loadTopData()
    this.loadDateList()
    this.loadMaterialList()
    this.loadChartData()
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.material-data {
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
  margin-left: 16px;
  margin-right: 16px;
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
  cursor: pointer;
}
.base-cell {
  color: #ffffff;
  text-align: center;
  border-radius: 4px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
.number {
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  line-height: 32px;
  font-weight: 500;
}
.text {
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 10px;
}
}
.one {
  background-image: linear-gradient(269deg, #4eb3fc 0%, #0091fa 100%);
}
.two {
  background-image: linear-gradient(269deg, #ad5489 0%, #702698 100%);
}
.three {
  background-image: linear-gradient(270deg, #a0e35e 0%, #67c230 100%);
}
.four {
  background-image: linear-gradient(269deg, #fc6767 0%, #ec008c 100%);
}
.five {
  background-image: linear-gradient(269deg, #8b4efc 0%, #6a00fa 100%);
}
.six {
  background-image: linear-gradient(270deg, #f7bd5b 0%, #f49f10 100%);
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
.sub-title {
  font-size: 16px;
  color: #8c8c8c;
  line-height: 24px;
  font-weight: 400;
}
.remind-data-view {
  height: 60px;
  background: #f3f9ff;
  border-radius: 4px;
  margin: 16px 16px 0 16px;
  font-size: 14px;
  color: #979797;
  letter-spacing: 0;
  font-weight: 400;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 23px;
}

.no-echart-list-view {
  margin: 0 auto;
  width: 320px;
  height: 220px;
}

.shop-content {
  position: relative;
  top: -1px;
  display: flex;
  font-size: 14px;
  border: 1px solid #D9D9D9;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  border-radius: 2px;
  margin-left: 16px;
}
.self-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
.guideIds-icon {
  margin-left: 10px;
  color:#8C8C8C;
}
}
.xxxx {
  display: flex;
  align-items: center;
}
</style>
