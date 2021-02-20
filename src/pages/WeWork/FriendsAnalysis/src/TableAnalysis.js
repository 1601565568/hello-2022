import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ElCountup from '@nascent/nui/lib/countup'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import $ from 'jquery'
import ElCard from '@nascent/nui/lib/card'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import NsGuideDialog from '@/components/NsGuideDialog'
import moment from 'moment'

export default {
  name: 'TableAnalysis',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  components: {
    NsDatetime,
    businessEcharts,
    ElCountup,
    ElBreadcrumb,
    ElBreadcrumbItem,
    NsGuideDialog,
    ElCard
  },
  data: function () {
    var searchBtn = [
      {
        'func': function () {
          this.$emit('add')
        },
        'icon': '$.noop',
        'name': '搜索',
        'auth': ``,
        'visible': ``
      }
    ]
    var resetBtn = [
      {
        'func': function () {
          this.$emit('add')
        },
        'icon': '$.noop',
        'name': '重置',
        'auth': ``,
        'visible': ``
      }
    ]
    let start = new Date(new Date().getTime() - 1 * 24 * 3600 * 1000)
    let date = new Date(start.getTime() - 6 * 24 * 3600 * 1000)
    let timeArr = []
    if (date.getMonth() < 10) {
      timeArr[0] = date.getFullYear() + '-' + '0' + (date.getMonth() + 1) + '-' + date.getDate()
    } else {
      timeArr[0] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
    if (start.getMonth() < 10) {
      timeArr[1] = start.getFullYear() + '-' + '0' + (start.getMonth() + 1) + '-' + start.getDate()
    } else {
      timeArr[1] = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
    }
    let model = Object.assign({},
      { 'guideIds': '', 'TheDate': '' },
      { TheDate: timeArr })
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      pickerOptions: { disabledDate: (time) => {
        if (time.getTime() >= (new Date().getTime() - 3600 * 1000 * 24 * 1)) { return true }
        return false
      }
      },
      pageCompleteData: [],
      pageUserData: [],
      rowDatas: {},
      selectUserRange: [],
      url: this.$api.weWork.weWorkCustomer.queryAnalysisListByDate,
      model: model,
      rules: Object.assign({}, {}, {}),
      time: [moment(new Date()).add(-6, 'days').format('YYYY-MM-DD 00:00:00'), moment(new Date()).format('YYYY-MM-DD 23:59:59')],
      chartRadio: 1,
      tableRadios: 1,
      loadingtable: false,
      _pagination: pagination,
      _tableData: [],
      _table: {
        operate_buttons_search: searchBtn,
        operate_buttons_reset: resetBtn
      },
      _queryConfig: {
        expand: false
      },
      brandCheckboxVal: false, // 表格头部是否选中
      brandIndeterminateIndex: false, // 表格是否全选
      /* 此处图表只是模拟数据 */
      option: {
        tooltip: {
          backgroundColor: '#fff',
          position: 'top',
          formatter: '{c}',
          textStyle: {
            color: '#000'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1
        },
        legend: {
          data: ['客户总数', '净增人数', '添加人数', '删除人数', '被删除数'],
          bottom: 10,
          right: 'center'
        },
        grid: {
          left: '10px',
          right: '40px',
          top: '40px',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        calculable: false,
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
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: 'value'
        },
        series: [
          {
            name: '客户总数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }, {
            name: '净增人数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }, {
            name: '添加人数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }, {
            name: '删除人数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }, {
            name: '被删除数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }
        ],
        color: ['#0078D7', '#E03D4F', '#1F9E89', '#E76C00', '#9977FF']
      },
      tableData: [],
      currentPage: 0
    }
  },
  watch: {
    '_table.data': {
      // 深度监听，可监听到对象、数组的变化
      handler (val) {
      },
      deep: true // true 深度监听
    }
  },
  created: function () {
    this.handleAPIReturnData()
  },
  /* updated: function () {
    this.changeChartDataType()
  }, */
  mounted: function () {
    var vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    if (this.$refs.table_filter_form && this.$refs.table_filter_form.$el) {
      this.$refs.table_filter_form.$el.onkeyup = function (event) {
        if (event.keyCode === 13) {
          vm.$searchAction$()
        }
      }
    }
    if (this.$refs.quickText && this.$refs.quickText.$el) {
      this.$refs.quickText.$el.onkeyup = function (event) {
        if (event.keyCode === 13) {
          vm.$quickSearchAction$(event)
        }
      }
      this.$refs.quickText.$el.onkeydown = function (event) {
        if (event.keyCode === 13) {
          return false
        }
      }
    }
  },
  methods: {
    resetInputAction: function () {
      this.$resetInputAction$()
    },
    changeChartDataType: function () {
      let _this = this
      this._data.option.xAxis[0].data = []
      this._data.option.series[0].data = []
      this._data.option.series[1].data = []
      this._data.option.series[2].data = []
      this._data.option.series[3].data = []
      this._data.option.series[4].data = []
      this._data.option.legend.data = []
      this.$http.fetch(_this.$api.weWork.weWorkCustomer.queryAnalysisListByDateReturnList,
        _this.$generateParams$())
        .then((resp) => {
          if (resp.success) {
            if (resp.result.length > 0) {
              resp.result.map((item) => {
                this._data.option.legend.data.push('客户总数')
                this._data.option.series[0].name = '客户总数'
                this._data.option.xAxis[0].data.push(item.analysis_date.substring(0, 10))
                this._data.option.series[0].data.push(item.customerTotal)
                this._data.option.legend.data.push('净增人数')
                this._data.option.series[1].name = '净增人数'
                this._data.option.series[1].data.push(item.increaseCount)
                this._data.option.legend.data.push('添加人数')
                this._data.option.series[2].name = '添加人数'
                this._data.option.series[2].data.push(item.addCount)
                this._data.option.legend.data.push('删除人数')
                this._data.option.series[3].name = '删除人数'
                this._data.option.series[3].data.push(item.deleteCount)
                this._data.option.legend.data.push('被删除数')
                this._data.option.series[4].name = '被删除数'
                this._data.option.series[4].data.push(item.beDeletedCount)
              })
            }
          }
        })
    },
    handleAPIReturnData: function () {
      let _this = this
      this.$http.fetch(_this.$api.weWork.weWorkCustomer.queryAnalysisOverview,
        { start: 0, length: 15, searchMap: { } })
        .then((resp) => {
          if (resp.success) {
            let customerTotal = 0
            let increaseCount = 0
            let addCount = 0
            let deleteCount = 0
            let beDeletedCount = 0
            if (resp.result) {
              customerTotal = resp.result.customerTotal
              increaseCount = resp.result.increaseCount
              addCount = resp.result.addCount
              deleteCount = resp.result.deleteCount
              beDeletedCount = resp.result.beDeletedCount
            }
            _this._data.rowDatas = {
              customerTotal: customerTotal,
              increaseCount: increaseCount,
              addCount: addCount,
              deleteCount: deleteCount,
              beDeletedCount: beDeletedCount
            }
          }
        })
      this.changeChartDataType()
      // this.tableReload(this.$generateParams$())
    },
    tableReload: function (params) {
      if (this.tableRadios === 1) {
        this.$http.fetch(this.$api.weWork.weWorkCustomer.queryAnalysisListByDate, params)
          .then((resp) => {
            if (resp.success) {
              this._data._table.data = resp.result.data
              this._data._pagination.total = parseInt(resp.result.recordsTotal)
              /* if (this._data._pagination.total > 0) {
                this._data._table.key = 1
              } else if (this._data._pagination.total === 0) {
                this._data._table.key = 2
              } */
            }
          })
        // this.changeChartDataType()
      } else if (this.tableRadios === 2) {
        this.$http.fetch(this.$api.weWork.weWorkCustomer.queryAnalysisListByUser, params)
          .then((resp) => {
            if (resp.success) {
              this._data._table.data = resp.result.data
              this._data._pagination.total = parseInt(resp.result.recordsTotal)
              /* if (this._data._pagination.total > 0) {
                this._data._table.key = 2
              } else if (this._data._pagination.total === 0) {
                this._data._table.key = 1
              } */
            }
          })
      } else {
        this._data._table.data = this._data.pageCompleteData
      }
    },
    changeListDataType: function () {
      this._data._pagination.page = 1
      this.tableReload(this.$generateParams$())
    },
    reload: function () {
      this._data._table.data = []
      this.tableReload(this.$generateParams$())
    },
    $searchAction$: function () {
      if (this.model.guideIds.length > 1) {
        this.$notify.warning('选择员工不能超过1个')
        return false
      }
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 记录搜索的条件
      var prePage = 1
      // this._data._pagination.page
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      if (prePage === 1) {
        this.reload()
      }
      this.$formatTextToShow$()
      this.changeChartDataType()
    },
    '$handleParams': function (param) {
      if (param.searchMap) {
        // 员工
        param.searchMap.guideIds = this.model.guideIds
        const guideIds = []
        for (let i = 0; i < this.model.guideIds.length; i++) {
          guideIds.push(this.model.guideIds[i])
        }
        param.searchMap.guideIds = guideIds.join(',')
        if (param.searchMap.guideIds === '') {
          delete param.searchMap.guideIds
        }
      }
      if (param.searchMap && this.model.TheDate) {
        param.searchMap.startTime = this.model.TheDate[0]
        param.searchMap.endTime = this.model.TheDate[1]
        if (param.searchMap.endTime === '') {
          delete param.searchMap.endTime
        }
        if (param.searchMap.startTime === '') {
          delete param.searchMap.startTime
        }
      }
      delete param.searchMap.analysis_date
      return param
    },
    formateTheDate: function (row) {
      if (this.tableRadios === 2) {
        return row.name
      } else if (this.tableRadios === 1 && row.analysis_date) {
        return row.analysis_date.substring(0, 10)
      }
    },
    analysisSizeChange: function (size) {
      var pagination = this._data._pagination
      pagination.size = size
      return this.tableReload(this.$generateParams$())
    },
    analysisPageChange: function (page) {
      // var _pagination = this._data._pagination
      this._data._pagination.page = page
      return this.tableReload(this.$generateParams$())
    },
    funIntroduce: function () {
      functionIntroduce(this, 30)
    }
  }
}
