import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../mixins/redpacketTable'
export default {
  data () {
    return {
      url: this.$api.guide.redpacket.getSendList,
      model: {
        guideIds: [] // 员工筛选
      },
      chooseItem: {}, // 员工展示弹框的请求数据
      visible: false,
      detailPath: '/Social/SocialOperation/RedPacket/Send/Edit'
    }
  },
  mixins: [tableMixin, redpacketTable],
  mounted () {
    this.$reload()
  },
  methods: {
    /**
     * 修改状态
     * @param {*} id
     * @param {*} value
     */
    handleChangeState (id, value) {
      this.changeState(this.$api.guide.redpacket.updateSendState, { id, state: this.normalType + this.closeType - value })
    },
    /**
     * 展示员工弹框
     * @param {*} settingId
     * @param {*} useType
     */
    handlePreview (settingId, useType) {
      this.chooseItem = { settingId, useType }
      this.visible = true
    }
  }
}
