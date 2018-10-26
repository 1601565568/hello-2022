import formMixin from 'mixins/form'
import ErrorCode from 'configs/errorCode'

var mixin = {
  data: function () {
    let that = this
    return {
      rules: {
        name: [{
          required: true,
          message: '请输入数据字典名称',
          trigger: ['blur', 'change']
        },
        {
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }],
        code:
        [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        },
        {
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        },
        {
          validator: (rule, value, callback) => {
            if (value !== '' && that.model.type !== '') {
              that.hasExist(value, that.model.type, callback)
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        type:
        [{
          required: true,
          message: '请输入类型',
          trigger: 'blur'
        },
        {
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        },
        {
          validator: (rule, value, callback) => {
            if (value !== '' && that.model.code !== '') {
              that.hasExist(that.model.code, value, callback)
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        remark: [{
          min: 0,
          max: 50,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }]
      }
    }
  },
  methods: {
    hasExist: function (code, type, callback) {
      let that = this
      this.$http.fetch(this.$api.core.dataDictionary.hasCodeAndTypeExist, {
        id: that.model.id ? that.model.id : 0,
        code: code,
        type: type
      }).then((resp) => {
        if (resp.code === ErrorCode.UNIQUE_REPEAT) {
          callback(new Error('编码与类型都已存在，请重新输入其中一项'))
        } else {
          callback()
        }
      }).catch(() => {
        callback(new Error('远程校验失败'))
      })
    },
    // 关闭弹窗
    onCloseDialog: function () {
      this.resetForm(this.orgModel)
      this.dataDictionaryVisible = false
    },
    // 保存
    onSave: function () {
      var info
      var that = this
      if (this.saveType === 'edit') {
        info = '修改'
      } else {
        info = '新增'
      }
      that.validAndSubmit({
        api: this.$api.core.dataDictionary.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.dataDictionaryTable.$reload()
          that.onClose()
        },
        error: function () {
          that.$notify.success(info + '失败')
        }
      })
    },
    onAdd: function () {
      this.saveType = 'add'
      this.dialogTitle = '新增数据字典'
      this.dataDictionaryVisible = true
    },
    onEdit: function (data) {
      this.saveType = 'edit'
      this.dialogTitle = '修改数据字典'
      this.getDataDictionaryDetail(data.id)
    },
    // 获取数据字典详情
    getDataDictionaryDetail: function (id) {
      var that = this
      this.$http.fetch(this.$api.core.dataDictionary.queryById, {id: id}).then((resp) => {
        var model = {
          name: resp.result.name,
          code: resp.result.code,
          type: resp.result.type,
          order_num: resp.result.order_num,
          remark: resp.result.remark,
          id: resp.result.id
        }
        that.setModel(model)
      }).catch(() => {
        that.$notify.error('数据请求失败')
      }).finally(() => {
        that.dataDictionaryVisible = true
      })
    }
  }
}
export default {
  mixins: [formMixin, mixin],
  data: function () {
    return {
      dataDictionaryVisible: false,
      dialogTitle: '',
      saveType: '',
      loading: false,
      model: {
        name: '',
        code: '',
        type: '',
        order_num: 1,
        remark: '',
        id: 0
      },
      types: {},
      saveBtnLoading: false
    }
  },
  mounted: function () {
    let that = this
    this.$http.fetch(this.$api.core.dataDictionary.getTypes).then((resp) => {
      that.types = resp.result ? resp.result : {}
    })
  }
}
