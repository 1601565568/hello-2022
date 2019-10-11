import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
import ExperienceMember from '../components/ExperienceMember'
import PluginManagement from '../components/PluginManagement'

export default {
  name: 'index',
  components: { ExperienceMember, PluginManagement },
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
          that.openDialog({})
        },
        'name': '草稿箱'
      }
      /*,
      {
        'func': function () {
          that.onAuthorization({})
        },
        'name': '授权'
      } */
    ]
    let tableButtons2 = [
      {
        'func': function (obj) {
          that.addDraftToTemplate(obj.row.draft_id)
        },
        'name': '添加到模板库',
        'visible': ''
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
        groupId: null,
        paySecret: null,
        userCorpsecret: null,
        addressCorpsecret: null,
        fromType: null,
        type: null,
        param: {}
      },
      obj: {
        appId: null,
        templateId: null
      },
      releaseObj: {}, // 发布代码模板对象
      particularsObj: {}, // 模板详情对象
      domainNameObj: {}, // 域名配置对象
      uploadingObj: {}, // 代码模板上传对象
      succeedObj: {}, // 查询已成功模板对象
      deleteTemplateObj: {}, // 模板删除对象
      submittedObj: {
        firstId: null,
        secondId: null,
        corpsecret: null,
        categoryList: [],
        pageList: []
      }, // 提交审核模板对象
      parameter: {
        length: 10,
        searchMap: {
          appId: null
        },
        start: 0
      },
      modelObj: {},
      appObj: {},
      modelArry: [],
      index: 0,
      appid: null,
      img: null,
      checkText: '',
      presentObj: {},
      underReviewObj: {
        pageList: [],
        categoryList: [],
        label: '',
        firstId: null,
        secondId: null,
        appId_array: ''
      },
      titleText: '',
      payTotal: null,
      rechargeTotal: null,
      domainNameVisible: false,
      dialogFormVisible: false,
      newestDialog: false,
      qrCodeShow: false,
      newauthorization: false,
      authorization: false,
      shopKuhuShow: false,
      miniProgram: false,
      dialogAutid: false,
      releaseShow: false,
      dialogVisible: false,
      loadingTable: false,
      dialogDeleteTemplate: false,
      tableList: [],
      weixinUrl: null,
      _table: {
        table_buttons: tableButtons,
        table_buttons_ext: [
          {
            'func': function (scope) {
              that.onSaveOpen(scope.row)
            },
            'icon': '',
            'name': '编辑',
            'auth': ``,
            'visible': ''
          },
          {
            'func': function (scope) {
              that.onCodeTemplate(scope.row)
            },
            'icon': '',
            'name': '代码模板',
            'auth': ``,
            'visible': 'scope.row.wxStatus === 1'
          },
          {
            'func': function (scope) {
              that.onRefresh(scope.row)
            },
            'icon': '',
            'name': '刷新',
            'auth': ``,
            'visible': ''
          },
          {
            'func': function (scope) {
              that.onDelete(scope.row)
            },
            'icon': '',
            'name': '删除',
            'auth': ``,
            'visible': ''
          },
          {
            'func': function (scope) {
              that.experienceMemberDialog.appid = scope.row.appid
              that.experienceMemberDialog.visible = true
            },
            'icon': '',
            'name': '体验成员',
            'auth': ``,
            'visible': 'scope.row.wxStatus === 1 && scope.row.fromType === 1'
          },
          {
            'func': function (scope) {
              that.pluginManagementDialog.appid = scope.row.appid
              that.pluginManagementDialog.visible = true
            },
            'icon': '',
            'name': '插件管理',
            'auth': ``,
            'visible': 'scope.row.wxStatus === 1 && scope.row.fromType === 1'
          }
        ]
      },
      _table2: {
        table_buttons2: tableButtons2,
        operate_buttons: [],
        quickSearchMap: {}
      },
      rules: {
        'groupId': [{ required: true, message: '请输入集团id' }],
        'name': [{ required: true, message: '请输入微信名称' }],
        'userCorpsecret': [{ required: true, message: '请输入外部联系人企业秘钥' }],
        'addressCorpsecret': [{ required: true, message: '请输入通讯录企业秘钥' }],
        'appid': [{ required: true, message: '请输入请输入应用ID' }],
        'secret': [{ required: true, message: '请输入请输入应用秘钥' }],
        'type': [{ required: true, message: '小选择小程序类型' }]
      },
      checkRules: {
        'template_id': [{ required: true, message: '请输入模版Id' }],
        'appid': [{ required: true, message: '请输入自定义标签，小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20' }],
        'firstId': [{ required: true, message: '请输入可选类目' }],
        'secondId': [{ required: true, message: '请选择页面地址' }],
        'corpsecret': [{ required: true, message: '请输入页面标题' }]
      },
      domainNameRules: {
        'request_domain': [{ required: true, message: '请输入request合法域名' }],
        'ws_request_domain': [{ required: true, message: '请输入socket合法域名' }],
        'upload_domain': [{ required: true, message: '请输入uploadFile合法域名' }],
        'download_domain': [{ required: true, message: '请输入downloadFile合法域名' }]
      },
      businessRules: {
        'webview_domain': [{ required: true, message: '请输入小程序业务域名' }]
      },
      uploadingRules: {
        'template_id': [{ required: true, message: '请输入模版Id' }],
        'version': [{ required: true, message: '请输入版本号' }],
        'user_desc': [{ required: true, message: '请输入代码备注' }]
      },
      experienceMemberDialog: {
        visible: false,
        appid: ''
      },
      pluginManagementDialog: {
        visible: false,
        appid: ''
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
    uploadAgain (particularsObj) { // 重新提交审核
      let that = this
      let obj = {}
      obj.categoryStr = {}
      obj.pageStr = particularsObj.audit_address
      obj.tags = particularsObj.audit_tags
      obj.title = particularsObj.audit_title
      obj.categoryStr = particularsObj.audit_category
      obj.appId = particularsObj.app_id
      obj.templateId = particularsObj.template_id
      if (that.checkText === '重新提交审核') {
        that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, obj).then((resp) => {
          if (resp.success) {
            that.$notify.success('提交成功')
            that.dialogAutid = false
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('保存失败', resp))
        })
        that.onPresent(particularsObj)
      } else if (that.checkText === '撤回审核') {
        that.$http.fetch(that.$api.isv.auditingRevert, obj).then((resp) => {
          if (resp.success) {
            that.$notify.success('撤回成功')
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('保存失败', resp))
        })
      } else {
        that.shopKuhuShow = false
      }
    },
    onSaveDomainName (domainNameObj) { // 配置域名保存
      var that = this
      that.$http.fetch(that.$api.isv.setModifyDomain, domainNameObj).then((resp) => {
        if (resp.success) {
          that.$notify.success('配置域名保存成功')
          that.domainNameVisible = false
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onCodeTemplate (row) { // 代码模版点击按钮
      let that = this
      this.parameter.searchMap.appId = row.appid
      that.loadingTable = true
      that.newestDialog = true
      that.titleText = '小程序代码模板'
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCodeTemplateList, this.parameter).then((resp) => {
        that.modelArry = resp.result.data
        that.modelObj.latestAuditVersion = resp.result.latestAuditVersion
        that.loadingTable = false
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('请求失败', resp))
        that.loadingTable = false
      })
    },
    uploading (row) { // 上传
      var that = this
      that.newauthorization = true
      that.underReviewObj = Object.assign({}, row, { appId_array: '' })
      that.underReviewObj.appId_array = ''
      that.titleText = '模板上传'
    },
    affirmUploading () { // 上传代码模版
      var that = this
      var arry = []
      var parameter = {}
      that.updataText = '模版上传'
      if (that.underReviewObj.appId_array !== '') {
        arry = that.underReviewObj.appId_array.split(',')
      }
      if (arry.length - 1 > 8) {
        this.$confirm('需要跳转的小程序appId列表，最大输入9个', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {})
      } else {
        parameter.templateId = that.underReviewObj.template_id
        parameter.appId = that.underReviewObj.app_id
        parameter.appIdArray = that.underReviewObj.appId_array
        parameter.userDesc = that.underReviewObj.user_desc
        parameter.userVersion = that.underReviewObj.version
        that.$http.fetch(that.$api.isv.codeTemplateUpload, parameter).then(resp => {
          if (resp.success) {
            that.$notify.success('上传成功!')
            that.newauthorization = false
            that.parameter.searchMap.appId = that.underReviewObj.app_id
            that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCodeTemplateList, this.parameter).then((resp) => {
              that.modelArry = resp.result.data
              that.modelObj.latestAuditVersion = resp.result.latestAuditVersion
            }).catch((resp) => {
              that.$notify.error(getErrorMsg('请求失败', resp))
            })
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('上传失败', resp))
        })
      }
    },
    underReview (row) { // 审核中
      this.shopKuhuShow = true
      this.titleText = '模板详情'
      this.checkText = '撤回审核'
      this.templateForDetails(row)
    },
    auditSuccess (row) { // 审核成功
      this.shopKuhuShow = true
      this.titleText = '模板详情'
      this.titleText = '模板详情'
      this.checkText = '确认'
      this.templateForDetails(row)
    },
    submitted (row) { // 提交审核展示详情
      var that = this
      let obj = {}
      that.titleText = '提交审核'
      that.dialogAutid = true
      // obj.appId = 'wxa400d24181be6a12'
      obj.appId = row.app_id
      that.$http.fetch(that.$api.isv.wechatsettingGetAppletCategoryList, obj).then((resp) => { // 查询小程序可选类目
        resp.result.map((item, i) => {
          item.theSecond_class = item.first_class + '-' + item.second_class
        })
        that.submittedObj.categoryList = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('请求失败', resp))
      })
      that.$http.fetch(that.$api.isv.wechatsettingGetAppletPageList, obj).then((resp) => { // 查询小程序页面配置
        that.submittedObj.pageList = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('请求失败', resp))
      })
      that.submittedObj = row
    },
    auditFailure (row) { // 审核失败
      this.shopKuhuShow = true
      this.checkText = '重新提交审核'
      this.titleText = '模板详情'
      this.templateForDetails(row)
    },
    dialogDeleteTemplateShow (row) { // 删除代码模板弹窗
      this.dialogDeleteTemplate = true
      this.titleText = '小程序代码模板删除'
      this.deleteTemplateObj.templateId = row.template_id
      this.deleteTemplateObj.appId = row.app_id
    },
    deleteTemplate () { // 删除模板
      let that = this
      let obj = {}
      obj.templateId = this.deleteTemplateObj.templateId
      that.$http.fetch(that.$api.isv.deleteTemplate, obj).then((resp) => {
        if (resp.success) {
          this.parameter.searchMap.appId = this.deleteTemplateObj.appId
          that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCodeTemplateList, this.parameter).then(
            (resp) => { that.modelArry = resp.result.data }).catch((resp) => {
            that.$notify.error(getErrorMsg('请求失败', resp))
          })
          this.dialogDeleteTemplate = false
          that.$notify.success('删除成功')
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('请求失败', resp))
      })
    },
    newest () { // 同步最新
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCodeTemplateList, this.parameter).then((resp) => {
        if (resp.result !== null) {
          that.modelArry = resp.result.data
          that.$notify.success('更新成功')
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('请求失败', resp))
      })
    },
    domainName () { // 域名配置
      var that = this
      that.domainNameVisible = true
      that.titleText = '配置域名'
      that.$http.fetch(that.$api.isv.wechatsettingGetDomainInfo, this.parameter.searchMap).then((resp) => {
        that.domainNameObj = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    qrCode () { // 体验二维码
      var that = this
      that.titleText = '体验二维码'
      that.$http.fetch(that.$api.isv.getQrcode, this.parameter.searchMap).then((resp) => {
        that.img = 'data:image/png;base64,' + resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
      that.qrCodeShow = true
    },
    releaseParticulars (succeedObj) { // 发布详情点击事件
      this.shopKuhuShow = true
      this.checkText = '确认'
      this.titleText = '模板详情'
      this.templateForDetails(succeedObj)
    },
    release () { // 查询已成功的代码模板
      var that = this
      that.titleText = '发布代码'
      that.releaseShow = true
      that.$http.fetch(that.$api.isv.getAuthedAppletCodeTemplate, this.parameter.searchMap).then((resp) => {
        if (resp.result !== null) {
          that.succeedObj = resp.result
        } else {
          that.succeedObj = {}
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onToAuthorize () { // 授权威胁你小程序
      var that = this
      var tempPage = window.open('', ' _blank')
      that.$http.fetch(that.$api.guide.sgwxaccount.getAuthUrl).then((resp) => {
        tempPage.location = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onSaveOpen (row) { // 新增或编辑
      this.dialogFormVisible = true
      this.titleText = (row.id && '编辑') || '新增'
      this.model = Object.assign({}, row)
      if (this.titleText === '新增') {
        //  新增修改小程序来源为配置
        this.model.fromType = 0
      }
    },
    onAuthorization () {
      this.titleText = ''
      this.authorization = true
    },
    draftBox () {
      this.dialogVisible = true
    },
    onPresent (underReviewObj) { // 提交审核
      let that = this
      let obj = {}
      obj.categoryStr = {}
      underReviewObj.categoryList.map(item => {
        if (underReviewObj.firstId === item.first_id) {
          obj.categoryStr = item
        }
      })
      obj.appId = underReviewObj.app_id
      obj.pageStr = underReviewObj.secondId
      obj.tags = underReviewObj.appid
      obj.templateId = underReviewObj.template_id
      obj.title = underReviewObj.corpsecret
      that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, obj).then((resp) => {
        if (resp.success) {
          that.$notify.success('提交成功')
          that.dialogAutid = false
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onPublish (latestStatus) { // 发布小程序
      let that = this
      let obj = {}
      obj.appId = latestStatus.app_id
      this.$confirm('是否确认发布小程序', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.fetch(that.$api.guide.sgwxaccount.templateToRelease, obj).then((resp) => {
          if (resp.success) {
            that.$notify.success('发布成功')
            that.releaseShow = false
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('发布失败', resp))
        })
      })
    },
    onSave () { // 小程序保存功能
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.guide.sgwxaccount.save, that.model).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('保存成功')
            that.model = {}
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('保存失败', resp))
          })
        }
      })
    },
    onDelete (row) { // 小程序删除功能
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          let that = this
          that.$http.fetch(that.$api.guide.sgwxaccount.delete, { id: row.id }).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('删除成功')
            that.model = {}
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('删除失败', resp))
          })
        }).catch(() => {
        // 点击取消事件
        })
    },
    onRefresh (row) { // 小程序刷新功能
      let that = this
      let obj = {}
      obj.appId = row.appid
      this.$http.fetch(that.$api.guide.guide.refreshAuthedAppletInfo, obj).then(resp => {
        this.$notify.success(resp.msg)
      }).catch(resp => {
        this.$notify.error(getErrorMsg('刷新失败', resp))
      })
    },
    async templateForDetails (succeedObj) { // 模板详情
      let that = this
      let obj = {}
      obj.templateId = succeedObj.template_id
      obj.appId = succeedObj.app_id
      that.particularsObj = {}
      await this.$http
        .fetch(that.$api.isv.getTemplateInfo, obj)
        .then(resp => {
          resp.result.audit_category = JSON.parse(resp.result.audit_category)
          that.particularsObj = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    openDialog: function () {
      let that = this
      that.dialogVisible = true
      that.loadingTable = true
      that.$http.fetch(that.$api.isv.getTemplateDraftList)
        .then((resp) => {
          if (resp.result.length > 10) {
            that.tableList = resp.result.slice(-10)
          } else {
            that.tableList = resp.result
          }
          that.loadingTable = false
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('查询失败', resp))
          that.loadingTable = false
        })
    },
    addDraftToTemplate: function (draftId) {
      let that = this
      that.$http.fetch(that.$api.isv.addDraftToTemplate, { draftId: draftId })
        .then(() => {
          that.$notify.success('添加成功')
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('查询失败', resp))
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
      return this.$http.fetch(this.$api.isv.getAppletList, params).then((resp) => {
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
