import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [tableMixin],
  props: {
    visible: Boolean,
    appid: String
  },
  data () {
    return {
      NoImg: '',
      url: this.$api.isv.applyPlugin,
      sVisible: false,
      loading: false,
      saving: false,
      model: {},
      formModel: {
        pluginId: ''
      },
      rules: {
        pluginId: [
          { required: true, message: '请输入插件id', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.model = Object.assign({}, {
          appid: this.appid,
          type: 'list'
        })
        this.$searchAction$()
      }
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.model = Object.assign({})
      this.formModel = Object.assign({}, { pluginId: '' })
    },
    apply () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true
          this.$http.fetch(this.$api.isv.applyPlugin, {
            searchMap: Object.assign({}, this.formModel,
              { appid: this.appid, type: 'apply' })
          })
            .then(data => {
            })
            .catch(error => {
              this.$notify.error(getErrorMsg('申请异常', error))
            })
            .finally(() => {
              this.saving = false
            })
        }
      })
    },
    wordLimit: function (words) {
      return words.length > 100 ? words.substr(0, 99) + '...' : words
    },
    getStatus (status) {
      switch (status) {
        case '1':
          return '申请中'
        case '2':
          return '申请通过'
        case '3':
          return '被拒绝'
        case '4':
          return '申请已超时'
        default:
          return '未知'
      }
    }
  }
}
