import formMixin from 'mixins/form' // 引入表单验证的一些相关方法
import ErrorCode from 'configs/errorCode'
import apiRequestConfirm from 'utils/apiRequestConfirm'
var mixin = {
  data: function () {
    return {
      onlineRules: {
        shopName: [
          {
            required: true,
            message: '请输入店铺名称',
            trigger: 'blur'
          }, {
            min: 0,
            max: 50,
            message: '最长50个字',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              this.$http.fetch(this.$api.core.sysShop.hasNameExist, {
                id: this.onlineModel.id ? this.onlineModel.id : 0,
                shopName: value,
                isOnline: 1
              })
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此店铺名称已存在，请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
            },
            trigger: 'blur'
          }
        ],
        channels: [{
          required: true,
          message: '请选择渠道',
          trigger: 'blur,change'
        }],
        platform: [{
          required: true,
          message: '请选择平台',
          trigger: 'blur'
        }],
        brands: [{
          required: true,
          message: '请选择关联品牌',
          trigger: 'change'
        }],
        remark: [{
          min: 0,
          max: 500,
          message: '最长500个字',
          trigger: 'blur'
        }]
      },
      bindRules: {
        brands: [{
          required: true,
          message: '请选择关联品牌',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    onCloseOnline: function () {
      this.$refs.onlineForm.resetFields()
      this.onlineDialogVisible = false
    },
    onCloseBind: function () {
      this.$refs.bindForm.resetFields()
      this.batchBrindVisiable = false
    },
    onBatchBind: function () {

    },
    onSubmitOnline: function () {
      var info
      if (this.onlineModel.id !== '') {
        info = '修改'
      } else {
        info = '添加'
      }
      let that = this
      that.saveDisabled = true
      that.$refs.onlineForm.validate((valid) => {
        if (valid) {
          that.$nextTick(() => {
            this.$http.fetch(this.$api.core.sysShop.saveOrUpdateOnline, that.onlineModel)
              .then((resp) => {
                if (resp.success) {
                  that.onlineDialogVisible = false
                  that.$notify.success(resp.result)
                  that.$refs.onlineForm.resetFields()
                  that.$refs.table.$reload()
                } else {
                  that.$notify.error(info + '失败')
                }
              }).catch(() => {
                that.$notify.error(info + '失败')
              }).finally(
              that.saveDisabled = false
            )
          })
        }
      })
    },
    getOnlineShopInfo: function (data) {
      let that = this
      let params = {id: data.id}
      this.$http.fetch(this.$api.core.sysShop.queryOnlineById, params)
        .then((resp) => {
          that.onlineModel.id = resp.result.id
          that.onlineModel.shopName = resp.result.shopName
          that.onlineModel.uid = resp.result.uid
          that.onlineModel.platform = resp.result.platform
          if (resp.result.channels !== null) {
            var tempChannelArr = resp.result.channels.split(',')
            this.onlineModel.channels = tempChannelArr
          }
          if (resp.result.brands !== null) {
            var tempBrandArr = resp.result.brands.split(',')
            this.onlineModel.brands = tempBrandArr
          }
          this.onlineModel.remark = resp.result.remark
          // this.onlineDialogVisible = true
        }).catch(() => {
        }).finally(() => {
          this.onlineDialogVisible = true
        })
    },
    onOpenDialog: function (type, title, data) {
      this.dialogTitle = title
      this.saveType = type
      if (this.saveType === 'edit') {
        this.getOnlineShopInfo(data)
      } else {
        this.onlineModel = {
          id: 0,
          shopName: '',
          uid: '',
          platform: '',
          channels: [],
          brands: [],
          remark: ''}
        this.onlineDialogVisible = true
      }
    },
    batchDel (ids) {
      apiRequestConfirm('删除该店铺').then(() => {
        this.$http.fetch(this.$api.core.sysShop.batchDetele, {'ids': ids})
          .then((resp) => {
            this.$notify.success('删除成功')
            this.$refs.table.$reload()
          })
      }).catch(() => {})
    }
  }
}
// 校验规则
// var vue
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      onlineDialogVisible: false,
      batchBrindVisiable: false,
      dialogTitle: '',
      saveType: '',
      saveDisabled: false,
      loading: false,
      brandOptions: [],
      channelOptions: [],
      contacts: [{type: 0, contact: ''}],
      bindBrandModel: {
        shopIds: [],
        shopNames: [],
        brands: []
      },
      onlineModel: {
        id: 0,
        shopName: '',
        uid: '',
        platform: '',
        channels: [],
        brands: [],
        remark: ''
      }
    }
  },
  mounted: function () {
    let that = this
    this.$http.fetch(this.$api.core.brand.queryOptionBrand)
      .then((resp) => {
        that.brandOptions = resp.result
      })
  },
  created: function () {
    //  vue = this
  }
  // 初始化页面的时候加载内容
}
