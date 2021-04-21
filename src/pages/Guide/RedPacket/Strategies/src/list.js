import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
import { redpacketTypeMap, timeTypeForever, redpacketTypeList, setTypeList } from '../../const'
export default {
  data () {
    return {
      redPacket,
      model: {
        endTime: '',
        launchType: null,
        name: '',
        payConfigId: null,
        redpackType: null,
        startTime: ''
      },
      url: this.$api.guide.redpacket.getStrategiesList,
      redpacketTypeMap,
      redpacketTypeList: [{ label: '全部', value: null }, ...redpacketTypeList],
      timeTypeForever,
      setTypeList: [{ label: '全部', value: null }, ...setTypeList],
      payList: [],
      payMap: {},
      // 筛选日期
      seachDate: []
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.getList()
    this.$reload()
  },
  methods: {
    /**
     * 获取金额列表
     */
    getList () {
      this.$store.dispatch('pay/getWxpayList').then(data => {
        const payMap = {}
        this.payList = [
          { label: '全部', value: null },
          ...data.map(item => {
            const value = item.id
            const label = item.mchid + '-' + item.officialAccount.nickName
            payMap[value] = label
            return {
              value,
              label
            }
          })
        ]
        this.payMap = payMap
      })
      // this.$http.fetch(this.$api.guide.pay.getList, { statr: 0, length: 999 }).then(res => {
      //   if (res.success) {
      //     const payMap = {}
      //     this.payList = [
      //       { label: '全部', value: null },
      //       ...res.result.data.map(item => {
      //         const value = item.id
      //         const label = item.mchid + '-' + item.officialAccount.nickName
      //         payMap[value] = label
      //         return {
      //           value,
      //           label
      //         }
      //       })
      //     ]
      //     this.payMap = payMap
      //   }
      // })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.model.name })
    },
    handleDetail (query = {}) {
      this.$router.push({
        path: '/Social/SocialOperation/RedPacket/Strategies/Edit',
        query
      })
    },
    // 修改状态
    handleChangeState (id, value) {
      this.$http.fetch(this.$api.guide.redpacket.changeStrategiesState, { id, state: 3 - value }).then(res => {
        if (res.success) {
          this.data = this.formatList(res.result.data)
        }
      })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  }
}
