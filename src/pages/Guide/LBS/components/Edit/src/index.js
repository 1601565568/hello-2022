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
    return {
      model: {
        id: null,
        name: '', // 活动名称
        shopList: [], // 选择门店
        time: [], // 时间
        timeType: 1, // 是否永久
        activityPoster: '', // 活动海报
        activityPositionX: 73, // 活动海报二维码定位x
        activityPositionY: 349, // 活动海报二维码定位y
        activityPositionWidth: 172, // 活动海报二维码定位宽度
        welcomePoster: '', // 引导页海报
        qrcodePoster: '', // 二维码海报背景
        positionX: 73, // 二维码海报背景二维码x
        positionY: 289, // 二维码海报背景二维码y
        positionWidth: 172, // 二维码海报背景二维码宽度
        roomRule: '',
        roomBaseName: '',
        roomBaseId: 1,
        roomUserNum: 1,
        qrcodeType: 1 // 好友聚合二维码设置
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { min: 1, max: 20, message: '长度在1-20个字符', trigger: ['blur', 'change'] }
        ],
        shopList: [
          { required: true, message: '请选择参加门店', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
        ],
        activityPoster: [
          { required: true, message: '请选择活动海报', trigger: ['blur', 'change'] }
        ],
        welcomePoster: [
          { required: true, message: '请选择海报', trigger: ['blur', 'change'] }
        ],
        roomRule: [
          { required: true, message: '请输入群名称规则', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '长度在1-50个字符以内', trigger: ['blur', 'change'] }
        ],
        qrcodePoster: [
          { required: true, message: '请上传海报背景', trigger: ['blur', 'change'] }
        ]
      },
      btnLoad: false,
      roomBaseNameLength: 0,
      tools: [
        { type: 'tag', text: '门店名称', id: 'LBS_SHOP_NAME', value: '门店名称' }
      ],
      validateActivityIntroduction
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
      return this.type === 'Group' ? '/Social/LBS/Group/Index' : '/Social/LBS/Friends/Index'
    }
  },
  methods: {
    async init () {
      const result = await this.loadData()
      if (result) {
        this.model = this.formatLoadData(result)
      }
    },
    async loadData () {
      const result = await this.$http.fetch(this.loadApi)
      if (result.success) {
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
      const baseData = {
        id: result.id,
        name: result.name, // 活动名称
        shopList: result.shopList, // 选择门店
        timeType: result.timeType, // 是否永久
        activityPoster: result.activityPoster, // 活动海报
        activityPositionX: result.activityPositionX, // 活动海报二维码定位x
        activityPositionY: result.activityPositionY, // 活动海报二维码定位y
        activityPositionWidth: result.activityPositionWidth, // 活动海报二维码定位宽度
        welcomePoster: result.welcomePoster, // 引导页海报
        qrcodePoster: result.qrcodePoster, // 二维码海报背景
        positionX: result.positionX, // 二维码海报背景二维码x
        positionY: result.positionY, // 二维码海报背景二维码y
        positionWidth: result.positionWidth // 二维码海报背景二维码宽度
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
      this.$router.go(-1)
    },
    handleChangeShopList (value) {
      this.model.shopList = value
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('shopList')
    },
    // 修改海报二维码位置
    onDragPosterResize (params) {
      this.model = { ...this.model,
        activityPositionWidth: params.width,
        activityPositionX: params.left,
        activityPositionY: params.top
      }
    },
    // 修改海报背景二维码位置
    onDragQrResize () {
      this.model = { ...this.model,
        positionWidth: params.width,
        positionX: params.left,
        positionY: params.top
      }
    },
    update () {
      this.loading = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doUpdate()
        }
      })
    },
    doUpdate () {
      this.btnLoad = true
      this.$http.fetch(this.saveApi, this.formatLoadData(this.model)).then(() => {
        this.btnLoad = false
        this.$notify.success('修改成功')
      }).catch((resp) => {
        this.btnLoad = true
        this.$notify.error(getErrorMsg('修改失败', resp))
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
    inputLength (length) {
      this.activityIntroductionLength = length
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('roomBaseName')
    }
  },
  mounted () {
    this.init()
  }
}
