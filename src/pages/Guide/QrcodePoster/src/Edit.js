const defaultData = {
  configId: null,
  title: '', // 海报名称
  background: '', // 海报背景图
  type: 1, // 二维码类型
  appId: '', // 公众号
  textW: 172, // 二维码尺寸
  appletPage: '', //
  textX: 73, // 二维码x轴
  textY: 349, // 二维码y轴
  sceneStr: '' // 占位符
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
      },
      isQY: true, // 是否是企微
      isLoading: false,
      brandDialogVisible: false, // 选择品牌模态框
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  mounted () {
    // 根据旅游判断个号还是导购
    this.isQY = this.$route.path.indexOf('QrcodePosterGH') === -1
    this.init()
  },
  computed: {
    tools () {
      const tools = [
        { type: 'tag', text: '集团ID', id: 'GROUP_ID', value: '集团ID' },
        { type: 'tag', text: '员工工作门店', id: 'SHOP_ID', value: '员工工作门店' },
        // { type: 'tag', text: '员工工作门店（外部)', id: 'OUTER_SHOP_ID', value: '员工工作门店（外部)' },
        { type: 'tag', text: '员工ID', id: 'GUIDE_ID', value: '员工ID' },
        { type: 'tag', text: '员工ID（外部)', id: 'EMPLOYEE_ID', value: '员工ID（外部)' },
        { type: 'tag', text: '导购账号', id: 'ACCOUNT', value: '导购账号' }
      ]
      if (this.isQY) {
        tools.push({ type: 'tag', text: '导购userid', id: 'USER_ID', value: '导购userid' })
      } else {
        tools.push({ type: 'tag', text: '导购微信ID', id: 'WECHAT_ID', value: '导购微信ID' })
      }

      // 按品牌运营
      if (this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange === 1) {
        tools.push({ type: 'custom', text: `品牌id`, id: 'BRAND_ID', value: `品牌id`, callback: this.openBrandDialog.bind(this) })
      }

      return tools
    },
    htmlText () {
      return this.htmlToText(this.model.sceneStr)
    },
    editType () {
      return this.$route.query.id ? '编辑' : '新建'
    }
  },
  methods: {
    init () {
      this.getWeChatOfficialAccounts()
      const { id } = this.$route.query
      if (id) {
        this.getResultPageConfig(id)
      } else {
        this.isLoading = true
      }
    },
    /**
     * 打开选择品牌模态框
     */
    openBrandDialog () {
      this.brandDialogVisible = true
    },
    /**
     * 向tagArea文本框中插入品牌id
     * @param {string} barndId
     */
    insertBrandId (barndId) {
      this.$refs.tagAreaText.addText(barndId)
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
    // 请求页面数据
    getResultPageConfig (configId) {
      this.$http.fetch(this.$api.guide.qrcodePoster.getByConfigId, { configId }).then(res => {
        if (res.success) {
          const { result } = res
          this.model = {
            ...result,
            textW: result.qrcodeSize,
            textX: result.qrcodeX,
            textY: result.qrcodeY,
            sceneStr: this.stringTohtml(result.sceneStr)
          }
          this.$nextTick(() => {
            this.isLoading = true
          })
        }
      }).catch(err => {
        this.$notify.error(err.msg)
      })
    },
    // 提交保存前格式化数据
    formatModel (model) {
      const data = model
      return {
        configId: data.id,
        appId: data.appId,
        background: data.background,
        qrcodeSize: data.textW,
        qrcodeX: data.textX,
        qrcodeY: data.textY,
        title: data.title,
        type: data.type,
        appletPage: data.appletPage,
        sceneStr: this.htmlToString(data.sceneStr)
      }
    },
    // 保存校验
    onSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveOrUpdate()
        }
      })
    },
    onCancel () {
      this.$router.go(-1)
    },
    // 保存请求接口
    saveOrUpdate () {
      this.btnLoad = true
      const parmas = this.formatModel(this.model)
      this.btnLoad = false
      this.$http.fetch(this.$api.guide.qrcodePoster.saveOrUpdate, parmas).then(res => {
        if (res.success) {
          this.$notify.success('保存成功')
          this.onCancel()
        } else {
          this.$notify.error(res.msg)
        }
        this.btnLoad = false
      }).catch(err => {
        this.btnLoad = false
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
      return html.replace(/<wise.*?\bclass="/g, '{').replace(/">.*?<\/wise>/g, '}').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
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
      return newHtml.replace(/<wise.*?\bclass=".*?">/g, '').replace(/<\/wise>/g, '').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '').substring(0, 64)
    }
  }
}
