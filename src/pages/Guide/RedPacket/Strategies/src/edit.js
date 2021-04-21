import { timeTypeInterval, timeTypeForever, redpacketTypeList, setTypeList, timeTypeList, normalRed, staffPost } from '../../const'
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
        total: 0,
        limitType: 1,
        everyoneLimit: 0,
        money: '',
        benediction: '',
        coverId: 36,
        customizeType: false
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
        ]
      },
      disabled: false,
      posterInfo: {},
      btnLoad: false,
      redpacketTypeList,
      setTypeList,
      timeTypeInterval,
      timeTypeForever,
      timeTypeList
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
        this.$http.fetch(this.$api.guide.redpacket.getStrategies, { id }).then((res) => {
          if (res.success) {
            this.model = res.result
          }
        }).catch((resp) => {

        })
      }
    },
    formatData (data, type) {
      return {

      }
    },
    // 返回列表
    handleCancel () {
      this.$router.push({ path: '/Social/SocialOperation/RedPacket/Strategies/List' })
    },
    update () {
      this.setStrategies()
    },
    setStrategies () {
      this.$http.fetch(this.$api.guide.redpacket.createStrategies, this.model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList')
    this.init()
  }
}
