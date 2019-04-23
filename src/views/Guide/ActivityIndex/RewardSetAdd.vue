
<template>
<!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
<div class="page-rewardSetAdd">
  <el-dialog
  :title="title"
  width='40%'
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  :before-close="handleClose">
    <div class="topTip">已选门店:<span>{{selectedArr.length}}</span>家</div>
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
      <div class="addItemCon">
        招募奖励：每招募一名新会员奖励
        <el-form-item  prop="memberReward">
          <el-input-number class="inputSize" :controls="false" :precision="2"
                           v-model.number="saveObj.memberReward"></el-input-number>
        </el-form-item><span >元</span>
      </div>

      <!-- <div class="addTitBox">
        <span class="addTitText">分享奖励</span>
        <el-form-item>
          <el-switch  :active-value='1' :inactive-value='0' v-model="saveObj.shareStatus"></el-switch>
        </el-form-item>
      </div>
      <div class="addItemCon">
       分享奖励：分享链接每
       <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.shareNum" auto-complete="off"></el-input>
        </el-form-item>个,
       奖励
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.shareReward" auto-complete="off"></el-input>
        </el-form-item>元;
      </div> -->

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
export default {
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
        onlineSalesRewardOrder: [{ validator: checkNumber, trigger: 'blur' }],
        onlineSalesRewardExclusive: [{ validator: checkNumber, trigger: 'blur' }],
        salesRewardOrder: [{ validator: checkNumber, trigger: 'blur' }],
        salesRewardExclusive: [{ validator: checkNumber, trigger: 'blur' }],
        memberReward: [{ validator: checkNumber, trigger: 'blur' }]
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
              this.$notify.error(resp.msg)
            })
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.comDialogBox {
  width: 600px !important;
}
.addItemCon {
  padding: 15px 0 0 10px;
}
.addTitBox {
  height: 32px;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
}
.addTitText {
  font-size: 16px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  border-left: 2px solid #0091fa;
  padding: 0 8px;
}
.topTip {
  line-height: 32px;
  height: 32px;
  font-size: 13px;
}
.topTip span {
  color: #f00;
}
.el-form--inline .el-form-item {
  margin-right: 5px !important;
}
.inputSize {
  width: 100px;
}
</style>
<style>
  .page-rewardSetAdd .el-input__inner{
    padding-right: 10px !important;
    text-align: right;
  }
</style>
