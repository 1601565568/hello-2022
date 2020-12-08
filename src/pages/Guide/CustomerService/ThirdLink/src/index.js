const defaultData = {
  background: '',
  text: '',
  hotZoneData: [],
  textW: 188,
  textH: 100,
  textX: 67,
  textY: 349,
  fontColor: '#262626'
}
export default {
  data () {
    return {
      rules: {
        background: [
          { required: true, message: '请上传背景图', trigger: ['blur', 'change'] }
        ],
        text: [
          { required: true, message: '请填写提示文案', trigger: ['blur', 'change'] }
        ],
        fontColor: [
          { required: true, message: '请选择字体颜色', trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      model: { ...defaultData },
      hotList: [], // 热区列表
      hotVisible: false,
      disabled: false,
      platformList: [], // 所有平台列表
      platform: { // 当前选中的平台
        index: 0,
        name: '平台',
        type: ''
      },
      textLength: 0,
      validatesText: (length, rule, value, callback) => {
        if (length > 50) {
          callback(new Error(`提示文案最多50个字`))
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
      return [{ type: 'tag', text: `成功关联的${this.platform.name}账号`, id: 'PT_NAME', value: `${this.platform.name}账号` }]
    },
    htmlText () {
      return this.htmlToText(this.model.text)
    }
  },
  methods: {
    init () {
      this.getResultPageConfig()
    },
    getResultPageConfig () {
      this.$http.fetch(this.$api.guide.customerService.getResultPageConfig).then(res => {
        if (res.success) {
          if (res.result && res.result.length) {
            this.platformList = res.result
            const activeItem = this.platformList[this.platform.index]
            this.platform = {
              ...this.platformName,
              name: activeItem.platformName,
              type: activeItem.platform
            }
            this.model = this.formatModel(activeItem.bindResultPageJson)
          } else {
            this.$notify.error('暂无绑定平台')
            this.disabled = true
          }
        } else {
          this.$notify.error(res.msg)
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
        hotZoneData: data.hotZoneData,
        textW: data.textW,
        textH: data.textH,
        textX: data.textX,
        textY: data.textY,
        fontColor: data.fontColor
      }
    },
    onSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updateResultPageConfig()
        }
      })
    },
    updateResultPageConfig () {
      const parmas = {
        platform: this.platform.type,
        bindResultPageJson: JSON.stringify({ ...this.model,
          text: this.htmlToString(this.model.text)
        })
      }
      this.$http.fetch(this.$api.guide.customerService.updateResultPageConfig, parmas).then(res => {
        if (res.success) {
          this.$notify.success('保存成功')
        } else {
          this.$notify.error(res.msg)
        }
      }).catch(err => {
        this.$notify.error(err.msg)
      })
    },
    handleSetHot () {
      if (this.model.background) {
        this.hotVisible = true
      } else {
        this.$notify.error(`请上传背景图～`)
      }
    },
    handleCancel () {
      this.hotVisible = false
    },
    setHotData (data) {
      this.model.hotZoneData = data
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
      return newHtml.replace(/<wise.*?\bclass=".*?">/g, '').replace(/<\/wise>/g, '').substring(0, 50)
    }
  }
}
