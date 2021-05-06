import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../mixins/redpacketTable'
import redPacketEmpty from '@/assets/redpactEmpty.png'
export default {
  mixins: [tableMixin, redpacketTable],
  data () {
    return {
      redPacketEmpty, // 红包空图
      model: {
        startTime: '', // 起始时间
        endTime: '', // 结束时间
        launchType: null, // 发放类型
        name: '', // 红包名称
        payConfigId: null, // 支付商户
        redpackType: null, // 红包类型
        sortName: 'createTime', // 排序字段
        sortType: 0 // 排序规则 0:倒叙  1:正序
      },
      url: this.$api.guide.redpacket.getStrategiesList,
      payList: [], // 支付商户列表用户列表筛选
      payMap: {}, // 支付商户枚举用于列表‘支付商户号’字段
      // 筛选日期
      seachDate: [], // 时间筛选
      isEmpty: false, // 是否有支付商户号列表
      detailPath: '/Social/SocialOperation/RedPacket/Strategies/Edit', // 详情页路由
      payPath: '/Guide/Others/PaySet' // 支付商户号配置页面，未配置商户号需要先配置
    }
  },
  mounted () {
    this.getList()
    this.$reload()
  },
  computed: {
    redpacketTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.redpacketTypeList]
    },
    setTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.setTypeList]
    }
  },
  methods: {
    /**
     * 获取支付商户号列表
     */
    getList () {
      this.$store.dispatch('pay/getWxpayList').then(data => {
        const payMap = {}
        this.payList = [
          { label: '全部', value: null },
          ...data.map(item => {
            const value = item.id
            const label = item.mchid + '-' + (item.officialAccount ? item.officialAccount.nickName : '')
            payMap[value] = label
            return {
              value,
              label
            }
          })
        ]
        this.payMap = payMap
        this.isEmpty = !data.length
      })
    },
    /**
     * 修改状态
     * @param {*} id
     * @param {*} value
     */
    handleChangeState (id, value) {
      this.changeState(this.$api.guide.redpacket.changeStrategiesState, { id, state: this.normalType + this.closeType - value })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  }
}
