import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
export default {
  data () {
    return {
      model: {
        endTime: '',
        launchType: null,
        name: '',
        payConfigId: null,
        redpackType: null,
        startTime: ''
      },
      url: this.$api.guide.redpacket.getReceiverList
    }
  },
  mixins: [tableMixin, redpacketTable],
  mounted () {
    this.$reload()
  },
  methods: {}
}
