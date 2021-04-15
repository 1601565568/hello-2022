<template>
  <div>
    <div class="material-data">
      <div class="title">素材库累计数据</div>
      <div class="data-view">
        <div v-for="item in dataList" :key="item">
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
              <span class="base-text">近七天</span>
              <span class="base-text">近30天</span>
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
      <div class="material-list">
        <div class="title">数据报表</div>
        <page-table style="padding-top:0">
          <template slot="table">
            <el-table
              :data="listData"
              class="new-table_border drawer-table"
              :row-style="{ height: '48px' }"
            >
              <el-table-column prop="time" label="日期"> </el-table-column>
              <el-table-column prop="send" label="发送次数"> </el-table-column>
              <el-table-column prop="dowm" label="下载次数"> </el-table-column>
              <el-table-column prop="title" width="125px" label="操作">
                <template>
                  <ns-button
                    type="text"
                    class="select-button"
                    @click="showMoreData"
                    >查看数据</ns-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </page-table>
      </div>
    </div>
    <DataList ref="detaList" />
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import DataList from './components/DataList'
export default {
  name: 'MaterialCahat',
  components: { PageTable, NsEcharts, DataList },
  data () {
    return {
      dataList: [
        { name: '素材发送次数总计', data: 782146816478, claseName: 'one' },
        { name: '素材下载总次数', data: 7482969067892, claseName: 'two' },
        { name: '今日素材发送次数', data: 89797, claseName: 'three' },
        { name: '今日素材下载次数', data: 7896767, claseName: 'four' }
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
            '今日素材发送次数',
            '今日素材下载次数'
          ],
          left: '0',
          bottom: '9%',
          icon: 'roundRect',
          itemWidth: 10,
          itemHeight: 10
        },
        color: ['#4287FF', '#F7B586', '#95DA73', '#7962EC'],
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
            name: '今日素材发送次数',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '今日素材下载次数',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      },
      value1: ''
    }
  },
  methods: {
    showMoreData () {
      this.$refs.detaList.closeDeawer()
    }
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';

.material-data {
  background-color: white;
  width: 1206px;
  padding-bottom: 24px;
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
  .base-cell {
    width: 282px;
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
    background-image: linear-gradient(270deg, #f7bd5b 0%, #f49f10 100%);
  }
  .three {
    background-image: linear-gradient(270deg, #a0e35e 0%, #67c230 100%);
  }
  .four {
    background-image: linear-gradient(269deg, #8b4efc 0%, #6a00fa 100%);
  }
}
.material-show {
  margin-top: 16px;
  background-color: white;
  padding-left: 16px;
  padding-right: 16px;
  width: 1206px;
  .material-chat {
    .title {
      font-size: 16px;
      color: #262626;
      line-height: 56px;
      font-weight: 500;
      height: 56px;
    }
  }
  .material-list {
    .title {
      font-size: 16px;
      color: #262626;
      line-height: 56px;
      font-weight: 500;
      height: 56px;
    }
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
  border-right: 1px solid #E8E8E8;
  .base-text {
    font-size: 14px;
    color: #595959;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    margin-right: 16px;
    background: #f5fbff;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 9px;
  }
}

.drawer-output {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
}
.date-view {
  margin-left: 16px;
}
.date-view >>> .el-input__inner {
  width: 256px;
  height: 32px;
}
.data-view >>> .el-range-input {
  font-size: 14px;
  text-align: center;
}
.data-view >>> .el-range-separator {
  font-size: 14px;
}
</style>
