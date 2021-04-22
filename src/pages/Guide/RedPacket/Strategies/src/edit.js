import { timeTypeInterval, timeTypeForever, redpacketTypeList, setTypeList, timeTypeList, normalRed, luckyRed, diyRed, staffPost, activityPost } from '../../const'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        redpackType: normalRed, // 红包类型
        launchType: staffPost,
        payConfigId: null,
        name: '',
        timeType: timeTypeInterval,
        time: [],
        total: '',
        limitType: 1,
        everyoneLimit: '',
        money: '',
        benediction: '',
        coverId: null,
        customizeType: false,
        moneyMax: '',
        moneyMin: ''
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
          { required: true, message: '请填写红包名称', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度在1-10个字符', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }
        ],
        total: [
          { required: true, message: '请填写红包总数', trigger: ['blur', 'change'] }
        ],
        everyoneLimit: [
          { required: true, message: '请填写 单人单日发放个数上限', trigger: ['blur', 'change'] }
        ]
      },
      visible: false,
      disabled: false,
      posterInfo: {},
      btnLoad: false,
      redpacketTypeList,
      setTypeList,
      timeTypeInterval,
      timeTypeForever,
      timeTypeList,
      normalRed,
      luckyRed,
      diyRed,
      activityPost,
      staffPost
    }
  },
  computed: {
    ...mapState({
      wxpayList: state => state.pay.wxpayList
    })
  },
  methods: {
    init () {
      const { id } = this.$route.query
      if (id) {
        this.disabled = true
        this.$http.fetch(this.$api.guide.redpacket.getStrategies, { id }).then((res) => {
          if (res.success) {
            this.model = this.formatData(res.result, 'load')
          }
        }).catch((resp) => {

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
        total: data.total,
        limitType: data.limitType,
        everyoneLimit: data.everyoneLimit,
        benediction: data.benediction,
        coverId: data.coverId,
        moneyMax: data.moneyMax,
        moneyMin: data.moneyMin,
        money: data.money
      }
      if (type === 'load') {
        obj.time = [data.startTime, data.endTime]
        obj.customizeType = data.customizeType === 1
      } else {
        obj.startTime = data.time[0]
        obj.endTime = data.time[1]
        obj.customizeType = 2 - data.customizeType
      }
      return obj
    },
    handleChangeRedpackType (value) {
      if ([luckyRed, diyRed].includes(value)) {
        this.model.launchType = staffPost
      }
    },
    handleChangePoster () {
      this.changeVisible(true)
    },
    changeVisible (visible) {
      this.visible = visible
    },
    // 返回列表
    handleCancel () {
      this.$router.push({ path: '/Social/SocialOperation/RedPacket/Strategies/List' })
    },
    update () {
      this.btnLoad = true
      this.$refs.searchform.validate(async (valid) => {
        if (!valid) {
          this.btnLoad = false
        } else {
          this.setStrategies(this.formatData(this.model, 'submit'))
        }
      })
    },
    setStrategies (model) {
      this.$http.fetch(this.$api.guide.redpacket.createStrategies, model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    handleSure () {
      this.posterInfo = this.$refs.fullDialog.checkItem || {}
      this.model.coverId = this.posterInfo.id
      console.log(this.model.coverId)
      this.changeVisible(false)
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList')
    this.init()
  }
}
