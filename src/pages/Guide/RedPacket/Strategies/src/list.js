import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
import redPacketEmpty from '@/assets/redpactEmpty.png'
import { redpacketTypeMap, timeTypeForever, redpacketTypeList, setTypeList } from '../../const'
import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      redPacket,
      redPacketEmpty,
      model: {
        endTime: '',
        launchType: null,
        name: '',
        payConfigId: null,
        redpackType: null,
        startTime: '',
        orderType: '',
        sortName: 'createTime',
        sortType: 0
      },
      url: this.$api.guide.redpacket.getStrategiesList,
      redpacketTypeMap,
      redpacketTypeList: [{ label: '全部', value: null }, ...redpacketTypeList],
      timeTypeForever,
      setTypeList: [{ label: '全部', value: null }, ...setTypeList],
      payList: [],
      payMap: {},
      // 筛选日期
      seachDate: [],
      isLoad: false
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.getList()
    this.$reload()
  },
  computed: {
    isEmpty () {
      return !this.payList.length && this.isLoad
    }
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
            const label = item.mchid + '-' + (item.officialAccount ? item.officialAccount.nickName : '')
            payMap[value] = label
            return {
              value,
              label
            }
          })
        ]
        this.payMap = payMap
        this.isLoad = true
      })
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
          this.$searchAction$()
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('操作失败', resp))
      })
    },
    handleGoPay () {
      this.$router.push({
        path: '/Guide/Others/PaySet'
      })
    },
    handleSort (data) {
      const sortType = data.order === 'ascending' ? 1 : data.order === 'descending' ? 0 : ''
      const sortName = sortType !== '' ? data.prop : ''
      this.changeSearchfrom({ sortName, sortType })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  }
}
