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
        id: null,
        code: null,
        value: null,
        remark: null,
        type: null,
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
          label: '其他',
          value: 0
        }, {
          label: 'ID',
          value: 1
        }, {
          label: '秘钥',
          value: 2
        }, {
          label: '秘钥',
          value: 3
        }, {
          label: '路由',
          value: 4
        }
      ],
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'code': [{required: true, message: '请输入配置项编码'}],
        'value': [{required: true, message: '请输入配置项值'}],
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
    onSaveOpen (row) { // 新增或编辑
      this.dialogFormVisible = true
      this.titleText = (row.id && '编辑') || '新增'
      this.model = row
    },
    onSave () { // 小程序保存功能shopManager_radio
      let that = this
      console.log(this.model.type)
      that.model.type = 0
      that.$refs.form.validate((valid) => {
        if (valid) {
          console.log(that.model)
          that.$http.fetch(that.$api.isv.saveOrUpdateSysConfig, that.model).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      })
    },
    onDelete (row) { // 小程序删除功能
      apiRequestConfirm('永久删除该数据')
      .then(() => {
        let that = this
        that.$http.fetch(that.$api.isv.delSysConfig, {id: row.id}).then(() => {
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
      return this.$http.fetch(this.$api.isv.findSysConfigList, params).then((resp) => {
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
