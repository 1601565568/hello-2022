import formMixin from 'web-crm/src/mixins/form'
import ErrorCode from '@/config/errorCode'
// var vue
var mixin = {
  data: function () {
    return {
      rules: {
        template_title: [{
          required: true,
          message: '请输入模板名称，限制2-30字',
          trigger: 'blur'
        }, {
          min: 2,
          max: 30,
          message: '限2-30个字',
          trigger: ['blur', 'change']
        },
        {
          validator: (rule, value, callback) => {
            if (this.model.template_type !== '') {
              var that = this
              var id = 0
              if (typeof (that.model.id) !== 'undefined') {
                id = that.model.id
              }
              this.$http.fetch(that.$api.touch.reviewTemplate.hasTitleExist, { id: id, templateTitle: that.model.template_title, templateType: 9// 回评模板
              }).then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此模板已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
            } else {
              callback()
            }
          },
          trigger: ['blur']
        }
        ],
        template: [{
          required: true,
          message: '请输入解释内容',
          trigger: ['blur', 'change']
        }, {
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: ['blur', 'change']
        }]
      }
    }
  },
  methods: {
    // 打开弹窗
    onOpenDialog: function (type, title, data) {
      this.dialogTitle = title
      this.saveType = type
      if (this.saveType === 'edit') {
        this.$http.fetch(this.$api.touch.reviewTemplate.queryById, { id: data.id })
          .then((resp) => {
            var model = {}
            model.template_title = resp.result.template_title
            model.template = resp.result.template
            model.id = resp.result.id
            this.setModel(model)
          }).catch(() => {
          }).finally(() => {
            this.loading = false
            this.reviewTemplateVisible = true
          })
      } else {
        this.loading = false
        this.reviewTemplateVisible = true
      }
    },
    // 关闭弹窗
    onCloseDialog: function () {
      var that = this
      that.resetForm()
      that.loading = true
      that.reviewTemplateVisible = false
    },
    // 保存
    onSave: function () {
      var info
      if (this.saveType === 'edit') {
        info = '修改'
      } else {
        info = '新增'
      }
      var that = this
      that.saveDisabled = true
      that.validAndSubmit({
        api: this.$api.touch.reviewTemplate.saveOrUpdateTemplate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.reviewTemplateTable.$reload()
          that.resetForm()
          that.reviewTemplateVisible = false
        },
        error: function () {
          that.$notify.error(info + '失败')
        },
        complete: () => {
          that.saveDisabled = false
        }
      })
    }
  },
  watch: {}
}
export default {
  data: function () {
    return {
      tabs: 'reviewTemplate',
      reviewTemplateVisible: false,
      dialogTitle: '',
      saveType: '',
      loading: true,
      // 模板示例
      remark: '',
      model: {
        template_type: 9, // 回评模板
        template_title: '',
        template: ''
      },
      templateTypeOptions: [],
      wxAccountOptions: []
    }
  },
  mixins: [mixin, formMixin],
  created: function () {
    // vue = this
  },
  mounted: function () {
  }
}
