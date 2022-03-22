import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../mixins/redpacketTable'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixin, redpacketTable],
  data () {
    return {
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
      // 筛选日期
      seachDate: [], // 时间筛选
      isLoad: false,
      detailPath: '/Social/SocialOperation/RedPacket/Strategies/Edit', // 详情页路由
      payPath: '/Guide/Others/PaySet', // 支付商户号配置页面，未配置商户号需要先配置
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList').then(() => {
      this.isLoad = true
    })
    this.$reload()
  },
  computed: {
    ...mapState({
      wxpayList: state => state.pay.wxpayList,
      payMap: state => state.pay.wxpayMap
    }),
    payList () {
      return [{ label: '全部', value: null }, ...this.wxpayList]
    },
    redpacketTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.redpacketTypeList]
    },
    setTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.setTypeList]
    },
    isEmpty () {
      return this.wxpayList.length === 0 && this.isLoad
    }
  },
  methods: {
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
