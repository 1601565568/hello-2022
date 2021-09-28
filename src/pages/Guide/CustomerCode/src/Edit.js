import validates from './validates'
export default {
  data () {
    return {
      normalDesc: '你好， {EXTERNAL_CONTACT_NICK} , 我是{USER_NICK}恭喜你成功参与本次福利活动，分享下方海报，邀请好友扫码助力，添加{USER_NICK}为好友：邀请5位好友为你助力并添加好友，即可领取奖品！奖品限量100份，先到先得哦！\n活动有效期：2020-03-03~2020-03-13\n点击以下链接可查询助力进展哦！{PROMOTION_URL}\n注册会员也可享受会员专属礼哦\n点击立即入会：{RECRUIT_URL}\n快去分享你的专属海报 ↓↓',
      collapseList: [1, 2, 3, 4],
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
      // 是否是进行中的
      isStating: false,
      isSetPrize: true,
      isLoading: false,
      prizeModel: {}, // 奖品组件回显
      brandDialogVisible: false,
      popoverShow: false, // 查看示例tip
      eidtList: [
        { name: '裂变大师信息模块', hideImg: true, itemCode: 'masterInfo', isOpen: true },
        { name: 'banner模块', itemCode: 'banner', isOpen: true },
        { name: '倒计时模块', itemCode: 'countdown', isOpen: true },
        { name: '活动奖励模块', itemCode: 'reward', isOpen: true },
        { name: '成功邀请好友模块', itemCode: 'invitedFriend', isOpen: true },
        { name: '活动规则', itemCode: 'activityRule', isOpen: true },
        { name: '注册会员模块', itemCode: 'memberRegister', isOpen: true },
        { name: '分享按钮模块', hideImg: true, itemCode: 'shareButton', isOpen: true }
      ],
      editBaseList: [0, 1, 2, 3, 4, 5, 6, 7],
      draggableIcon:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/draggable.png',
      goodsName: '',
      goodsDes: '',
      goodsImage: '',
      defauletWelcome: `你好 , 我是<wise>员工微信昵称~</wise><br/>恭喜你成功参与本次福利活动，分享活动邀请好友扫码添加<wise>员工微信昵称~</wise>为好友<br/>邀请5位好友即可领取奖品！奖品限量100份，先到先得哦！<br/>活动有效期：<wise>活动有效时间</wise><br/>点击下方链接去分享吧 ↓↓`,
      pageObj: {
        headStyle: 0,
        bannerUrl: ''
      }
    }
  },
  computed: {
    welcomeInfo () {
      return this.$refs.tagAreaText.htmlToString(this.defauletWelcome)
    },
    editType () {
      return this.$route.query.guestCodeId ? '编辑' : '新建'
    },
    tools () {
      const tools = [
        { type: 'tag', text: '插入员工微信昵称', id: 'USER_NICK', value: '员工微信昵称' },
        { type: 'tag', text: '插入活动有效时间', id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
      ]

      // 按品牌运营
      // if (this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange === 1) {
      //   tools.push({ type: 'custom', text: `插入招募链接`, id: 'RECRUIT_URL', value: `招募链接`, callback: this.openBrandDialog.bind(this) })
      // } else {
      //   tools.push({ type: 'tag', text: '插入招募链接', id: 'RECRUIT_URL', value: '招募链接' })
      // }

      return tools
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
    } else {
      this.isLoading = true
    }
  },
  methods: {
    updateHeadImgStyle (index) {
      this.pageObj.headStyle = index
    },
    updateBannerUrl (url) {
      this.pageObj.bannerUrl = url
    },
    onclick (itemCode) {
      let event = window.event
      event.stopPropagation()
      this.onShowEdit(itemCode)
    },
    // 点击获取编辑模块
    onShowEdit (itemCode) {
      this.$emit('onShowEdit', itemCode)
    },
    formatSettingType (code) {
      let setComponent
      switch (code) {
        case 'masterInfo':
          setComponent = 'HeadImg'
          break
        case 'banner':
          setComponent = 'Banner'
          break
        case 'reward':
          setComponent = 'Active'
          break
        case 'activityRule':
          setComponent = 'Rules'
          break
        case 'shareButton':
          setComponent = 'Share'
          break
        case 'memberRegister':
          setComponent = 'Register'
          break
      }
      return setComponent
    },
    handleChangePopoverShow (popoverShow = !this.popoverShow) {
      this.popoverShow = popoverShow
    },
    /**
     * 打开选择品牌模态框
     */
    openBrandDialog (item) {
      this.brandDialogVisible = true
    },
    /**
     * 向tagArea文本框中插入品牌id
     * @param {string} barndId
     */
    insertBrandId (barndId) {
      this.$refs.tagAreaText.addTag({ id: `RECRUIT_URL?barndId=${barndId}`, value: '招募链接' })
    },
    // 获取详情
    loadActivity (guestCodeId) {
      this.customerLoading = true
      this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId }).then(res => {
        const { result } = res
        this.model = {
          ...this.model,
          activityDescription: result.activityDescription,
          activityIntroduction: this.$refs.tagAreaText.stringTohtml(result.activityIntroduction),
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
        prizeRuleList: result.prizeRuleList ? result.prizeRuleList.map((item) => {
          return {
            ...item,
            addPrizeNumber: item.addPrizeNumber ? item.addPrizeNumber : 0,
            validNumber: item.prizeValidSum, // 保存回显奖品剩余数量字段不一样
            uuid: this.copyGuestCodeId ? null : item.uuid
          }
        }) : [],
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
        activityIntroduction: this.$refs.tagAreaText.htmlToString(model.activityIntroduction),
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
          this.btnLoad = true
          if (!prizeModel) {
            this.btnLoad = false
            return false
          }
          const save = Object.assign(this.formatModel(), prizeModel)
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
      return html.replace(/<wise.*?\bclass="/g, '{').replace(/">.*?<\/wise>/g, '}').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
    },
    // 替换模板成标签
    stringTohtml (string) {
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '(\\?((&?\\w*=\\w*)+))?}', 'g')
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
    },
    handleSynch () {
      if (this.$refs.tagAreaText) {
        const text = this.$refs.tagAreaText.stringTohtml(this.normalDesc)
        this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerHTML = text
        this.$refs.tagAreaText.currentText = this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerText
        this.model.activityIntroduction = text
        this.handleChangePopoverShow(false)
      }
    }
  }
}
