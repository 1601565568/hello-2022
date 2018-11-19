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
        name: null,
        appid: null,
        secret: null,
        corpid: null,
        corpsecret: null,
        openKey: null,
        openSecret: null,
        payId: null,
        paySecret: null
      },
      titleText: '',
      url: this.$api.guide.sgwxaccount.findList,
      payTotal: null,
      rechargeTotal: null,
      dialogFormVisible: false,
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'name': [{required: true, message: '请输入微信名称'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 10) {
              callback(new Error('名称长度不得超过10位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'appid': [{required: true, message: '请输入应用ID'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 32) {
              callback(new Error('应用ID长度不得超过32位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'secret': [{required: true, message: '请输入应用密钥'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
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
    onSaveOpen (row) {
      this.titleText = (row.id && '编辑') || '新增'
      this.model.id = row.id
      this.model.name = row.name
      this.model.appid = row.appid
      this.model.secret = row.secret
      this.model.corpid = row.corpid
      this.model.corpsecret = row.corpsecret
      this.model.openKey = row.open_key
      this.model.openSecret = row.open_secret
      this.model.payId = row.pay_id
      this.model.paySecret = row.pay_secret
      this.dialogFormVisible = true
    },
    onSave () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.guide.sgwxaccount.save, that.model).then(() => {
            that.dialogFormVisible = false
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      })
    },
    onDelete (row) {
      let that = this
      console.log(row.id)
      that.$http.fetch(that.$api.guide.sgwxaccount.delete, {id: row.id}).then(() => {
        that.dialogFormVisible = false
        that.$notify.success('删除成功')
        that.$reload()
      }).catch((resp) => {
        that.$notify.error(resp.msg || '删除失败')
      })
    },
    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    $handleParams: function (params) {
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
      return this.$http.fetch(this.url, params).then((resp) => {
        that.payTotal = resp.result.payTotal
        that.rechargeTotal = resp.result.rechargeTotal
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
