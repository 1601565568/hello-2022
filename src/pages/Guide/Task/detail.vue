
<template>
<div class='page-task-detail'>
  <div class='ptb5 bg-white plr10 base-border-radius'>
    <span class="demonstration">时间：</span>
    <el-date-picker
      v-model="queryDate"
      type="date"
      placeholder="请选择开始日期"
      @change='change'
      value-format="yyyy-MM-dd"
      :picker-options="pickerOption">
    </el-date-picker>
    <el-tooltip content="根据任务的开始时间筛选，结束时间默认为当前时间">
      <i class="text-secondary leftspace"><Icon type="info-circle" theme="filled" /></i>
    </el-tooltip>
  </div>
  <div class="bg-white mt5 base-border-radius content-overflow">
    <div class="text-secondary ptb5 plr10">
      任务统计
      <el-tooltip content="任务总数：统计所有的任务数量；进行中：统计进行中的任务数">
        <Icon type="info-circle" theme="filled" />
      </el-tooltip>
    </div>
    <el-row class="statistics" :gutter="5" style='height:254px'>
      <el-col :span="11" class='flex flex-evenly ptb58' style='height:254px;border-right:1px solid #dcdfe6;'>
        <div class="statistics-pic statistics-total flex flex-center">
          <div class="round"></div>
          <div class="text-white fz18" style='opacity:0.9'>任务总数</div>
          <div class=" text-white fz32 mt24">
            <el-countup
              :start="0"
              :end="infoObj.total"
              :duration="1.5"
              v-if="infoObj.total >= 0">
            </el-countup>
          </div>
        </div>
        <div class="statistics-pic statistics-doing flex flex-center ">
          <div class="round"></div>
          <div class="text-white fz18" style='opacity:0.9'>进行中</div>
          <div class=" text-white fz32 mt24">
            <el-countup
              :start="0"
              :end="infoObj.unfinishedCount"
              :duration="1.5"
              v-if="infoObj.unfinishedCount >= 0">
            </el-countup>
          </div>
        </div>
      </el-col>
      <el-col :span="13" class='ptb30' style='height:254px'>
        <div class='statistics-pro statistics-fin flex flex-around '>
          <div class='flex flex-start'>
            <div style='position:relative;height:80px'>
              <el-progress type="circle" :percentage="percentage.completed"  :width='80' :show-text='false' :stroke-width=4 color='#11b37f'></el-progress>
              <div class='percentage_abs'>
                <p class='fz12 text-secondary'>完成率</p>

                <p class='fz16' style='color:#33393e'>{{percentage.completed}}%</p>
              </div>
            </div>
            <el-tooltip content="完成率 = （按时完成 + 延期完成）/ 任务总数">
              <i class="text-secondary leftspace"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
          <div>
              <div>
                <span class='fz12 text-secondary'>按时完成</span>
                <el-tooltip content="在规定时间内完成的任务数">
                  <i class="text-secondary leftspace"><Icon type="info-circle" theme="filled" /></i>
                </el-tooltip>
              </div>
              <div class='fz16 mt14 text-center text-success'>{{infoObj.finishOnTime}}</div>
          </div>
          <div>
              <div>
                <span class='fz12 text-secondary'>延期完成</span>
              </div>
              <div class='fz16 mt14 text-center text-success'>{{infoObj.finishDelay}}</div>
          </div>
        </div>

        <div class='statistics-pro statistics-fin flex flex-around mt30'>
          <div class='flex flex-start'>
            <div style='position:relative;height:80px'>
              <el-progress type="circle" :percentage="percentage.delay"  :width='80' :show-text='false' :stroke-width=4 color='#ff5e5e'></el-progress>
              <div class='percentage_abs'>
                <p class='fz12 text-secondary'>延期率</p>

                <p class='fz16' style='color:#33393e'>{{percentage.delay}}%</p>
              </div>
            </div>
            <el-tooltip content=" 延期率 = 延期数/ 任务总数">
              <i class="text-secondary leftspace"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
          <div>
              <div>
                <span class='fz12 text-secondary'>延期数</span>
                <el-tooltip content="延期数：只有没有按时完成的任务即为延期（包含延期完成和未完成）">
                  <i class="text-secondary leftspace"><Icon type="info-circle" theme="filled" /></i>
                </el-tooltip>
              </div>
              <div class='fz16 mt14 text-center text-error'>{{infoObj.delayCount}}</div>
          </div>
          <div>
              <div>
                <span class='fz12 text-secondary'>延期未完成</span>
              </div>
              <div class='fz16 mt14 text-center text-error'>{{infoObj.delayUnfinished}}</div>
          </div>
        </div>
        <!-- <div class='statistics-pro statistics-del'></div> -->
      </el-col>
    </el-row>

  </div>
   <el-row class="overview-content__echart mt5" :gutter="5">
    <el-col :span="12">
      <div class="overview-echart__item overview-echart__item--pink">
        <div class="overview-content__title flex flex-between">
          <div class='span'>任务进度
            <el-tooltip content="任务显示根据任务的开始时间进行筛选；例如：筛选时间为2019-03-01至现在，则显示任务开始时间为2019-03-01至现在的任务"
                        popper-class="table-body__tooltip" >
              <i class="text-secondary"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
          <div class="mr5">
            <ns-button :type="!searchObj.type?'primary':''" @click="selectTask('brand')">品牌任务</ns-button>
            <ns-button :type="searchObj.type?'primary':''" @click="selectTask('shop')">门店任务</ns-button>
          </div>
        </div>
        <div v-loading.lock="loadingShopRecruit"
              :element-loading-text="$t('prompt.loading')">
          <!-- 暂无数据结构 -->
          <div class="no-data" style='height:362px' v-if="!isTaskProgressData">
          </div>
          <template v-if="isTaskProgressData">
            <business-echarts :options="taskProgressOption" class="oscillogram" auto-resize style='height:362px'></business-echarts>
          </template>
        </div>
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange">
      </el-pagination>
      </div>

    </el-col>
    <el-col :span="12">
      <div class="overview-echart__item">
        <div class="overview-content__title overview-content__title--pink">
          <div class='span'>燃尽图
            <el-tooltip content="统计所有任务的总数和未完成数（未完成数：进行中任务+延期未完成任务）">
              <i class="text-secondary"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
        </div>
        <div v-loading.lock="loadingRecruit"
              :element-loading-text="$t('prompt.loading')">
          <!-- 暂无数据结构 -->
          <div class="no-data" v-if="!isRecruitData" style='height:400px'>
          </div>
          <template v-if="isRecruitData">
            <business-echarts :options="recruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row class="overview-content__echart mt5" :gutter="5">
    <el-col :span="12">
      <div class="overview-echart__item">
        <div class="overview-content__title overview-echart__item--pink">
          <div class='span'>门店完成任务数排行榜
            <el-tooltip content="完成任务包含按时完成和延期完成">
              <i class="text-secondary"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
        </div>
        <div v-loading.lock="loadingShopRecruit"
              :element-loading-text="$t('prompt.loading')">
          <!-- 暂无数据结构 -->
          <div class="no-data" v-if="!isShopRecruitData" style='height:400px'>
          </div>
          <template v-if="isShopRecruitData">
            <business-echarts :options="shopRecruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="overview-echart__item">
        <div class="overview-content__title overview-echart__item--pink">
          <div class='span'>导购完成任务数排行榜
            <el-tooltip content="完成任务包含按时完成和延期完成">
              <i class="text-secondary"><Icon type="info-circle" theme="filled" /></i>
            </el-tooltip>
          </div>
        </div>
        <div v-loading.lock="loadingGuideRecruit"
              :element-loading-text="$t('prompt.loading')">
          <!-- 暂无数据结构 -->
          <div class="no-data" v-if="!isGuideRecruitData" style='height:400px'>
          </div>
          <template v-if="isGuideRecruitData">
            <business-echarts :options="guideRecruitOption" class="oscillogram" auto-resize></business-echarts>
          </template>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>
