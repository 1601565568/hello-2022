import NsDatetime from 'web-crm/src/components/NsDatetime'
import businessEcharts from 'web-crm/src/components/NsEcharts'

export default {
  components: {
    NsDatetime,
    businessEcharts
  },
  data: function () {
    return {
      selectOptions: [{
        value: '1',
        label: '商品ID'
      }, {
        value: '2',
        label: '商品编码'
      }, {
        value: '3',
        label: '商品关键词'
      }],
      selectValue: '1',
      goodsLits: [{
        id: 1,
        goodUrl: '',
        imgUrl: 'https://img.alicdn.com/bao/uploaded/i3/1640288245/TB2V3WvvNSYBuNjSspjXXX73VXa_!!1640288245.jpg_100x100.jpg',
        title: '白色T恤 年货积分兑换赠品 小礼品（单拍不发）',
        price: '1.01'
      }, {
        id: 2,
        goodUrl: '',
        imgUrl: 'https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2LxCpvQ9WBuNjSspeXXaz5VXa_!!1640288245.jpg_100x100.jpg',
        title: '衬衫 年货',
        price: '1.01'
      }, {
        id: 3,
        goodUrl: '',
        imgUrl: 'https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg',
        title: '红色t恤 运动风 夏',
        price: '1.01'
      }, {
        id: 4,
        goodUrl: '',
        imgUrl: 'https://img.alicdn.com/bao/uploaded/i3/1640288245/TB2R4NWwyCYBuNkSnaVXXcMsVXa_!!1640288245.png_100x100.jpg',
        title: '背心 灰色',
        price: '1.01'
      }],
      radioList: 1,
      time: [],
      loadingtable: false,
      radio: 1,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['描述相符', '服务态度', '发货速度'],
          y: 220,
          x: 'center'
        },
        grid: {
          left: '30px',
          right: '40px',
          bottom: '40px',
          top: '10px',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        calculable: false,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '描述相符',
            type: 'line',
            symbol: 'diamond',
            data: [0.03, -0.03, 0.04, 0.05, 0, -0.05, 0]
          },
          {
            name: '服务态度',
            type: 'line',
            symbol: 'triangle',
            data: [0.01, 0.03, 0.05, 0.01, 0.02, 0.03, 0.01]
          },
          {
            name: '发货速度',
            type: 'line',
            symbol: 'emptyCircle',
            data: [0.01, -0.02, 0.02, 0.05, 0.03, 0.02, 0]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      tableData: [{
        date: '2016-05-02',
        num: '￥41.11',
        num1: '￥87.11',
        num2: '￥36.11',
        proportion: '95.21%',
        num3: 65,
        num4: 24,
        num5: 15,
        num6: 36,
        num7: 45,
        num8: 0,
        proportion1: '0.00%'
      }, {
        date: '2016-05-02',
        num: '￥45.11',
        num1: '￥12.11',
        num2: '￥123.11',
        proportion: '0.00%',
        num3: 51,
        num4: 96,
        num5: 52,
        num6: 23,
        num7: 86,
        num8: 98,
        proportion1: '0.00%'
      }, {
        date: '2016-05-02',
        num: '￥10.11',
        num1: '￥10.11',
        num2: '￥99.11',
        proportion: '50.00%',
        num3: 99,
        num4: 45,
        num5: 12,
        num6: 752,
        num7: 123,
        num8: 74,
        proportion1: '45.00%'
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
