import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'
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
        groupId: null,
        guideId: null,
        guideName: null,
        configId: null,
        shopName: null,
        brandId: null,
        param: {}
      },
      obj: {
        appId: null,
        templateId: null
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
          label: '其它',
          value: 0
        }, {
          label: 'ID',
          value: 1
        }, {
          label: '秘钥',
          value: 2
        }, {
          label: '域名',
          value: 3
        }, {
          label: '路由',
          value: 4
        }
      ],
      _table: {
        table_buttons: tableButtons
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
        code: null,
        value: null,
        remark: null,
        type: null,
        param: {}
      }
    },
    onSaveOpen (row) { // 新增或编辑
      this.dialogFormVisible = true
      this.titleText = (row.id && '编辑') || '新增'
      this.model = Object.assign({}, row)
      // this.model = row
    },
    onSave () { // 小程序保存功能shopManager_radio
      let that = this
      that.$http.fetch(that.$api.isv.setGuideContactWay, {guideId: that.model.guideId}).then(() => {
        that.closeDialog()
        that.newestDialog = false
        that.$notify.success('设置成功')
        that.$reload()
      }).catch((resp) => {
        that.$notify.error(resp.msg || '设置失败')
      })
    },
    onDelete (row) { // 小程序删除功能
      apiRequestConfirm('永久删除该数据')
      .then(() => {
        let that = this
        that.$http.fetch(that.$api.isv.deleteContactWay, {guideId: row.guideId}).then(() => {
          that.dialogFormVisible = false
          that.newestDialog = false
          that.$notify.success('删除成功')
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(resp.msg || '删除失败')
        })
      }).catch(() => {
        // 点击取消事件
      })
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
      return this.$http.fetch(this.$api.isv.getContactWayGuideInfo, params).then((resp) => {
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
