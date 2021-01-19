const defaultData = {
  title: '',
  background: '',
  type: 1,
  appId: '',
  text: '',
  textW: 172,
  appletPage: '',
  textX: 73,
  textY: 349,
  sceneStr: ''
}
export default {
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '请填写海报名称', trigger: ['blur', 'change'] },
          { validator: (rule, value, callback) => {
            if (value.length > 20) {
              callback(new Error('海报名称最多20个字'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'] }
        ],
        background: [
          { required: true, message: '请上传背景图', trigger: ['blur', 'change'] }
        ],
        text: [
          { required: true, message: '请填写提示文案', trigger: ['blur', 'change'] }
        ],
        appId: [
          { required: true, message: '请选择公众号', trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      model: { ...defaultData },
      disabled: false,
      weChatOfficialAccounts: [],
      textLength: 0,
      isStating: false,
      validatesText: (length, rule, value, callback) => {
        if (length > 64) {
          callback(new Error(`提示文案最多64个字`))
        } else {
          callback()
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    tools () {
      return [
        { type: 'tag', text: '集团ID', id: 'GROUP_ID', value: '集团ID' },
        { type: 'tag', text: '导购帐号', id: 'USER_ID', value: '导购帐号' },
        { type: 'tag', text: '插入推广大师查询链接', id: 'WECHAT_ID', value: '导购微信id' },
        { type: 'tag', text: '插入招募链接', id: 'ACCOUNT', value: '导购账号' },
        { type: 'tag', text: '插入活动有效时间', id: 'SHOP_ID', value: '员工工作门店' },
        { type: 'tag', text: '插入推广大师查询链接', id: 'OUTER_SHOP_ID', value: '员工工作门店（外部)' },
        { type: 'tag', text: '插入招募链接', id: 'GUIDE_ID', value: '员工ID' },
        { type: 'tag', text: '插入活动有效时间', id: 'EMPLOYEE_ID', value: '员工ID（外部）' }
      ]
    },
    htmlText () {
      return this.htmlToText(this.model.text)
    },
    editType () {
      return this.$route.query.guestCodeId ? '编辑' : '新建'
    }
  },
  methods: {
    init () {
      this.getWeChatOfficialAccounts()
      const { id } = this.$route.query
      if (id) {
        this.getResultPageConfig(id)
      }
    },
    // 请求公众号列表
    getWeChatOfficialAccounts () {
      this.$http.fetch(this.$api.guide.qrcodePoster.getWeChatOfficialAccounts).then(res => {
        if (res.success) {
          if (res.result && res.result.length) {
            this.weChatOfficialAccounts = res.result
          } else {
            this.$notify.error('暂无绑定公众号')
            this.disabled = true
          }
        } else {
          this.$notify.error(res.msg)
        }
      }).catch(err => {
        this.$notify.error(err.msg)
      })
    },
    getResultPageConfig (configId) {
      this.$http.fetch(this.$api.guide.qrcodePoster.getByConfigId, { configId }).then(res => {
        if (res.success) {
          const { result } = res
          this.model = {
            ...result,
            textW: result.qrcodeSize,
            textX: result.qrcodeX,
            textY: result.qrcodeY
          }
          console.log(this.model)
        }
      }).catch(err => {
        this.$notify.error(err.msg)
      })
    },
    formatModel (model) {
      const obj = model ? JSON.parse(model) : { ...defaultData }
      const data = typeof obj === 'object' ? obj : { ...defaultData }
      return {
        background: data.background,
        text: this.stringTohtml(data.text),
        textW: data.textW,
        textH: data.textH,
        textX: data.textX,
        textY: data.textY
      }
    },
    onSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updateResultPageConfig()
        }
      })
    },
    onCancel () {
      this.$router.go(-1)
    },
    updateResultPageConfig () {
      const parmas = {
        bindResultPageJson: JSON.stringify({ ...this.model,
          text: this.htmlToString(this.model.text)
        })
      }
      this.$http.fetch(this.$api.guide.customerService.updateResultPageConfig, parmas).then(res => {
        if (res.success) {
          this.$notify.success('保存成功')
          this.onCancel()
        } else {
          this.$notify.error(res.msg)
        }
      }).catch(err => {
        this.$notify.error(err.msg)
      })
    },
    onDragResize (data) {
      this.model = {
        ...this.model,
        textW: data.width,
        textH: data.height,
        textX: data.left,
        textY: data.top
      }
    },
    inputLength (length) {
      this.textLength = length
      this.$refs['form'] && this.$refs['form'].validateField('text')
    },
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    // 替换标签成模板
    htmlToString (html) {
      return html.replace(/<wise.*?\bclass="/g, '{').replace(/">.*?<\/wise>/g, '}')
    },
    // 替换模板成标签
    stringTohtml (string) {
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        string = string.replace(regexp, `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`)
      })
      return string
    },
    // 替换标签成文本
    htmlToText (html) {
      const newHtml = html
      return newHtml.replace(/<wise.*?\bclass=".*?">/g, '').replace(/<\/wise>/g, '').substring(0, 64)
    }
  }
}
