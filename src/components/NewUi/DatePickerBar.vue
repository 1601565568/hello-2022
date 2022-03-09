
<template>
  <el-form :inline="true" class="date-picker-bar">
    <el-radio-group class="alalysis-radio" v-model="analysisDateField" @change="switchSearchDate">
      <template v-for='item in dateList'>
        <el-radio :label="item.label" border :key='item.label' :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">{{item.value}}</el-radio>
      </template>
      <!-- <el-radio :label="1" border>全部</el-radio>
      <el-radio :label="2" border>近7天</el-radio>
      <el-radio :label="3" border>近30天</el-radio> -->
    </el-radio-group>
    <span class="line"></span>
    <el-date-picker
      v-if="clear"
      class="date-filter"
      v-model="searchDate"
      @change="switchSearchDate"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00','23:59:59']"
      range-separator="至"
      :picker-options='pickerOptions'
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-date-picker
      v-if="!clear"
      class="date-filter"
      v-model="searchDate"
      popper-class='date-filter'
      :clearable='false'
      @change="switchSearchDate"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00','23:59:59']"
      range-separator="至"
      :picker-options='pickerOptions'
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
  </el-form>
</template>

<script>
/**
 * 日期切换选择 近7天 近30天切换
 *  属性 defaultPickDay: 'all' | 7 | 30
 *  方法 change 选择日期返回日期数组 []
 *              清空日期返回空数组 []
 *      initDate 返回初始化日期，和change返回格式相同
 *  使用
 *    <DatePickerBar @change="changeSearchDate" @initDate="setSearchDate" :defaultPickDay="7"/>
 */
import moment from 'moment'

export default {
  props: {
    clear: {
      type: Boolean,
      default: true
    },
    defaultPickDay: {
      default: 'all',
      validator: function (value) {
        return [ 'all', 7, 30 ].indexOf(value) !== -1
      }
    },
    dateList: {
      default () {
        return [
          {
            label: 1,
            value: '全部'
          }, {
            label: 2,
            value: '近7天'
          }, {
            label: 3,
            value: '近30天'
          }
        ]
      }
    },
    pickerOptions: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      analysisDateField: 1,
      searchDate: [],
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  created () {
    this.initPickDay()
  },
  methods: {
    initPickDay () {
      if (this.defaultPickDay === 7) {
        this.analysisDateField = 2
        this.searchDate = this.getDuringDateArray(7)
      }

      if (this.defaultPickDay === 30) {
        this.analysisDateField = 3
        this.searchDate = this.getDuringDateArray(30)
      }

      this.$emit('initDate', this.searchDate)
    },
    switchSearchDate (date) {
      if (typeof date === 'number') {
        if (this.analysisDateField === 1) { // 全部
          this.searchDate = []
        }

        if (this.analysisDateField === 2) { // 近7天
          this.searchDate = this.getDuringDateArray(7)
        }

        if (this.analysisDateField === 3) { // 近30天
          this.searchDate = this.getDuringDateArray(30)
        }
      } else {
        if (date === null) {
          this.analysisDateField = 1
          this.searchDate = []
        } else {
          this.analysisDateField = 0
        }
      }

      this.$emit('change', this.searchDate)
    },
    // 获取近几天日期数组
    getDuringDateArray (day) {
      const todayStartTime = new Date(new Date().toLocaleDateString())
      const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)

      const duringDays = new Date(todayStartTime.getTime() - (day - 1) * 24 * 3600 * 1000)
      return [ this.formatTime(duringDays), this.formatTime(todayEndTeime) ]
    },
    formatTime (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/date-picker-bar-reset.css";

.date-picker-bar {
  display: flex;
  align-items: center;
  margin-left: 16px;
  .line {
    margin-left: 8px;
    margin-right: 24px;
    display: inline-block;
    height: 20px;
    border-left: 1px solid #e8e8e8;
  }
}
</style>
<style scoped>
.fuscousQA >>>.el-radio__input.is-checked + .el-radio__label{
  color: #0C4CFF;
}
.fuscousIcon >>>.el-radio__input.is-checked + .el-radio__label{
  color: #41a2e8;
}
</style>
