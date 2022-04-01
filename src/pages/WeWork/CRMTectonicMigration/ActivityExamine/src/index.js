import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      messageId: 0, // 点中审核的id
      visibleExamineDialog: false, // 审核dialog
      visible: false,
      loading: false
    }
  },
  watch: {},
  methods: {
    /**
     * 审核活动
     */
    examineActivity (id) {
      this.visibleExamineDialog = true
    },
    // 审核处理接口
    async confirmExamineActivity (context) {
      try {
        const resp = await this.$http.fetch(this.$api.marketing.weworkMarketing.reviewWxActivity, context)
        this.$message.success('审核完成')
        this.$refs.table.$reload()
      } catch (respErr) {
        this.$message.error('审核失败')
      } finally {
        this.visibleCheckActivityDrawer = false
        // this.$emit('change')
      }
    },
    // 展示审核详情
    showAudit (messageId) {
      if (!messageId) {
        return false
      }
      this.messageId = messageId
      this.$refs.CheckActivityDrawer.getActivityDetailById()
    }
  },
  created () {},
  mounted () {}
}
