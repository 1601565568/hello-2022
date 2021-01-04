import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    return {
      visible: false,
      loading: false,
      audioModel: {
        planId: '',
        planName: '',
        userName: '',
        obj: [],
        userStr: '',
        executeTime: '',
        auditRemark: '',
        auditResult: ''
      },
      rules: {
        auditResult: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
        ],
        auditRemark: [
          {
            validator: (rule, value, callback) => {
              if (this.audioModel.auditResult === 2 && !value) {
                callback(new Error('请输入审核意见'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  methods: {
    showAudit (planId) {
      if (!planId) {
        return false
      }
      this.visible = true
      const that = this
      this.loading = true
      that.$http.fetch(this.$api.marketing.weworkMarketing.queryAuditInfo, { planId: planId })
        .then((resp) => {
          if (resp && resp.result) {
            const audioModel = { planId: '', planName: '', userName: '', obj: [], userStr: '', executeTime: '', auditRemark: '', auditResult: '' }
            audioModel.planId = resp.result.id
            audioModel.planName = resp.result.planName
            audioModel.marketingType = resp.result.marketingType === 1 ? '好友消息' : resp.result.marketingType === 2 ? '群消息' : resp.result.marketingType === 3 ? '朋友圈' : '企业微信'
            audioModel.userName = resp.result.userName
            audioModel.executeTime = resp.result.executeTime
            audioModel.userStr = resp.result.userStr
            let typeName = ''
            if (resp.result.customerType === 1) {
              typeName = ' 个客户分群'
            } else if (resp.result.customerType === 2) {
              typeName = ' 个员工全部好友'
            } else if (resp.result.customerType === 4) {
              typeName = ' 个群主'
            } else {
              typeName = ' 个微信群'
            }
            audioModel.obj = (resp.result.userGroupIds.indexOf(',') ? resp.result.userGroupIds.split(',').length : 1) + typeName
            that.$set(this, 'audioModel', audioModel)
          }
        }).catch((resp) => {
          that.$notify.error(resp.msg)
          that.$reload()
        }).finally(() => {
          that.loading = false
        })
    },
    onCloseDialog () {
      this.visible = false
      this.$set(this, 'audioModel', {})
    },
    onSaveAuditInfo () {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.checkSubmitData()) {
            return false
          }
          const param = {
            wxActivityVo: {
              planId: this.audioModel.planId
            },
            auditRemark: this.audioModel.auditRemark ? this.audioModel.auditRemark.trim() : '',
            auditResult: this.audioModel.auditResult
          }
          that.$http.fetch(this.$api.marketing.weworkMarketing.auditActivity, param)
            .then(() => {
              that.$notify.success('提交成功')
              that.resetSaveAuditInfo()
              that.$refs.table.$reload()
            }).catch((resp) => {
              that.$notify.error(resp.msg)
              that.$refs.table.$reload()
            })
        } else {
        }
      })
    },
    resetSaveAuditInfo () {
      this.visible = false
      this.$set(this, 'audioModel', {})
    },
    checkSubmitData () {
      if (!this.audioModel) {
        this.$notify.error('参数为空')
        return false
      }
      if (!this.audioModel.auditResult) {
        this.$notify.error('请选择审核状态')
        return false
      }
      if (this.audioModel.auditRemark && this.audioModel.auditRemark.trim().length > 20) {
        this.$notify.error('审核意见字数过长')
        return false
      }
      return true
    }
  },
  created () {},
  mounted () {}
}
