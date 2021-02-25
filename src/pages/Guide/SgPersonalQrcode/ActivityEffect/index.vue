<template>
  <div class="activity-effect-container">
    <DatePickerBar
      v-if="activeTabPanelName === 'first'"
      class="top-tool-bar effect-analysis-tool-bar"
      @change="changeAnalysisSearchDate"
      @initDate="changeAnalysisSearchDate"
    />
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
import EffectAnalysis from './EffectAnalysis/index.vue'
import AdderDetails from './AdderDetails/index.vue'
import DatePickerBar from '@/components/NewUi/DatePickerBar'

/**
 * 活动效果主页面
 */
export default {
  components: {
    EffectAnalysis,
    AdderDetails,
    DatePickerBar
  },
  data () {
    return {
      activeTabPanelName: 'first',
      analysisDateField: 1,
      analysisSearchDate: []
    }
  },
  methods: {
    changeAnalysisSearchDate (searchDate) {
      this.analysisSearchDate = searchDate
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
