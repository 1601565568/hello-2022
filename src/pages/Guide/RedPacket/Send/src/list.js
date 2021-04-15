import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
export default {
  data () {
    return {
      redPacket,
      model: {
      },
      data: [{}]
    }
  },
  mixins: [tableMixin]
}
