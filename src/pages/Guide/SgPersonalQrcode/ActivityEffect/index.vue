<template>
  <div class="activity-effect-container">
    <el-form :inline="true" class="effect-analysis-tool-bar">
      <el-radio-group class="alalysis-radio" v-model="analysisDateField">
        <el-radio label="1" border>全部</el-radio>
        <el-radio label="2" border>近7天</el-radio>
        <el-radio label="3" border>近30天</el-radio>
      </el-radio-group>
      <span class="line"></span>
      <el-form-item label="日期筛选">
          <el-date-picker
            class="date-filter"
            v-model="seachDate"
            type="date"
            placeholder="请选择"
            align="right">
          </el-date-picker>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="效果分析" name="first">
        <EffectAnalysis/>
      </el-tab-pane>
      <el-tab-pane label="添加明细" name="second">
        <AdderDetails/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
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
  data () {
    return {
      analysisDateField: '',
      activeName: 'first',
      seachDate: ''
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
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
    width: 644px;
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

    .date-filter {
      display: flex;
      margin-left: 24px;
    }
  }

  .activity-effect-header {
    background: #fff;
    margin: -10px -10px 0;
  }
}
</style>
