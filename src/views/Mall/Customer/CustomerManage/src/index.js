import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [formMixin],
  data: function () {
    return {
      loading2: false,
      row: null,
      dialogVisible: false,
      integralDialog: false,
      smsDialog: false,
      customerInfo: {},
      detail: '',
      sys_customer_id: null,
      integral: null,
      smsContent: null,
      mobile: null,
      names: null
    }
  },
  methods: {
    async showDetailDialog (row) {
      let that = this
      // loading2用于防止同步调接口等待时，多次点击造成重复调用
      if (that.loading2) { return }
      that.loading2 = true
      that.customerInfo = row
      if (!row) {
        that.$notify.error('必须选中一个客户')
        return
      }
      await that.$http.fetch(that.$api.mall.customer.getInfo, {
        sys_customer_id: row.sys_customer_id
      }).then((resp) => {
        let model = that.customerInfo
        let data = resp.result
        model = Object.assign(model, data)
        model.itemUnit = data.buy_total_num / (data.trade_times || 1)
        model.priceUnit = data.trade_amount / (data.trade_times || 1)
        if (model.itemUnit) { model.itemUnit = model.itemUnit.toFixed(2) + '件' }
        if (model.priceUnit) { model.priceUnit = model.priceUnit.toFixed(2) + '元' }
        if (data.first_success_time && data.last_success_time && data.trade_times) {
          let time1 = new Date(data.first_success_time).getTime()
          let time2 = new Date(data.last_success_time).getTime()
          model.buyTimesUnit = ((time2 - time1) / data.trade_times) / 24 / 3600 / 1000
          if (model.buyTimesUnit) { model.buyTimesUnit = model.buyTimesUnit.toFixed(3) + '天' }
        }
        if (!model.buyTimesUnit) { model.buyTimesUnit = null }
      }).catch(() => {
        that.$notify.error('客户详情查询失败')
      })
      that.loading2 = false
      that.dialogVisible = true
    },
    showIntegralDialog (row) {
      this.sys_customer_id = row.sys_customer_id
      this.integral = null
      this.integralDialog = true
    },
    showSmsDialog (row) {
      this.mobile = row.mobile
      this.names = row.true_name
      this.smsContent = null
      this.smsDialog = true
    },
    showSmsDialog2 (rows) {
      let mobile = ''
      let names = ''
      for (let i = 0; i < rows.length; i++) {
        if (!rows[i].mobile) { continue }
        mobile += ',' + rows[i].mobile
        names += ',' + (rows[i].true_name || '尊敬的客户')
      }
      if (!mobile) {
        this.$notify.warning('选中的客户无手机号，无法发送短信')
        return
      }
      this.mobile = mobile.substring(1)
      this.names = names.substring(1)
      this.smsContent = null
      this.smsDialog = true
    },
    addSmsName () {
      if (this.smsContent === null) { this.smsContent = '' }
      this.smsContent += this.names.indexOf(',') > 0 ? '{NAME}' : (this.names || '尊敬的客户')
    },
    sendSms () {
      let that = this
      if (!that.smsContent) {
        that.$notify.warning('短信内容不能为空')
        return
      }
      that.$http.fetch(that.$api.mall.customer.sendSms, {
        mobile: that.mobile,
        content: that.smsContent,
        names: that.names
      }).then((resp) => {
        if (!resp.success) {
          that.$notify.error(getErrorMsg('发短信失败', resp))
          return
        }
        that.smsDialog = false
        that.$notify.success('发短信成功')
      }).catch(() => {
        that.$notify.error('发短信失败')
      })
    },
    addCustomerIntegral () {
      let that = this
      if (!that.integral) {
        that.$notify.warning('发放的积分必须大于0')
        return
      }
      that.$http.fetch(that.$api.mall.customer.addCustomerIntegral, {
        sys_customer_id: that.sys_customer_id,
        integral: that.integral
      }).then((resp) => {
        if (!resp.success) {
          that.$notify.error(getErrorMsg('发积分失败', resp))
          return
        }
        that.integralDialog = false
        that.$notify.success('发积分成功')
      }).catch(() => {
        that.$notify.error('发积分失败')
      })
    }
  },
  mounted: function () {
    this.$refs.table.$reload()
  }
}
