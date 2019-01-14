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
      obj: {
        appId: null,
        templateId: null
      },
      releaseObj: {}, // 发布代码模板对象
      particularsObj: {}, // 模板详情对象
      domainNameObj: {}, // 域名配置对象
      uploadingObj: {}, // 代码模板上传对象
      succeedObj: {}, // 查询已成功模板对象
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
        secondId: null
      },
      shopManager_radio: '1',
      shoppingGuide_radio: '0',
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
        'secret': [{required: true, message: '请输入应用密钥'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'appid': [
          {
            required: true,
            message: '请输入请输入应用ID'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 50) {
                callback(new Error(''))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
      },
      checkRules: {
        'template_id': [
          {
            required: true,
            message: '请输入模版Id'
          },
          {
            validator: (rule, value, callback) => {
              console.log(rule, value)
              if (value && value.length > 50) {
                callback(new Error(''))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        'appid': [
          {
            required: true,
            message: '请输入自定义标签'
          },
          {
            validator: (rule, value, callback) => {
              console.log(rule, value)
              if (value && value.length > 50) {
                callback(new Error('小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }],
        'firstId': [
          {
            required: true,
            message: '请输入可选类目'
          }
        ],
        'secondId': [
          {
            required: true,
            message: '请选择页面地址'
          }
        ],
        'corpsecret': [
          {
            required: true,
            message: '请输入页面标题'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 50) {
                callback(new Error('请输入页面标题'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
      },
      domainNameRules: {
        'request_domain': [{required: true, message: '请输入request合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'ws_request_domain': [{required: true, message: '请输入socket合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'upload_domain': [{required: true, message: '请输入uploadFile合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'download_domain': [{required: true, message: '请输入downloadFile合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      },
      businessRules: {
        'webview_domain': [{required: true, message: '请输入小程序业务域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      },
      uploadingRules: {
        'template_id': [{required: true, message: '请输入模版Id'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'version': [{required: true, message: '请输入版本号'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'user_desc': [{required: true, message: '请输入代码备注'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error(''))
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
    uploadAgain (particularsObj) { // 重新提交审核
      let that = this
      let obj = {}
      obj.appId = particularsObj.app_id
      obj.templateId = particularsObj.template_id
      if (that.checkText === '重新提交审核') {
        this.onPresent(particularsObj)
      } else if (that.checkText === '撤回审核') {
        that.$http.fetch(that.$api.isv.auditingRevert, obj).then((resp) => {
          if (resp.success) {
            that.$notify.success('撤回成功')
          }
        }).catch((resp) => {
          that.$notify.error(resp.msg || '保存失败')
        })
      } else {
        that.shopKuhuShow = false
      }
    },
    onSaveDomainName (domainNameObj) { // 配置域名保存
      var that = this
      that.$http.fetch(that.$api.isv.setModifyDomain, domainNameObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    shopManager () { // 店长勾选
      this.shopManager_radio = '1'
      this.shoppingGuide_radio = '0'
    },
    shoppingGuide () { // 导购勾选
      this.shopManager_radio = '0'
      this.shoppingGuide_radio = '1'
    },
    onCodeTemplate (row) { // 代码模版点击按钮
      var that = this
      this.parameter.searchMap.appId = row.appid
      this.newestDialog = true
      that.titleText = '小程序代码模板'
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCodeTemplateList, this.parameter).then((resp) => {
        that.modelArry = resp.result.data
        that.modelObj.latestAuditVersion = resp.result.latestAuditVersion
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    uploading (row) { // 上传
      var that = this
      that.newauthorization = true
      that.underReviewObj = row
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
            // that.parameter.searchMap.appId = that.underReviewObj.app_id
            // that.onCodeTemplate()
          }
        }).catch((resp) => {
          that.$notify.error(resp.msg || '上传失败')
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
          // if (i === 0) {
          //   that.submittedObj.firstId = item.first_id
          // }
        })
        that.submittedObj.categoryList = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
      that.$http.fetch(that.$api.isv.wechatsettingGetAppletPageList, obj).then((resp) => { // 查询小程序页面配置
        that.submittedObj.pageList = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
      that.submittedObj = row
      console.log('row:', row)
    },
    auditFailure (row) { // 审核失败
      this.shopKuhuShow = true
      this.checkText = '重新提交审核'
      this.titleText = '模板详情'
      this.templateForDetails(row)
    },
    newest () { // 同步最新
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.refreshCodeTemplate, this.parameter.searchMap).then((resp) => {
        if (resp.result !== null) {
          that.modelArry = resp.result.data
        } else {
          that.$notify.success('更新成功')
        }
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    domainName () { // 域名配置
      var that = this
      that.domainNameVisible = true
      that.titleText = '配置域名'
      that.$http.fetch(that.$api.isv.wechatsettingGetDomainInfo, this.parameter.searchMap).then((resp) => {
        that.domainNameObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    qrCode () { // 体验二维码
      var that = this
      that.titleText = '体验二维码'
      that.$http.fetch(that.$api.isv.getQrcode, this.parameter.searchMap).then((resp) => {
        that.img = 'data:image/png;base64,' + resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
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
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    onToAuthorize () { // 授权威胁你小程序
      var that = this
      var tempPage = window.open('', ' _blank')
      that.$http.fetch(that.$api.guide.sgwxaccount.getAuthUrl).then((resp) => {
        tempPage.location = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    onSaveOpen (row) { // 新增或编辑
      // var that = this
      this.shopManager_radio = '1'
      this.shoppingGuide_radio = '0'
      this.dialogFormVisible = true
      this.titleText = (row.id && '编辑') || '新增'
      this.model = row
      // if (row.wx_status === 1) {
      //   this.dialogFormVisible = true
      //   this.titleText = (row.id && '编辑') || '新增'
      //   this.model = row
      // } else {
      //   this.miniProgram = true
      //   this.obj.appId = row.appid
      //   this.$http.fetch(that.$api.guide.sgwxaccount.getAppletInfo, this.obj).then((resp) => {
      //     this.appObj = resp
      //   }).catch((resp) => {
      //     that.$notify.error(resp.msg || '请求失败')
      //   })
      // }
    },
    onAuthorization () {
      this.authorization = true
    },
    onPresent (underReviewObj) { // 提交审核
      let that = this
      let obj = {}
      obj.appId = underReviewObj.app_id
      obj.pageStr = underReviewObj.secondId
      obj.tags = underReviewObj.appid
      obj.templateId = underReviewObj.template_id
      obj.title = underReviewObj.corpsecret
      obj.categoryStr = {}
      underReviewObj.categoryList.map(item => {
        if (item.first_id === underReviewObj.firstId) {
          obj.categoryStr.first_class = item.first_class
          obj.categoryStr.first_id = item.first_id
          obj.categoryStr.second_class = item.second_class
          obj.categoryStr.second_id = item.second_id
        }
      })
      that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, obj).then((resp) => {
        if (resp.success) {
          that.$notify.success('提交成功')
          that.dialogAutid = false
        }
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
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
          that.$notify.error(resp.msg || '发布失败')
        })
      })
    },
    onSave () {
      let that = this
      that.shopManager_radio === '1' ? that.model.type = 1 : that.model.type = 0
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
          console.log('kjlkjkl:', that.particularsObj)
        })
        .catch(resp => {
          this.$notify.error(resp.msg || '查询失败')
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
