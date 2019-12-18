import { getErrorMsg } from '@/utils/toast'

export default {
  props: {
    visible: Boolean,
    appid: String
  },
  data () {
    const originModel = {
      wechatId: ''
    }
    return {
      originModel,
      sVisible: false,
      loading: false,
      model: JSON.parse(JSON.stringify(originModel)),
      rules: {
        wechatId: [
          { required: true, message: '请输入微信号', trigger: ['change', 'blur'] }
        ]
      },
      saving: false
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.model = JSON.parse(JSON.stringify(this.originModel))
      this.$refs.form.resetFields()
    },
    onBindOrUnBindExperienceMember (type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true
          this.$http.fetch(this.$api.isv.bindOrUnBindExperienceMember, Object.assign({}, this.model,
            { type: type, appid: this.appid }))
            .then(data => {
              this.$notify.success(type === 1 ? '绑定成功' : '解绑成功')
            })
            .catch(error => {
              this.$notify.error(getErrorMsg((type === 1 ? '绑定' : '解绑') + '出现异常：', error))
            })
            .finally(() => {
              this.saving = false
            })
        }
      })
    }
  }
}
