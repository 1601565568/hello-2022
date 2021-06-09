import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ElCountup from '@nascent/nui/lib/countup'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'

export default {
  name: 'DataAnalysis',
  mixins: [tableMixin],
  props: {
    types: Object,
    date: {
      type: Array,
      value: []
    }
  },
  components: {
    NsDatetime,
    businessEcharts,
    ElCountup,
    ElBreadcrumb,
    ElBreadcrumbItem
  },
  data: function () {
    let model = Object.assign({},
      { 'shopIds': '', 'profileId': null })
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
      rowDatas: {},
      url: this.$api.weWork.friendsCircle.logPageByType,
      model: model,
      type: 0,
      loadingtable: false,
      _pagination: pagination,
      externalLogQuery: {
        profileId: null,
        shopIds: '',
        startTime: this.date[0] || '',
        endTime: this.date[1] || ''
      },
      logByTypeQuery: {
        profileId: null,
        shopIds: '',
        startTime: this.date[0] || '',
        endTime: this.date[1] || '',
        length: 15,
        start: 0,
        type: 0,
        sort: 'asc',
        orderBy: 'visitTime'
      },
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
          data: ['访问次数', '访问人数'],
          bottom: 10,
          right: 'center',
          textStyle: {
            color: '#595959'
          },
          icon: 'rectangle',
          itemHeight: 10,
          itemWidth: 10
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
              show: false,
              lineStyle: {
                color: '#8C8C8C'
              }
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
            show: false,
            lineStyle: {
              color: '#8C8C8C'
            }
          },
          axisTick: {
            show: false
          },
          type: 'value'
        },
        series: [
          {
            name: '访问次数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }, {
            name: '访问人数',
            type: 'line',
            symbolSize: 8,
            data: [],
            smooth: 0.35
          }
        ],
        color: ['#6BA6FF', '#73CADB']
      },
      tableData: [],
      currentPage: 0,
      typeList: [
        {
          name: '按日期',
          id: 0
        }, {
          name: '按导购',
          id: 1
        }
      ]
    }
  },
  watch: {
    '_table.data': {
      // 深度监听，可监听到对象、数组的变化
      handler (val) {
      },
      deep: true // true 深度监听
    },
    date: {
      handler (newValue) {
        this.externalLogQuery.startTime = newValue[0]
        this.externalLogQuery.endTime = newValue[1]
        this.logByTypeQuery.startTime = newValue[0]
        this.logByTypeQuery.endTime = newValue[1]
        this.changeChartDataType()
        this.tableReload()
      },
      deep: true
    }
  },
  /* updated: function () {
    this.changeChartDataType()
  }, */
  methods: {
    // 折线图初始化数据
    changeChartDataType: function () {
      let _this = this
      this._data.option.xAxis[0].data = []
      this._data.option.series[0].data = []
      this._data.option.series[1].data = []
      this._data.option.legend.data = []
      // 后台把shopId 改为 shopIds
      this.externalLogQuery.shopIds = this.model.shopIds
      this.externalLogQuery.profileId = this.model.profileId
      this.externalLogQuery.areaId = this.model.areaId
      this.$http.fetch(_this.$api.weWork.friendsCircle.logPvAndUv,
        this.externalLogQuery)
        .then((resp) => {
          if (resp.success) {
            let pv = 0
            let uv = 0
            if (resp.result) {
              pv = resp.result.pv
              uv = resp.result.uv
            }
            _this._data.rowDatas = {
              pv: pv,
              uv: uv
            }
            if (resp.result.data.length > 0) {
              resp.result.data.map((item) => {
                this._data.option.xAxis[0].data.push(item.visitTime.substring(0, 10))
                this._data.option.legend.data.push('访问次数')
                this._data.option.series[0].name = '访问次数'
                this._data.option.series[0].data.push(item.pv)
                this._data.option.legend.data.push('访问人数')
                this._data.option.series[1].name = '访问人数'
                this._data.option.series[1].data.push(item.uv)
              })
            }
          }
        })
    },
    // 日期导购列表
    tableReload: function () {
      // 后台把shopId 改为 shopIds
      this.logByTypeQuery.shopIds = this.model.shopIds
      this.logByTypeQuery.areaId = this.model.areaId
      this.logByTypeQuery.profileId = this.model.profileId
      this.logByTypeQuery.length = this._data._pagination.size
      this.logByTypeQuery.start = (this._data._pagination.page - 1) * (this._data._pagination.size)
      this.$http.fetch(this.$api.weWork.friendsCircle.logPageByType, this.logByTypeQuery)
        .then((resp) => {
          if (resp.success) {
            this._data._table.data = resp.result.data
            this._data._pagination.total = parseInt(resp.result.recordsTotal)
          }
        })
    },
    // 切换数据报表搜索类型
    changeListDataType: function (e) {
      this.logByTypeQuery.type = e
      if (e === 1) {
        this.logByTypeQuery.orderBy = ''
      }
      this._data._pagination.page = 1
      this.tableReload(this.$generateParams$())
    },
    // 刷新
    $searchAction$: function () {
      this.tableReload()
      this.changeChartDataType()
    },
    // 排序
    sortChange (val) {
      // 获取字段名称和排序类型
      this.logByTypeQuery.orderBy = val.prop
      this.logByTypeQuery.sort = val.order === 'descending' ? 'desc' : 'asc'
      this.tableReload(this.$generateParams$())
    },
    // 日期格式转换
    formateTheDate: function (row) {
      if (this.type === 1) {
        return row.name
      } else if (this.type === 0 && row.visitTime) {
        return row.visitTime.substring(0, 10)
      }
    },
    analysisSizeChange: function (size) {
      var pagination = this._data._pagination
      pagination.size = size
      return this.tableReload(this.$generateParams$())
    },
    analysisPageChange: function (page) {
      this._data._pagination.page = page
      return this.tableReload(this.$generateParams$())
    }
  }
}