<script>
import echarts from 'echarts'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ElProgress from '@nascent/nui/lib/progress'
import ElCountup from '@nascent/nui/lib/countup'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
var myColor = ['#ff402c', '#ff592c', '#ff8f2c', '#ff8f2c', '#ffb22c']
let taskProgressObj = {}
export default {
  components: {
    businessEcharts,
    ElProgress,
    ElCountup
  },
  data () {
    let queryDate = moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)).format('YYYY-MM-DD')
    return {
      infoObj: {},
      searchObj: {
        pageSize: 5,
        pageStart: 0,
        type: 0,
        searchMap: {}
      },
      pagination: {
        // 分页对象
        enable: true,
        size: 5,
        sizeOpts: [5],
        page: 1,
        total: 0
      },
      arr: [
        {
          name: '待完成任务数',
          num: ' ',
          color: '#FF0000'
        },
        {
          name: '延期',
          num: ' ',
          color: '#FF0000'
        },
        {
          name: '已完成',
          num: ' ',
          color: '#008000'
        },
        {
          name: '任务总数',
          num: ' ',
          color: '#000000'
        }
      ],
      percentage: {
        completed: 0, // 完成率
        delay: 0// 延期率
      },
      pickerOption: {
        shortcuts: [
          {
            text: '最近一个月',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }],
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      queryDate: queryDate,
      shopArr: [{
        shopName: '所有门店',
        id: null
      }], // 所有门店
      shopMap: {},
      getRewardInfoObj: {}, // 当月业绩情况对象
      isSaleData: true, // 是否有数据展示
      isRecruitData: true,
      isRewardDate: true,
      isShopSellData: true,
      isGuideSellData: true,
      isShopRecruitData: true,
      isGuideRecruitData: true,
      isTaskProgressData: true,
      loadingSell: false,
      loadingRecruit: false,
      loadingReward: false,
      loadingShopSell: false,
      loadingGuideSell: false,
      loadingShopRecruit: false,
      loadingGuideRecruit: false,
      saleOption: {
        tooltip: {
          formatter: '{c}',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [10, 0, 0, 0]
          },
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [0, 12, 0, 0]
          }
        },
        grid: {
          top: 30,
          left: 100,
          right: 55
        },
        series: [{
          color: '#1299FA',
          data: [],
          smooth: 0.35,
          symbolSize: 8,
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(18, 153, 250, 0.6)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(18, 153, 250, 0.1)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      recruitOption: {
        tooltip: {
          // formatter: '{c}',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 20,
          itemHeight: 5,
          itemGap: 13,
          right: 20,
          top: 0,
          data: ['总数', '未完成数']
          // itemGap: 36
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [10, 0, 0, 0]
          },
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [0, 12, 0, 0]
          }
        },
        grid: {
          top: 30,
          left: 100,
          right: 55
        },
        series: [
          {
            color: '#227afb',
            name: '总数',
            data: [],
            smooth: false,
            symbolSize: 8,
            type: 'line'
            // areaStyle: {
            //   color: '#2dcdbe'
            //   // {
            //   //   type: 'linear',
            //   //   x: 0,
            //   //   y: 0,
            //   //   x2: 0,
            //   //   y2: 1,
            //   //   colorStops: [{
            //   //     offset: 0, color: 'rgba(255, 58, 58, 0.6)' // 0% 处的颜色
            //   //   }, {
            //   //     offset: 1, color: 'rgba(255, 58, 58, 0.1)' // 100% 处的颜色
            //   //   }]
            //   // }
            // }
          },
          {
            color: '#2dcdbe',
            name: '未完成数',
            data: [],
            smooth: false,
            symbolSize: 8,
            type: 'line'
            // areaStyle: {
            //   color: {
            //     type: 'linear',
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [{
            //       offset: 0, color: 'rgba(255, 58, 58, 0.6)' // 0% 处的颜色
            //     }, {
            //       offset: 1, color: 'rgba(255, 58, 58, 0.1)' // 100% 处的颜色
            //     }]
            //   }
            // }
          }
        ]
      },
      shopSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#3963FF' },
                { offset: 1, color: '#2B67FF' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      guideSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#A964FF' },
                { offset: 1, color: '#BF63FF' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      taskProgressOption: {
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   borderColor: '#E4E7ED',
        //   borderWidth: 1.4,
        //   backgroundColor: '#fff',
        //   textStyle: {
        //     color: '#606266'
        //   }
        // },
        grid: {
          top: '10',
          left: '10',
          right: '80',
          height: 362,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            // color: '#999999',
            // padding: [0, 10, 0, 0]
            show: false,
            color: '#4DCEF8',
            fontSize: 14
          },
          type: 'category'
        },
        series: [{
          type: 'bar',
          barGap: '-100%',
          yAxisIndex: 0,
          label: {
            normal: {
              show: true,
              position: 'right',
              color: '#ff8f2c',
              fontSize: 14,
              formatter:
                function (data) {
                  let total = taskProgressObj[data.dataIndex].total
                  if (Number(total) === 0) {
                    return `${Number(0).toFixed(2)}%`
                  } else {
                    return `${(taskProgressObj[data.dataIndex].completedCount * 100 / total).toFixed(2)}%`
                  }
                }
            }
          },
          barWidth: 14,
          itemStyle: {
            normal: {
              // borderColor: '#4DCEF8',
              // borderWidth: 2,
              barBorderRadius: 15,
              color: '#ddd'
            },
            emphasis: {
              color: '#00000000',
              borderColor: '#ddd',
              borderWidth: 1
            }
          },
          data: []
        // data: da
        }, {
          barWidth: 14,
          // barGap: '-100%',
          yAxisIndex: 0,
          label: {
            normal: {
              show: true,
              position: [0, '-20'],
              textStyle: {
                fontSize: 14,
                color: '#333'
              },
              formatter: function (data) {
                return `${taskProgressObj[data.dataIndex].name}(${taskProgressObj[data.dataIndex].completedCount}/${taskProgressObj[data.dataIndex].total})`
              }
            }
          },
          itemStyle: {
            barBorderRadius: 15,
            // color: new echarts.graphic.LinearGradient(
            //   0, 0, 1, 1,
            //   [
            //     {offset: 0, color: '#FF5215'},
            //     {offset: 1, color: '#FF6C00'}
            //   ]),
            color: function (params) {
              var num = myColor.length
              return myColor[params.dataIndex % num]
            }
          },
          type: 'bar',
          data: []
        }]
      },
      shopRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 400,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 14,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#FF5215' },
                { offset: 1, color: '#FF6C00' }
              ])
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              color: '#999999',
              fontSize: 14,
              // ${parseInt(taskProgressObj[data.dataIndex].completedCount * 100 / taskProgressObj[data.dataIndex].total)}%
              formatter:
                function (data) {

                }
            }
          },
          type: 'bar',
          data: []
        }
      },
      guideRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 380,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          inverse: true,
          type: 'category',
          data: []
        },
        series: [{
          barWidth: 14,
          label: {
            normal: {
              show: true,
              position: 'right',
              color: '#999999',
              fontSize: 14,
              // ${parseInt(taskProgressObj[data.dataIndex].completedCount * 100 / taskProgressObj[data.dataIndex].total)}%
              formatter:
                function (data) {

                }
            }
          },
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#1FC47C' },
                { offset: 1, color: '#2EC59C' }
              ])
          },
          type: 'bar',
          data: []
        }]
      },
      rewardOption: {
        color: ['#FD9B00', '#F7C71F'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        legend: {
          bottom: 20,
          type: 'scroll',
          data: ['销售提成', '招募奖励'],
          itemWidth: 20,
          itemGap: 36
        },
        grid: {
          top: '30',
          left: '3%',
          right: '4%',
          bottom: '70',
          containLabel: true
        },
        xAxis: [
          {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            itemStyle: {
              borderWidth: 1,
              barBorderRadius: [0, 0, 50, 50]
            },
            name: '销售提成',
            barWidth: 16,
            barCategoryGap: '30px',
            type: 'bar',
            stack: 'stack',
            data: []
          },
          {
            itemStyle: {
              borderWidth: 1,
              barBorderRadius: [30, 30, 0, 0]
            },
            barWidth: 16,
            name: '招募奖励',
            type: 'bar',
            stack: 'stack',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    getArr (arr, add) {
      var newArr = []
      for (var i = 0; i < 10; i++) {
        newArr[i] = add
      }
      for (var j = 0; j < arr.length; j++) {
        newArr[j] = arr[j]
      }
      return newArr
    },
    change (e) {
      this.init()
    },
    selectTask (type) {
      if (type === 'brand') {
        this.searchObj.pageStart = 0
        this.pagination.page = 1
        this.searchObj.type = 0
      } else {
        this.searchObj.pageStart = 0
        this.pagination.page = 1
        this.searchObj.type = 1
      }
      this.getTaskProgress()
    },
    handleCurrentChange (val) {
      this.searchObj.pageStart = (val - 1) * this.searchObj.pageSize
      this.getTaskProgress()
    },
    shopSelect (id) {
      if (id === null) {
        this.getRewardInfo()
        this.findDailySell()
        this.findDailyRecruit()
        this.findDailyReward()
        this.findGuideRanking(0, null)
        this.findGuideRanking(1, null)
      } else {
        this.getRewardInfo(id)
        this.findDailySell(id)
        this.findDailyRecruit(id)
        this.findDailyReward(id)
        this.findGuideRanking(0, id)
        this.findGuideRanking(1, id)
      }
    },
    getMonthLength (d) { // 给定一个日期  计算出当月天数
      // 将日期设置为下月一号
      d.setMonth(d.getMonth() + 1)
      d.setDate('1')
      // 获取本月最后一天
      d.setDate(d.getDate() - 1)
      return d.getDate()
    },
    async getTaskCount () { // 当月业绩情况查询
      let parms = { queryDate: this.queryDate }
      await this.$http
        .fetch(this.$api.guide.task.getTaskCount, parms)
        .then(resp => {
          if (resp !== null) {
            for (let i in resp.result) {
              resp.result[i] = Number(resp.result[i] || 0)
            }
            this.infoObj = resp.result
            this.infoObj.delayCount = this.infoObj.finishDelay + this.infoObj.delayUnfinished
            if (!resp.result.total || (resp.result.finishOnTime + resp.result.finishDelay) > resp.result.total) {
              this.percentage.completed = 100
            } else {
              this.percentage.completed = Number(((resp.result.finishOnTime + resp.result.finishDelay) * 100 / resp.result.total).toFixed(2))
            }
            if (!resp.result.total || (resp.result.finishDelay + resp.result.delayUnfinished) > resp.result.total) {
              this.percentage.delay = 100
            } else {
              this.percentage.delay = Number(((resp.result.finishDelay + resp.result.delayUnfinished) * 100 / resp.result.total).toFixed(2))
            }
            // this.percentage.delay = Number((resp.result.delayCount * 100 / resp.result.total).toFixed(2))
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailySell (id) { // 当月销售业绩按日查询
      this.loadingSell = true
      let parms = {
        type: 0
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyTrend, parms)
        .then(resp => {
          that.loadingSell = false
          if (resp.result === null || resp.result.length === 0) {
            that.isSaleData = false
          } else {
            that.isSaleData = true
            that.saleOption.series[0].data = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailyRecruit (id) { // 当月招募人数按日查询
      let that = this
      this.loadingRecruit = true
      let parms = { queryDate: this.queryDate }
      await this.$http
        .fetch(this.$api.guide.task.findDailyStatistics, parms)
        .then(resp => {
          that.loadingRecruit = false
          let dayArr = []
          let totalNumArr = []
          let unfinishedNumArr = []
          if (resp.result === null || resp.result.length === 0) {
            that.isRecruitData = false
          } else {
            that.isRecruitData = true
            resp.result.map(item => {
              dayArr.push(item.day)
              totalNumArr.push(item.totalNum)
              unfinishedNumArr.push(item.unfinishedNum)
            })
            that.recruitOption.xAxis.data = dayArr
            that.recruitOption.series[0].data = totalNumArr
            that.recruitOption.series[1].data = unfinishedNumArr
          }
        })
        .catch(resp => {
          // that.recruitOption.series[0].data = resp.result.map(Number)
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailyReward (id) { // 当月收益按日查询
      this.loadingReward = true
      let sellRewardArr = []
      let recruitRewardArr = []
      let parms = {}
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyReward, parms)
        .then(resp => {
          that.loadingReward = false
          if (resp.result === null || resp.result.length === 0) {
            that.isRewardDate = false
          } else {
            resp.result.map(item => {
              sellRewardArr.push(item.sale)
              recruitRewardArr.push(item.recruit)
            })
            that.isRewardDate = true
            that.rewardOption.series[0].data = recruitRewardArr
            that.rewardOption.series[1].data = sellRewardArr
          }
        })
        .catch(resp => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findGuideRanking () { // 当月导购排行查询
      let parms = { queryDate: this.queryDate }
      this.loadingGuideRecruit = true
      let that = this
      await this.$http
        .fetch(this.$api.guide.task.findGuideTaskRanking, parms)
        .then(resp => {
          let guideNameArr = []
          let perfAllArr = []
          that.loadingGuideRecruit = false
          if (resp.result === null || resp.result.length === 0) {
            that.isGuideRecruitData = false
          } else {
            resp.result.map(item => {
              guideNameArr.push(item.name)
              perfAllArr.push(item.completedCount)
            })
            that.isGuideRecruitData = true
            that.guideRecruitOption.yAxis.data = guideNameArr
            that.guideRecruitOption.series[0].data = perfAllArr
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findShopRanking () { // 当月门店排行查询
      let parms = { queryDate: this.queryDate }
      this.loadingShopRecruit = true // 门店招募
      let that = this
      await this.$http
        .fetch(this.$api.guide.task.findShopTaskRanking, parms)
        .then(resp => {
          let shopNameArr = []
          let memberCountArr = []
          that.loadingShopRecruit = false
          if (resp.result === null || resp.result.length === 0) {
            that.isShopRecruitData = false
          } else {
            resp.result.map(item => {
              shopNameArr.push(item.shopName)
              memberCountArr.push(item.completedCount)
            })
            that.isShopRecruitData = true
            that.shopRecruitOption.yAxis.data = shopNameArr
            that.shopRecruitOption.series.data = memberCountArr
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async getTaskProgress () { // 当月门店排行查询
      let parms = Object.assign({ queryDate: this.queryDate }, this.searchObj)
      // this.loadingShopRecruit = true // 门店招募
      let that = this
      await this.$http
        .fetch(this.$api.guide.task.getTaskProgress, parms)
        .then(resp => {
          let shopNameArr = []
          let memberCountArr = []
          that.loadingShopRecruit = false
          if (resp.result === null || resp.result.length === 0) {

          } else {
            that.taskProgressOption.series[0].data = []
            that.taskProgressOption.series[1].data = []
            resp.result.data.map(item => {
              shopNameArr.push(item.name)
              memberCountArr.push(Number(item.total) === 0 ? 0 : (item.completedCount / Number(item.total)))
              that.taskProgressOption.series[0].data.push(1)
            })
            that.pagination.total = Number(resp.result.recordsTotal)
            taskProgressObj = resp.result.data
            that.taskProgressOption.series[1].data = memberCountArr
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    init () {
      this.getTaskCount()
      this.findDailyRecruit()
      this.getTaskProgress()
      this.findShopRanking()
      this.findGuideRanking()
    }
  },

  mounted () {
    this.init()
  }
}
</script>
<style scoped>
@import "@theme/variables.pcss";
  @component-namespace overview {
    @b content {
      .el-row {
        & + .el-row {
          margin-top: var(--default-margin-base);
        }
      }
      @e grid {
        margin-bottom: var(--default-margin-base);
        @b content {
          @e item {
            position: relative;
            padding: var(--default-padding-base);
            background-color: var(--theme-color-white);
            border: none;
            &:before {
              position: absolute;
              top: 0;
              left: 0;
              content: ' ';
              height: 5px;
              width: 100%;
              border-radius: var(--default-radius-mini);
            }
            >>>.el-card__body {
              height: 100px;
              padding: 16px 20px;
              position: relative;
              span {
                font-weight: bold;
              }
              p {
                padding-top: 6px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-left: var(--default-margin-xlarger);
                margin-bottom: var(--default-margin-larger);
              }
              .text-secondary {
                font-weight: normal;
              }
              .overview-content__item-left {
                margin-right: 80px;
              }
              .overview-content__item-right {
                position: absolute;
                top: 50%;
                right: 40px;
                margin-top: -30px;
                width: 70px;
                height: 70px;
                img {
                  width: 60px;
                  height: 60px;
                }
                .overview-content__item-right--progress-text {
                  position: absolute;
                  top: 34%;
                  left: 25%;
                  margin: 0;
                  padding: 0;
                }
              }
            }
            @m select {
              padding: var(--default-padding-base);
              display: flex;
              align-items: center;
              >>> .el-select,.el-date-editor{
                /* padding-left: var(--default-padding-larger); */
                flex: 1;
              }
            }
          }
        }
        .el-col {
          &:first-child {
            .overview-content__item:before {
              background: var(--theme-color-success);
            }
          }
          &:nth-child(2) {
            .overview-content__item:before {
              background: var(--theme-color-primary);
            }
          }
          &:nth-child(3) {
            .overview-content__item:before {
              background: var(--theme-color-danger);
            }
          }
          &:nth-child(4) {
            .overview-content__item:before {
              background: var(--theme-color-warning);
            }
          }
        }
      }
      @e title {
        line-height: 30px;
        padding: 20px;
        >.span {
          font-size: var(--default-font-size-middle);
          font-weight: bold;
          position: relative;
          display: inline-block;
          line-height: 1;
          padding: 0 0 0 var(--default-padding-xlarger);
          &:before {
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--theme-color-primary);
          }
        }
        .el-radio-group {
          padding: 3px;
          .el-radio-button__inner {
            padding: var(--default-padding-base) var(--default-padding-larger);
          }
        }

        @m color-pink {
          >span {
            &:before {
              background-color: #FF3A3A;
            }
          }
        }
        @m color-yellow {
          >span {
            &:before {
              background-color: #F7C71F;
            }
          }
        }
      }
      @e echart {
        @b echart {
          @e item {
            background-color: var(--theme-color-white);
            border-radius: var(--default-radius-mini);
            overflow: hidden;
            .el-form {
              padding: var(--default-padding-base);
              .el-form-item {
                margin: 0;
              }
              .spacing-button {
                display: block;
                margin-top: var(--default-margin-larger);
                text-align: center;
                .el-radio-button {
                  margin: 0 var(--default-margin-larger);
                  .el-radio-button__inner {
                    padding: var(--default-padding-base) var(--default-padding-larger);
                    border-radius: var(--default-radius-mini);
                    border: 1px solid var(--theme-base-border-color-primary);
                    box-shadow: none;
                  }
                }
              }
            }
            .echarts {
              padding-left: var(--default-padding-larger);
              width: 100%;
            }
            .no-data {
              width: 100%;
              height: 360px;
              background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QONaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWJmOTRjYmQtN2UwZi0xZDQ1LWFhNDItZGZhNDc2NzJkZjRmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg1NkQwQTM1Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg1NkQwQTM0Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZjMjI1OGRlLWNlMDAtZjc0OC1hZTdiLTExNTc3N2FmNWFiYiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmJlNWVjZDE3LWNiNjctMTFlOC05MmFjLWNlNDA1NzdlZjMxNyIvPiA8L3Jk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) center center no-repeat;
            }

            @m big {
              .echarts {
                height: 500px;
              }
            }
            @m larger {
              .echarts {
                height: 550px;
              }
            }
          }
        }
      }
    }
  }
  .statistics{
    border-top: 1px solid var(--theme-base-border-color-primary);
  }
  .statistics-pic{
    width: 220px;
    height: 140px;
    border-radius: 6px;
    position: relative;
    flex-direction: column;
    .round{
      width: 10px;
      height: 10px;
      border: 2px solid #fde7d6;
      border-radius: 50%;
      position: absolute;
      right: 16px;
      top: 14px;

    }
    &.statistics-total{
      background-image: linear-gradient(45deg, #2089f1 0%, #3bb4f8 100%);
    }
    &.statistics-doing{
      background-image: linear-gradient(45deg, #f75726 0%, #f78832 100%);
    }
  }
  .percentage{
    position: relative;
  }
  .percentage_abs{
   position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
  }
  .leftspace {
    margin-left: var(--default-margin-small);
  }
  .overview-content__title {
    line-height: 30px;
    padding: 5px 0;
  }
  .overview-content__title > .span {
    font-size: var(--default-font-size-small);
  }
  .content-overflow {
    overflow: hidden;
  }
  .flex-evenly {
    justify-content: space-evenly;
  }
</style>
