import formMixin from 'mixins/form'
// import ErrorCode from '@/config/errorCode'

var mixin = {
  methods: {
    // 关闭弹窗
    onClose: function () {
      this.visible = false
      this.loading = true
      // 重置表单以及移除校验结果
      this.resetForm()
    },
    // 保存
    onSave: function () {
      var that = this
      that.validAndSubmit({
        loading: 'saveBtnLoading',
        api: this.$api.core.hash.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.table.$reload()
          that.onClose()
        },
        error: function () {
          that.$notify.success(this.savePromptMsg + '失败')
        }
      })
    },
    /**
     * 新增表单
     */
    onAddForm: function () {
      this.visible = true
      this.saveType = 'add'
      this.title = '新增哈希配置'
      this.loading = false
      this.model.id = 0
    },
    /**
     * 修改表单
     * @param row
     */
    onEditForm: function (row) {
      this.saveType = 'edit'
      this.title = '修改哈希配置'
      this.getHashById(row.id)
    },
    /**
     * 删除表格行数据
     * @param row
     */
    onDelete: function (row) {
      let that = this
      that.$http.fetch(that.$api.core.hash.deleteById, {
        id: row.id
      }).then(resp => {
        that.$notify.success(resp.msg)
        that.$reload()
      }).catch(() => {
        that.$notify.error('删除失败')
      })
    },
    // 获取数据字典详情
    getHashById: function (id) {
      let that = this
      that.$http.fetch(that.$api.core.hash.queryById, { id: id })
        .then((resp) => {
          let model = {
            hash_name: resp.result.hash_name,
            hash_key: resp.result.hash_key,
            hash_value: resp.result.hash_value,
            hash_type: resp.result.hash_type,
            is_write: resp.result.is_write,
            remark: resp.result.remark,
            id: resp.result.id
          }
          that.setModel(model)
        }).catch(() => {
          that.$notify.error('数据请求失败')
        }).finally(() => {
          that.visible = true
          that.loading = false
        })
    }

  }
}
export default {
  mixins: [formMixin, mixin],
  data: function () {
    let rules = {
      hash_name: [{
        required: true,
        message: '请输入哈希名称',
        trigger: 'blur'
      },
      {
        min: 0,
        max: 50,
        message: '已超过可输入长度',
        trigger: ['blur,change']
      }],
      hash_key:
      [{
        required: true,
        message: '请输入哈希键',
        trigger: 'blur'
      },
      {
        min: 0,
        max: 50,
        message: '已超过可输入长度',
        trigger: ['blur,change']
      },
      {
        validator: function (rule, val, callback) {
          // that.$http.fetch(that.$api.core.hash.isExistHashKey, {
          //   id: vm.model.id ? vm.model.id : 0,
          //   hashKey: val
          // }).then((resp) => {
          //   if (resp.code === ErrorCode.UNIQUE_REPEAT) {
          //     callback(new Error('哈希键已存在，请重新输入'))
          //   } else {
          //     callback()
          //   }
          // }).catch(() => {
          //   callback(new Error('远程校验失败'))
          // })
          callback()
        },
        trigger: 'change'
      }],
      hash_value: [{
        required: true,
        message: '请输入哈希值',
        trigger: 'blur'
      },
      {
        min: 0,
        max: 250,
        message: '已超过可输入长度',
        trigger: ['blur,change']
      }],
      remark: [{
        min: 0,
        max: 250,
        message: '已超过可输入长度',
        trigger: ['blur,change']
      }]
    }
    return {
      visible: false,
      title: '',
      saveType: '',
      loading: true,
      saveBtnLoading: false,
      rules: rules,
      model: {
        hash_name: '',
        hash_key: '',
        hash_value: '',
        hash_type: 0,
        is_write: 0,
        remark: '',
        id: 0
      },
      types: [{
        label: '集团',
        value: 0
      },
      {
        label: '品牌',
        value: 1
      },
      {
        label: '渠道',
        value: 2
      },
      {
        label: '店铺',
        value: 3
      }]
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
