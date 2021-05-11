import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        endTime: '',
        payConfigId: null,
        launchType: null,
        startTime: '',
        redpackName: '',
        guideIds: []
      },
      url: this.$api.guide.redpacket.getRecordList,
      seachDate: []
    }
  },
  mixins: [tableMixin, redpacketTable],
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
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList')
    this.$reload()
  },
  methods: {
    handlePreview () {

    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  }
}
