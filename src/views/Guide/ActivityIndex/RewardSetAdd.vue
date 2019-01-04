
<template>
<!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
<div>
  <el-dialog
  :title="title"
  width='30%'
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  :before-close="handleClose">
    <div class="topTip">已选门店:<span>{{selectedArr.length}}</span>家</div>
    <div class="comDialogBoxCon">
      <el-form ref="form" :inline="true" :model="saveObj">
      <div class="addTitBox">
        <span class="addTitText">销售提成</span>
        <el-form-item>
          <el-switch :active-value="1" :inactive-value="0" v-model="saveObj.salesStatus"></el-switch>
        </el-form-item>
      </div>
      <div class="addItemCon">
        线上成单：成单导购提成
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.onlineSalesRewardOrder" auto-complete="off" step="0.0001"></el-input>
        </el-form-item>%;
        专属导购提成
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.onlineSalesRewardExclusive" auto-complete="off" step="0.0001"></el-input>
        </el-form-item><span>%;</span>
      </div>
      <div class="addItemCon">
        门店成单：成单导购提成
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.salesRewardOrder" auto-complete="off" step="0.0001"></el-input>
        </el-form-item><span>%;</span>
        专属导购提成
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.salesRewardExclusive" auto-complete="off" step="0.0001"></el-input>
        </el-form-item><span>%;</span>
      </div>
      <div class="addTitBox">
        <span class="addTitText">招募新会员奖励</span>
        <el-form-item>
          <el-switch  :active-value="1" :inactive-value="0" v-model="saveObj.memberStatus" step="0.0001"></el-switch>
        </el-form-item>
      </div>
      <div class="addItemCon">
        招募奖励：每招募一名新会员奖励
        <el-form-item  prop="age">
          <el-input type="number" style="width:60px" v-model.number="saveObj.memberReward" auto-complete="off" step="0.0001"></el-input>
        </el-form-item><span >元。</span>
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
    return {
      loading: false, // 防重复提交
      saveObj: {
        list: []
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
      console.log('showToggle')
      console.log(data)
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
      console.log(val)
      this.multipleSelection = val
    },
    async saveFun () {
      this.loading = true
      // 组装选择的门店
      this.saveObj.list = [] // 清空
      this.selectedArr.forEach((value, key) => {
        this.saveObj.list.push({
          id: value.id,
          shopId: value.shopId
        })
      })
      console.log('saveObj')
      console.log(this)
      await this.$http
        .fetch(this.$api.guide.guide.rewardruleSave, this.saveObj)
        .then(resp => {
          this.loading = false
          this.handleClose()
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
    },
    handleClose () {
      console.log('handleClose')
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
</style>