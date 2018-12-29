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
      },
      {
        'func': function () {
          that.onAuthorization({})
        },
        'name': '授权'
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
        paySecret: null,
        param: {}
      },
      titleText: '',
      titleTexts: '小程序代码模版',
      authorizationText: '微信号授权',
      miniProgramText: '小程序信息',
      url: this.$api.guide.sgwxaccount.findList,
      payTotal: null,
      rechargeTotal: null,
      dialogFormVisible: false,
      newestDialog: false,
      authorization: false,
      miniProgram: false,
      weixinUrl: null,
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
    uploading () { // 上传
      console.log('0000')
    },
    underReview () { // 审核中
      console.log('1111')
    },
    auditSuccess () { // 审核成功
      console.log('2222')
    },
    published () { // 已发布
      console.log('3333')
    },
    submitted () { // 提交审核
      console.log('4444')
    },
    auditFailur () { // 审核失败
      console.log('5555')
    },
    newest () { // 同步最新
      this.$queryList$(this.param)
    },
    domainName () { // 域名配置
      console.log('6666')
    },
    qrCode () { // 体验二维码
      console.log('7777')
    },
    release () { // 发布
      console.log('8888')
    },
    onToAuthorize () {
      var that = this
      var tempPage = window.open('', ' _blank')
      that.$http.fetch(that.$api.guide.sgwxaccount.getAuthUrl).then((resp) => {
        tempPage.location = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    onSaveOpen (row) { // 新增
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
      // this.newestDialog = true
      // this.miniProgram = true
    },
    onAuthorization () {
      this.authorization = true
    },
    onSave () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.guide.sgwxaccount.save, that.model).then(() => {
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
    onDelete (row) {
      apiRequestConfirm('永久删除该数据')
      .then(() => {
        let that = this
        that.$http.fetch(that.$api.guide.sgwxaccount.delete, {id: row.id}).then(() => {
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
