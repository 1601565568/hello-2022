import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
export default {
  data () {
    return {
      url: this.$api.guide.redpacket.getSendList,
      redPacket,
      model: {
      },
      data: [{}]
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.$reload()
  }
}
