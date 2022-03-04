import qychat from '@/assets/qychat.jpg'
import redpacketEdit from '../../mixins/redpacketEdit'
export default {
  mixins: [redpacketEdit],
  data () {
    return {
      qychat,
      model: {
        useType: 1, // 用户类型
        guideIds: [], // 选中员工列表
        redpackPolicyId: '', // 选中红包策略id
        shopIds: [] // 选中的门店列表
      },
      rules: {
        useType: [
          { required: true, message: '请选择发放对象', trigger: ['blur', 'change'] }
        ],
        redpackPolicyId: [
          { required: true, message: '请选择红包策略', trigger: ['blur', 'change'] }
        ],
        shopIds: [
          { required: true, message: '请选择门店', trigger: ['blur', 'change'] }
        ],
        guideIds: [
          { required: true, message: '请选择员工', trigger: ['blur', 'change'] }
        ]
      },
      visible: false, // 选中红包策略列表
      btnLoad: false,
      listPath: '/Social/SocialOperation/RedPacket/Send/List',
      submitApi: this.$api.guide.redpacket.createSend,
      chooseItem: {}, // 选择策略对象，回显
      radioIcon: process.env.VUE_APP_THEME,
      radiobox: 'radiobox',
      radioboxQA: 'radioboxQA'
    }
  },
  methods: {
    /**
     * 选中导购
     * @param {*} value
     */
    handleChangeGuide (value) {
      this.model.guideIds = value.map(item => item.id)
      this.$refs.searchform && this.$refs.searchform.validateField('guideIds')
    },
    /**
     * 选中门店
     * @param {*} value
     */
    handleChangeShopList (value) {
      this.model.shopIds = value
      this.$refs.searchform && this.$refs.searchform.clearValidate('shopIds')
    },
    /**
     * 打开选择策略
     */
    hanleChoose () {
      this.changeVisible(true)
    },
    /**
     * 策略弹框
     * @param {*} visible
     */
    changeVisible (visible) {
      this.visible = visible
    },
    /**
     * 完成策略选择
     */
    handleSure () {
      const checkedItem = this.$refs.strategiesList.checkItem
      if (!checkedItem.id) {
        this.$notify.error('请选择红包')
        return
      }
      this.model.redpackPolicyId = checkedItem.id
      this.chooseItem = checkedItem
      this.changeVisible(false)
    },
    /**
     * 格式化数据
     */
    formatData (obj) {
      return {
        useType: obj.useType,
        guideIds: obj.guideIds,
        redpackPolicyId: obj.redpackPolicyId,
        shopIds: obj.shopIds
      }
    }
  }
}
