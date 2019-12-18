<template>
  <!-- 门店优惠券--编辑弹窗  wanrengang 20180713 -->
  <div>
    <el-dialog
      title="追加优惠券数量"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      width="450px" height="180px"
      :before-close="handleClose">
      <div style="margin-left: 5px; margin-bottom: 10px">总量：<span>{{initObj.maxIssueAmount}}</span>张，已发放：<span>{{initObj.hadIssueAmount}}</span>张
      </div>
      <el-form ref="form" :model="addNumForm" label-width="120px" class="form-main" :rules="rules">
        <el-form-item label="追加数量：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="amount">
              <el-input type="number" v-model="addNumForm.amount"><span slot="append">张</span>
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" @click="saveFun">提交</ns-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    callBack: Function
  },
  data () {
    let rules = {
      amount: [{
        validator: (rule, val, call) => {
          if (!/^\+?[1-9][0-9]*$/.test(val)) {
            call(new Error('请输入大于0的整数'))
          }
          if (val <= 0) {
            call(new Error('数量必须大于0'))
          }
          call()
        }
      }]
    }
    return {
      rules: rules,
      initObj: {},
      dialogVisible: false,
      loading: false, // 防重复提交
      addNumForm: {
        amount: null
      }
    }
  },
  created: function () {},
  methods: {
    showToggle (data) {
      this.dialogVisible = true
      this.initObj = data
      this.addNumForm.couponId = data.id
    },
    async saveFun () {
      let validSuccess = false
      this.$refs.form.validate(valid => {
        if (valid) {
          validSuccess = true
        }
      })
      if (!validSuccess) {
        return
      }
      this.loading = true
      await this.$http.fetch(this.$api.coupon.storeCoupon.updateCouponMaxAmount, this.addNumForm).then(resp => {}).catch(() => {
        this.$notify.error('保存失败')
      })
      this.loading = false
      this.handleClose()
      // 回调刷新列表
      this.$props.callBack('addNum')
    },
    handleClose () {
      this.addNumForm = {
        amount: null
      }
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
