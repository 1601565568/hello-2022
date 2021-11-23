import validates from './validates'
import { formatePageObj, formatModel, formatCustomComponent, formatPrizeModel, formatModelSave, RichText, defBanner, defGoodsUrl, defRegUrl, defPosters, defCardImg } from '../util/Edit'
import { EDIT_DATA, DEFAULT_DATA } from './const'
import moment from 'moment'
export default {
  data () {
    const validTimeEndFunc = (rule, value, callback) => {
      const isBefore = moment(this.model.validTimeEnd).isBefore(this.model.validTimeStart)
      const isSame = moment(this.model.validTimeEnd).isSame(this.model.validTimeStart)
      if (isBefore || isSame) {
        callback(new Error('结束时间不能大于等于开始时间'))
      } else {
        callback()
      }
    }
    return {
      normalDesc: '你好， {EXTERNAL_CONTACT_NICK} , 我是{USER_NICK}恭喜你成功参与本次福利活动，分享下方海报，邀请好友扫码助力，添加{USER_NICK}为好友：邀请5位好友为你助力并添加好友，即可领取奖品！奖品限量100份，先到先得哦！\n活动有效期：2020-03-03~2020-03-13\n点击以下链接可查询助力进展哦！{PROMOTION_URL}\n注册会员也可享受会员专属礼哦\n点击立即入会：{RECRUIT_URL}\n快去分享你的专属海报 ↓↓',
      NsAddTagDialogVisible: false, // 打标模态框
      NsAddTagDialogColumn: '', // 正在打标的字段
      tagList: [],
      collapseList: [1, 2, 3, 4],
      customerLoading: false,
      guestCodeId: null,
      copyGuestCodeId: null,
      activityIntroductionLength: 0,
      validates,
      model: {
        headerType: 1,
        time: [],
        activityDescription: '活动说明', // 活动说明
        activityIntroduction: '', // 活动介绍
        backgroundPic: defPosters, // 一客一码背景图片
        cardCopywriting: '', // 活动消息卡片文案
        cardCoverPic: defCardImg, // 活动消息卡片封面图片
        cardTitle: '', // 活动消息卡片标题
        effectiveCycle: 1, // 一客一码有效周期-天（过期时间）
        guideIds: [], // 使用导购ids
        guideDatas: [],
        headPortrait: 1, // 用户头像：0无，1有
        headPortraitShape: 1, // 用户头像形状：0圆 1方
        name: '', // 一客一码活动名称
        nick: 0, // 用户昵称：0无，1有
        nickColour: '#ffffff', // 用户昵称字体颜色：十六进制
        nickSize: 14, // 用户昵称字体大小
        qrcodeSize: 70, // 二维码大小
        qrcodeX: 220, // 二维码X轴坐标值
        qrcodeY: 470, // 二维码Y轴坐标值
        validTimeType: 1, // 有效时间类型 0永久有效，1固定范围
        pageColor: '#FFA30E,#F96C39,#FFFFFF', // 活动页面配色方案
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
        validTimeStart: '', // 活动有效时间结束
        // 数据安全
        // distinctType: 0, // 去重方式：0=不去重；1=全局去重；2=活动内去重；
        // unfriendDeduction: 0, // 解除好友关系是否扣减好友数：0=不扣减；1扣减
        // validIntervalTimeOfStatistical: 0, // 统计的有效间隔时间(统计时效)：0=立即生效；>0 =间隔该时间后生效
        // repeatParticipation: 0 // 是否允许重复参与：0=允许；1=不允许
        ...DEFAULT_DATA,
        // 自动打标
        tags: {
          count: 10,
          addValidFriendTags: [ { level: 1, tag: '', tagGroupId: '' } ],
          beGuestCodeTags: [ { level: 1, tag: '', tagGroupId: '' } ],
          noStandardTags: [ { level: 1, tag: '', tagGroupId: '' } ],
          standardTags: [ { level: 1, tag: '', tagGroupId: '' } ],
          noReceiveRewardsTags: [ { level: 1, tag: '', tagGroupId: '' } ],
          receiveRewardsTags: [ { level: 1, tag: '', tagGroupId: '' } ]
        }
      },
      staircase: [ '一', '二', '三', '四', '五' ],
      allTagGroupIds: [], // 所有的tagGroupId，用于计算tags.count
      tagConf: {
        addValidFriendTags: { label: '自动打标签', tip: '在裂变活动中，通过去重规则后新增的好友', stairPrefix: '自动打标梯度' },
        beGuestCodeTags: { tip: '成为裂变大师后自动打标签', stairPrefix: '成为大师梯度', help: '分享裂变海报的客户即自动成为裂变大师' },
        noStandardTags: { tip: '活动结束后，裂变未达标', stairPrefix: '未达标阶梯' },
        standardTags: { tip: '活动结束后，裂变达标', stairPrefix: '阶梯' },
        noReceiveRewardsTags: { tip: '活动结束后，裂变达标但未领取奖励', stairPrefix: '未领阶梯' },
        receiveRewardsTags: { tip: '通过裂变活动领取奖励打标签', stairPrefix: '领取奖励' }
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
        validTimeStart: [
          { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] }
        ],
        validTimeEnd: [
          { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
          { validator: validTimeEndFunc, trigger: ['blur', 'change'] }
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
          { required: true, message: '请输入欢迎语', trigger: ['blur', 'change'] }
        ],
        effectiveCycle: [
          { required: true, message: '请填写过期时间', trigger: ['blur', 'change'] }
        ],
        validIntervalTimeOfStatistical: [
          {
            validator: (rule, value, callback) => {
              if ((!value && value !== 0) || value < 0 || value > 9999) {
                callback(new Error(`请输入0～9999的整数`))
              } else {
                callback()
              }
            },
            message: '请输入0～9999的整数',
            trigger: ['blur', 'change']
          }
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
        bannerUrl: defBanner,
        activeInfo: {
          image: defGoodsUrl,
          number: '0',
          getColor: '',
          goodsName: '',
          goodsDes: ''
        },
        isOnlyReceiveByMember: 0,
        rules: '',
        regUrl: defRegUrl,
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
      ieEditCount: 0,
      pickerOptions: this.endDateDisable(),
      editEndDate: null,
      defPosters: defPosters
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
    },
    model: {
      handler (newValue, oldValue) {
        if (this.isEdit) return
        const item = this.eidtList[2]
        item.status = newValue.validTimeType === 1 ? 1 : 0
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
    },
    // 数据安全去重方式提示
    dedupWay () {
      return EDIT_DATA.DEDUP_WAY[this.model.distinctType] || {}
    },
    // 打开选择tag的模块框时，要回显选中的标签
    activeSelectedTags () {
      if (!this.NsAddTagDialogColumn) return ''
      const [ tags, tagKey, index ] = this.NsAddTagDialogColumn.split('.')
      return this.model[tags][tagKey][index].tag
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
      this.setPageColor()
      this.showDefaultText(this.defauletWelcome)
    }
  },
  methods: {
    updateStair (type) {
      if (type === 'add') {
        const { noStandardTags, standardTags, noReceiveRewardsTags } = this.model.tags
        noStandardTags.push({ level: noStandardTags.length + 1, tag: '', tagGroupId: '' })
        standardTags.push({ level: standardTags.length + 1, tag: '', tagGroupId: '' })
        noReceiveRewardsTags.push({ level: noReceiveRewardsTags.length + 1, tag: '', tagGroupId: '' })
      } else if (type === 'del') {
        const { noStandardTags, standardTags, noReceiveRewardsTags } = this.model.tags
        noStandardTags.pop()
        standardTags.pop()
        noReceiveRewardsTags.pop()
      }
    },
    openAddTagDialog (tag) {
      this.NsAddTagDialogVisible = true
      this.NsAddTagDialogColumn = tag
    },
    // 确认选择的tag
    confirmSelectedTag (info) {
      const [ tags, tagKey, index ] = this.NsAddTagDialogColumn.split('.')
      const tagItem = this.model[tags][tagKey][index]
      tagItem.tag = info.tagIds.join(',')
      tagItem.tagGroupId = info.tagGroupIds.join(',')

      this.NsAddTagDialogColumn = ''
    },
    totalTagCount () {
      let tagGroupId = ''
      for (const key in this.model.tags) {
        if (key !== 'count') {
          const tag = this.model.tags[key]
          tag.forEach(item => {
            if (item.tagGroupId) tagGroupId += `,${item.tagGroupId}`
          })
        }
      }
      tagGroupId = tagGroupId.slice(1)
      return tagGroupId ? Array.from(new Set(tagGroupId.split(','))).length : 0
    },
    showDefPosters () {
      this.model.backgroundPic = defPosters
    },
    showDefCard () {
      this.model.cardCoverPic = defCardImg
    },
    endDateDisable () {
      let that = this
      return {
        disabledDate (time) {
          if (that.isEdit) {
            return time.getTime() < that.editEndDate
          } else {
            return false
          }
        }
      }
    },
    setPageColor () {
      const colors = this.model.pageColor.split(',')
      if (colors.length > 0) {
        this.showColor = {
          mainColor: colors[0],
          bgColor: colors[1],
          strColor: colors[2]
        }
      }
    },
    inputEffectiveCycle (e, name, max) {
      let value = ''
      if (typeof e === 'object') {
        value = e.target.value.replace(/[^\d]/g, '')
      } else {
        value = e.replace(/[^\d]/g, '')
      }
      this.model[name] = max && max < value ? max : value
    },
    showDefaultText (introText = this.defauletWelcome) {
      const str = this.$refs.tagAreaText.stringTohtml(introText)
      this.model.activityIntroduction = str
      this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerHTML = str
    },
    scrollPhone (name) {
      this.$refs.activePhone.acScrollPhone(name)
    },
    updateActiveModel (obj) {
      this.model.prizeRuleList = obj.prizeRuleList
      this.model.prizeSendPlan = obj.prizeSendPlan
      if (!this.isEdit) {
        this.$refs.activePhone.acScrollPhone('time-view')
      }
    },
    onclick (itemCode, status) {
      let event = window.event
      event.stopPropagation()
      this.onShowEdit(itemCode, status)
      if (itemCode === 'countdown' && this.model.validTimeType === 0) {
        this.eidtList[2].status = 0
        this.$notify.warning('活动永久有效，无需显示倒计时')
      }
    },
    // 点击获取编辑模块
    onShowEdit (itemCode, status) {
      if (itemCode === 'countdown' || itemCode === 'reward') {
        this.$refs.activePhone.acScrollPhone('time-view')
      }
      if (itemCode === 'banner') {
        this.$refs.activePhone.acScrollPhone('banner-view')
      }
      if (itemCode === 'invitedFriend') {
        if (status === 0) {
          this.$refs.activePhone.acScrollPhone('rules-view')
        } else {
          this.$refs.activePhone.acScrollPhone('friends-view')
        }
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
    // handleChangePopoverShow (popoverShow = !this.popoverShow) {
    //   this.popoverShow = popoverShow
    // },
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
    // insertBrandId (barndId) {
    //   this.$refs.tagAreaText.addTag({ id: `RECRUIT_URL?barndId=${barndId}`, value: '招募链接' })
    // },
    // 获取详情
    async loadActivity (guestCodeId) {
      this.customerLoading = true
      const json = await this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId })
      if (!json.success) return
      const result = json.result
      this.model = { ...this.model, ...result }
      this.model.time = [result.validTimeStart, result.validTimeEnd]
      if (result.validTimeType === 1) {
        const endTime = new Date(result.validTimeEnd).getTime()
        this.editEndDate = endTime
      }
      let nickColor = this.model.nickColour
      if (!nickColor.includes('#')) {
        nickColor = '#' + nickColor
      }
      this.model.nickColour = nickColor
      // // 数据解析
      this.setPageColor()
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
      this.pageObj = { ...formatePageObj(this.eidtList, this.prizeModel), isOnlyReceiveByMember: result.isOnlyReceiveByMember || 0 }
      this.$nextTick(() => {
        this.isLoading = true
        if (this.$refs.colorView) {
          this.$refs.colorView.selctColor(this.showColor)
        }
        if (this.$refs.tagAreaText) {
          this.pageObj.rules = this.$refs.tagAreaText.stringTohtml(this.eidtList[5].value.content || '')
          this.showDefaultText(result.activityIntroduction || '')
        }
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
    // 拖动二维码
    onDragResize (params) {
      this.model = { ...this.model,
        qrcodeSize: params.width,
        qrcodeX: params.left,
        qrcodeY: params.top
      }
    },
    // 数据与安全模块字段检验
    verifySafeData () {
      return new Promise((resolve, reject) => {
        this.$refs.datasafeForm.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('数据与安全校验失败'))
          }
        })
      })
    },
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
      const ruleForm5 = this.$refs.componentList[3].validateRules()
      const ruleForm6 = this.$refs.componentList[5].validateRules()
      this.model = formatModel(this.model, this.eidtList, this.pageObj, this.showColor)
      let activityIntroduction = this.$refs.tagAreaText.htmlToString(this.model.activityIntroduction)
      activityIntroduction = RichText(activityIntroduction)
      let activeRules = this.$refs.tagAreaText.htmlToString(this.pageObj.rules)
      activeRules = RichText(activeRules)
      if (!this.model.name) {
        this.$notify.error('请输入活动名称')
        return
      }
      if (this.model.guideIds.length === 0) {
        this.$notify.error('请选择参加活动人员')
        return
      }
      if (this.model.validTimeType === 1) {
        if (!this.model.validTimeStart) {
          this.$notify.error('请选择开始时间')
          return
        }
        if (!this.model.validTimeEnd) {
          this.$notify.error('请选择结束时间')
          return
        }
        const isBefore = moment(this.model.validTimeEnd).isBefore(this.model.validTimeStart)
        const isSame = moment(this.model.validTimeEnd).isSame(this.model.validTimeStart)
        if (isBefore || isSame) {
          this.$notify.error('结束时间不能大于等于开始时间')
          return
        }
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
      if (activityIntroduction.length > 1000) {
        this.$notify.error('欢迎语最多1000个字')
        return
      }
      if (!this.model.cardTitle) {
        this.$notify.error('请输入活动消息卡片标题')
        return
      }
      if (this.model.cardTitle.length > 20) {
        this.$notify.error('活动名称最多20个字')
        return
      }
      if (!this.model.cardCopywriting) {
        this.$notify.error('请输入活动消息卡片文案')
        return
      }
      if (this.model.cardCopywriting.length > 50) {
        this.$notify.error('活动文案最多50个字')
        return
      }
      if (!this.model.cardCoverPic) {
        this.$notify.error('请选择活动消息卡片封面图片')
        return
      }
      const activeItem = this.eidtList[3]
      let ruleForm4
      if (activeItem.status === 1 && (!this.isEdit || this.copyGuestCodeId > 0)) {
        ruleForm4 = this.$refs.componentList[2].validateRules()
        let prizeRuleListObj = this.model.prizeRuleList[0] || {}
        if (!prizeRuleListObj.recruitment) {
          this.$notify.error('请输入邀请人数')
          return
        }
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
        if (parseFloat(prizeRuleListObj.prizeNumber) > parseFloat(prizeRuleListObj.validNumber)) {
          this.$notify.error('发放数量不能大于剩余数量')
          return
        }
        if (!this.pageObj.activeInfo.goodsName) {
          this.$notify.error('请输入奖品名称')
          return
        }
        if (this.pageObj.activeInfo.goodsName.length > 20) {
          this.$notify.error('奖品名称最多20个字')
          return
        }
        if (!this.pageObj.activeInfo.goodsDes) {
          this.$notify.error('请输入奖品简介')
          return
        }
        if (this.pageObj.activeInfo.goodsDes.length > 50) {
          this.$notify.error('奖品简介最多50个字')
          return
        }
      }
      const rulesItem = this.eidtList[5]
      if (rulesItem.status === 1) {
        if (!this.pageObj.rules) {
          this.$notify.error('请输入活动规则')
          return
        }
        if (activeRules.length > 1000) {
          this.$notify.error('活动规则最多1000个字')
          return
        }
      }
      const shareItem = this.eidtList[7]
      if (shareItem.status === 1) {
        if (!this.pageObj.share.name) {
          this.$notify.error('请输入分享按钮名称')
          return
        }
        if (this.pageObj.share.name > 10) {
          this.$notify.error('分享按钮名称最多10个字')
          return
        }
      }
      let checksRules = [ruleForm, ruleForm2, ruleForm3]
      if (activeItem.status === 1 && !this.isEdit) {
        checksRules.push(ruleForm4)
      }
      if (rulesItem.status === 1) {
        checksRules.push(ruleForm5)
      }
      if (shareItem.status === 1) {
        checksRules.push(ruleForm6)
      }
      await this.verifySafeData()
      const checks = await Promise.all(checksRules)
      if (checks.length === checksRules.length) {
        // this.model = formatModel(this.model, this.eidtList, this.pageObj, this.showColor)
        const guestCodeId = this.$route.query.guestCodeId || null
        const saveIntro = this.$refs.tagAreaText.htmlToString(this.model.activityIntroduction)
        const saveRules = this.$refs.tagAreaText.htmlToString(this.pageObj.rules)
        this.model = formatModelSave(this.model, saveIntro, saveRules, guestCodeId, this.eidtList)
        const headPosition = this.headPosition[this.model.headerType]
        const data = { ...this.model, ...headPosition, tags: { ...this.model.tags, count: this.totalTagCount() } }
        this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, data).then(res => {
          this.$notify.success('保存成功')
          this.handleCancel()
        }).catch(res => {
          this.$notify.error(res.msg)
        }).finally(res => {
          // this.btnLoad = false
        })
      }
    },
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    handleCancel () {
      this.$router.push({ name: 'CustomerCodeList' })
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
        // this.handleChangePopoverShow(false)
      }
    }
  }
}
