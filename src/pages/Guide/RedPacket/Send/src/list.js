import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
import { redpacketTypeMap, normalRed, luckyRed, diyRed } from '../../const'
export default {
  data () {
    return {
      url: this.$api.guide.redpacket.getSendList,
      redPacket,
      model: {
        guideIds: []
      },
      redpacketTypeMap,
      normalRed,
      luckyRed,
      diyRed,
      chooseItem: {},
      visible: false
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.$reload()
  },
  methods: {
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleDetail (query = {}) {
      this.$router.push({
        path: '/Social/SocialOperation/RedPacket/Send/Edit',
        query
      })
    },
    handleChangeState (id, value) {
      this.$http.fetch(this.$api.guide.redpacket.updateSendState, { id, state: 3 - value }).then(res => {
        if (res.success) {
          this.$searchAction$()
        }
      })
    },
    handlePreview (settingId, useType) {
      this.chooseItem = { settingId, useType }
      this.visible = true
    },
    handleSort (data) {
      this.changeSearchfrom({ sortName: data.prop, sortType: data.order === 'ascending' ? 1 : 0 })
    }
  }
}
