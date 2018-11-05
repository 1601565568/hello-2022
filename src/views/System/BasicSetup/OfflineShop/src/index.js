import formMixin from 'mixins/form' // 引入表单验证的一些相关方法
import ErrorCode from 'configs/errorCode'
import apiRequestConfirm from 'utils/apiRequestConfirm'
var mixin = {
  data: function () {
    return {
      key: {
        children: 'children',
        label: 'label',
        value: 'label',
        disabled: 'disabled'
      },
      offlineRules: {
        shopName: [
          {
            required: true,
            message: '请输入店铺名称',
            trigger: 'change'
          }, {
            min: 0,
            max: 50,
            message: '最长50个字',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              this.$http.fetch(this.$api.core.sysShop.hasNameExist, {
                id: this.offlineModel.id ? this.offlineModel.id : 0,
                shopName: value,
                isOnline: 0
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
            trigger: 'change'
          }],
        contacts: [{
          validator: (rule, value, callback) => {
            let rgx = /^(\+?86-?)?1(3|4|7|5|8)[0-9]{9}$/
            let c = /^(010|02\d{1}|0[3-9]\d{2})-\d{7,9}(-\d+)?$/
            let b = /^(4|8)00(-\d{3,4}){2}$/
            if (value[0].type === 1) {
              if ((value[0].contact).match(rgx)) {
                callback()
              } else {
                callback(new Error('请输入正确手机号'))
              }
            } else if (value[0].type === 0) {
              if ((value[0].contact).match(b) || (value[0].contact).match(c)) {
                callback()
              } else {
                callback(new Error('请输入正确座机电话,区号以-分隔'))
              }
            }
          },
          required: true,
          trigger: 'change'
        }],
        district: [{
          required: true,
          message: '请选择地区',
          trigger: 'change'
        }],
        openShopTime: [{
          required: true,
          message: '请选择开业时间',
          trigger: 'change'
        }],
        businessTimeSpan: [{
          required: true,
          message: '请输入营业时间',
          trigger: 'change'
        }],
        channels: [{
          required: true,
          message: '请选择渠道',
          trigger: 'change'
        }],
        platform: [{
          required: true,
          message: '请选择平台',
          trigger: 'change'
        }],
        brands: [{
          required: true,
          message: '请选择关联品牌',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入店铺地址',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    sendChange: function (value) {
      let _this = this
      _this.offlineModel.postage = 0
      if (value) {
        _this.offlineModel.sendMethod = 1
      } else {
        _this.offlineModel.sendMethod = 0
      }
    },
    handleVerify: function (index, contact) {
      console.log(contact.type)
      console.log(contact.contact)
    },
    onChange: function (data) {
      let that = this
      that.offlineModel.province = data[0]
      that.offlineModel.city = data[1]
      that.offlineModel.district = data[2]
    },
    onCloseOffline: function () {
      // this.$refs.sendEmailForm.resetFields()
      this.area = []
      this.offlineDialogVisible = false
    },
    onCloseUpdate () {
      this.updateDialogVisible = false
    },
    onSaveOffline: function () {
      var deliverMethod = this.offlineModel.deliverMethod
      if (deliverMethod !== null && deliverMethod !== '') {
        if (deliverMethod.length === 2) {
          this.offlineModel.deliverWay = '1,2'
        } else {
          this.offlineModel.deliverWay = deliverMethod[0] + ''
        }
      } else {
        return
      }
      if (this.offlineModel.deliverWay.search('1') !== -1) {
        if (this.offlineModel.postage === 0) {
          return
        }
      }
      var that = this
      that.$http.fetch(this.$api.core.sysShop.updateShopExtension, that.offlineModel)
      .then((resp) => {
        if (resp.success) {
          that.offlineDialogVisible = false
          that.$notify.success(resp.result)
          that.$refs.offlineForm.resetFields()
          that.$refs.table.$reload()
        } else {
          that.$notify.success('失败')
        }
      }).catch(resp => {
        that.$notify.error(resp.code)
      }).finally(
        that.saveDisabled = false
      )
    },
    onSubmitOffline: function () {
      var deliverMethod = this.offlineModel.deliverMethod
      if (deliverMethod !== null && deliverMethod !== '') {
        if (deliverMethod.length === 2) {
          this.offlineModel.deliverWay = '1,2'
        } else {
          this.offlineModel.deliverWay = deliverMethod[0] + ''
        }
      } else {
        return
      }
      if (this.offlineModel.deliverWay.search('1') !== -1) {
        if (this.offlineModel.postage === 0) {
          return
        }
      }
      console.log(this.offlineModel.deliverWay)
      var info
      if (this.offlineModel.id !== '') {
        info = '修改'
      } else {
        info = '添加'
      }
      let that = this
      that.saveDisabled = true
      that.$refs.offlineForm.validate((valid) => {
        if (valid) {
          that.$nextTick(() => {
            that.$http.fetch(this.$api.core.sysShop.saveOrUpdateOffline, that.offlineModel)
              .then((resp) => {
                if (resp.success) {
                  that.offlineDialogVisible = false
                  that.$notify.success(resp.result)
                  that.$refs.offlineForm.resetFields()
                  that.$refs.table.$reload()
                } else {
                  that.$notify.success(info + '失败')
                }
              }).catch(resp => {
                that.$notify.error(resp.code)
              }).finally(
              that.saveDisabled = false
            )
          })
        }
      })
    },
    // 打开弹窗
    onOpenDialog: function (type, title, data) {
      this.dialogTitle = title
      console.log(type, title, data)
      this.saveType = type
      if (this.saveType === 'edit') {
        // this.getOfflineInfo(data)
        this.offlineModel.shopId = data.shopId
        // this.offlineModel.firstOrderPreferential = data.firstOrderPreferential
        if (data.deliverWay !== null) {
          if (data.deliverWay.search('1') !== -1) {
            this.offlineModel.sendMethod = 1
            this.offlineModel.postage = data.postage
          }
          this.offlineModel.deliverMethod = data.deliverWay.split(',')
          for (var x = 0; x < this.offlineModel.deliverMethod.length; x++) {
            this.offlineModel.deliverMethod[x] = Number(this.offlineModel.deliverMethod[x])
          }
          this.offlineModel.deliverWay = data.deliverWay
        }
        this.offlineDialogVisible = true
      }
      if (this.saveType === 'addOffline') {
        this.area = []
        this.offlineModel = {
          id: 0,
          shopType: 'ZYD',
          // officialAccount: '',
          shopStatus: 1,
          shopName: '',
          uid: '',
          openShopTime: '',
          businessTimeSpan: '',
          contactJson: '',
          contacts: [{type: 0, contact: ''}],
          province: null,
          city: null,
          district: null,
          address: '',
          channels: [],
          brands: [],
          longitude: '',
          latitude: '',
          remark: '',
          deliverMethod: [],
          deliverWay: '',
          postage: 0,
          firstOrderPreferential: 0,
          sendMethod: 0
        }
        this.offlineDialogVisible = true
      } else if (this.saveType === 'updateOffline') {
        this.updateDialogVisible = true
      }
    },
    getOfflineInfo: function (data) {
      let that = this
      let params = {id: data.id}
      this.$http.fetch(this.$api.core.sysShop.queryOfflineById, params)
        .then((resp) => {
          this.area = []
          this.offlineModel.id = resp.result.id
          this.offlineModel.shopStatus = resp.result.shopStatus
          this.offlineModel.shopType = resp.result.shopType
          this.offlineModel.shopName = resp.result.shopName
          this.offlineModel.uid = resp.result.uid
          this.offlineModel.platform = resp.result.platform
          this.offlineModel.province = resp.result.province
          this.offlineModel.city = resp.result.city
          this.offlineModel.district = resp.result.district
          this.offlineModel.address = resp.result.address
          this.offlineModel.businessTimeSpan = resp.result.business_time_span
          this.offlineModel.longitude = resp.result.longitude
          this.offlineModel.latitude = resp.result.latitude
          this.offlineModel.openShopTime = resp.result.open_shop_time
          this.area.push(resp.result.province)
          this.area.push(resp.result.city)
          this.area.push(resp.result.district)
          if (resp.result.deliverWay !== null) {
            if (resp.result.deliverWay.search('1') !== -1) {
              this.offlineModel.sendMethod = 1
              this.offlineModel.postage = resp.result.postage
            }
            this.offlineModel.deliverMethod = resp.result.deliverWay.split(',')
            for (var x = 0; x < this.offlineModel.deliverMethod.length; x++) {
              this.offlineModel.deliverMethod[x] = Number(this.offlineModel.deliverMethod[x])
            }
            this.offlineModel.deliverWay = resp.result.deliverWay
          }
          if (resp.result.channels !== null) {
            var tempChannelArr = resp.result.channels.split(',')
            this.offlineModel.channels = tempChannelArr
          } else {
            this.offlineModel.channels = []
          }
          if (resp.result.brands !== null) {
            var tempBrandArr = resp.result.brands.split(',')
            this.offlineModel.brands = tempBrandArr
          } else {
            this.offlineModel.brands = []
          }
          if (resp.result.contact_json !== null) {
            this.offlineModel.contacts = []
            var contacts = JSON.parse(resp.result.contact_json)
            for (var i = 0; i < contacts.length; i++) {
              this.offlineModel.contacts.push(contacts[i])
            }
          } else {
            this.offlineModel.contacts = [{type: 0, contact: ''}]
          }
          this.offlineModel.remark = resp.result.remark
          that.offlineDialogVisible = true
        }).catch(() => {
        }).finally(() => {
          that.visible = true
        })
    },
    /**
     * 处理添加联系方式
     */
    onHandleAddContact: function () {
      this.offlineModel.contacts.push({
        type: 0,
        contact: ''
      })
    },
    /**
     * 处理删除联系方式
     */
    onHandleDelContact: function (index) {
      console.log(index)
      this.offlineModel.contacts.splice(index, 1)
    },
    batchDel (ids) {
      var that = this
      apiRequestConfirm('删除该店铺').then(() => {
        that.$http.fetch(that.$api.core.sysShop.underDetele, {'ids': ids})
          .then((resp) => {
            that.$notify.success('删除成功')
            that.$refs.table.$reload()
          })
      }).catch(() => {})
    }
  }
}// 校验规则
// var vue
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      offlineDialogVisible: false,
      updateDialogVisible: false,
      dialogTitle: '',
      updateDialogTitle: '',
      saveType: '',
      saveDisabled: false,
      loading: false,
      brandOptions: [],
      channelOptions: [],
      area: [],
      deliverWay: [{id: 1, name: '配送'}, {id: 2, name: '自提'}],
      contacts: [{type: 0, contact: ''}],
      offlineModel: {
        id: 0,
        // officialAccount: null, // 公众号
        shopStatus: 1,
        shopType: 0,
        shopName: '',
        uid: '',
        openShopTime: '',
        businessTimeSpan: '',
        contactJson: '',
        contacts: [{type: 0, contact: ''}],
        province: null,
        city: null,
        district: null,
        address: '',
        channels: [],
        brands: [],
        deliverMethod: [],
        longitude: '',
        latitude: '',
        remark: ''
      }
    }
  },
  mounted: function () {
    let that = this
    // 关联品牌
    this.$http.fetch(this.$api.core.brand.queryOptionBrand)
      .then((resp) => {
        that.brandOptions = resp.result
      })
  },
  created: function () {
  }
  // 初始化页面的时候加载内容
}
