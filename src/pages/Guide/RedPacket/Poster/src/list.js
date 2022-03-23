import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../mixins/redpacketTable'
export default {
  data () {
    return {
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType, // 平台判断
      model: {
        name: '', // 封面名称
        operatorName: '' // 创建人
      },
      drawer: false,
      url: this.$api.guide.redpacket.getCoverList,
      detailPath: '/Social/SocialOperation/RedPacket/Poster/Edit',
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  mixins: [tableMixin, redpacketTable],
  mounted () {
    this.$reload()
  },
  methods: {
    // 删除封面
    handleDelete (id, isDefault) {
      if (isDefault) {
        this.$notify.error('默认封面不能删除')
        return false
      }
      this.$confirm('删除后不可恢复，使用此封面的红包替换为默认封面', '确定删除？', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteCover(id)
      })
    },
    deleteCover (id) {
      this.$http.fetch(this.$api.guide.redpacket.deleteCover(id))
        .then(() => {
          this.$searchAction$()
          this.$notify.success('删除成功')
        }).catch(() => {
          this.$notify.error('操作失败')
        })
    },
    /**
     * 修改状态
     * @param {*} id
     * @param {*} isDefault
     * @return {*}
     */
    handleChangeState (id, isDefault) {
      if (isDefault) {
        this.$notify.error('至少保留一个默认封面')
        return false
      }
      this.changeState(this.$api.guide.redpacket.setDefault(id), {}, true)
    }
  }
}
