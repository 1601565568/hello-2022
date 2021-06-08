<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">
          素材库累计数据
          <span class="sub-title">（数据统计至昨日）</span>
        </div>
        <div class="unDoneData" @click="lookNoStatistical">查看未执行统计</div>
      </div>
      <div class="data-view">
        <el-row :gutter="15">
          <template v-for="item in dataList">
            <el-col :key="item.name" :span="4">
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
          <div class="drawer-output" @click="outputClick">
            导出CSV文件
          </div>
        </div>
        <div class="title">数据分析</div>
        <div v-if="echartList.length" class="charts-view">
          <NsEcharts :options="option" />
        </div>
        <div v-else class="no-echart-list-view">
          <img src="@/assets/no-data.png" alt="暂无数据" />
        </div>
      </div>
    </div>
    <div class="material-list">
      <div class="title">数据报表</div>
      <div class="select-data-view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <div class="remind-data-view">
            <div v-if="activeName === 'second'">
              统计范围：{{ startTime || '-' }}至{{ endTime || '-' }}
            </div>
            <div>一条素材包括多项可发送元素时，每次发送都会记一次发送次数</div>
          </div>
          <el-tab-pane label="按日期统计" name="first">
            <div v-if="listDate.length > 0">
              <page-table style="padding-top:0">
                <template slot="table">
                  <el-table
                    :data="listDate"
                    class="new-table_border drawer-table"
                    :row-style="{ height: '48px' }"
                  >
                    <el-table-column prop="trackTime" label="日期">
                    </el-table-column>
                    <el-table-column prop="nowSendSum" label="发送次数">
                    </el-table-column>
                    <el-table-column prop="nowDownloadSum" label="下载次数">
                    </el-table-column>
                    <el-table-column prop="nowCompletionSum" label="补全次数">
                    </el-table-column>
                    <el-table-column prop="title" width="125px" label="操作">
                      <template slot-scope="scope">
                        <ns-button
                          type="text"
                          class="select-button"
                          @click="showMoreToDate(scope.row)"
                          >查看明细</ns-button
                        >
                      </template>
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
            </div>
            <div v-else>
              <NoData />
            </div>
          </el-tab-pane>
          <el-tab-pane label="按素材统计" name="second">
            <div v-if="listMaterial.length > 0">
              <page-table style="padding-top:0">
                <template slot="table">
                  <el-table
                    :data="listMaterial"
                    class="new-table_border drawer-table"
                    :row-style="{ height: '48px' }"
                  >
                    <el-table-column prop="materialTitle" label="素材标题">
                      <template slot-scope="scope">
                        <el-popover
                          placement="top-start"
                          width="300"
                          trigger="hover"
                          :disabled="scope.row.materialTitle.length <= 15"
                        >
                          <div>{{ scope.row.materialTitle }}</div>
                          <span
                            slot="reference"
                            v-if="scope.row.materialTitle.length <= 15"
                            >{{ scope.row.materialTitle }}</span
                          >
                          <span
                            slot="reference"
                            v-if="scope.row.materialTitle.length > 15"
                            >{{
                              scope.row.materialTitle.substr(0, 15) + '...'
                            }}</span
                          >
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sendSum" label="发送次数">
                    </el-table-column>
                    <el-table-column prop="downloadSum" label="下载次数">
                    </el-table-column>
                    <el-table-column prop="completionSum" label="补全次数">
                    </el-table-column>
                    <el-table-column prop="title" width="125px" label="操作">
                      <template slot-scope="scope">
                        <ns-button
                          type="text"
                          class="select-button"
                          @click="showMoreToPerson(scope.row)"
                          >查看明细</ns-button
                        >
                      </template>
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
            </div>
            <div v-else>
              <NoData />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <DataList ref="detaList" />
    <TimeList ref="timeList" />
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import DataList from './components/DataList'
import TimeList from './components/TimeList'
import NoData from './components/NoData'
import moment from 'moment'
export default {
  name: 'MaterialCahat',
  components: { PageTable, NsEcharts, DataList, TimeList, NoData },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
      dataList: [
        { name: '素材发送次数总计', data: 0, claseName: 'one' },
        { name: '素材下载总次数', data: 0, claseName: 'two' },
        { name: '素材补全总次数', data: 0, claseName: 'three' },
        { name: '昨日素材发送次数', data: 0, claseName: 'four' },
        { name: '昨日素材下载次数', data: 0, claseName: 'five' },
        { name: '昨日素材补全次数', data: 0, claseName: 'six' }
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
            '素材发送次数总计',
            '素材下载总次数',
            '素材补全总次数',
            '每日素材发送次数',
            '每日素材下载次数',
            '每日素材补全次数'
          ],
          left: 'center',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10,
          selected: {
            素材发送次数总计: false,
            素材下载总次数: false,
            素材补全总次数: false
          }
        },
        color: [
          '#4287FF',
          '#722898',
          '#95DA73',
          '#F34CA7',
          '#7962EC',
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
      datePickerValue: []
    }
  },
  methods: {
    // initPageData
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
      const parms = {
        endTime: this.endTime + ' 23:59:59',
        startTime: this.startTime + ' 00:00:00'
      }
      const csvStartTime = this.startTime.replace(/-/g, '')
      const csvEndTime = this.endTime.replace(/-/g, '')
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.exportExcelByComplete, parms)
        .then(resp => {
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let curDate = moment().format('YYYYMMDDHHmmss')
            let fileName =
              '素材行为数据统计' + csvStartTime + '至' + csvEndTime + '.xlsx'
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
    lookNoStatistical () {
      this.$router.push({
        path: '/Social/OperationData/NoStatistical'
      })
    },
    handleClick () {},
    showMoreToDate (row) {
      this.$refs.timeList.openDeawer(row)
    },
    showMoreToPerson (row) {
      this.$refs.detaList.openDeawer(row, this.startTime, this.endTime)
    },
    loadTopData () {
      this.$http
        .fetch(this.$api.guide.getSumData, {})
        .then(resp => {
          if (resp.success) {
            const json = resp.result || {}
            this.dataList = [
              {
                name: '素材发送次数总计',
                data: json.sendSum || 0,
                claseName: 'one'
              },
              {
                name: '素材下载总次数',
                data: json.downloadSum || 0,
                claseName: 'two'
              },
              {
                name: '素材补全总次数',
                data: json.completionSum || 0,
                claseName: 'three'
              },
              {
                name: '昨日素材发送次数',
                data: json.nowSendSum || 0,
                claseName: 'four'
              },
              {
                name: '昨日素材下载次数',
                data: json.nowDownloadSum || 0,
                claseName: 'five'
              },
              {
                name: '昨日素材补全次数',
                data: json.nowCompletionSum || 0,
                claseName: 'six'
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
          endTime: this.endTime + ' 23:59:59',
          startTime: this.startTime + ' 00:00:00'
        },
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      if (this.paginationToDate.page === 1) {
        this.listDate = []
        this.paginationToDate.total = 0
      }
      this.$http
        .fetch(this.$api.guide.getStatisticsListByDate, parms)
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
          endTime: this.endTime + ' 23:59:59',
          startTime: this.startTime + ' 00:00:00'
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
        .fetch(this.$api.guide.getStatisticsListByMaterial, parms)
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
        endTime: this.endTime + ' 23:59:59',
        startTime: this.startTime + ' 00:00:00',
        eventType: 0,
        guideIdsStr: '',
        shopIdsStr: ''
      }
      this.$http
        .fetch(this.$api.guide.getChartData, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result || []
            const arr = json.reverse()
            this.echartList = arr
            const times = []
            const sendTotal = []
            const downTotal = []
            const addTotal = []
            const ySendTotal = []
            const yDownTotal = []
            const yAddTotal = []
            for (const item of arr) {
              times.push(item.date)
              sendTotal.push(item.sendSum)
              downTotal.push(item.downloadSum)
              addTotal.push(item.completionSum)
              ySendTotal.push(item.nowSendSum)
              yDownTotal.push(item.nowDownloadSum)
              yAddTotal.push(item.nowCompletionSum)
            }
            this.option.xAxis.data = times
            this.option.series = [
              {
                name: '素材发送次数总计',
                type: 'line',
                data: sendTotal
              },
              {
                name: '素材下载总次数',
                type: 'line',
                data: downTotal
              },
              {
                name: '素材补全总次数',
                type: 'line',
                data: addTotal
              },
              {
                name: '每日素材发送次数',
                type: 'line',
                data: ySendTotal
              },
              {
                name: '每日素材下载次数',
                type: 'line',
                data: yDownTotal
              },
              {
                name: '每日素材补全次数',
                type: 'line',
                data: yAddTotal
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
</style>
