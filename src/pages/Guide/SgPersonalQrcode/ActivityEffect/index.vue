<template>
  <div class="activity-effect-container">
    <el-form v-show="activeTabPanelName === 'first'" :inline="true" class="top-tool-bar effect-analysis-tool-bar">
      <el-radio-group class="alalysis-radio" v-model="analysisDateField">
        <el-radio :label="1" border>全部</el-radio>
        <el-radio :label="2" border>近7天</el-radio>
        <el-radio :label="3" border>近30天</el-radio>
      </el-radio-group>
      <span class="line"></span>
      <el-date-picker
        v-model="analysisSearchDate"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00','23:59:59']"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
      ></el-date-picker>
    </el-form>
    <el-tabs v-model="activeTabPanelName">
      <el-tab-pane label="效果分析" name="first">
        <EffectAnalysis
          :searchDate="analysisSearchDate"
        />
      </el-tab-pane>
      <el-tab-pane label="添加明细" name="second" :lazy="true">
        <AdderDetails/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import EffectAnalysis from './EffectAnalysis/index.vue'
import AdderDetails from './AdderDetails/index.vue'

/**
 * 活动效果主页面
 */
export default {
  components: {
    EffectAnalysis,
    AdderDetails
  },
  watch: {
    analysisDateField (newVal) {
      const todayStartTime = new Date(new Date().toLocaleDateString())
      const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)
      const endTimeStr = moment(todayEndTeime).format('YYYY-MM-DD HH:mm:ss')

      if (newVal === 1) { // 全部
        this.analysisSearchDate = []
      }

      if (newVal === 2) { // 近7天
        const during7Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 3600 * 1000)
        this.analysisSearchDate = [ this.formatTime(during7Days), endTimeStr ]
      }

      if (newVal === 3) { // 近30天
        const during30Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 3600 * 1000)
        this.analysisSearchDate = [ this.formatTime(during30Days), endTimeStr ]
      }
    }
  },
  data () {
    return {
      activeTabPanelName: 'first',
      analysisDateField: 1,
      analysisSearchDate: []
    }
  },
  methods: {
    formatTime (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";

.activity-effect-container {
  position: relative;
  .effect-analysis-tool-bar {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    height: 48px;
    display: flex;
    align-items: center;
    .alalysis-radio {
      margin-left: 115px;
    }

    .line {
      margin-left: 8px;
      margin-right: 24px;
      display: inline-block;
      height: 20px;
      border: 1px solid #E8E8E8;
    }
  }

  .activity-effect-header {
    background: #fff;
    margin: -10px -10px 0;
  }
}
</style>
