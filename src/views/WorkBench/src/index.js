import echarts from 'echarts'
import businessEcharts from 'components/NsEcharts'

export default {
  name: 'Home',
  components: {
    businessEcharts
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '2018.11'
      }, {
        value: '选项2',
        label: '2018.12'
      }],
      value: '选项1',
      constantlyData1: [
        {
          type: 'price',
          value: 0,
          totalTitle: '今日付款总额',
          decimal: 2,
          titleNum: [
            {title: '昨日付款总额', num: 0},
            {title: '近30日付款总额', num: 0},
            {title: '今日退款总额', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日付款订单',
          decimal: 0,
          titleNum: [
            {title: '昨日付款订单', num: 0},
            {title: '近30日付款订单', num: 0},
            {title: '今日付款订单', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日付款客户',
          decimal: 0,
          titleNum: [
            {title: '昨日付款客户', num: 0},
            {title: '近30日付款客户', num: 0},
            {title: '今日回购客户', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日新增会员',
          decimal: 0,
          titleNum: [
            {title: '昨日新增会员', num: 0},
            {title: '近30日新增会员', num: 0},
            {title: '今日新增会员', num: 0}
          ]
        }
      ],
      isSaleData: true, // 是否有数据展示
      isSaleData1: false, // 是否有数据展示
      lineChartOption1: {
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
          data: ['1', '2', '3', '4', '5', '6', '7']
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
          data: [400, 800, 650, 900, 600, 950, 500],
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
      lineChartOption2: {
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
          data: ['1', '2', '3', '4', '5', '6', '7']
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
          color: '#FF3A3A',
          data: [400, 800, 650, 900, 600, 950, 500],
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
                offset: 0, color: 'rgba(255, 58, 58, 0.6)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255, 58, 58, 0.1)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      barChartOption1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
          data: ['厦门sm店', '福州万达店', '厦门前埔店', '泉州店', '成都天泉店', '郑州二七店', '莆田正荣店', '北京王府井店', '扬州店', '广州天河店']
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                {offset: 0, color: '#3963FF'},
                {offset: 1, color: '#2B67FF'}
              ])
          },
          type: 'bar',
          data: [30000, 60000, 105000, 120000, 140000, 155000, 170000, 190000, 220000, 240000]
        }
      },
      barChartOption2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
          data: ['厦门sm店', '福州万达店', '厦门前埔店', '泉州店', '成都天泉店', '郑州二七店', '莆田正荣店', '北京王府井店', '扬州店', '广州天河店']
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                {offset: 0, color: '#A964FF'},
                {offset: 1, color: '#BF63FF'}
              ])
          },
          type: 'bar',
          data: [30000, 60000, 105000, 120000, 140000, 155000, 170000, 190000, 220000, 240000]
        }
      },
      barChartOption3: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
          data: ['厦门sm店', '福州万达店', '厦门前埔店', '泉州店', '成都天泉店', '郑州二七店', '莆田正荣店', '北京王府井店', '扬州店', '广州天河店']
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                {offset: 0, color: '#FF5215'},
                {offset: 1, color: '#FF6C00'}
              ])
          },
          type: 'bar',
          data: [30000, 60000, 105000, 120000, 140000, 155000, 170000, 190000, 220000, 240000]
        }
      },
      barChartOption4: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
          data: ['厦门sm店', '福州万达店', '厦门前埔店', '泉州店', '成都天泉店', '郑州二七店', '莆田正荣店', '北京王府井店', '扬州店', '广州天河店']
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                {offset: 0, color: '#1FC47C'},
                {offset: 1, color: '#2EC59C'}
              ])
          },
          type: 'bar',
          data: [30000, 60000, 105000, 120000, 140000, 155000, 170000, 190000, 220000, 240000]
        }
      },
      rewardChartOption: {
        color: ['#FD9B00', '#F7C71F'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
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
            data: [120, 132, 101, 134, 90, 230, 210, 123, 221, 154, 310, 120, 132, 101, 134, 120, 132, 101, 134, 90, 230, 210, 123, 221, 154, 310, 120, 132, 101, 134]
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
            data: [150, 232, 201, 154, 190, 230, 310, 323, 290, 350, 150, 232, 201, 154, 190, 150, 232, 201, 154, 190, 230, 310, 323, 290, 350, 150, 232, 201, 154, 190]
          }
        ]
      }
    }
  },
  mounted () {
    console.log('VUEX:', this.$store)
  }
}
