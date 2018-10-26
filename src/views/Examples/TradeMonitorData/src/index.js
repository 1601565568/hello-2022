import NsDatetime from 'components/NsDatetime'
import businessEcharts from 'components/NsEcharts'
import { VoBasic } from 'vue-orgchart'
import 'vue-orgchart/dist/style.min.css'

export default {
  components: {
    NsDatetime,
    businessEcharts,
    VoBasic
  },
  data: function () {
    return {
      time: [],
      loadingtable: false,
      radioValue: 1,
      banners: [],
      radio2: 3,
      chartData: {
        name: '有效付款金额',
        num: 0.00, // 数量
        vsLastMonth: 100, // VS上月同天
        vsLastYear: 100, // VS去年同天
        children: [{
          name: '订单数',
          num: 0.00, // 数量
          vsLastMonth: 100, // VS上月同天
          vsLastYear: 100, // VS去年同天
          children: [{
            name: 'PC订单数',
            num: 0.00, // 数量
            vsLastMonth: 100, // VS上月同天
            vsLastYear: 100 // VS去年同天
          },
          {
            name: '无线订单数',
            num: 0.00, // 数量
            vsLastMonth: 100, // VS上月同天
            vsLastYear: 100 // VS去年同天
          }]
        },
        {
          name: '商品件数',
          num: 0.00, // 数量
          vsLastMonth: 100, // VS上月同天
          vsLastYear: 100 // VS去年同天
        },
        {
          name: '客户数',
          num: 0.00, // 数量
          vsLastMonth: 100, // VS上月同天
          vsLastYear: 100, // VS去年同天
          children: [{
            name: '新客户数',
            num: 0.00, // 数量
            vsLastMonth: 100, // VS上月同天
            vsLastYear: 100, // VS去年同天
            children: [{
              name: '客单价',
              num: 0.00, // 数量
              vsLastMonth: 100, // VS上月同天
              vsLastYear: 100 // VS去年同天
            }, {
              name: '客件数',
              num: 0.00, // 数量
              vsLastMonth: 100, // VS上月同天
              vsLastYear: 100 // VS去年同天
            }]
          },
          {
            name: '老客户数',
            num: 0.00, // 数量
            vsLastMonth: 100, // VS上月同天
            vsLastYear: 100, // VS去年同天
            children: [{
              name: '客单价',
              num: 0.00, // 数量
              vsLastMonth: 100, // VS上月同天
              vsLastYear: 100 // VS去年同天
            },
            {
              name: '客件数',
              num: 0.00, // 数量
              vsLastMonth: 100, // VS上月同天
              vsLastYear: 100 // VS去年同天
            }]
          }]
        }]
      },
      tableData: [{
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
    createNode ($node, data) {
      var infoContent = document.createElement('div')
      var numContent = document.createElement('span')
      numContent.innerHTML = data.num
      infoContent.append(numContent)

      var listContent = document.createElement('div')
      listContent.className = 'info-list'
      var listLeft = document.createElement('div')
      var listLeftTitle = document.createElement('p')
      var listLeftContent = document.createElement('span')
      listLeftTitle.innerHTML = 'VS上月同天'
      listLeftContent.innerHTML = data.vsLastMonth
      listLeft.append(listLeftTitle)
      listLeft.append(listLeftContent)
      var listRight = document.createElement('div')
      var listRightTitle = document.createElement('p')
      var listRightContent = document.createElement('span')
      listRightTitle.innerHTML = 'VS去年同天'
      listRightContent.innerHTML = data.vsLastYear
      listRight.append(listRightTitle)
      listRight.append(listRightContent)
      listContent.append(listLeft)
      listContent.append(listRight)
      infoContent.append(listContent)
      $node.append(infoContent)
    }
  }
}
