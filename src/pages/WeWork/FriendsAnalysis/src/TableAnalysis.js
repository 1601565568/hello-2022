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
    timeArr[0] = this.getDate(date)
    timeArr[1] = this.getDate(start)
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
      echartList: [],
      currentPage: 0,
      outputClickState: true,
      dataList: [
        {
          key: 'chat_totals',
          nick: '昨天好友总数',
          value: 0
        },
        {
          key: 'member_totals',
          nick: '昨日净增人数',
          value: 0
        },
        {
          key: 'new_member_cnts',
          nick: '昨日添加人数',
          value: 0
        },
        {
          key: 'member_loss_cnts',
          nick: '昨日删除人数',
          value: 0
        },
        {
          key: 'member_loss_cnts_one',
          nick: '昨日被删除人数',
          value: 0
        }
      ],
      colorList: [
        'linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%)',
        'linear-gradient(270deg, #F7BD5B 0%, #F49F10 100%)',
        'linear-gradient(270deg, #A0E35E 0%, #67C230 100%)',
        'linear-gradient(269deg, #8B4EFC 0%, #6A00FA 100%)',
        'linear-gradient(269deg, #fc6767 0%, #ec008c 100%)'
      ],
      bases: process.env.VUE_APP_THEME,
      eltabQA: 'elTabQA',
      eltab: 'elTab'

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
    outputClick () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      const searchMap = this.$generateParams$().searchMap || {}
      const params = {
        ...searchMap,
        exportType: 17
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: rect.top,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    },
    getDate: function (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
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
      this._data.option.legend.selected = {}
      this.$http.fetch(_this.$api.weWork.weWorkCustomer.queryAnalysisListByDateReturnList,
        _this.$generateParams$())
        .then((resp) => {
          if (resp.success) {
            const json = resp.result || []
            const arr = json.reverse()
            this.echartList = arr
            if (resp.result.length > 0) {
              resp.result.map((item) => {
                this._data.option.legend.data.push('好友总数')
                this._data.option.legend.selected['好友总数'] = false
                this._data.option.series[0].name = '好友总数'
                this._data.option.xAxis[0].data.push(item.time.substring(0, 10))
                this._data.option.series[0].data.push(item.contactCnt)
                this._data.option.legend.data.push('净增人数')
                this._data.option.series[1].name = '净增人数'
                this._data.option.series[1].data.push(item.addContactCnt)
                this._data.option.legend.data.push('添加人数')
                this._data.option.series[2].name = '添加人数'
                this._data.option.series[2].data.push(item.newContactCnt)
                this._data.option.legend.data.push('删除人数')
                this._data.option.series[3].name = '删除人数'
                this._data.option.series[3].data.push(item.positiveFeedbackCnt)
                this._data.option.legend.data.push('被删除数')
                this._data.option.series[4].name = '被删除数'
                this._data.option.series[4].data.push(item.negativeFeedbackCnt)
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
              customerTotal = resp.result.contactCnt
              increaseCount = resp.result.addContactCnt
              addCount = resp.result.newContactCnt
              deleteCount = resp.result.positiveFeedbackCnt
              beDeletedCount = resp.result.negativeFeedbackCnt
            }
            _this._data.rowDatas = {
              customerTotal: customerTotal,
              increaseCount: increaseCount,
              addCount: addCount,
              deleteCount: deleteCount,
              beDeletedCount: beDeletedCount
            }
            this.dataList[0].value = customerTotal || 0
            this.dataList[1].value = increaseCount || 0
            this.dataList[2].value = addCount || 0
            this.dataList[3].value = deleteCount || 0
            this.dataList[4].value = beDeletedCount || 0
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
      // if (this.model.guideIds.length > 1) {
      //   this.$notify.warning('选择员工不能超过1个')
      //   return false
      // }
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
        return row.guideName
      } else if (this.tableRadios === 1 && row.time) {
        return row.time.substring(0, 10)
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
