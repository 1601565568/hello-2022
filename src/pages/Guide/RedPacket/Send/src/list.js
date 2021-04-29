import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redPacket from '@/assets/redPacket.png'
import { redpacketTypeMap, normalRed, luckyRed, diyRed } from '../../const'
import { getErrorMsg } from '@/utils/toast'
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
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('操作失败', resp))
      })
    },
    handlePreview (settingId, useType) {
      this.chooseItem = { settingId, useType }
      this.visible = true
    },
    handleSort (data) {
      const sortType = data.order === 'ascending' ? 1 : data.order === 'descending' ? 0 : ''
      const sortName = sortType !== '' ? data.prop : ''
      this.changeSearchfrom({ sortName, sortType })
    }
  }
}
