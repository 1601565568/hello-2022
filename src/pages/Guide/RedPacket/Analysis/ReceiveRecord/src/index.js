import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
export default {
  data () {
    return {
      model: {
        endTime: '',
        launchType: null,
        customerNick: '',
        payConfigId: null,
        redpackType: null,
        startTime: ''
      },
      url: this.$api.guide.redpacket.getReceiverList,
      seachDate: [],
      payList: [],
      payMap: {}
    }
  },
  mixins: [tableMixin, redpacketTable],
  mounted () {
    this.$reload()
  },
  methods: {
    handleSearch () {}
  }
}
