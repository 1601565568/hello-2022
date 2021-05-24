<template>
  <div>
    <div class="material-data">
      <div class="top-view">
        <div class="title">群分析</div>
      </div>
      <div class="data-view">
        <div v-for="(item, index) in dataList" :key="index">
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
            <div class="item-down">
              <div class="name">群主：</div>
              <div class="item-select">
                <el-select v-model="chatRoomValue" :default-first-option="true" @visible-change="selectOptionClick">
                  <el-option
                    v-for="item in chatRoomOwner"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="icon-view">
                <Icon type="ns-arrow-drowdown" :class="{ 'arrowTransform': !flag, 'arrowTransformReturn': flag}" style="color: #8C8C8C;"/>
              </div>
            </div>
            <div class="item-down">
              <div class="name">群名称：</div>
              <div class="item-select">
                <el-select v-model="actionValue" :default-first-option="true">
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
                  :data="listDate"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="stat_time" label="日期"> </el-table-column>
                  <el-table-column prop="chat_totals" label="今日群总数">
                  </el-table-column>
                  <el-table-column prop="member_totals" label="群管理客户数">
                  </el-table-column>
                  <el-table-column prop="new_member_cnts" label="群新增客户数">
                  </el-table-column>
                  <el-table-column prop="member_loss_cnts" label="群流失客户数">
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
          <el-tab-pane label="按员工显示" name="second">
            <page-table style="padding-top:0">
              <template slot="table">
                <el-table
                  :data="listPerson"
                  class="new-table_border drawer-table"
                  :row-style="{ height: '48px' }"
                >
                  <el-table-column prop="owner_name" label="员工"> </el-table-column>
                  <el-table-column prop="chat_totals" label="今日群总数">
                  </el-table-column>
                  <el-table-column prop="member_totals" label="群管理客户数">
                  </el-table-column>
                  <el-table-column prop="new_member_cnts" label="群新增客户数">
                  </el-table-column>
                  <el-table-column prop="member_loss_cnts" label="群流失客户数">
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
        { name: '今日总群数', data: 0, claseName: 'one' },
        { name: '群管理好友数', data: 0, claseName: 'two' },
        { name: '今日群新增好友数', data: 0, claseName: 'three' },
        { name: '今日群流失好友数', data: 0, claseName: 'four' }
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
            '今日总群数',
            '群管理好友数',
            '今日群新增好友数',
            '今日群流失好友数'
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
            name: '今日总群数',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '群管理好友数',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '今日群新增好友数',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '今日群流失好友数',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
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
      paginationToPerson: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      paginationToDate: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      selectToday: true,
      listDate: [],
      listPerson: [],
      chatRoomOwner: [],
      chatRoomValue: '',
      actionValue: '',
      flag: false
    }
  },
  methods: {
    selectOptionClick (val) {
      this.flag = val
    },
    selectTodayClick (val) {
      this.selectToday = val === 'seven'
    },
    lookNoStatistical () {
      this.$router.push({
        path: '/Social/OperationData/NoStatistical'
      })
    },
    handleClick () {},
    showMoreData () {
      // this.$refs.timeList.closeDeawer()
      this.$refs.detaList.closeDeawer()
    },
    loadTopData () {
      this.$http.fetch(this.$api.weWork.weWorkRooms.general, {}).then(res => {
        if (res.success) {
          const json = res.result || {}
          const oneNum = json.chat_totals || 0
          const twoNum = json.member_totals || 0
          const threeNum = json.new_member_cnts || 0
          const fourNum = json.member_loss_cnts || 0
          this.dataList = [
            { name: '今日总群数', data: oneNum, claseName: 'one' },
            { name: '群管理好友数', data: twoNum, claseName: 'two' },
            { name: '今日群新增好友数', data: threeNum, claseName: 'three' },
            { name: '今日群流失好友数', data: fourNum, claseName: 'four' }
          ]
        }
      })
    },
    loadDateList () {
      const parms = {
        searchMap: {},
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      if (this.paginationToDate.page === 1) {
        this.listDate = []
      }
      this.$http
        .fetch(this.$api.weWork.weWorkRooms.page_list_by_date, parms)
        .then(res => {
          if (res.success) {
            const json = res.result
            const arr = json.data || []
            this.listDate = arr
            this.paginationToDate.total = parseInt(res.result.recordsTotal)
          }
        })
    },
    loadPersonList () {
      const parms = {
        searchMap: {},
        start: (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      if (this.paginationToPerson.page === 1) {
        this.listPerson = []
      }
      this.$http
        .fetch(this.$api.weWork.weWorkRooms.page_list_by_owner, parms)
        .then(res => {
          if (res.success) {
            const json = res.result
            const arr = json.data || []
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
    loadChatList () {
      const parms = {
        chatRoomId: '',
        endTime: '',
        owner: '',
        startTime: ''
      }
      this.$http.fetch(this.$api.weWork.weWorkRooms.list, parms).then(res => {
        if (res.success) {

        }
      })
    },
    queryChatroomLeaderOptions () {
      this.$http.fetch(this.$api.weWork.weWorkRooms.queryWeWorkRoomsLeaderOptions)
        .then((resp) => {
          this.chatRoomOwner = resp.result
        }).catch((resp) => {
        })
    }
  },
  mounted () {
    this.loadTopData()
    this.loadDateList()
    this.loadPersonList()
    this.loadChatList()
    this.queryChatroomLeaderOptions()
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

.item-down {
  width: 171px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  margin-left: 16px;
  .name {
    width: 70px;
    margin-left: 8px;
  }
}
.arrowTransform{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
