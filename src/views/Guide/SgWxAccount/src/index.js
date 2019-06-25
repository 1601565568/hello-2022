import tableMixin from 'web-crm/src/mixins/table'
// import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      // {
      //   'func': function () {
      //     that.onSaveOpen({})
      //   },
      //   'name': '新增'
      // },
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
        pay_id: null,
        pay_secret: null,
        type: null,
        from_type: null,
        userCorpsecret: null,
        addressCorpsecret: null,
        param: {}
      },
      obj: {
        appId: null
      },
      shopManager_radio: '1',
      shoppingGuide_radio: '0',
      appObj: {},
      appid: null,
      presentObj: {},
      titleText: '',
      titleTexts: '小程序代码模版',
      authorizationText: '微信号授权',
      miniProgramText: '小程序信息',
      autidText: '提交审核',
      url: this.$api.guide.sgwxaccount.findList,
      payTotal: null,
      rechargeTotal: null,
      dialogFormVisible: false,
      newestDialog: false,
      authorization: false,
      miniProgram: false,
      dialogAutid: false,
      cancelAuthorizations: false,
      weixinUrl: null,
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'name': [{ required: true, message: '请输入微信名称' }],
        'appid': [{ required: true, message: '请输入应用ID' }],
        'userCorpsecret': [{ required: true, message: '请输入外部联系人企业秘钥' }],
        'addressCorpsecret': [{ required: true, message: '请输入通讯录企业秘钥' }]
      }
    }
  },
  mounted: function () {
    let _this = this
    _this.auth_code = this.$route.query.auth_code
    _this.timestamp = this.$route.query.timestamp
    _this.nonce = this.$route.query.nonce
    _this.msg_signature = this.$route.query.msg_signature
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    cancelAuthorization () { // 微信取消授权
      let that = this
      let obj = {}
      obj.length = 15
      obj.start = 0
      that.$http.fetch(that.$api.guide.sgwxaccount.findList, obj).then((resp) => {
        that.payTotal = resp.result.payTotal
        that.rechargeTotal = resp.result.rechargeTotal
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
        that.cancelAuthorizations = false
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    shopManager () {
      this.shopManager_radio = '1'
      this.shoppingGuide_radio = '0'
    },
    shoppingGuide () {
      this.shopManager_radio = '0'
      this.shoppingGuide_radio = '1'
    },
    onToAuthorize () {
      var that = this
      var tempPage = window.open('', ' _blank')
      that.$http.fetch(that.$api.guide.sgwxaccount.getAuthUrl).then((resp) => {
        tempPage.location = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onSaveOpen (row) { // 新增或编辑
      var that = this
      that.dialogFormVisible = true
      that.shopManager_radio = row.type === 1 ? '1' : '0'
      that.shoppingGuide_radio = row.type === 0 ? '1' : '0'
      that.titleText = (row.id && '编辑') || '新增'
      that.model.id = row.id
      that.model.groupId = row.groupId
      that.model.name = row.name
      that.model.appid = row.appid
      that.model.secret = row.secret
      that.model.corpid = row.corpid
      that.model.corpsecret = row.corpsecret
      that.model.openKey = row.open_key
      that.model.open_secret = row.open_secret
      that.model.pay_id = row.pay_id
      that.model.type = row.type
      that.model.from_type = row.from_type
      that.model.userCorpsecret = row.userCorpsecret
      that.model.addressCorpsecret = row.addressCorpsecret
      that.model.paySecret = row.pay_secret
    },
    onAuthorization () {
      this.authorization = true
    },
    onUpdate () {},
    onRelieve () {},
    onAutid (appid) {
      this.presentObj.appId = appid
      this.dialogAutid = true
      var that = this
      // 查询小程序可选类目
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCategoryList, that.presentObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
      // 查询小程序页面配置
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletPageList, that.presentObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onPresent () { // 提交审核
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, that.presentObj).then(() => {

      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onPublish (latestStatus) { // 发布小程序
      var that = this
      if (latestStatus === 3) {
        this.$confirm('是否确认发布小程序', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.fetch(that.$api.guide.sgwxaccount.templateToRelease, that.obj).then(() => {

          }).catch((resp) => {
            that.$notify.error(getErrorMsg('保存失败', resp))
          })
        })
      } else if (latestStatus === 1 || latestStatus === 2 || latestStatus === 5) {
        this.$confirm('小程序版本尚未审核通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        })
      }
    },
    onSave () {
      let that = this
      that.shopManager_radio === '1' ? that.model.type = 1 : that.model.type = 0
      delete that.model.param
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.guide.sgwxaccount.save, that.model).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('保存失败', resp))
          })
        }
      })
    },
    onDelete (row) {
      this.cancelAuthorizations = true
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
