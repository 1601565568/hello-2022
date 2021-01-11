
<template>
<!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
<div class="page-rewardSetAdd">
  <el-dialog
  :title="title"
  width='600px'
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  :before-close="handleClose">
    <div>已选门店:<span class="text-error">{{selectedArr.length}}</span>家</div>
    <div class="comDialogBoxCon">
      <el-form ref="form" :inline="true" :model="saveObj" :rules="rules">
      <div class="addTitBox">
        <span class="addTitText">销售提成</span>
        <el-form-item>
          <el-switch :active-value="1" :inactive-value="0" v-model="saveObj.salesStatus"></el-switch>
        </el-form-item>
      </div>
      <div class="addItemCon">
        线上成单：成单导购提成
        <el-form-item  prop="onlineSalesRewardOrder">
          <el-input-number class="inputSize" :controls="false" :precision="2"
                           v-model.number="saveObj.onlineSalesRewardOrder"></el-input-number>
        </el-form-item>%；
        专属导购提成
        <el-form-item  prop="onlineSalesRewardExclusive">
          <el-input-number class="inputSize" :controls="false" :precision="2"
                           v-model.number="saveObj.onlineSalesRewardExclusive"></el-input-number>
        </el-form-item><span>%</span>
      </div>
      <div class="addItemCon">
        门店成单：成单导购提成
        <el-form-item  prop="salesRewardOrder">
          <el-input-number class="inputSize" :controls="false" :precision="2"
                           v-model.number="saveObj.salesRewardOrder"></el-input-number>
        </el-form-item><span>%；</span>
        专属导购提成
        <el-form-item  prop="salesRewardExclusive">
          <el-input-number class="inputSize" :controls="false" :precision="2"
                           v-model.number="saveObj.salesRewardExclusive"></el-input-number>
        </el-form-item><span>%</span>
      </div>
      <div class="addTitBox">
        <span class="addTitText">招募新会员奖励</span>
        <el-form-item>
          <el-switch  :active-value="1" :inactive-value="0" v-model="saveObj.memberStatus"></el-switch>
        </el-form-item>
      </div>
        <el-form-item label="招募奖励：  每招募一名新会员奖励" prop="memberReward" class="el-form-validate__unHide addItemCon">
          <el-form-grid class="memberReward">
            <el-input-number class="inputSize" :controls="false" :precision="2"
                             v-model.number="saveObj.memberReward"></el-input-number>
          </el-form-grid>
          <el-form-grid>
            元
          </el-form-grid>
        </el-form-item>
        <div class="addTitBox">
          <span class="addTitText">新加好友奖励</span>
          <el-form-item>
            <el-switch  :active-value="1" :inactive-value="0" v-model="saveObj.addfriendStatus"></el-switch>
          </el-form-item>
        </div>
        <el-form-item label="新加好友奖励：  每添加一名新好友奖励" prop="addfriendReward" class="el-form-validate__unHide addItemCon">
          <el-form-grid class="memberReward">
            <el-input-number class="inputSize" :controls="false" :precision="2"
                             v-model.number="saveObj.addfriendReward"></el-input-number>
          </el-form-grid>
          <el-form-grid>
            元
          </el-form-grid>
        </el-form-item>
    </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import ElInputNumber from '@nascent/nui/lib/input-number'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElInputNumber
  },
  props: {
    callBack: Function
  },
  data () {
    // 校验数值
    let checkNumber = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      } else {
        let arr = /^([-+]?\d{1,10})(\.\d{1,2})?$/
        if (!arr.test(value)) {
          callback(new Error('请输入10位以内整数且最多2位小数'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false, // 防重复提交
      saveObj: {
        list: []
      },
      rules: {
        onlineSalesRewardOrder: [{ validator: this.checkDecimals, trigger: ['blur', 'change'] }],
        onlineSalesRewardExclusive: [{ validator: this.checkDecimals, trigger: ['blur', 'change'] }],
        salesRewardOrder: [{ validator: this.checkDecimals, trigger: ['blur', 'change'] }],
        salesRewardExclusive: [{ validator: this.checkDecimals, trigger: ['blur', 'change'] }],
        memberReward: [{ validator: checkNumber, trigger: ['blur', 'change'] }],
        addfriendReward: [{ validator: checkNumber, trigger: ['blur', 'change'] }]
      },
      title: '',
      curMonth: 5,
      dialogVisible: false,
      selectedArr: [],
      shopList: []
    }
  },
  created: function () {},
  methods: {
    showToggle (data) {
      this.selectedArr = data.selectedArr
      // 单条就回显
      if (data.selectedArr.length === 1) {
        this.title = '设置提成奖励'
        this.saveObj = JSON.parse(JSON.stringify(data.selectedArr[0]))
      } else {
        this.title = '批量设置提成奖励'
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async saveFun () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 组装选择的门店
          this.saveObj.list = [] // 清空
          this.selectedArr.forEach((value, key) => {
            this.saveObj.list.push({
              id: value.id,
              shopId: value.shopId
            })
          })
          this.$http.fetch(this.$api.guide.guide.rewardruleSave, this.saveObj)
            .then(resp => {
              this.loading = false
              this.handleClose()
              // 回调刷新列表
              this.$props.callBack()
            })
            .catch(resp => {
              this.loading = false
              this.$notify.error(getErrorMsg('保存失败', resp))
            })
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    // checkMax (rule, value, callback) {
    //   let error
    //   if (value) {
    //     if (Number(value) > 100) {
    //       error = '不允许超过100%'
    //     }
    //   }
    //   callback(error)
    // },
    // 校验数值
    checkDecimals (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入数字'))
      } else {
        let arr = /^([-+]?\d*)(\.\d{1,2})?$/
        if (!arr.test(value)) {
          callback(new Error('最多输入2位小数'))
        } else if (Number(value) > 100) {
          callback(new Error('不允许超过100%'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .comDialogBox {
    width: 600px !important;
  }
  .addItemCon {
    padding: 5px 0 0 10px;
  }
  .addTitBox {
    border-bottom: 1px solid var(--theme-base-border-color-primary);
    >>> .el-form-item.el-form-item--small {
      margin-bottom: 0 !important;
    }
  }
  .addTitText {
    display: inline-block;
    vertical-align: middle;
    border-left: 2px solid var(--theme-color-primary);
    padding: 0 8px;
  }
  .el-form--inline .el-form-item {
    margin-right: var(--default-margin-small) !important;
  }
  .inputSize {
    width: 100px;
  }
  >>> .el-input-number .el-input .el-input__inner {
    padding-right: var(--default-padding-base);
  }
  .memberReward {
    margin-left: var(--default-margin-small);
  }
  .page-rewardSetAdd .el-input__inner{
    padding-right: 10px !important;
    text-align: right;
  }
</style>
