import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'

var mixin = {
  data: function () {
    return {
      rules: {
        template_title: [
          { required: true, message: '请输入邮件标题，限制2-30字', trigger: ['blur', 'change'] },
          { min: 2, max: 30, message: '限2-30个字', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (this.model.template_type !== '') {
                var that = this
                var id = 0
                if (typeof (that.model.id) !== 'undefined') {
                  id = that.model.id
                }
                this.$http.fetch(that.$api.touch.emailTemplate.hasTitleExist, { templateTitle: that.model.template_title, templateType: that.model.template_type, id: id
                }).then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此模板已存在，请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
              } else {
                callback()
              }
            },
            trigger: ['blur']
          }
        ],
        topText: [
          { min: 0, max: 500, message: '已超过可输入长度', trigger: ['blur', 'change'] },
          { validator: function (rule, val, callback) {
            if (vue.model.template_type === 1 || vue.model.template_type === 16 || vue.model.template_type === 13 || vue.model.template_type === 18) {
              callback()
            } else {
              if (val === '') {
                callback(new Error('请输入邮件头部自定义内容,限500字以内'))
              } else {
                callback()
              }
            }
          },
          trigger: ['blur', 'change']
          }],
        editor: [
          { required: true, message: '请输入邮件内容，限制10000字', trigger: ['blur', 'change'] },
          { min: 1, max: 10007, message: '已超过可输入长度', trigger: ['blur', 'change'] }
        ],
        senderEmail: [
          { min: 1, max: 320, message: '已超过可输入长度', trigger: ['blur', 'change'] },
          {
            validator: function (rule, val, callback) {
              var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+(com|cn)$/)
              if (vue.isValidate === false) {
                callback()
              } else {
                if (val === '') {
                  callback(new Error('请输入邮箱地址'))
                } else if (!patten.test(val)) {
                  callback(new Error('请输入正确的邮箱地址'))
                } else {
                  callback()
                }
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        channel: [
          {
            validator: function (rule, val, callback) {
              if (vue.isValidate === false) {
                callback()
              } else {
                if (val === '') {
                  callback(new Error('请选择通道'))
                } else {
                  callback()
                }
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        template_type: [{
          required: true,
          message: '请选择模板类型',
          trigger: ['blur', 'change']
        }, {
          validator: (rule, value, callback) => {
            if (this.model.template_title !== '') {
              var that = this
              var id = 0
              if (typeof (that.model.id) !== 'undefined') {
                id = that.model.id
              }
              this.$http.fetch(that.$api.touch.smsTemplate.hasTitleExist, { templateTitle: that.model.template_title, templateType: that.model.template_type, id: id
              }).then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此模板已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
            } else {
              callback()
            }
          },
          trigger: ['blur']
        }]
      }
    }
  },
  methods: {
    getCommandTips (type) {
      var str
      switch (type) {
        case 2:
          str = '下单关怀模板'
          break
        case 3:
          str = '催付模板'
          break
        case 4:
          str = '付款关怀模板'
          break
        case 5:
          str = '发货提醒模板'
          break
        case 6:
          str = '物流跟踪模板'
          break
        case 7:
          str = '签收关怀模板'
          break
        case 8:
          str = '确认关怀模板'
          break
        case 10:
          str = '退款关怀模板'
          break
        case 13:
          str = '积分触发模板'
          break
        case 14:
          str = '升级提醒模板'
          break
        case 15:
          str = '生日祝福模板'
          break
        case 16:
          str = '节日关怀模板'
          break
        case 18:
          str = '入会关怀模板'
          break
        default:
          str = '营销模板'
      }
      return str
    },
    urlValidator: function (rule, val, callback) {
      // /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/
      if (vue.model.template_type === 0) {
        callback()
      } else {
        if (val === '' || val === undefined) {
          callback(new Error('请输入商品购买地址'))
        } else if (!reg.test(val)) {
          callback(new Error('请输入正确的购买地址'))
        } else {
          callback()
        }
      }
    },
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.model.editor) // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.model.editor = this.editorInstance.getContent()
      })
    },
    /**
     * 重置
     */
    resetEmailForm: function () {
      // 首次打开未初始化
      if (this.$refs.emailform && this.$refs.emailform.resetFields instanceof Function) {
        // this.$refs.form.resetFields();
      }
    },
    // 表单初始化
    initEmailForm: function () {
      this.model = {
        id: 0,
        source_model: 35,
        template_title: '',
        template_type: 1,
        topText: '',
        templateText: '',
        channel: '',
        senderEmail: '',
        editor: '',
        items: []
      }
    },
    onShow: function () {
      this.$refs.goods.onShow()
    },
    // 新增邮件模板
    onAddEmail: function () {
      this.initEmailForm()
      this.title = '新增邮件模板'
      this.mailtemplateformvisible = true
      this.initChannel()
    },
    // 点击邮件模板标签占位符添加到标题；
    titleTagClick: function (val) {
      this.model.template_title += val
    },
    contentTagClick: function (val) {
      this.model.editor += val
    },
    /**
     * 邮件模板选中改变时触发
     * @param val
     */
    // 测试发送邮件通道下拉框切换
    changeSenderTestEmail: function (val) {
    },
    // 表单回显选中的商品
    callback: function (opts) {
      this.model.items = []
      var goods = opts.goods
      for (var i = 0; i < goods.length; i++) {
        this.model.items.push({
          'id': goods[i].id,
          'title': goods[i].title,
          'price': goods[i].price,
          'imgUrl': goods[i].pictureUrl,
          'buyUrl': ''
        })
      }
    },
    // 删除选中商品
    delGoods: function (data) {
      var arr = this.model.items
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === data) {
          arr.splice(i, 1)
        }
      }
      // this.$refs.goods.deleteGoods(data)
    },
    // 邮件模板信息修改
    onEditEmail: function (data) {
      this.initEmailForm()
      this.title = '修改邮件模板'
      var that = this
      vue.isValidate = true
      that.mailtemplateformvisible = true
      that.$nextTick(function () {
        this.$http.fetch(this.$api.touch.emailTemplate.queryById, { id: data.id })
          .then((resp) => {
            var content
            that.model.id = resp.result.id
            that.model.template_type = resp.result.template_type
            that.model.template_title = resp.result.template_title
            var template = JSON.parse(resp.result.template)
            that.model.topText = template.CustomDefinitionText
            if (template.itemIds) {
              that.model.items = JSON.parse(template.itemIds)
            } else {
              that.model.items = []
            }
            content = template.CustomDefinition === '' ? '' : template.CustomDefinition
            that.model.editor = content
          }).catch(() => {

          }).finally(() => {
            this.loading = false
            this.mailtemplateformvisible = true
          })
      })
    },
    transGoodsData (data) {
      let transData = {}
      transData.sysGoodsId = data.sysGoodsId
      transData.picture_url = data.picture_url
      transData.price = data.price
      transData.title = data.title
      return transData
    },
    // 发送测试邮件
    onSendTestEmail: function () {
      var that = this
      that.$refs.emailform.validate(function (valid) {
        if (valid) {
          if (that.model.channel === '') {
            that.$notify.error('通道不能为空')
            return
          }
          if (that.model.senderEmail === '') {
            that.$notify.error('邮箱不能为空')
            return
          }
          var templateText = that.model.editor
          var sendEmail = that.model.senderEmail
          var topText = that.model.topText
          var spId = that.model.channel
          var templateTitle = that.model.template_title
          var items = that.model.items
          var templateContent = {
            'CustomDefinitionText': topText,
            'CustomDefinition': templateText,
            'TemplateType': that.model.template_type,
            'itemIds': JSON.stringify(items)
          }
          templateContent = JSON.stringify(templateContent)
          // 发送测试邮件数据
          var emailSend = {
            'spId': spId,
            'content': templateContent,
            'templateTitle': templateTitle,
            'sendEmail': sendEmail,
            'templateType': that.model.template_type
          }

          that.$nextTick(function () {
            this.$http.fetch(this.$api.touch.emailTemplate.emailSend, emailSend)
              .then((resp) => {
                if (resp.success === true) {
                  that.$notify.success('测试邮件发送成功')
                } else {
                  that.$notify.error(resp.msg)
                }
              })
          })
          // that.$message.success('主题：' + emailSend.templateTitle + '测试邮件发送成功')
        } else {
          return false
        }
      })
    },

    // 邮件模板弹窗保存
    onSave: function () {
      this.isValidate = false
      var that = this
      // that.saveDisabled = true
      that.$refs.emailform.validate(function (valid) {
        if (valid) {
          var templateType = that.model.template_type
          var templateTitle = that.model.template_title
          var id = that.model.id
          /* 邮件模板内容拼接 */
          var topText = that.model.topText
          var templateText = that.model.editor
          var items = that.model.items
          var templateContent = {
            'CustomDefinitionText': topText,
            'CustomDefinition': templateText,
            'TemplateType': that.model.template_type,
            'itemIds': JSON.stringify(items)
          }
          var model = {
            id: id,
            template_type: templateType,
            template_title: templateTitle,
            marketing_manner: 1,
            template: JSON.stringify(templateContent)
          }
          that.$nextTick(function () {
            this.$http.fetch(this.$api.touch.emailTemplate.saveOrUpdateTemplate, model).then(resp => {
              if (resp.success === true) {
                that.$notify.success(resp.msg)
                that.$refs.emailTemplateTable.$reload()
                that.mailtemplateformvisible = false
              } else {
                that.$notify.error(resp.msg)
              }
            }).catch(() => {
              that.$notify.error('网络异常，保存失败！')
            }).finally(() => {
              // that.saveDisabled = false
            })
          })
        } else {
          return false
        }
      })
    },

    // 邮件模板弹窗关闭
    onCloseEmailDialog: function () {
      this.initEmailForm()
      this.mailtemplateformvisible = false
      this.editorInstance.setContent('')
      this.$refs.emailform.resetFields()
    },
    initChannel: function () {
      var that = this
      that.$nextTick(function () {
        that.$http.fetch(that.$api.touch.ysChannel.getDefaultEmailChannel)
          .then(resp => {
            this.model.channel = resp.result.id
          }).catch(() => {
          }).finally(() => {
          })
      })
    },
    handleClick: function (tab, event) {
      // var num = tab.index
      // var statusNum = ''
      // statusNum = '邮件模板'
      this.$refs.emailTemplateTable.$search({
        searchMap: {
          marketing_manner$EQ: 1
        }
      })
    }

  }
}// 校验规则
var vue
export default {
  mixins: [formMixin, mixin],
  data: function () {
    return {
      goods: [],
      template: 'template',
      title: '',
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        serverUrl: ''
      },
      mailtemplateformvisible: false,
      isValidate: false,
      model: {
        id: 0,
        template_title: '',
        template_type: 0,
        topText: '',
        templateText: '',
        channel: '',
        senderEmail: '',
        editor: '',
        items: [{
          buyUrl: ''
        }]
      },
      editorInstance: {},
      fullTitleTags: [{
        key: '{Nick}',
        text: '昵称'
      }, {
        key: '{Name}',
        text: '姓名'
      }, {
        key: '{TradeId}',
        text: '订单编号'
      }],
      halfTitleTags: [{
        key: '{Nick}',
        text: '昵称'
      }, {
        key: '{Name}',
        text: '姓名'
      }],
      miniTitleTags: [{
        key: '{Name}',
        text: '姓名'
      }],
      fullContentTags: [{
        key: '{Name}',
        text: '姓名'
      }, {
        key: '<a style="text-decoration: underline;" href="{$PLUGINLINK=unsubscribe}" target="email" data-mce-href="{$PLUGINLINK=unsubscribe}" data-mce-style="text-decoration: underline;">点击退订</a>',
        text: '退订'
      }],
      miniContentTags: [{
        key: '{Name}',
        text: '姓名'
      }]
    }
  },
  created: function () {
    vue = this
  }// 初始化页面的时候加载内容

}
