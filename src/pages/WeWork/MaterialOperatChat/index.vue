<template>
  <div>
    <TipsView/>
    <TopData/>
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
          <NsEcharts :options.sync="option" />
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
                    <el-table-column prop="sendCodePicturesSum" label="发送次数">
                    </el-table-column>
                    <el-table-column prop="imagesViewedSum" label="被浏览次数">
                    </el-table-column>
                    <el-table-column prop="conversionOrderSum" label="转化订单数">
                    </el-table-column>
                    <el-table-column prop="conversionAmountSum" label="转化金额">
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
                    <el-table-column prop="sendCodePicturesSum" label="发送次数">
                    </el-table-column>
                    <el-table-column prop="imagesViewedSum" label="被浏览次数">
                    </el-table-column>
                    <el-table-column prop="conversionOrderSum" label="转化订单数">
                    </el-table-column>
                    <el-table-column prop="conversionAmountSum" label="转化金额">
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
          <el-tab-pane label="按员工统计" name="third">
            <div v-if="listUser.length > 0">
              <page-table style="padding-top:0">
                <template slot="table">
                  <el-table
                    :data="listUser"
                    class="new-table_border drawer-table"
                    :row-style="{ height: '48px' }"
                  >
                    <el-table-column prop="guideName" label="员工姓名">
                    </el-table-column>
                    <el-table-column prop="guide_id" label="工号">
                    </el-table-column>
                    <el-table-column prop="shopName" label="所属门店">
                    </el-table-column>
                    <el-table-column prop="sendCodePicturesSum" label="发送次数">
                    </el-table-column>
                    <el-table-column prop="imagesViewedSum" label="被浏览次数">
                    </el-table-column>
                    <el-table-column prop="conversionOrderSum" label="转化订单数">
                    </el-table-column>
                    <el-table-column prop="conversionAmountSum" label="转化金额">
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
                    :page-sizes="paginationToUser.sizeOpts"
                    :total="paginationToUser.total"
                    :current-page.sync="paginationToUser.page"
                    :page-size="paginationToUser.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChangeForUser"
                    @current-change="handleCurrentChangeForUser"
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
import TopData from './components/TopData'
import TipsView from './components/TipsView'
export default {
  name: 'MaterialOpearatChat',
  components: { PageTable, NsEcharts, DataList, TimeList, NoData, TopData, TipsView },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
      dataList: [],
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
            '发送次数总计',
            '被浏览次数总计',
            '转化订单数总计',
            '转化金额总计',
            '日发送次数',
            '日被浏览次数',
            '日转化订单数',
            '日转化金额'
          ],
          left: '2%',
          bottom: '6%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
        },
        color: [
          '#4287FF',
          '#F7B586',
          '#95DA73',
          '#7962EC',
          '#A0522D',
          '#6D8764',
          '#E3C800',
          '#EC028B'
        ],
        grid: {
          left: '2%',
          right: '3%',
          bottom: 0,
          containLabel: true,
          top: '12%',
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
        yAxis: [],
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
      paginationToUser: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      listMaterial: [],
      listUser: [],
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
    yAaixNum (min, max) {
      return {
        min: min,
        max: max
      }
    },
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
      this.loadUserList()
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
        .fetch(this.$api.guide.exportOperateExcelByComplete, parms)
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
              '附码图片累计数据' + csvStartTime + '至' + csvEndTime + '.xlsx'
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
      this.loadUserList()
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
    handleSizeChangeForUser (size) {
      this.paginationToUser = {
        ...this.paginationToUser,
        size,
        page: 1
      }
      this.loadUserList()
    },
    handleCurrentChangeForUser (page) {
      this.paginationToUser.page = page
      this.loadUserList()
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
    showMoreToDate (row) {
      this.$refs.timeList.openDeawer(row)
    },
    showMoreToPerson (row) {
      this.$refs.detaList.openDeawer(row, this.startTime, this.endTime)
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
        .fetch(this.$api.guide.getOperateStatisticsListByDate, parms)
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
        .fetch(this.$api.guide.getOperateStatisticsListByMaterial, parms)
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
    loadUserList () {
      const parms = {
        searchMap: {
          endTime: this.endTime + ' 23:59:59',
          startTime: this.startTime + ' 00:00:00'
        },
        start:
          (this.paginationToUser.page - 1) * this.paginationToUser.size,
        length: this.paginationToUser.size
      }
      if (this.paginationToUser.page === 1) {
        this.listUser = []
        this.paginationToUser.total = 0
      }
      this.$http
        .fetch(this.$api.guide.getOperateStatisticsListByGuideId, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result
            const arr = json.data || []
            this.listUser = arr
            this.paginationToUser.total = parseInt(json.recordsTotal)
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
            const sendCode = []
            const imagesView = []
            const order = []
            const money = []
            const ySendCode = []
            const yImagesView = []
            const yOrder = []
            const yMoney = []
            for (const item of arr) {
              times.push(item.date)
              sendCode.push(item.sendCodePicturesSum)
              imagesView.push(item.imagesViewedSum)
              order.push(item.nowConversionOrderSum)
              money.push(item.nowConversionAmountSum)
              ySendCode.push(item.nowSendCodePicturesSum)
              yImagesView.push(item.nowImagesViewedSum)
              yOrder.push(item.nowConversionOrderSum)
              yMoney.push(item.nowConversionAmountSum)
            }
            this.option.xAxis.data = times
            this.option.series = [
              {
                name: '发送次数总计',
                type: 'line',
                yAxisIndex: 0,
                data: sendCode
              },
              {
                name: '被浏览次数总计',
                type: 'line',
                yAxisIndex: 0,
                data: imagesView
              },
              {
                name: '转化订单数总计',
                type: 'line',
                yAxisIndex: 0,
                data: order
              },
              {
                name: '转化金额总计',
                type: 'line',
                yAxisIndex: 1,
                data: money
              },
              {
                name: '日发送次数',
                type: 'line',
                yAxisIndex: 0,
                data: ySendCode
              },
              {
                name: '日被浏览次数',
                type: 'line',
                yAxisIndex: 0,
                data: yImagesView
              },
              {
                name: '日转化订单数',
                type: 'line',
                yAxisIndex: 0,
                data: yOrder
              },
              {
                name: '日转化金额',
                type: 'line',
                yAxisIndex: 1,
                data: yMoney
              }
            ]
            const leftArr = [...sendCode, ...imagesView, ...order, ...ySendCode, ...yImagesView, ...yOrder]
            const rightArr = [...money, ...yMoney]
            let leftMin = Math.min(...leftArr)
            let leftMax = Math.max(...leftArr)
            let rightMin = Math.min(...rightArr)
            let rightMax = Math.max(...rightArr)
            leftMax = leftMax < 5 ? 5 : leftMax
            rightMax = rightMax < 5 ? 5 : rightMax
            const num = leftMax > 5 && rightMax > 5 ? 5 : leftMax > rightMax ? rightMax : leftMax
            const leftInterval = (leftMax - leftMin) / 5
            const rightInterval = (rightMax - rightMin) / 5
            const interval = leftInterval > rightInterval ? rightInterval : leftInterval
            this.option.yAxis = [
              {
                name: '次数',
                nameGap: 30,
                nameLocation: 'end',
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
                },
                nameTextStyle: {
                  color: '#BFBFBF'
                },
                min: leftMin,
                max: leftMax,
                interval: leftInterval
              },
              {
                name: '金额',
                type: 'value',
                nameGap: 30,
                nameLocation: 'end',
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
                },
                nameTextStyle: {
                  color: '#BFBFBF'
                },
                min: rightMin,
                max: rightMax,
                interval: rightInterval
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
    this.loadDateList()
    this.loadMaterialList()
    this.loadUserList()
    this.loadChartData()
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
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
.no-echart-list-view {
  margin: 0 auto;
  width: 320px;
  height: 220px;
}
</style>
