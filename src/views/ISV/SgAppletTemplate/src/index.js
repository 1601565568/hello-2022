import tableMixin from 'mixins/table'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          that.onSaveOpen({})
        },
        'name': '新增'
      }
    ]
    return {
      model: {
        id: null,
        appid: null,
        type: null,
        template_id: null,
        name: null,
        param: {}
      },
      obj: {
        appId: null
      },
      parameter: {
        length: 10,
        searchMap: {
          appId: null
        },
        start: 0
      },
      modelObj: {},
      index: 0,
      checkText: '',
      titleText: '',
      dialogFormVisible: false,
      dialogVisible: false,
      loadingTable: false,
      tableList: [],
      typeList: [
        {
          label: '导购转移提醒',
          value: 0
        }, {
          label: '任务分配通知',
          value: 1
        }, {
          label: '优惠券分配通知',
          value: 2
        }
      ],
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'appid': [{required: true, message: '请输入小程序appid'}],
        'type': [{required: true, message: '请选择类型'}]
      }
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    closeDialog () {
      this.dialogFormVisible = false
      this.model = {
        id: null,
        appid: null,
        type: null,
        template_id: null,
        name: null,
        param: {}
      }
    },
    onSaveOpen (row) { // 新增或编辑
      this.dialogFormVisible = true
      this.titleText = (row.id && '编辑') || '新增'
      this.model = row
    },
    onSave () { // 小程序保存功能shopManager_radio

    },

    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    $handleParams: function (params) {
      this.param = params
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.timeStart = params.searchMap.time[0]
        params.searchMap.timeEnd = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    $queryList$: function (params) {
      let that = this
      let tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.$api.isv.findAppletTemplateList, params).then((resp) => {
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch(() => {
        that.$notify.error('网络异常，获取数据失败！')
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    }
  }
}
