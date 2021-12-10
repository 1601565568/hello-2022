<template>
  <div class="analysis-container">
    <div class='analysis-header'>
      <h3 class='header-text'>
        <img :src='backIcon' class='back-icon' @click='handleBack'/>
        活动效果
      </h3>
      <div class='header-tab'>
        <el-tabs v-model="dateValue" @tab-click="handleChangeDateType">
          <el-tab-pane v-for="item in dateList" :label="item.label" :name="item.value" :key="item.value"></el-tab-pane>
        </el-tabs>
        <div class="header-tab_right">
          <el-date-picker
            v-model="dateValueList"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            @change='handleChangeDateValue'
            align="right">
          </el-date-picker>
        </div>
      </div>
    </div>
    <el-row class='analysis-tab' :gutter="16">
      <el-col v-for='item in typeList' :span='5' :key="item.id">
        <div :class="'tab-content'+(item.id===analysisType?' avtive':'')" @click='hanldeChangeType(item.id)'>
          <h3 class="tab-label">
            {{item.label}}
            <el-tooltip v-if='item.tip' :content="item.id==='friend'?inviteFriendTip:item.tip" placement="top" popper-class='popperClass'>
              <Icon type="question-circle" />
              <template slot='content'>
                <p class='popperClass' v-html="item.id==='friend'?inviteFriendTip:item.tip"></p>
              </template>
            </el-tooltip>
          </h3>
          <div class="tab-value">{{item.value}}</div>
        </div>
      </el-col>
    </el-row>
    <div class='analysis-content'>
      <template v-if='analysisType === "employee"'>
        <employee-table :startTime='startTime' :endTime='endTime' @showMaster='showMaster' @showFriend='showFriend' ref='employeeTable'/>
      </template>
      <template v-if='analysisType === "master"'>
        <master-table :startTime='startTime' :endTime='endTime' @showFriend='showFriend' ref='masterTable'/>
      </template>
      <template v-if='analysisType === "friend"'>
        <friend-table :startTime='startTime' :endTime='endTime'/>
      </template>
      <template v-if='analysisType === "prize"'>
        <reward-table :startTime='startTime' :endTime='endTime'/>
      </template>
      <template v-if='analysisType === "receive"'>
        <receive-table :startTime='startTime' :endTime='endTime'/>
      </template>
    </div>
    <el-drawer
      title="我是标题"
      :modal='false'
      size='60%'
      @close='handleClose'
      append-to-body
      :visible.sync="drawer"
      :with-header="false">
      <template v-if='showType === "master"'>
        <master-drawer :chooseMaster='chooseMaster' @onClose='handleClose' @openFriend='showFriend' @onPrev='onPrevMaster' @onNext='onNextMaster' ref='masterDrawer'/>
      </template>
      <template v-if='showType === "friend"'>
        <friend-drawer :chooseFriend='chooseFriend' @onClose='handleClose' @onPrev='onPrevFriend' @onNext='onNextFriend' @showMaster='showMaster' ref='friendDrawer'/>
      </template>
      <!-- <friend-drawer :chooseMaster='chooseFriend'/> -->
    </el-drawer>
  </div>
</template>
<script>
import Analysis from './src/Analysis'
import PageTable from './components/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import MasterDrawer from './components/Analysis/MasterDrawer'
import FriendDrawer from './components/Analysis/FriendDrawer'
import EmployeeTable from './components/Analysis/EmployeeTable'
import FriendTable from './components/Analysis/FriendTable'
import MasterTable from './components/Analysis/MasterTable'
import RewardTable from './components/Analysis/RewardTable'
import ReceiveTable from './components/Analysis/ReceiveTable'
export default Analysis
Analysis.components = {
  PageTable, ElDrawer, MasterDrawer, FriendDrawer, EmployeeTable, FriendTable, MasterTable, RewardTable, ReceiveTable
}
</script>
<style lang="scss" scoped>
  @import "./styles/reset.css";
  .analysis-container {
    .back-icon {
      height: 16px;
      width: 16px;
      cursor: pointer;
      margin-right: 16px;
    }
    .analysis-header {
      margin: -10px -10px 16px -10px;
      background: #fff;
      padding: 0 16px;
      .header-text {
        font-size: 16px;
        color: #262626;
        height: 48px;
        line-height: 48px;
        display: flex;
        align-items: center;
      }
      .header-tab {
        display: flex;
        align-items: center;
      }
      .header-tab_right {
        margin-bottom: 13px;
        padding-left:  24px;
        border-left:1px solid #E8E8E8;
      }
    }
    .analysis-tab {
      margin-bottom: 16px;
      .tab-content {
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        border-radius: 4px;
        padding: 20px 0;
        text-align: center;
        cursor: pointer;
        user-select:none;
        font-weight: normal;
        .tab-label {
          font-size: 16px;
          font-weight: normal;
          color: #8C8C8C;
          text-align: center;
          line-height: 24px;
        }
        .tab-value {
          margin-top: 16px;
          font-size: 24px;
          color: #262626;
          text-align: center;
          line-height: 32px;
          font-weight: 700;
        }
        &.avtive {
          background: #F2F9FE;
          border: 1px solid #0094FC;
          .tab-label {
            color: #0094FC;
          }
          .tab-value {
            color: #0094FC;
          }
        }
      }
    }
  }
  .popperClass {
    max-width: 200px;
  }
</style>
<style scoped>
.header-tab {
  >>> .el-tabs__item {
    box-sizing: content-box;
    display: inline-block;
    padding: 0 0 13px 0;
    height: 32px;
    line-height: 32px;
    width: 82px;
    text-align: center;
    font-size: 14px;
    color: #262626;
    font-weight: normal;
    &.is-active {
      color:#0094FC;
    }
  }
  >>> .el-tabs__header {
    border-bottom: none;
  }
}
.analysis-container {
  >>> .el-col-5 {
    width: 20%;
  }
}
</style>
