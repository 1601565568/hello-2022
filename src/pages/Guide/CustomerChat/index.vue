<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">客户会话统计</div>
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
              <span class="base-text-select">近七天</span>
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
            <div class="item-down">
              <div class="name">员工:</div>
              <div class="item-select">
                <el-select v-model="actionValue" :default-first-option='true'>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="drawer-output">
            导出CSV文件
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
                  :data="listData"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="time" label="日期"> </el-table-column>
                  <el-table-column prop="send" label="聊天次数"> </el-table-column>
                  <el-table-column prop="dowm" label="发送消息数"> </el-table-column>
                </el-table>
              </template>
            </page-table>
          </el-tab-pane>
          <el-tab-pane label="按员工显示" name="second">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  :data="listData"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="time" label="员工"> </el-table-column>
                  <el-table-column prop="send" label="聊天次数"> </el-table-column>
                  <el-table-column prop="dowm" label="发送消息数"> </el-table-column>
                </el-table>
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
export default {
  name: 'GroupData',
  components: { PageTable, NsEcharts },
  data () {
    return {
      dataList: [
        { name: '昨日聊天次数', data: 98, claseName: 'one' },
        { name: '昨日发送消息数', data: 12, claseName: 'two' },
        { name: '昨日已回复聊天占比（%）', data: 33, claseName: 'three' },
        { name: '昨日平均首次回复时长（分）', data: 4, claseName: 'four' }
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
          '#F7B586'
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
            name: '聊天总数',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '发送消息数',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      value1: '',
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
      actionValue: '全部动作'
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
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
  .base-cell {
    width: 300px;
    height: 120px;
    background-image: linear-gradient(270deg, #f7bd5b 0%, #f49f10 100%);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-right: 16px;
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
    background-image: linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%);
  }
  .two {
    background-image: linear-gradient(270deg, #F7BD5B 0%, #F49F10 100%);
  }
  .three {
    background-image: linear-gradient(270deg, #A0E35E 0%, #67C230 100%);
  }
  .four {
   background-image: linear-gradient(269deg, #8B4EFC 0%, #6A00FA 100%);
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
  }
  .base-text-select {
    font-size: 14px;
    color: #0091FA;
    text-align: center;
    line-height: 22px;
    font-weight: 500;
    margin-right: 16px;
    background:  #F5FBFF;
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
  border-radius: 2px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
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
</style>
