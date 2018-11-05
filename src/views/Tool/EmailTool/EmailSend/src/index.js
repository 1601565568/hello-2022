import formMixin from 'mixins/form' // 引入表单验证的一些相关方法
// 校验规则
var mixin = {
  data: function () {
    let that = this
    return {
      rules: {
        send_name: [{
          required: true,
          message: '请输入发件人名称,限4-50个字',
          trigger: ['blur', 'change']
        }, {
          min: 4,
          max: 50,
          message: '限4-50个字',
          trigger: ['blur', 'change']
        }],
        send_addr: [
          { required: true, message: '请输入发件人邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] },
          {
            min: 0,
            max: 200,
            message: '已超过可输入长度',
            trigger: ['blur', 'change']
          }],
        targetStr: [{
          required: true,
          message: '请输入收件人邮箱地址',
          trigger: ['blur', 'change']
        }, {
          min: 0,
          max: 10000,
          message: '已超过可输入长度',
          trigger: ['blur', 'change']
        }, {

          validator: function (rule, val, callback) {
            // 邮件格式正则
            // var myreg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
            val = val.replace(/；/g, '\\;')
            var emails = val
            if (emails.length === 0) {
              callback(new Error('请输入收件邮箱地址'))
            }
            var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
            // var repaceReg = /（;\n）|（\n;）|（\n）|（;）|（；）|（；\n）/g
            emails = emails.replace(repaceReg, ';').replace(';;', ';')
            var emailsArray = emails.split(';')
            var result = []
            var targetStr = ''
            for (var i = 0; i < emailsArray.length; i++) {
              emailsArray[i] = emailsArray[i].replace(/\s/ig, '')// 去掉所有字符串中空格
              // 下面那行match中的内容为正则表达式，用于验证邮箱
              if (emailsArray[i] !== '' && emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                if (that.inArray(emailsArray[i], result)) {
                  callback(new Error('邮箱地址出现重复'))
                } else {
                  if (emailsArray[i].length > 320) {
                    callback(new Error('单个邮箱地址超过320个字符，请核实'))
                  } else {
                    result.push(emailsArray[i])
                    targetStr += emailsArray[i] + ','
                  }
                }
              }
              if (emailsArray[i] !== '' && !emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                callback(new Error('邮箱地址格式不正确'))
              }
            }
            that.model.target = targetStr.substring(0, targetStr.length - 1)
            if (result.length > 100) {
              callback(new Error('每次限发100封邮件'))
            }
            callback()
          },
          trigger: ['blur']
        }],
        title_name: [{
          required: true,
          message: '请输入邮件标题',
          trigger: ['blur', 'change']
        }, {
          min: 0,
          max: 200,
          message: '已超过可输入长度',
          trigger: ['blur', 'change']
        }],
        editor: [
          {required: true, message: '请输入邮件内容，限制10000字', trigger: ['blur']},
          {min: 1, max: 10007, message: '已超过可输入长度', trigger: ['blur', 'change']}
        ],
        sp_id: [{
          required: true,
          message: '请选择邮件通道',
          trigger: ['blur', 'change']
        }],
        content: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              // callback(new Error('请输入邮件内容'));
              callback()
            } else {
              callback()
            }
          }
        }]

      }
    }
  },
  methods: {
    inArray: function (val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          return true
        }
      }
      return false
    },
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.model.editor) // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.model.editor = this.editorInstance.getContent()
      })
    },
    // 发送邮件
    onSendEmail: function (data) {
      var that = this
      that.$refs.sendEmailForm.validate(function (valid) {
        if (valid) {
          var content = that.model.editor
          // 本方法发送的是营销模板，只有富文本框内容
          var templateContent = {
            'CustomDefinitionText': '',
            'CustomDefinition': content,
            'TemplateType': 1, // 此页面只有这种类型，特殊处置
            'itemIds': ''
          }
          templateContent = JSON.stringify(templateContent)
          that.model.email_content = templateContent
          var data = that.model
          that.$nextTick(function () {
            this.$http.fetch(this.$api.touch.emailSend.emailSend, data)
              .then(resp => {
                if (resp.success === true) {
                  this.$notify.success('发送成功')
                  this.resetForm()
                } else {
                  that.$notify.error(resp.msg)
                }
              }).catch(() => {
              }).finally(() => {
              })
          })
        } else {
          return false
        }
      })
    },
    resetForm: function () {
      var that = this
      that.editorInstance.setContent('')
      that.model.template_id = ''
      that.$refs.sendEmailForm.resetFields()
      that.model.send_name = this.defaultSendName
      that.model.send_addr = this.defaultSendAddr
      that.model.sp_id = this.defaultSpId
    }
  }
}// 校验规则
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      saveType: '', // 保存类型
      saveDisabled: false, // 是否禁止保存（即只可弹窗）
      loading: false, //
      defaultSendName: '',
      defaultSendAddr: '',
      defaultSpId: '',
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '80%',
        serverUrl: ''
      },
      model: {
        // 所需数据组合成一个model
        id: 0,
        sp_id: '',
        editor: ''
      }
    }
  },
  watch: {
    'model.template_id': function (value) {
      var that = this
      if (value !== '' && value !== null && value !== undefined) {
        that.$http.fetch(that.$api.touch.emailTemplate.queryById, {id: value})
          .then((resp) => {
            var content
            // that.model.template_type = resp.result.template_type
            that.model.title_name = resp.result.template_title
            var template = JSON.parse(resp.result.template)
            that.model.topText = template.CustomDefinitionText
            that.model.items = JSON.parse(template.itemIds)
            content = template.CustomDefinition === '' ? '' : template.CustomDefinition
            that.model.editor = content
          }).catch(() => {
          })
      } else {
        that.model.title_name = ''
        that.model.editor = ''
      }
    }
  },
  created: function () {
  }, // 初始化页面的时候加载内容
  mounted: function () {
    var that = this
    that.$nextTick(function () {
      let limitHeight = window.innerHeight - 96
      this.$refs.emailSendHeight.$el.children[0].style.maxHeight = limitHeight + 'px'
      that.$http.fetch(that.$api.touch.emailSend.getSendEmailInitInfo)
        .then(resp => {
          if (resp) {
            that.defaultSendName = resp.result.sendName
            that.defaultSendAddr = resp.result.sendAddr
            if (resp.result.defaultChannelId) {
              that.defaultSpId = resp.result.defaultChannelId
              that.defaultSpId = resp.result.defaultChannelId
            } else {
              that.defaultSpId = ''
              that.model.sp_id = ''
            }
            that.model.send_name = resp.result.sendName
            that.model.send_addr = resp.result.sendAddr
          }
        }).catch(() => {
        }).finally(() => {
          this.$refs.sendEmailForm.clearValidate()
        })
    })
  }
}
