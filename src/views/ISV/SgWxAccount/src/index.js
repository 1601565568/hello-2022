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
      pageList: [],
      categoryList: [],
      index: 0,
      appid: null,
      img: null,
      checkText: '',
      presentObj: {},
      underReviewObj: {},
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
        }],
        'request': [{required: true, message: '请输入request合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'socket': [{required: true, message: '请输入socket合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'upliadFile': [{required: true, message: '请输入uploadFile合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'downloadFile': [{required: true, message: '请输入downloadFile合法域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'webViewDomain': [{required: true, message: '请输入小程序业务域名'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '模版Id': [{required: true, message: '请输入模版Id'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '版本号': [{required: true, message: '请输入版本号'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '代码备注': [{required: true, message: '请输入代码备注'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('应用密钥长度不得超过50位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '自定义标签': [{required: true, message: '请输入自定义标签'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '可选类目': [{required: true, message: '请输入自定义标签'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '页面地址': [{required: true, message: '请输入页面地址'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        '页面标题': [{required: true, message: '请输入页面标题'}, {
          validator: (rule, value, callback) => {
            if (value && value.length > 50) {
              callback(new Error('小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20'))
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
    releaseUploading () {

    },
    categoryStore () {
      console.log('opoi')
    },
    pageStore () {
      console.log('opoi')
    },
    onSaveDomainName (underReviewObj) {
      var that = this
      that.$http.fetch(that.$api.isv.setModifyDomain, underReviewObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
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
            // that.parameter.searchMap.appId = that.underReviewObj.app_id
            // that.onCodeTemplate()
          }
        }).catch((resp) => {
          that.$notify.error(resp.msg || '上传失败')
        })
      }
    },
    underReview (row) { // 审核中
      var that = this
      that.obj.templateId = row.template_id
      that.obj.appId = row.app_id
      that.shopKuhuShow = true
      that.titleText = '模板详情'
      that.checkText = '确认'
      that.$http.fetch(that.$api.isv.getTemplateInfo, this.obj).then((resp) => {
        resp.result.audit_category = JSON.parse(resp.result.audit_category)
        that.underReviewObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    auditSuccess (row) { // 审核成功
      var that = this
      that.obj.templateId = row.template_id
      that.obj.appId = row.app_id
      that.shopKuhuShow = true
      that.titleText = '模板详情'
      that.$http.fetch(that.$api.isv.getTemplateInfo, this.obj).then((resp) => {
        resp.result.audit_category = JSON.parse(resp.result.audit_category)
        that.underReviewObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    published (row) { // 已发布
      console.log('3333')
    },
    submitted (row) { // 提交审核
      var that = this
      that.titleText = '提交审核'
      that.dialogAutid = true
      that.obj = row
      that.obj.appId = 'wxa400d24181be6a12'
      that.$http.fetch(that.$api.isv.wechatsettingGetAppletCategoryList, this.obj).then((resp) => { // 查询小程序可选类目
        // console.log('resp:', resp.result)
        resp.result.map(item => {
          item.first_class = item.first_class + '-' + item.second_class
        })
        that.categoryList = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
      that.$http.fetch(that.$api.isv.wechatsettingGetAppletPageList, this.obj).then((resp) => { // 查询小程序页面配置
        // console.log('resps:', resp.result)
        that.pageList = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })

      // that.$http.fetch(that.$api.isv.getAppletPageList, this.obj).then((resp) => {
      //   that.underReviewObj = resp.result
      // }).catch((resp) => {
      //   that.$notify.error(resp.msg || '保存失败')
      // })
    },
    auditFailure (row) { // 审核失败
      var that = this
      that.obj.templateId = row.template_id
      that.obj.appId = row.app_id
      that.checkText = '重新提交审核'
      that.shopKuhuShow = true
      that.$http.fetch(that.$api.isv.getTemplateInfo, this.obj).then((resp) => {
        resp.result.audit_category = JSON.parse(resp.result.audit_category)
        that.underReviewObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    newest () { // 同步最新
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.refreshCodeTemplate, this.parameter.searchMap).then((resp) => {
        console.log('resp:', resp.result)
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    domainName () { // 域名配置
      var that = this
      that.domainNameVisible = true
      that.titleText = '配置域名'
      that.$http.fetch(that.$api.isv.wechatsettingGetDomainInfo, this.parameter.searchMap).then((resp) => {
        that.underReviewObj = resp.result
        // that.img = resp.result
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
    releaseParticulars (id, templateId) {
      var that = this
      that.obj.templateId = templateId
      that.obj.appId = id
      that.shopKuhuShow = true
      that.titleText = '模板详情'
      that.underReviewObj = {}
      that.$http.fetch(that.$api.isv.getTemplateInfo, this.obj).then((resp) => {
        resp.result.audit_category = JSON.parse(resp.result.audit_category)
        that.underReviewObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '请求失败')
      })
    },
    release () { // 发布
      var that = this
      that.titleText = '发布代码'
      that.releaseShow = true
      that.$http.fetch(that.$api.isv.getAuthedAppletCodeTemplate, this.parameter.searchMap).then((resp) => {
        that.underReviewObj = resp.result
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })

      // that.$http.fetch(that.$api.isv.templateToRelease, this.parameter.searchMap).then((resp) => {
      //   console.log('resp:', resp.result)
      // }).catch((resp) => {
      //   that.$notify.error(resp.msg || '保存失败')
      // })
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
    onUpdate () {},
    onRelieve () {},
    // onAutid (appid) {
    //   var that = this
    //   that.presentObj.appId = appid
    //   that.dialogAutid = true
    //   that.titleText = '小程序可选类目'
    //   console.log('appid:', this.presentObj.appId)
    //   // 查询小程序可选类目
    //   that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCategoryList, that.presentObj).then((resp) => {
    //     console.log('查询小程序可选类目:', resp)
    //   }).catch((resp) => {
    //     that.$notify.error(resp.msg || '保存失败')
    //   })
    //   // 查询小程序页面配置
    //   that.$http.fetch(that.$api.guide.sgwxaccount.getAppletPageList, that.presentObj).then((resp) => {
    //     console.log('查询小程序页面配置:', resp)
    //   }).catch((resp) => {
    //     that.$notify.error(resp.msg || '保存失败')
    //   })
    // },
    onPresent () { // 提交审核
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, that.presentObj).then(() => {

      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
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
            that.$notify.error(resp.msg || '发布失败')
          })
        })
      } else if (latestStatus === 1 || latestStatus === 2 || latestStatus === 5) {
        this.$confirm('小程序版本尚未审核通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {})
      }
    },
    // async findShopList () { // 查询店铺
    //   await this.$http
    //     .fetch(this.$api.guide.shop.findBrandShopList)
    //     .then(resp => {
    //       this.shopArr = [...this.shopArr, ...resp.result]
    //       for (let i = 0; i < resp.result.length; i++) {
    //         this.shopMap[resp.result[i].id] = resp.result[i].shopName
    //       }
    //     })
    //     .catch(resp => {
    //       this.$notify.error('查询失败：')
    //     })
    // },
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
