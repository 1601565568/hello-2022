import validates from './validates'
export default {
  data () {
    return {
      collapseList: [1, 2],
      guestCodeId: null,
      copyGuestCodeId: null,
      model: {
        headerType: 0,
        time: [],
        activityDescription: '',
        activityIntroduction: '',
        backgroundPic: '',
        effectiveCycle: 1,
        guideIds: [],
        guideDatas: [],
        headPortrait: true,
        headPortraitShape: 1,
        name: '',
        nick: 0,
        nickColour: '#262626',
        nickSize: 0,
        qrcodeSize: 172,
        qrcodeX: 74,
        qrcodeY: 349,
        validTimeEnd: '',
        validTimeStart: '',
        validTimeType: 1
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { validator: validates.validateName, trigger: ['blur', 'change'] }
        ],
        guideIds: [
          { required: true, message: '请选择参与人员', trigger: ['blur', 'change'] },
          { validator: validates.validateName, message: '请选择参与人员', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
        ],
        activityDescription: [
          { required: true, message: '请输入活动说明', trigger: ['blur', 'change'] },
          { validator: validates.validateActivityDescription.bind(this, '活动说明'), trigger: ['blur', 'change'] }
        ],
        activityIntroduction: [
          { required: true, message: '请输入活动介绍', trigger: ['blur', 'change'] },
          { validator: validates.validateActivityDescription.bind(this, '活动说明'), trigger: ['blur', 'change'] }
        ],
        backgroundPic: [
          { required: true, message: '请选择图片', trigger: ['blur', 'change'] }
        ],
        effectiveCycle: [
          { required: true, message: '请填写过期时间', trigger: ['blur', 'change'] }
        ]
      },
      // 用户信息排列方式
      headPosition: {
        // 竖排
        0: {
          headPortraitCoordinateX: 136,
          headPortraitCoordinateY: 40,
          headPortraitSize: 48,
          nickCoordinateX: 0,
          nickCoordinateY: 104,
          nickPosition: 0
        },
        // 横排
        1: {
          headPortraitCoordinateX: 24,
          headPortraitCoordinateY: 40,
          headPortraitSize: 48,
          nickCoordinateX: 88,
          nickCoordinateY: 53,
          nickPosition: 1
        }
      },
      // 员工请求参数
      employeePage: {
        start: 0,
        length: 200
      },
      fileList: [],
      btnLoad: false,
      tools: [
        { type: 'tag', text: '插入好友微信昵称', id: 'EXTERNAL_CONTACT_NICK', value: '好友微信昵称' },
        { type: 'tag', text: '插入员工微信昵称', id: 'USER_NICK', value: '员工微信昵称' },
        { type: 'tag', text: '插入推广大师查询链接', id: 'PROMOTION_URL', value: '推广大师查询链接' },
        { type: 'tag', text: '插入招募链接', id: 'RECRUIT_URL', value: '招募链接' },
        { type: 'tag', text: '插入活动有效时间', id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
      ]
    }
  },
  computed: {
    editType () {
      return this.$route.query.guestCodeId ? '编辑' : '新建'
    }
  },
  mounted () {
    const query = this.$route.query
    const { guestCodeId, copyGuestCodeId } = query
    if (guestCodeId || copyGuestCodeId) {
      this.loadActivity(guestCodeId || copyGuestCodeId)
      if (guestCodeId) {
        this.getGuideListByGuestCodeId(guestCodeId)
      }
    }
    this.guestCodeId = guestCodeId
    this.copyGuestCodeId = copyGuestCodeId
  },
  methods: {
    // 获取详情
    loadActivity (guestCodeId) {
      this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId }).then(res => {
        const { result } = res
        this.model = {
          ...this.model,
          activityDescription: result.activityDescription,
          activityIntroduction: this.stringTohtml(result.activityIntroduction),
          backgroundPic: result.backgroundPic,
          effectiveCycle: result.effectiveCycle,
          headPortrait: !!result.headPortrait,
          name: result.name,
          nickColour: '#' + result.nickColour,
          qrcodeSize: result.qrcodeSize,
          qrcodeX: result.qrcodeX,
          qrcodeY: result.qrcodeY,
          time: [result.validTimeStart, result.validTimeEnd],
          validTimeType: result.validTimeType
        }
        this.fileList = [{ name: result.backgroundPic }]
      })
    },
    // 获取员工详情
    getGuideListByGuestCodeId (guestCodeId) {
      const { start, length } = this.employeePage
      this.$http.fetch(this.$api.guide.customerCode.findGuideList, { start, length, searchMap: { guestCodeId } }).then(res => {
        const { result } = res
        this.employeePage.start += this.employeePage.length
        this.model.guideDatas.push(...result.data)
        this.model.guideIds.push(...result.data.map(item => item.guideId))
      })
    },
    handleChangeGuide (value) {
      this.model.guideDatas = value
    },
    // 删除所选员工
    handleDelect (index) {
      this.model.guideDatas.splice(index, 1)
      this.model.guideIds.splice(index, 1)
    },
    // 上传之前钩子
    beforeUpload (file) {
      this.fileList = [file]
    },
    // 上传完成钩子
    handleUploadSuccess (res) {
      this.model.backgroundPic = res.result.url
    },
    // 删除文件钩子
    handleRemove () {
      this.model.backgroundPic = ''
    },
    // 拖动二维码
    onDragResize (params) {
      this.model = { ...this.model,
        qrcodeSize: params.width,
        qrcodeX: params.left,
        qrcodeY: params.top
      }
    },
    // 格式化上传数据
    formatModel (model = this.model) {
      const newModel = {
        activityDescription: model.activityDescription,
        activityIntroduction: this.htmlToString(model.activityIntroduction),
        backgroundPic: model.backgroundPic,
        effectiveCycle: model.effectiveCycle,
        guestCodeId: this.$route.query.guestCodeId || null,
        guideIds: model.guideIds,
        headPortrait: model.headPortrait * 1,
        headPortraitShape: model.headPortraitShape,
        name: model.name,
        nick: model.headPortrait * 1,
        nickColour: model.nickColour.split('#')[1],
        nickSize: 14,
        qrcodeSize: model.qrcodeSize,
        qrcodeX: model.qrcodeX,
        qrcodeY: model.qrcodeY,
        validTimeStart: model.time[0],
        validTimeEnd: model.time[1],
        validTimeType: model.validTimeType
      }
      const headPosition = this.headPosition[model.headerType]
      return { ...newModel, ...headPosition }
    },
    // 保存
    handleSave () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnLoad = true
          this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, this.formatModel()).then(res => {
            this.$notify.success('保存成功')
            this.handleCancel()
          }).catch(res => {
            this.$notify.error(res.msg)
          }).finally(res => {
            this.btnLoad = false
          })
        }
      })
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
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    handleCancel () {
      this.$router.go('-1')
    }
  }
}
