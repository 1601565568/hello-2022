<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">素材库累计数据
          <span class="sub-title">（数据统计至前一日）</span>
        </div>
        <div class="unDoneData" @click="lookNoStatistical">查看未执行统计</div>
      </div>
      <div class="data-view">
        <div v-for="(item,index) in dataList" :key="index">
          <div class="base-cell" :class="item.claseName">
            <div class="text">{{ item.name }}</div>
            <div class="number">{{ item.data }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="material-show">
      <div class="material-chat">
        <div class="chat-select">
          <div class="left-select">
            <div class="day-view">
              <span
                :class="{ 'base-text-select': selectToday }"
                class="base-text"
                @click="selectTodayClick('seven')"
                >近七天</span
              >
              <span
                :class="{ 'base-text-select': !selectToday }"
                class="base-text"
                @click="selectTodayClick('thirty')"
                >近30天</span
              >
            </div>
            <div class="date-view">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="center"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="drawer-output">
            导出CSV文件
          </div>
        </div>
        <div class="title">数据分析</div>
        <NsEcharts :options="option" />
      </div>
    </div>
    <div class="material-list">
      <div class="title">数据报表</div>
      <div class="select-data-view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按日期统计" name="first">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  :data="listDate"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="trackTime" label="日期"> </el-table-column>
                  <el-table-column prop="nowSendSum" label="发送次数"> </el-table-column>
                  <el-table-column prop="nowDownloadSum" label="下载次数"> </el-table-column>
                  <el-table-column prop="nowCompletionSum" label="补全次数"> </el-table-column>
                  <el-table-column prop="title" width="125px" label="操作">
                    <template>
                      <ns-button
                        type="text"
                        class="select-button"
                        @click="showMoreData"
                        >查看明细</ns-button
                      >
                    </template>
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
                  layout="total, prev, pager, next"
                  @size-change="handleSizeChangeForDate"
                  @current-change="handleCurrentChangeForDate"
                >
                </el-pagination>
              </template>
            </page-table>
          </el-tab-pane>
          <el-tab-pane label="按素材统计" name="second">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  :data="listMaterial"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="materialTitle" label="素材标题"> </el-table-column>
                  <el-table-column prop="sendSum" label="发送次数"> </el-table-column>
                  <el-table-column prop="completionSum" label="下载次数"> </el-table-column>
                  <el-table-column prop="downloadSum" label="补全次数"> </el-table-column>
                  <el-table-column prop="title" width="125px" label="操作">
                    <template>
                      <ns-button
                        type="text"
                        class="select-button"
                        @click="showMoreData"
                        >查看明细</ns-button
                      >
                    </template>
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
                  layout="total, prev, pager, next"
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
    <DataList ref="detaList" />
    <TimeList ref="timeList" />
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import DataList from './components/DataList'
import TimeList from './components/TimeList'
import moment from 'moment'
export default {
  name: 'MaterialCahat',
  components: { PageTable, NsEcharts, DataList, TimeList },
  data () {
    return {
      dataList: [
        { name: '素材发送次数总计', data: 0, claseName: 'one' },
        { name: '素材下载总次数', data: 0, claseName: 'two' },
        { name: '素材补全总次数', data: 0, claseName: 'three' },
        { name: '昨日素材发送次数', data: 0, claseName: 'four' },
        { name: '昨日素材下载次数', data: 0, claseName: 'five' },
        { name: '昨日素材补全次数', data: 0, claseName: 'six' }
      ],
      listData: [
        {
          time: '2021-02-14',
          send: '789787',
          dowm: '47867979'
        },
        {
          time: '2021-02-14',
          send: '789787',
          dowm: '47867979'
        },
        {
          time: '2021-02-14',
          send: '789787',
          dowm: '47867979'
        },
        {
          time: '2021-02-14',
          send: '789787',
          dowm: '47867979'
        }
      ],
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
            '昨日素材发送次数',
            '昨日素材下载次数',
            '昨日素材补全次数'
          ],
          left: '0',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
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
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
          top: '4%',
          height: 291
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [
            '2018/08/06',
            '2018/08/07',
            '2018/08/09',
            '2018/08/10',
            '2018/08/11',
            '2018/08/12',
            '2018/08/13'
          ],
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
        series: [
          {
            name: '素材发送次数总计',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '素材下载总次数',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '素材补全总次数',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '昨日素材发送次数',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '昨日素材下载次数',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '昨日素材补全次数',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      },
      value1: '',
      activeName: 'first',
      today: '',
      last7: '',
      lart30: '',
      paginationToDate: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      listDate: [],
      paginationToPerson: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      listMaterial: [],
      selectToday: true
    }
  },
  methods: {
    selectTodayClick (val) {
      this.selectToday = val === 'seven'
      // this.loadChatList()
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
      this.today = moment().format('YYYY-MM-DD')
      this.last7 = moment()
        .subtract('days', 6)
        .format('YYYY-MM-DD')
      this.lart30 = moment()
        .subtract('days', 29)
        .format('YYYY-MM-DD')
    },
    lookNoStatistical () {
      this.$router.push({
        path: '/Social/OperationData/NoStatistical'
      })
    },
    handleClick () {

    },
    showMoreData () {
      // this.$refs.timeList.closeDeawer()
      this.$refs.detaList.closeDeawer()
    },
    loadTopData () {
      this.$http.fetch(this.$api.guide.getSumData, {}).then(resp => {
        if (resp.success) {
          const json = resp.result || {}
          this.dataList = [
            { name: '素材发送次数总计', data: json.sendSum || 0, claseName: 'one' },
            { name: '素材下载总次数', data: json.downloadSum || 0, claseName: 'two' },
            { name: '素材补全总次数', data: json.completionSum || 0, claseName: 'three' },
            { name: '昨日素材发送次数', data: json.nowSendSum || 0, claseName: 'four' },
            { name: '昨日素材下载次数', data: json.nowDownloadSum || 0, claseName: 'five' },
            { name: '昨日素材补全次数', data: json.nowCompletionSum || 0, claseName: 'six' }
          ]
        }
      }).catch(resp => {
      }).finally(() => {
      })
    },
    loadDateList () {
      const parms = {
        searchMap: {
          endTime: this.today,
          startTime: this.last7
        },
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      this.$http.fetch(this.$api.guide.getStatisticsListByDate, parms).then(resp => {
        if (resp.success) {
          const json = resp.result
          const arr = json.data || []
          this.listDate = arr
          this.paginationToDate.total = parseInt(json.recordsTotal)
        }
      }).catch(resp => {
      }).finally(() => {
      })
    },
    loadMaterialList () {
      // listMaterial
      const parms = {
        searchMap: {
          endTime: this.today,
          startTime: this.last7
        },
        start: (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      this.$http.fetch(this.$api.guide.getStatisticsListByMaterial, parms).then(resp => {
        if (resp.success) {
          const json = resp.result
          const arr = json.data || []
          this.listMaterial = arr
          this.paginationToPerson.total = parseInt(json.recordsTotal)
        }
      }).catch(resp => {
      }).finally(() => {
      })
    }
  },
  mounted () {
    this.dealTime()
    this.loadTopData()
    this.loadDateList()
    this.loadMaterialList()
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
    display: flex;
    flex-direction: row;
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
  .base-cell {
    width: 245px;
    height: 120px;
    background-image: linear-gradient(270deg, #f7bd5b 0%, #f49f10 100%);
    border-radius: 4px;
    margin-left: 16px;
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
    font-size: 14px;
    color: #0091fa;
    text-align: center;
    line-height: 22px;
    font-weight: 500;
    margin-right: 16px;
    background: #f5fbff;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 9px;
    cursor: pointer;
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
  color: #8C8C8C;
  line-height: 24px;
  font-weight: 400;
}
</style>
