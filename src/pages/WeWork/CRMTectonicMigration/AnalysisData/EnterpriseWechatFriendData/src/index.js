import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import moment from 'moment'
import { API_ROOT } from '@/config/http.js'
import $ from 'jquery'
import NsExportReport from '@nascent/ecrp-ecrm/src/components/NsExportReport'
import 'vue-orgchart/dist/style.min.css'
import ViewSelect from '@/components/NsViewSelect'

export default {
  components: {
    NsDatetime,
    businessEcharts,
    NsExportReport,
    NsDroptree,
    ElSelectLoad,
    ViewSelect
  },
  data: function () {
    return {
      isChart: false,
      loadingtable: false,
      model: {
        time: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')],
        shopId: '',
        userName: '',
        wxNo: '',
        shopArea: '',
        viewId: ''
      },
      copyModel: {
        time: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')],
        shopId: '',
        userName: '',
        wxNo: '',
        shopArea: ''
      },
      chartData: {},
      option: {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let result = params[0].name + '<br>'
            params.forEach((item) => {
              if (item.value && item.seriesName === '好友购买率') {
                result += item.marker + ' ' + item.seriesName + ' : ' + item.value + '%</br>'
              } else if (item.value) {
                result += item.marker + ' ' + item.seriesName + ' : ' + item.value + '</br>'
              } else {
                result += item.marker + ' ' + item.seriesName + ' :  0 </br>'
              }
            })
            return result
          }
        },
        legend: {
          data: ['总好友数', '新增好友数', '好友会员总数', '新增好友会员数', '好友付款金额', '好友客单价', '好友购买率'], // names
          y: 'bottom',
          x: 'center',
          show: true
        },
        grid: {
          left: '10px',
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
            data: []// theDates
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#0f2244', '#ff7f50', '#87cefa', '#ff76b5']
      },
      // 列表数据
      tableData: [],
      // 门店区域树
      shopAreaTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
      shopAreaData: [],
      viewList: [] // 视角列表
    }
  },
  computed: {
    /**
     * 区域id
     */
    areaId () {
      return this.$store.state.user.area.id
    }
  },
  mounted () {
    this.getShopAreaAndShop()
    this.findViewList()
  },
  methods: {
    // 区域模式下 查询区域对应的视角列表
    findViewList () {
      this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId: this.areaId })
        .then(res => {
          if (res.success) {
            if (res.result.length) {
              this.viewList = res.result
              this.model.viewId = res.result[0].viewId

              this.getData()
            }
          } else {
            this.$notify.error(res.msg)
          }
        }).catch(res => {
          this.$notify.error('视角列表查询失败')
        })
    },
    viewChange () {
      this.getData()
    },
    /**
     * 获取门店区域，所有门店选项
     */
    getShopAreaAndShop: function () {
      // 设置选中
      const that = this
      that.$http.fetch(that.$api.marketing.weworkMarketing.queryEmployeeTreeAndOption4Component)
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions.filter(item => item.ext && item.ext.indexOf(this.areaId) > -1)
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    // 懒加载门店区域树
    loadShopAreaNode (node, resolve) {
      const shopAreaTree = this.shopAreaTree
      if (node.level === 0) { // 第一次调用
        return resolve([{
          id: 0,
          parentId: -1,
          code: 0,
          label: '全部'
        }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        const filter = shopAreaTree.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    setData (data) {
      const that = this
      that.handleGraphData(data, that)
      that.handleTableData(data, that)
    },
    handleTableData (data, that) {
      const tableData = []
      for (const xv of data) {
        const item = Object.assign({}, xv)
        if (xv.date !== '均值' && xv.date !== '总计') {
          item.friendsPaymentsRadio = item.friendsPaymentsRadio + '%'
        }
        tableData.push(item)
      }
      that.tableData = tableData
    },
    handleGraphData (data, that) {
      that.option.xAxis[0].data = []
      that.option.series = []
      if (data && data.length > 0) {
        for (const xv of data) {
          if (xv.date !== '均值' && xv.date !== '总计') {
            that.option.xAxis[0].data.push(xv.date)
          }
        }
        // ['总好友数', '新增好友数', '好友会员总数', '新增好友会员数', '好友付款金额', '好友客单价', '好友购买率'], // nam
        const zhys = {
          name: '总好友数',
          type: 'line',
          data: []
        }
        const xzhys = {
          name: '新增好友数',
          type: 'line',
          data: []
        }
        const hyhyzs = {
          name: '好友会员总数',
          type: 'line',
          data: []
        }
        const xzhyhys = {
          name: '新增好友会员数',
          type: 'line',
          data: []
        }
        const hyfkje = {
          name: '好友付款金额',
          type: 'line',
          stack: '总量',
          data: []
        }
        const hykdj = {
          name: '好友客单价',
          type: 'line',
          data: []
        }
        const hygml = {
          name: '好友购买率',
          type: 'line',
          data: []
        }
        for (const xv of data) {
          if (xv.date !== '均值' && xv.date !== '总计') {
            zhys.data.push(parseInt(xv.allFriendsCount))
            xzhys.data.push(parseInt(xv.newAddFriendsCount))
            hyhyzs.data.push(parseInt(xv.allMemberCount))
            xzhyhys.data.push(parseInt(xv.newAddMemberCount))
            hyfkje.data.push(parseFloat(xv.friendsPayments))
            hykdj.data.push(parseFloat(xv.friendsPaymentsUnit))
            hygml.data.push(parseFloat(xv.friendsPaymentsRadio))
          }
        }
        that.option.series.push(zhys)
        that.option.series.push(xzhys)
        that.option.series.push(hyhyzs)
        that.option.series.push(xzhyhys)
        that.option.series.push(hyfkje)
        that.option.series.push(hykdj)
        that.option.series.push(hygml)
        that.isChart = true
      } else {
        that.isChart = false
      }
    },
    onSearch () {
      // const start = this.model.time[0] ? moment(this.model.time[0]).format('YYYY-MM-DD 00:00:00') : ''
      // const end = this.model.time[1] ? moment(this.model.time[1]).format('YYYY-MM-DD 23:59:59') : ''
      // const chazhi = (moment(end).toDate().getTime() - moment(start).toDate().getTime()) > (365 * 24 * 60 * 60 * 1000)
      this.getData()
    },
    filterShopArea (val) {
      if (val) {
        const nodes = this.shopAreaTree.filter(item => {
          if (item.label) {
            return item.label.indexOf(val) !== -1
          }
        })
        this.shopAreaData = nodes
      } else {
        this.shopAreaData = [{
          id: 0,
          parentId: -1,
          code: 0,
          label: '全部'
        }]
      }
    },
    reset () {
      this.model = Object.assign({}, this.copyModel)
      this.onSearch()
    },
    getParams (type) {
      const that = this
      const params = {
        // isQyWx: true
      }
      if (that.model.time[0]) {
        const start = that.model.time[0] ? moment(that.model.time[0]).format('YYYY-MM-DD 00:00:00') : ''
        params.startTime = start
      }
      if (that.model.time[1]) {
        const end = that.model.time[1] ? moment(that.model.time[1]).format('YYYY-MM-DD 23:59:59') : ''
        params.endTime = end
      }
      if (that.model.shopId) {
        params.shopIds = that.model.shopId
      } else if (that.model.shopArea && that.model.shopArea.value && that.shopOptions) {
        params.shopIds = that.shopOptions.map(item => item.value).join(',')
      }
      params.userName = that.model.userName
      params.wxNo = that.model.wxNo
      if (type === 'export') {
        params.tableData = JSON.stringify(that.tableData)
      }

      // 视角id
      params.viewId = this.model.viewId

      return params
    },
    getData () {
      const that = this
      that.loadingtable = true
      const param = this.getParams()
      that.$http.fetch(that.$api.marketing.weworkMarketing.queryWxPersonalFriendsAnalysisData, param)
        .then((resp) => {
          const response = resp.result
          if (response) {
            that.setData(response)
          } else {
            that.tableData = []
            that.isChart = false
          }
        }).catch(() => {
          that.$notify.error('获取企微好友数据失败')
        }).finally(() => {
          that.loadingtable = false
        })
    },
    /**
     *  导出报表
     */
    onExportReport () {
      let _this = this
      const url = API_ROOT + '/wework/marketing/createExportTask'
      const form = document.createElement('form')
      const start = _this.model.time[0] ? moment(_this.model.time[0]).format('YYYY-MM-DD') : ''
      const end = _this.model.time[1] ? moment(_this.model.time[1]).format('YYYY-MM-DD') : ''
      const name = start + '-' + end + '企微好友数据分析报表'
      form.appendChild(
        _this.generateHideElement('json', JSON.stringify(_this.tableData))
      )
      form.appendChild(_this.generateHideElement('fileName', name))
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      document.body.appendChild(form)
      form.submit()
      _this.$notify.info('报表导出中，请稍后！')
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    }
  },
  watch: {
    'model.shopArea': function (o1, o2) {
      const shopOptions = []
      if (!o1.value || o1.value !== o2.value) {
        let areaIdStr = '/' + o1.value + '/'
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            this.model.shopId = ''
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    }
  }
}
