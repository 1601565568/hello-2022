import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'

var vue
var mixin = {
  data: function () {
    return {
      rules: {
        templateName: [{
          required: true,
          message: '请输入模板名称',
          trigger: ['blur', 'change']
        }, {
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }, {
          validator: (rule, value, callback) => {
            if (value) {
              this.$http.fetch(this.$api.touch.wxTemplate.hasNameExist
                , { id: vue.model.id ? vue.model.id : 0, name: value }).then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此模板名称已存在,请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
            }
          },
          trigger: 'blur'
        }],
        templateCode: [{
          required: true,
          message: '请选择微信官方模板',
          trigger: 'change'
        }],
        templateType: [{
          required: true,
          message: '请选择模板类型',
          trigger: 'change'
        }],
        'template.remark': [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: ['blur', 'change']
        }],
        'template.detailContent': [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: ['blur', 'change']
        }]
      }
    }
  }
}
export default {
  data: function () {
    return {
      tabs: 'wxTemplate',
      wxTemplateVisible: false,
      dialogTitle: '',
      saveType: '',
      // 模板示例
      model: {
        id: 0,
        templateName: '',
        templateType: '',
        templateCode: '',
        template: {
          wxTemplateName: '',
          detailContent: '',
          remark: '',
          detailLink: '',
          templateTags: []
        },
        remark: ''
      },
      templateTypeOptions: [],
      wxTemplateTagsList: [],
      currWxTemplate: {},
      loading: false,
      dateStr: '',
      saveBtnLoading: false
    }
  },
  mixins: [mixin, formMixin],
  created: function () {
    vue = this
    this.getTemplateType()
    this.getWxTemplateTags()
    this.getCurrDateFormat()
  },
  methods: {
    onAdd: function () {
      this.saveType = 'add'
      this.dialogTitle = '新增微信模板'
      this.wxTemplateVisible = true
      this.loading = false
    },
    // 打开弹窗
    onEdit: function (data) {
      var that = this
      that.dialogTitle = '修改微信模板'
      that.saveType = 'edit'
      this.$http.fetch(this.$api.touch.wxTemplate.queryById, { id: data.id }).then((resp) => {
        that.setModel(that.handleEchoData(resp.result))
      }).catch(() => {
        that.$notify.error('数据请求失败')
      }).finally(() => {
        that.loading = false
        that.wxTemplateVisible = true
      })
    },
    /**
     * 处理数据回显
     * @param data
     * @returns {*}
     */
    handleEchoData (data) {
      let model = this.transObjProp2CamelCase(data)
      model.template = JSON.parse(model.templateContent)
      delete model.templateContent
      delete model.createTime
      delete model.updateTime
      return model
    },
    // 关闭弹窗
    onClose: function () {
      this.resetForm()
      this.wxTemplateVisible = false
      this.loading = true
    },
    // 保存
    onSave: function () {
      var info
      var that = this
      if (this.saveType === 'edit') {
        info = '新增'
      } else {
        info = '修改'
      }
      that.validAndSubmit({
        loading: 'saveBtnLoading',
        api: this.$api.touch.wxTemplate.saveOrUpdate,
        handleParams: this.handleSubmitParams,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.wxTemplateTable.$reload()
          that.onClose()
        },
        error: function () {
          that.$notify.error(info + '失败')
        }
      })
    },
    /**
     * 处理提交参数
     * @param params
     * @returns {*}
     */
    handleSubmitParams: function (params) {
      params.templateContent = JSON.stringify(params.template)
      delete params.template
      return this.transObjProp2Underline(params)
    },
    /**
     * 选择关怀微信模板时触发
     */
    onSelectWxTemplate: function () {
      let wxTemplateCode = this.model.templateCode
      if (wxTemplateCode) {
        let wxTemplateTag = this.wxTemplateTagsList.find(item => {
          return wxTemplateCode === item.wx_template_code
        })
        if (wxTemplateCode) {
          this.currWxTemplate = wxTemplateTag
          this.model.template.templateTags = JSON.parse(wxTemplateTag.wx_template_json)
          this.model.template.wxTemplateName = wxTemplateTag.wx_template_name
        }
      }
    },
    /**
     * 获取模板类型
     */
    getTemplateType () {
      let that = this
      // 查询模板类型下拉列表数据
      this.$http.fetch(this.$api.touch.wxTemplate.queryTemplateType).then((resp) => {
        that.templateTypeOptions = resp.result
      })
    },
    /**
     * 获取官方微信模板
     */
    getWxTemplateTags () {
      let that = this
      // 查询模板类型下拉列表数据
      this.$http.fetch(this.$api.touch.wxTemplate.queryWxTemplateTagsList).then((resp) => {
        that.wxTemplateTagsList = resp.result
      })
    },
    /**
     * 获取当前格式化的时间
     */
    getCurrDateFormat () {
      let date = new Date()
      let currMonth = date.getMonth() + 1
      let currDate = date.getDate()
      this.dateStr = (currMonth > 9 ? currMonth : '0' + currMonth) + '月' + (currDate > 9 ? currDate : '0' + currDate) + '号'
    }
  }
}
