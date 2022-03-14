import baguser from '@/assets/baguser.png'
import fangRedpact from '@/assets/fangRedpact.png'
import ValidateUtil from '@/utils/validateUtil'
import { mapState } from 'vuex'
import { getErrorMsg } from '@/utils/toast'
import redpacketEdit from '../../mixins/redpacketEdit'
export default {
  mixins: [redpacketEdit],
  data () {
    const validateLength = (length, rule, value, callback) => {
      if (value.length > length) {
        callback(new Error(`长度在1-${length}字符`))
      } else {
        callback()
      }
    }
    return {
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType, // 平台判断
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(new Date().toLocaleDateString())
        }
      },
      model: {
        redpackType: null, // 红包类型
        launchType: null, // 发放类型
        payConfigId: null, // 支付商户
        name: '', // 红包名称
        timeType: null, // 时间类型
        time: [], // 有限时间时间范围
        total: '', // 红包总数
        limitType: 1, // 单人单日发放个数上限
        everyoneLimit: '', // 单人单日发放个数上限个数
        money: '', // 单个红包金额（元）
        benediction: null, // 祝福语
        coverId: null, // 红包封面
        customizeType: false, // 允许员工自定义红包祝福语
        moneyMax: '', // 最大金额
        moneyMin: '' // 最小金额
      },
      rules: {
        redpackType: [
          { required: true, message: '请选择红包类型', trigger: ['blur', 'change'] }
        ],
        launchType: [
          { required: true, message: '请选择发放类型', trigger: ['blur', 'change'] }
        ],
        payConfigId: [
          { required: true, message: '请选择支付商户号', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入红包名称', trigger: ['blur', 'change'] },
          { validator: validateLength.bind(this, 10), trigger: ['blur', 'change'] }
          // { min: 1, max: 10, message: '长度在1-10字符', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
        ],
        total: [
          { required: true, message: '请输入红包总数', trigger: ['blur', 'change'] },
          { validator: ValidateUtil.isPositiveNumber, trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '最多输入10位数', trigger: ['blur', 'change'] }
        ],
        everyoneLimit: [
          { required: true, message: '请输入单人单日发放个数上限', trigger: ['blur', 'change'] },
          { validator: ValidateUtil.isPositiveNumber, trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '最多输入10位数', trigger: ['blur', 'change'] }
        ],
        money: [
          { required: true, message: '请输入金额', trigger: ['blur', 'change'] },
          { validator: ValidateUtil.isPositiveMoney, trigger: ['blur', 'change'] },
          { validator: ValidateUtil.intervalMoney.bind(this, 0.3, 5000), trigger: ['blur', 'change'] }
        ],
        benediction: [
          { required: true, message: '请输入红包祝福语', trigger: ['blur', 'change'] },
          { validator: validateLength.bind(this, 25), trigger: ['blur', 'change'] }
          // { min: 1, max: 25, message: '长度在1-25个字符', trigger: ['blur', 'change'] },
        ]
      },
      visible: false, // 选择海报弹框
      disabled: false, // 是否查看进入
      posterInfo: {}, // 选中的海报信息
      btnLoad: false, // 是否正在保存
      ValidateUtil,
      fangRedpact,
      baguser,
      listPath: '/Social/SocialOperation/RedPacket/Strategies/List',
      submitApi: this.$api.guide.redpacket.createStrategies,
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  computed: {
    ...mapState({
      wxpayList: state => state.pay.wxpayList
    })
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      const { id } = this.$route.query
      if (id) {
        this.disabled = true
        this.$http.fetch(this.$api.guide.redpacket.getStrategies, { id }).then((res) => {
          if (res.success) {
            this.model = this.formatData(res.result, 'load')
            this.posterInfo.background = res.result.background
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('获取失败', resp))
        })
      } else {
        this.setDefault({
          redpackType: this.normalRed,
          launchType: this.staffPost,
          timeType: this.timeTypeInterval,
          benediction: this.BLESSING
        })
        this.$http.fetch(this.$api.guide.redpacket.getCoverList, { start: 0, length: 1 }).then((res) => {
          if (res.success) {
            this.model.coverId = res.result.data[0].id
            this.posterInfo = res.result.data[0]
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('获取失败', resp))
        })
      }
    },
    /**
     *
     * @param {model} data
     * @param {string} type load 加载  submit  提交
     * @return {model}
     */
    formatData (data, type) {
      const obj = {
        redpackType: data.redpackType,
        launchType: data.launchType,
        payConfigId: data.payConfigId + '',
        name: data.name,
        timeType: data.timeType,
        limitType: data.limitType,
        benediction: data.benediction,
        coverId: data.coverId
      }
      if (type === 'load') {
        obj.time = [data.startTime, data.endTime]
        obj.customizeType = data.customizeType === 1
        obj.moneyMax = data.moneyMax / 100
        obj.moneyMin = data.moneyMin / 100
        obj.money = data.money / 100
        obj.total = data.total + ''
        obj.everyoneLimit = data.everyoneLimit + ''
      } else {
        obj.startTime = data.timeType === this.timeTypeInterval ? data.time[0] : ''
        obj.endTime = data.timeType === this.timeTypeInterval ? data.time[1] : ''
        obj.customizeType = data.launchType === this.activityPost ? 2 : 2 - data.customizeType
        obj.moneyMax = data.redpackType === this.normalRed ? 0 : (data.moneyMax * 100)
        obj.moneyMin = data.redpackType === this.normalRed ? 0 : (data.moneyMin * 100)
        obj.money = data.redpackType === this.normalRed ? data.money * 100 : 0
        obj.total = data.total
        obj.limitType = data.launchType === this.activityPost ? 2 : data.limitType
        obj.everyoneLimit = data.limitType === 1 && data.launchType !== this.activityPost ? data.everyoneLimit : ''
      }
      return obj
    },
    /**
     * 切换红包类型
     * @param {*} value
     */
    handleChangeRedpackType (value) {
      if ([this.luckyRed, this.diyRed].includes(value)) {
        this.model.launchType = this.staffPost
      }
      this.$refs.searchform.clearValidate()
    },
    /**
     * 打开选封面弹框
     */
    handleChangePoster () {
      this.changeVisible(true)
    },
    /**
     * 修改弹框状态
     * @param {*} visible
     */
    changeVisible (visible) {
      this.visible = visible
    },
    /**
     * 选择完成红包封面
     */
    handleSure () {
      this.posterInfo = this.$refs.fullDialog.checkItem || {}
      this.model.coverId = this.posterInfo.id
      this.changeVisible(false)
    },
    resetValite (ref) {
      if (this.$refs[ref]) {
        this.$nextTick(() => {
          this.$refs[ref].clearValidate()
        })
      }
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList').then(res => {
      if (!this.$route.query.id) {
        this.model.payConfigId = res[0].id
      }
    })
    this.init()
  }
}
