import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import TagArea from '@/components/NewUi/TagArea'
import DrapUpload from '@/components/NewUi/DrapUpload'
import Tip from '../compontent/index.vue'
import ElUpload from '@nascent/nui/lib/upload'
export default {
  mixins: [scrollHeight],
  components: { TagArea, ElUpload, DrapUpload, Tip },
  data () {
    const pageUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入网页地址'))
      }
      const checkUrl = /^http[s]{0,1}:\/\/?/
      if (checkUrl.test(value)) {
        return callback()
      } else {
        return callback(new Error('网页地址格式错误,以http://或https://开头'))
      }
    }
    const validateActivityIntroduction = (length, rule, value, callback) => {
      if (length > 1000) {
        callback(new Error(`最多1000个字`))
      } else {
        callback()
      }
    }
    // 网页链接配置model
    const linkModel = {
      desc: '', // 文案
      link: '', // 链接
      title: '', // 标题
      image: '' // 图片
    }
    // 小程序实体model
    const appModel = {
      appid: '', // 小程序appid
      path: '', // 小程序路径
      title: '', // 标题
      image: '', // 封面
      originId: '' // 小程序原始id
    }
    return {
      loading: false,
      labelPosition: 'left',
      validates: { pageUrl, validateActivityIntroduction },
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 66
      },
      // value: true,
      pageUrlLength: 0,
      model: {
        memberShowSwitch: 0, // 发送招募链接开启关闭 1启用 0禁用
        recruitLinkType: 1, // 招募链接类型 1:系统预置链接 2:自定义链接"
        sysLink: '', // 选择系统链接地址
        linkType: 1, // 链接类型  1H5 2小程序
        linkModel: linkModel,
        appModel: appModel
      },
      rules: {
        sysLink: [{
          required: true, message: '请选择链接', trigger: ['blur', 'change']
        }],
        'linkModel.title': [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        'linkModel.desc': [
          { required: true, message: '请输入文案', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        'linkModel.image': [{
          required: true, message: '请上传图片', trigger: ['blur', 'change']
        }],
        'appModel.appid': [
          { required: true, message: '请输入小程序appId', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        'appModel.title': [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        'appModel.originId': [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        'appModel.path': [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] }
        ]
      },
      tools: [
        {
          type: 'tag',
          title: `{groupId}`,
          text: '集团ID',
          id: 'groupId',
          value: '集团ID'
        },
        {
          type: 'tag',
          title: `{userId}`,
          text: '好友userId',
          id: 'userId',
          value: '好友userId'
        },
        {
          type: 'tag',
          text: '导购userId',
          title: `{guideUserId}`,
          id: 'guideUserId',
          value: '导购userId'
        },
        {
          type: 'tag',
          text: '导购账号',
          title: `{guideAccount}`,
          id: 'guideAccount',
          value: '导购账号'
        },
        {
          type: 'tag',
          text: '导购工号',
          title: `{workNumber}`,
          id: 'workNumber',
          value: '导购工号'
        },
        {
          type: 'tag',
          text: '导购ID',
          title: `{guideId}`,
          id: 'guideId',
          value: '导购ID'
        },
        {
          type: 'tag',
          text: '员工工作门店',
          title: `{shopId}`,
          id: 'shopId',
          value: '员工工作门店'
        },
        {
          type: 'tag',
          text: '随机数标识',
          title: `{random}`,
          id: 'random',
          value: '随机数标识'
        },
        {
          type: 'tag',
          text: '时间戳',
          title: `{timestamp}`,
          id: 'timestamp',
          value: '时间戳'
        }
      ],
      presetLink: [], // 系统链接数组 // linkModelFileList: [],// appModelFileList: []
      radioBOX: process.env.VUE_APP_THEME,
      radio: 'radio',
      radioQA: 'radioQA',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'

    }
  },
  mounted () {
    this.getSystemPresetLink()
    // 加载页面设置函数
    let _this = this
    this.$http.fetch(this.$api.guide.notMemberSet.search).then(resp => {
      if (resp.success) {
        let result = resp.result
        _this.model.memberShowSwitch = result.member_show_switch === 1
        _this.model.recruitLinkType = result.recruit_link_type || 1
        _this.model.linkType = result.link_type || 1
        if (result.recruit_link_type === 1 && result.content) {
          let content = JSON.parse(result.content)
          _this.model.sysLink = content
        } else if (result.link_type && result.link_type === 1 && result.content) {
          let content = JSON.parse(result.content)
          // console.log(content)
          _this.model.linkModel.desc = content.desc // 文案
          _this.model.linkModel.link = this.stringTohtml(content.link) // 链接
          _this.model.linkModel.title = content.title // 标题
          _this.model.linkModel.image = content.image // 图片
          // this.linkModelFileList = [{ name: content.image }]
        } else if (result.link_type && result.link_type === 2 && result.content) {
          let content = JSON.parse(result.content)
          _this.model.appModel.appid = content.appid // 小程序appid
          _this.model.appModel.originId = content.originId // 小程序appid
          _this.model.appModel.path = this.stringTohtml(content.path) // 小程序路径
          _this.model.appModel.title = content.title // 标题
          _this.model.appModel.image = content.image // 封面
          // this.appModelFileList = [{ name: content.image }]
        }
      }
    })
  },
  methods: {
    /**
     * 获取系统预置链接
     */
    getSystemPresetLink: function () {
      this.$http.fetch(this.$api.guide.systemPreset.getLink, { type: 1 }).then(resp => {
        if (resp.success && resp.result != null) {
          this.presetLink = this.formatPresetLink(resp.result)
        }
      }).catch((err) => {
        this.$notify.error(err.msg || '系统预置链接失败')
      })
    },
    /**
     * 格式化系统预置链接
     * @param {Array} result
     * @return {Array}
     */
    formatPresetLink (result) {
      const arr = result || []
      return arr.map((item) => (
        {
          content: item.content,
          edit: item.edit,
          id: item.id,
          name: item.name,
          picture: item.picture,
          title: item.title,
          url: item.url
        }
      ))
    },
    /**
     * 图片上传的钩子函数
     * @param {*} file
     */
    beforeUpload (file) {
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      if (file.size / 1024 / 1024 > 1) {
        this.$notify.error('上传图片不能超过1M')
        return false
      }
      // this.appModelFileList = [file]
      // return true
    },
    /**
     * H5链接上传成功的钩子
     * @param {object} res
     */
    handleUploadSuccess (res) {
      this.model.linkModel.image = res.result.url
    },
    /**
    * 小程序上传成功的钩子
    * @param {object} res
    */
    handleSuccessUpload (res) {
      this.model.appModel.image = res.result.url
    },
    /**
     * H5链接移除钩子函数
     */
    handleRemove () {
      this.model.linkModel.image = ''
    },
    /**
    * 小程序链接移除钩子函数
    */
    handleRemoveApp () {
      this.model.appModel.image = ''
    },
    /**
     * H5配置链接长度判断
     * @param {number} length
     */
    inputLength (length) {
      this.pageUrlLength = length
      // if (this.pageUrlLength === 0) { return }
      // this.$refs.form && this.$refs.form.validateField('pageUrl')
    },
    /**
     * 替换标签成模板
     * @param {string} html // 配置的地址
     * @return {string} newHtml // 返回转换成功的地址
     */
    htmlToString (html) {
      let newHtml = html
        .replace(/<wise.*?\bclass="/g, '{')
        .replace(/">.*?<\/wise>/g, '}')
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        // newHtml = newHtml.replace(regexp, `${item.id}=\${${item.id}}`)
        newHtml = newHtml.replace(regexp, `{${item.id}}`)
      })
      return newHtml
    },
    /**
     * 替换模板成标签
     * @param {string} string // 模板
     * @return {string} html // 重新生成的标签
     */
    stringTohtml (string) {
      let html = string
      this.tools.map(item => {
        // const regexp = new RegExp(item.id + '=\\${' + item.id + '}', 'g')
        const regexp = new RegExp('{' + item.id + '}', 'g')
        html = html.replace(
          regexp,
          `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`
        )
      })
      return html
    },
    /**
     * 链接配置随机生成标识
     * @return {string} id // 生成随机ID
     */
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    handleBlur () {
      this.$refs.form && this.$refs.form.validateField('linkModel.link')
    },
    /**
     * 切换链接类型清除表单校验
     */
    handleChange () {
      this.$refs.form.clearValidate()
    },
    /**
     * 保存事件
     */
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http
            .fetch(this.$api.guide.notMemberSet.saveOrUpdate, this.formatParam())
            .then(resp => {
              if (resp.success) {
                this.loading = false
                this.$notify.success('保存成功')
              }
            })
            .catch(error => {
              this.loading = false
              this.$notify.error(error.msg)
            })
        }
      })
    },
    /**
     * 格式化数据
     * @return {*}
     */
    formatParam () {
      const model = this.model
      let content
      if (model.recruitLinkType === 1) {
        content = JSON.stringify(model.sysLink)
      } else {
        if (model.linkType === 1) {
          const { linkModel } = model
          const newModel = {
            ...linkModel,
            link: this.htmlToString(linkModel.link)
          }
          content = JSON.stringify(newModel)
        } else {
          const { appModel } = model
          const newModel = {
            ...appModel,
            path: this.htmlToString(appModel.path)
          }
          content = JSON.stringify(newModel)
        }
      }
      return {
        memberShowSwitch: model.memberShowSwitch ? 1 : 0,
        recruitLinkType: model.recruitLinkType,
        linkType: model.linkType,
        content: content
      }
    }
  }
}
