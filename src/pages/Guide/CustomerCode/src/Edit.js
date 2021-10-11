import validates from './validates'
import { formatePageObj, formatModel, formatCustomComponent, formatPrizeModel } from '../util/Edit'
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
        activityDescription: '活动说明', // 活动说明
        activityIntroduction: '', // 活动介绍
        backgroundPic: '', // 一客一码背景图片
        cardCopywriting: '', // 活动消息卡片文案
        cardCoverPic: '', // 活动消息卡片封面图片
        cardTitle: '', // 活动消息卡片标题
        effectiveCycle: 1, // 一客一码有效周期-天（过期时间）
        guideIds: [], // 使用导购ids
        guideDatas: [],
        headPortrait: 1, // 用户头像：0无，1有
        headPortraitShape: 1, // 用户头像形状：0圆 1方
        name: '', // 一客一码活动名称
        nick: 0, // 用户昵称：0无，1有
        nickColour: '#262626', // 用户昵称字体颜色：十六进制
        nickSize: 0, // 用户昵称字体大小
        qrcodeSize: 172, // 二维码大小
        qrcodeX: 74, // 二维码X轴坐标值
        qrcodeY: 349, // 二维码Y轴坐标值
        validTimeType: 1, // 有效时间类型 0永久有效，1固定范围
        pageColor: '#FF544E,#FF8C5C,#FFFFFF', // 活动页面配色方案
        pageDecoration: '', // 裂变大师活动页面装修配置
        prizeStatus: '', // 奖励机制启用状态：0 关闭 1开启
        guestCodeId: '', // 一客一码活动ID
        headPortraitCoordinateX: '', // 用户头像坐标X轴
        headPortraitCoordinateY: '', // 用户头像坐标Y轴
        headPortraitSize: '', // 用户头像大小
        nickCoordinateX: '', // 用户昵称坐标X轴
        nickCoordinateY: '', // 用户昵称坐标Y轴
        nickPosition: '', // 昵称位置：0居中、1居左
        prizeSendPlan: 1, // 奖品发放方案：0：不发放；1：普通奖励（只能领取一个）
        prizeRuleList: [], // 奖励规则集，奖励机制启用后，该值不能为空
        validTimeEnd: '', // 活动有效时间结束
        validTimeStart: '' // 活动有效时间结束
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
        cardTitle: [
          { required: true, trigger: ['blur', 'change'], message: '请输入活动消息卡片标题' },
          { validator: validates.validateCard, trigger: ['blur', 'change'] }
        ],
        cardCopywriting: [
          { required: true, trigger: ['blur', 'change'], message: '请输入活动消息卡片文案' },
          { validator: validates.validateString, trigger: ['blur', 'change'] }
        ],
        cardCoverPic: [
          { required: true, trigger: ['blur', 'change'], message: '请选择活动消息卡片封面图片' }
        ],
        backgroundPic: [
          { required: true, trigger: ['blur', 'change'], message: '请上传裂变大师海报' }
        ],
        activityIntroduction: [
          { required: true, message: '请输入欢迎语', trigger: ['blur', 'change'] },
          { validator: validates.validateActivityDescription.bind(this, '活动说明'), trigger: ['blur', 'change'] }
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
      editBaseList: [0, 1, 2, 3, 4, 5, 6, 7],
      draggableIcon:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/draggable.png',
      defauletWelcome: `你好 , 我是{USER_NICK}<br/>恭喜你成功参与本次福利活动，分享活动邀请好友扫码添加{USER_NICK}为好友<br/>邀请5位好友即可领取奖品！奖品限量100份，先到先得哦！<br/>活动有效期：{ACTIVITY_VALIT_TIME}<br/>点击下方链接去分享吧 ↓↓`,
      pageObj: {
        headStyle: 1,
        bannerUrl: '',
        activeInfo: {
          image: '',
          number: 0,
          getColor: '',
          goodsName: '',
          goodsDes: ''
        },
        rules: '',
        regUrl: '',
        share: {
          color: '',
          name: '立即分享'
        },
        mainColor: ''
      },
      showColor: {},
      eidtList: [
        { itemName: '裂变大师信息模块', hideImg: true, itemCode: 'masterInfo', status: 1, value: {}, sortable: 0, switchable: 0 },
        { itemName: 'banner模块', itemCode: 'banner', status: 1, value: {}, sortable: 1, switchable: 1 },
        { itemName: '倒计时模块', itemCode: 'countdown', status: 1, value: {}, sortable: 2, switchable: 1 },
        { itemName: '活动奖励模块', itemCode: 'reward', status: 1, value: {}, sortable: 3, switchable: 1 },
        { itemName: '成功邀请好友模块', itemCode: 'invitedFriend', status: 1, value: {}, sortable: 4, switchable: 1 },
        { itemName: '活动规则', itemCode: 'activityRule', status: 1, value: {}, sortable: 5, switchable: 1 },
        { itemName: '注册会员模块', itemCode: 'memberRegister', status: 1, value: {}, sortable: 6, switchable: 1 },
        { itemName: '分享按钮模块', hideImg: true, itemCode: 'shareButton', status: 1, value: {}, sortable: 7, switchable: 0 }
      ],
      isEdit: false,
      ieEditCount: 0
    }
  },
  watch: {
    showColor: {
      handler (newValue, oldValue) {
        if (this.isEdit && this.ieEditCount === 1) {
          this.ieEditCount = 2
          return
        }
        this.pageObj.activeInfo.getColor = newValue.mainColor
        this.pageObj.share.color = newValue.mainColor
        this.pageObj.mainColor = newValue.mainColor
      },
      deep: true
    }
  },
  computed: {
    editType () {
      return this.$route.query.guestCodeId ? '编辑' : '新建'
    },
    tools () {
      const tools = [
        { type: 'tag', text: '插入员工微信昵称', id: 'USER_NICK', value: '员工微信昵称' },
        { type: 'tag', text: '插入活动有效时间', id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
      ]
      return tools
    }
  },
  mounted () {
    const query = this.$route.query
    const { guestCodeId, copyGuestCodeId } = query
    this.guestCodeId = guestCodeId
    this.copyGuestCodeId = copyGuestCodeId
    if (guestCodeId || copyGuestCodeId) {
      this.isEdit = true
      this.ieEditCount = 1
      this.loadActivity(guestCodeId || copyGuestCodeId)
      this.getGuideListByGuestCodeId(guestCodeId || copyGuestCodeId)
    } else {
      this.isEdit = false
      this.isLoading = true
      this.model.activityIntroduction = this.$refs.tagAreaText.stringTohtml(this.defauletWelcome)
      const colors = this.model.pageColor.split(',')
      this.showColor = {
        mainColor: colors[0],
        bgColor: colors[1],
        strColor: colors[2]
      }
    }
  },
  methods: {
    inputEffectiveCycle (e) {
      this.model.effectiveCycle = e.target.value.replace(/[^\d]/g, '')
    },
    showDefaultText () {
      const str = this.$refs.tagAreaText.stringTohtml(this.defauletWelcome)
      this.model.activityIntroduction = this.$refs.tagAreaText.stringTohtml(str)
      this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerHTML = str
    },
    scrollPhone (name) {
      this.$refs.activePhone.acScrollPhone(name)
    },
    updateActiveModel (obj) {
      this.model.prizeRuleList = obj.prizeRuleList
      this.model.prizeSendPlan = obj.prizeSendPlan
    },
    onclick (itemCode) {
      let event = window.event
      event.stopPropagation()
      this.onShowEdit(itemCode)
    },
    // 点击获取编辑模块
    onShowEdit (itemCode) {
      if (itemCode === 'countdown' || itemCode === 'reward') {
        this.$refs.activePhone.acScrollPhone('time-view')
      }
      if (itemCode === 'banner') {
        this.$refs.activePhone.acScrollPhone('banner-view')
      }
      if (itemCode === 'invitedFriend') {
        this.$refs.activePhone.acScrollPhone('friends-view')
      }
      if (itemCode === 'memberRegister') {
        this.$refs.activePhone.acScrollPhone('register-view')
      }
      if (itemCode === 'activityRule') {
        this.$refs.activePhone.acScrollPhone('rules-view')
      }
      this.$emit('onShowEdit', itemCode)
    },
    formatSettingType (code) {
      return formatCustomComponent(code)
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
    async loadActivity (guestCodeId) {
      this.customerLoading = true
      const json = await this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId })
      if (!json.success) return
      const result = json.result
      this.model = { ...this.model, ...result }
      this.model.time = [result.validTimeStart, result.validTimeEnd]
      // this.model = {
      //   ...this.model,
      //   activityDescription: result.activityDescription,
      //   // activityIntroduction: this.$refs.tagAreaText.stringTohtml(result.activityIntroduction),
      //   backgroundPic: result.backgroundPic,
      //   effectiveCycle: result.effectiveCycle,
      //   headPortrait: result.headPortrait,
      //   name: result.name,
      //   nickColour: result.nickColour,
      //   qrcodeSize: result.qrcodeSize,
      //   qrcodeX: result.qrcodeX,
      //   headerType: result.nickPosition,
      //   headPortraitShape: result.headPortraitShape,
      //   qrcodeY: result.qrcodeY,
      //   time: [result.validTimeStart, result.validTimeEnd],
      //   validTimeType: 0,
      //   cardTitle: result.cardTitle,
      //   cardCoverPic: result.cardCoverPic,
      //   cardCopywriting: result.cardCopywriting,
      //   pageColor: result.pageColor,
      //   prizeSendPlan: result.prizeSendPlan
      // }
      // // 数据解析
      const colors = this.model.pageColor.split(',')
      this.showColor = {
        mainColor: colors[0],
        bgColor: colors[1],
        strColor: colors[2]
      }
      const pageDecoration = JSON.parse(result.pageDecoration)
      if (Array.isArray(pageDecoration)) {
        this.eidtList = pageDecoration || []
      }
      this.prizeModel = formatPrizeModel(result, this.copyGuestCodeId)
      this.customerLoading = false
      this.isStating = !!(result.status === 2 && this.guestCodeId)
      // 是否可以在未开始活动编辑奖励
      this.isSetPrize = !!(result.status === 1 && this.guestCodeId)
      // this.fileList = [{ name: result.backgroundPic }]
      this.pageObj = { ...formatePageObj(this.eidtList, this.prizeModel) }
      this.$nextTick(() => {
        this.isLoading = true
        if (this.$refs.colorView) {
          this.$refs.colorView.selctColor(this.showColor)
        }
        if (this.$refs.tagAreaText) {
          this.model.activityIntroduction = this.$refs.tagAreaText.stringTohtml(result.activityIntroduction)
        }
      })
    },
    // formatPrizeModel (result) {
    //   this.prizeModel = {
    //     prizeStatus: result.prizeStatus === 1,
    //     prizeRuleList: result.prizeRuleList ? result.prizeRuleList.map((item) => {
    //       return {
    //         ...item,
    //         addPrizeNumber: item.addPrizeNumber ? item.addPrizeNumber : 0,
    //         validNumber: item.prizeValidSum, // 保存回显奖品剩余数量字段不一样
    //         uuid: this.copyGuestCodeId ? null : item.uuid
    //       }
    //     }) : [],
    //     prizeSendPlan: result.prizeSendPlan
    //   }
    // },
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
    // beforeUpload (file) {
    //   // this.fileList = [file]
    //   // 图片格式判断
    //   if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
    //     this.$notify.error('仅支持jpg/jpeg/png的图片格式')
    //     return false
    //   }
    //   if (file.size / 1024 / 1024 > 1) {
    //     this.$notify.error('上传图片不能超过1M')
    //     return false
    //   }
    //   return new Promise((resolve, reject) => {
    //     const _URL = window.URL || window.webkitURL
    //     const img = new Image()
    //     img.src = _URL.createObjectURL(file)
    //     img.onload = () => {
    //       let valid = img.width === 750 && img.height === 1334
    //       if (valid) {
    //         this.fileList = [file]
    //         resolve(file)
    //       } else {
    //         this.fileList = [...this.fileList]
    //         this.$notify.error('上传图片尺寸只能是750X1334')
    //       }
    //     }
    //   })
    // },
    // 上传完成钩子
    // handleUploadSuccess (res) {
    //   this.model.backgroundPic = res.result.url
    // },
    // 删除文件钩子
    // handleRemove () {
    //   this.model.backgroundPic = ''
    // },
    // 拖动二维码
    onDragResize (params) {
      this.model = { ...this.model,
        qrcodeSize: params.width,
        qrcodeX: params.left,
        qrcodeY: params.top
      }
    },
    // // 格式化上传数据
    // formatModel (model = this.model) {
    //   const newModel = {
    //     activityDescription: model.activityDescription,
    //     activityIntroduction: this.$refs.tagAreaText.htmlToString(model.activityIntroduction),
    //     backgroundPic: model.backgroundPic,
    //     effectiveCycle: model.effectiveCycle,
    //     guestCodeId: this.$route.query.guestCodeId || null,
    //     guideIds: model.guideIds,
    //     headPortrait: model.headPortrait * 1,
    //     headPortraitShape: model.headPortraitShape,
    //     name: model.name,
    //     nick: model.headPortrait * 1,
    //     nickColour: model.nickColour.split('#')[1],
    //     nickSize: 14,
    //     qrcodeSize: model.qrcodeSize,
    //     qrcodeX: model.qrcodeX,
    //     qrcodeY: model.qrcodeY,
    //     validTimeStart: model.time[0],
    //     validTimeEnd: model.time[1],
    //     validTimeType: model.validTimeType
    //   }
    //   const headPosition = this.headPosition[model.headerType]
    //   return { ...newModel, ...headPosition }
    // },
    // 保存
    async handleSave () {
      const ruleForm = new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
      const ruleForm2 = new Promise((resolve, reject) => {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
      const ruleForm3 = new Promise((resolve, reject) => {
        this.$refs.ruleForm3.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
      const ruleForm4 = this.$refs.componentList[2].validateRules()
      const ruleForm5 = this.$refs.componentList[3].validateRules()
      this.model = formatModel(this.model, this.eidtList, this.pageObj, this.showColor)
      if (!this.model.name) {
        this.$notify.error('请输入活动名称')
        return
      }
      if (this.model.guideIds.length === 0) {
        this.$notify.error('请选择参加活动人员')
        return
      }
      if (this.model.validTimeType === 1 && this.model.time.length === 0) {
        this.$notify.error('请选择有效日期')
        return
      }
      if (Number(this.model.effectiveCycle) <= 0) {
        this.$notify.error('请填写过期时间')
        return
      }
      if (!this.model.backgroundPic) {
        this.$notify.error('请上传裂变大师海报')
        return
      }
      if (!this.model.activityIntroduction) {
        this.$notify.error('请输入欢迎语')
        return
      }
      if (!this.model.cardTitle) {
        this.$notify.error('请输入活动消息卡片标题')
        return
      }
      if (!this.model.cardCopywriting) {
        this.$notify.error('请输入活动消息卡片文案')
        return
      }
      if (!this.model.cardCoverPic) {
        this.$notify.error('请选择活动消息卡片封面图片')
        return
      }
      let prizeRuleListObj = this.model.prizeRuleList[0] || {}
      if (!prizeRuleListObj.prizeType) {
        this.$notify.error('请选择奖励类型')
        return
      }
      if (!prizeRuleListObj.prizeId) {
        this.$notify.error('请选择奖励内容')
        return
      }
      if (!prizeRuleListObj.prizeNumber) {
        this.$notify.error('请设置活动奖励总数')
        return
      }
      const activeItem = this.eidtList[3]
      if (activeItem.status === 1 && !this.isEdit) {
        if (!this.pageObj.activeInfo.goodsName) {
          this.$notify.error('请输入奖品名称')
          return
        }
        if (!this.pageObj.activeInfo.goodsDes) {
          this.$notify.error('请输入奖品简介')
          return
        }
      }
      const rulesItem = this.eidtList[5]
      if (rulesItem.status === 1) {
        if (!this.pageObj.rules) {
          this.$notify.error('请输入活动规则')
          return
        }
      }
      const checks = await Promise.all([ruleForm, ruleForm2, ruleForm3, ruleForm4, ruleForm5])
      if (checks.length === 5) {
        // this.model = formatModel(this.model, this.eidtList, this.pageObj, this.showColor)
        this.model.guestCodeId = this.$route.query.guestCodeId || null
        this.model.activityIntroduction = this.$refs.tagAreaText.htmlToString(this.model.activityIntroduction)
        const headPosition = this.headPosition[this.model.headerType]
        const data = { ...this.model, ...headPosition }
        this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, data).then(res => {
          this.$notify.success('保存成功')
          this.handleCancel()
        }).catch(res => {
          this.$notify.error(res.msg)
        }).finally(res => {
          // this.btnLoad = false
        })
      }

      // this.$refs.ruleForm.validate(async (valid) => {
      //   if (valid) {
      //     const prizeModel = await this.$refs.setPrize.onSave()
      //     this.btnLoad = true
      //     if (!prizeModel) {
      //       this.btnLoad = false
      //       return false
      //     }
      //     const save = Object.assign(this.formatModel(), prizeModel)
      //     this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, save).then(res => {
      //       this.$notify.success('保存成功')
      //       this.handleCancel()
      //     }).catch(res => {
      //       this.$notify.error(res.msg)
      //     }).finally(res => {
      //       this.btnLoad = false
      //     })
      //   }
      // })
    },
    // // 替换标签成模板
    // htmlToString (html) {
    //   return html.replace(/<wise.*?\bclass="/g, '{').replace(/">.*?<\/wise>/g, '}').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
    // },
    // // 替换模板成标签
    // stringTohtml (string) {
    //   this.tools.map(item => {
    //     const regexp = new RegExp('{' + item.id + '(\\?((&?\\w*=\\w*)+))?}', 'g')
    //     string = string.replace(regexp, `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`)
    //   })
    //   return string
    // },
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
