import validates from './validates'
export default {
  data () {
    return {
      collapseList: [1, 2, 3],
      customerLoading: false,
      guestCodeId: null,
      copyGuestCodeId: null,
      activityIntroductionLength: 0,
      validates,
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
          { required: true, message: '请选择参加活动人员', trigger: ['blur', 'change'] },
          { validator: validates.validateGuideIds, message: '请选择参加活动人员', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
        ],
        activityDescription: [
          { required: true, message: '请填写活动说明', trigger: ['blur', 'change'] },
          { validator: validates.validateActivityDescription.bind(this, '活动说明'), trigger: ['blur', 'change'] }
        ],
        // activityIntroduction: [
        //   { required: true, message: '请输入活动介绍', trigger: ['blur', 'change'] },
        //   { validator: validates.validateActivityIntroduction.bind(this, this.activityIntroductionLength), trigger: ['blur', 'change'] }
        // ],
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
        { type: 'tag', text: '插入裂变大师查询链接', id: 'PROMOTION_URL', value: '裂变大师查询链接' },
        { type: 'tag', text: '插入招募链接', id: 'RECRUIT_URL', value: '招募链接' },
        { type: 'tag', text: '插入活动有效时间', id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
      ],
      // 是否是进行中的
      isStating: false,
      isSetPrize: true,
      isLoading: false,
      prizeModel: {} // 奖品组件回显
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
    this.guestCodeId = guestCodeId
    this.copyGuestCodeId = copyGuestCodeId
    if (guestCodeId || copyGuestCodeId) {
      this.loadActivity(guestCodeId || copyGuestCodeId)
      this.getGuideListByGuestCodeId(guestCodeId || copyGuestCodeId)
      // if (guestCodeId) {

      // }
    } else {
      this.isLoading = true
    }
  },
  methods: {
    // 获取详情
    loadActivity (guestCodeId) {
      this.customerLoading = true
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
          headerType: result.nickPosition,
          headPortraitShape: result.headPortraitShape,
          qrcodeY: result.qrcodeY,
          time: [result.validTimeStart, result.validTimeEnd],
          validTimeType: result.validTimeType
        }
        this.formatPrizeModel(result)
        this.customerLoading = false
        this.isStating = !!(result.status === 2 && this.guestCodeId)
        // 是否可以在未开始活动编辑奖励
        this.isSetPrize = !!(result.status === 1 && this.guestCodeId)
        this.fileList = [{ name: result.backgroundPic }]
        this.$nextTick(() => {
          this.isLoading = true
        })
      })
    },
    formatPrizeModel (result) {
      this.prizeModel = {
        prizeStatus: result.prizeStatus === 1,
        prizeRuleList: result.prizeRuleList.map((item) => {
          return {
            ...item,
            addPrizeNumber: item.addPrizeNumber ? item.addPrizeNumber : 0,
            validNumber: item.prizeValidSum, // 保存回显奖品剩余数量字段不一样
            uuid: this.copyGuestCodeId ? null : item.uuid
          }
        }) || [],
        prizeSendPlan: result.prizeSendPlan
      }
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
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    // 删除所选员工
    handleDelect (index) {
      this.model.guideDatas.splice(index, 1)
      this.model.guideIds.splice(index, 1)
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    // 删除所有员工
    handleDelectAll () {
      this.model.guideIds = []
      this.model.guideDatas = []
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('guideIds')
    },
    // 上传之前钩子
    beforeUpload (file) {
      // this.fileList = [file]
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      if (file.size / 1024 / 1024 > 1) {
        this.$notify.error('上传图片不能超过1M')
        return false
      }
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = () => {
          let valid = img.width === 750 && img.height === 1334
          if (valid) {
            this.fileList = [file]
            resolve(file)
          } else {
            this.fileList = [...this.fileList]
            this.$notify.error('上传图片尺寸只能是750X1334')
          }
        }
      })
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
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const prizeModel = await this.$refs.setPrize.onSave()
          // this.btnLoad = true
          if (!prizeModel) {
            this.btnLoad = false
            return false
          }
          // console.log('prizeModel', prizeModel)
          const save = Object.assign(this.formatModel(), prizeModel)
          // console.log(save)
          this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, save).then(res => {
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
    },
    inputLength (length) {
      this.activityIntroductionLength = length
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('activityIntroduction')
    }
  }
}
