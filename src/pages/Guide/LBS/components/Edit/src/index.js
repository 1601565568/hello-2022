import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    const validateActivityIntroduction = (length, rule, value, callback) => {
      if (length > 40) {
        callback(new Error(`自动建群名称最多40个字`))
      } else {
        callback()
      }
    }
    const checkTime = (rule, value, callback) => {
      let endTime = this.model.time[1]
      let now = new Date()
      if (!this.model.time[0]) {
        callback(new Error('请选择开始时间'))
      } else if (!this.model.time[1]) {
        callback(new Error('请选择结束时间'))
      } else if (new Date(endTime) <= now) {
        callback(new Error('结束时间不能早于当前时间'))
      } else {
        callback()
      }
    }
    const validateNumber = (min, max, rule, value, callback) => {
      if (value > max || value < min) {
        callback(new Error(`请输入${min}-${max}的正整数`))
      } else {
        callback()
      }
    }
    return {
      model: {
        id: null,
        guid: null,
        name: '', // 活动名称
        shopIdList: [], // 选择门店
        time: [], // 时间
        timeType: 1, // 是否永久
        activityPoster: '', // 活动海报
        activityPositionX: 73, // 活动海报二维码定位x
        activityPositionY: 349, // 活动海报二维码定位y
        activityQrcodeWidth: 172, // 活动海报二维码定位宽度
        welcomePoster: '', // 引导页海报
        qrcodePoster: '', // 二维码海报背景
        positionX: 73, // 二维码海报背景二维码x
        positionY: 289, // 二维码海报背景二维码y
        qrcodeWidth: 172, // 二维码海报背景二维码宽度
        roomRule: '',
        roomBaseName: '',
        roomBaseId: 1,
        roomUserNum: 200,
        qrcodeType: 1 // 好友聚合二维码设置
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { min: 1, max: 20, message: '长度在1-20个字符', trigger: ['blur', 'change'] }
        ],
        shopIdList: [
          { required: true, message: '请选择参加门店', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] },
          { validator: checkTime, trigger: ['blur', 'change'] }
        ],
        activityPoster: [
          { required: true, message: '请选择活动海报', trigger: ['blur', 'change'] }
        ],
        welcomePoster: [
          { required: true, message: '请选择海报', trigger: ['blur', 'change'] }
        ],
        roomRule: [
          { required: true, message: '请输入群名称规则', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '长度在1-50个字符', trigger: ['blur', 'change'] }
        ],
        qrcodePoster: [
          { required: true, message: '请上传海报背景', trigger: ['blur', 'change'] }
        ],
        qrcodeType: [
          { required: true, message: '请选择聚合码设置', trigger: ['blur', 'change'] }
        ],
        roomBaseId: [
          { validator: validateNumber.bind(this, 1, 100), trigger: ['blur', 'change'] }
        ],
        roomUserNum: [
          { validator: validateNumber.bind(this, 1, 200), trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      roomBaseNameLength: 0,
      tools: [
        { type: 'tag', text: '门店名称', id: 'LBS_SHOP_NAME', value: '门店名称' }
      ],
      validateActivityIntroduction,
      loadOver: false, // 保存是否加载完成
      isStating: false, // 是否正在进行中
      messageQA: process.env.VUE_APP_THEME,
      messageIconQA: 'scope_tipQA',
      messageIcon: 'scope_tip',
      radiobox: 'radiobox',
      radioboxQA: 'radioboxQA',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  props: {
    type: {
      default: 'Group' // Group:群拉新 Friends:好友拉新
    }
  },
  computed: {
    // 页面名称
    title () {
      const type = this.$route.query && this.$route.query.id ? '编辑' : '新建'
      const path = this.type === 'Group' ? '群' : '好友'
      return `${type}LBS${path}拉新活动`
    },
    // 加载接口
    loadApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.getGroupDetail : this.$api.guide.lbs.getFriendsDetail
    },
    // 保存接口
    saveApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.saveGroupDetail : this.$api.guide.lbs.saveFriendsDetail
    },
    // 列表页面
    listPath () {
      return this.type === 'Group' ? '/Guide/LBS/Group/Index' : '/Guide/LBS/Friends/Index'
    },
    // 参与门店提示
    shopTip () {
      // return this.type === 'Group' ? '会根据客户位置信息，自动推荐最近门店群聚合码' : '会根据客户位置信息，自动推荐最近门店的企微聚合码'
      return '根据客户选择城市，推荐附近参与活动的门店列表'
    },
    // 海报提示
    welcomePosterTip () {
      return this.type === 'Group' ? '默认海报固定显示，建议为权益说明，引导客户入群' : '默认海报固定显示，建议为权益说明，引导消费者添加员工企业微信好友'
    },
    // 消费者进群页面设置
    groupTip () {
      return this.type === 'Group' ? '消费者进群页面设置' : '消费者加好友页面设置'
    },
    // 手机title
    phoneTitle () {
      // return this.type === 'Group' ? '加入门店群' : 'LBS好友拉新活动名称'
      return this.model.name || '活动名称'
    },
    // q群聚合码设置
    groupSet () {
      return this.type === 'Group' ? '02 群聚合码设置' : '02 企微聚合码'
    }
  },
  methods: {
    async init () {
      const result = await this.loadData()
      if (result) {
        this.model = this.formatLoadData(result)
        this.$nextTick(() => {
          this.loadOver = true
        })
      }
    },
    async loadData () {
      const result = await this.$http.fetch(this.loadApi, { guid: this.$route.query.guid })
      if (result.success) {
        this.isStating = result.result.state === 1
        return result.result
      } else {
        return false
      }
    },
    /**
     * 格式化数据
     * @param {*} result
     * @param {*} type load 加载 update 提交
     */
    formatLoadData (result, type = 'load') {
      const { id, guid } = this.$route.query
      const baseData = {
        name: result.name, // 活动名称
        shopIdList: result.shopIdList, // 选择门店
        timeType: result.timeType, // 是否永久
        activityPoster: result.activityPoster, // 活动海报
        activityPositionX: result.activityPositionX, // 活动海报二维码定位x
        activityPositionY: result.activityPositionY, // 活动海报二维码定位y
        activityQrcodeWidth: result.activityQrcodeWidth, // 活动海报二维码定位宽度
        welcomePoster: result.welcomePoster, // 引导页海报
        qrcodePoster: result.qrcodePoster, // 二维码海报背景
        positionX: result.positionX, // 二维码海报背景二维码x
        positionY: result.positionY, // 二维码海报背景二维码y
        qrcodeWidth: result.qrcodeWidth, // 二维码海报背景二维码宽度
        id: id || null,
        guid: guid || null
      }
      if (type === 'load') {
        baseData.time = [result.startTime, result.endTime]
      } else {
        baseData.startTime = result.time[0]
        baseData.endTime = result.time[1]
      }
      const otherData = this.type === 'Group' ? this.formatLoadDataByGroup(result, type) : this.formatLoadDataByFriends(result)
      return { ...baseData, ...otherData }
    },
    // 群拉新数据
    formatLoadDataByGroup (result, type = 'load') {
      return {
        roomRule: result.roomRule,
        roomBaseName: type === 'load' ? this.stringTohtml(result.roomBaseName) : this.htmlToString(result.roomBaseName),
        roomBaseId: result.roomBaseId,
        roomUserNum: result.roomUserNum
      }
    },
    // 好友拉新数据
    formatLoadDataByFriends (result) {
      return { qrcodeType: result.qrcodeType }
    },
    // 返回列表
    handleCancel () {
      this.$router.push({ path: this.listPath })
    },
    handleChangeShopList (value) {
      this.model.shopIdList = value
      this.$refs.searchform && this.$refs.searchform.clearValidate('shopIdList')
    },
    // 修改海报二维码位置
    onDragPosterResize (params) {
      this.model = { ...this.model,
        activityQrcodeWidth: params.width,
        activityPositionX: params.left,
        activityPositionY: params.top
      }
    },
    // 修改海报背景二维码位置
    onDragQrResize (params) {
      this.model = { ...this.model,
        qrcodeWidth: params.width,
        positionX: params.left,
        positionY: params.top
      }
    },
    update () {
      this.btnLoad = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doUpdate()
        } else {
          this.btnLoad = false
        }
      })
    },
    doUpdate () {
      this.$http.fetch(this.saveApi, this.formatLoadData(this.model, 'updata')).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
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
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    inputLength (length) {
      this.activityIntroductionLength = length
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('roomBaseName')
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.guid) {
      this.init()
    } else {
      this.loadOver = true
    }
  }
}
