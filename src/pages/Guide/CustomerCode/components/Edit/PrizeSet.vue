<template>
  <div>
    <el-form
      label-width="110px"
      size="medium"
      label-position="left"
      :model="model"
      class="normal-from padding-form"
      :rules="rules"
      ref="setPrizeruleForm"
    >
      <el-form-item
        label="奖品设置"
        prop="name"
        class="larger-item"
      >
        <el-switch v-model="model.isOpnePrize"/>
      </el-form-item>
      <el-form-item v-if='model.isOpnePrize'>
        <el-table
          ref="table"
          class="new-table_border border-round"
          :data="model.prizeRuleList"
        >
          <el-table-column type="default" label="阶梯">
            <template slot-scope="scope">
              阶梯{{[ '一', '二', '三', '四', '五' ][scope.$index]}}
            </template>
          </el-table-column>
          <el-table-column type="default" label="达标门槛（人）" min-width="120"  :sortable="false">
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.recruitment'"
                :rules="[
                  {
                    validator: ValidateUtil.checkRankNumber.bind(this, scope.$index),
                    trigger: ['blur']
                  }
                ]"
              >
                <el-input-number
                  :disabled="isStating || isEditSetPrize"
                  style="width:100%"
                  size="medium"
                  v-model="scope.row.recruitment"
                  controls-position="right"
                  :min="1"
                  :step="1"
                  step-strictly
                  controls
                  onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            type="default"
            label="奖励类型"
            :sortable="false"
            min-width="150"
            class="el-form__change"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.prizeType'"
                :rules="[
                  {
                    required: true,
                    message: '请选择奖励类型',
                    trigger: ['blur', 'change']
                  },
                ]"
              >
                <el-select
                  :disabled="isStating || isEditSetPrize"
                  v-model="scope.row.prizeType"
                  placeholder="请选择奖励"
                  @change='(value)=>{handleChangePrizeType(scope,value)}'
                >
                  <el-option
                    v-for="item in prizeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column type="default" min-width="150" label="奖励内容" :sortable="false">
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.prizeId'"
                :rules="[{
                    required: true,
                    message: '请选择奖励内容',
                    trigger: ['blur', 'change']
                  }]"
              >
                <div class="coupon" @click="handleSetPrize(scope)">
                  <p v-if="!scope.row.prizeId" class="getCoupon">
                    请选择
                  </p>
                  <p v-else class="couponText">{{ scope.row.prizeName }}</p>
                  <Icon type="couponicon" />
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column type="default" max-width="150"  label="剩余数量" :sortable="false">
            <template slot-scope="scope">
              <p>{{ scope.row.validNumber }}</p>
            </template></el-table-column
          >
          <el-table-column type="default" min-width="100"  label="活动奖励总数" :sortable="false">
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.prizeNumber'"
                :rules="[
                  {
                    validator: ValidateUtil.isPureNumber,
                    message: '请填写大于等于0的整数',
                    trigger: ['blur', 'change']
                  },
                  {
                    required: true,
                    message: '请设置活动奖励总数',
                    trigger: ['blur', 'change']
                  },
                  {
                    validator: ValidateUtil.checkDigitalLength.bind(
                      this,
                      null,
                      10
                    ),
                    trigger: ['blur', 'change']
                  },
                  {
                    validator: ValidateUtil.checkStock.bind(this, scope.row),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input
                  :disabled="isStating || isEditSetPrize"
                  v-model="scope.row.prizeNumber"
                  maxlength="10"
                  type="number"
                ></el-input
              ></el-form-item>
            </template>
          </el-table-column>
          <el-table-column type="default" min-width="100"  label="活动剩余数量" :sortable="false" v-if="isEdit">
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.prizeNumber'"
              >
                <el-input
                  :value="remainNumber(scope.row)"
                  type="number"
                  :disabled="true"
                ></el-input
              ></el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            type="default"
            min-width="100"
            label="追加数量"
            :sortable="false"
            v-if="isStating || isEditSetPrize"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'prizeRuleList.' + scope.$index + '.addPrizeNumber'"
                :rules="[
                  {
                    validator: ValidateUtil.isPureNumber,
                    message: '请填写大于等于0的整数',
                    trigger: ['blur', 'change']
                  },
                  {
                    required: true,
                    message: '请设置追加数量',
                    trigger: ['blur', 'change']
                  },
                  {
                    validator: ValidateUtil.checkDigitalLength.bind(
                      this,
                      null,
                      10
                    ),
                    trigger: ['blur', 'change']
                  },
                  {
                    validator: ValidateUtil.checkaddPrizeNumber.bind(
                      this,
                      scope.row
                    ),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input
                  v-model="scope.row.addPrizeNumber"
                  maxlength="10"
                  type="number"
                ></el-input
              ></el-form-item>
              <!-- <p v-else>{{ scope.row.prizeNumber }}</p> -->
            </template>
          </el-table-column>
          <el-table-column type="default" label="操作">
            <template slot-scope="scope">
              <ns-button type="text" :disabled='isEdit' v-if='scope.$index === 0 && model.prizeRuleList.length < maxLength' @click="handleAddPrizeItem">新增</ns-button>
              <ns-button type="text" :disabled='isEdit' v-if='scope.$index && scope.$index === model.prizeRuleList.length - 1' @click="handleDelPrizeItem(scope.$index)">删除</ns-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="remind-view">
          <span class="remind-color"></span>
          <span>活动奖励总数用完后，将不再对符合获奖规则的消费者发放奖励</span>
        </div> -->
      </el-form-item>
      <el-form-item  v-if='model.isOpnePrize' label="领奖规则" prop="guideIds" class="larger-item">
        <div class='swicth-item'>
          <span>允许奖品叠加领取</span>
          <template v-if='model.prizeRuleList && model.prizeRuleList.length > 1'>
            <el-switch v-model="model.isOnlyReceiveByMember" :active-value='1' :inactive-value='0' :disabled="isStating"/>
          </template>
          <template v-else>
            <el-switch :value='false' :disabled='true' />
          </template>
        </div>
        <div class="qrcode-bottom-view">
          <span class="remind-view"></span>
          若打开则允许用户领取多阶梯奖励，若关闭则领取一次后不可再领取其他奖励
          <el-tooltip  placement="top" popper-class='popperClass'>
            <ns-button type='text' class='safe-btn'>
              示例说明
            </ns-button>
            <template slot='content'>
              若开启（允许）：张三完成了阶梯一并领取了奖励，当他再完成阶梯二的要求时，可继续领取阶梯二的奖励
              <br/>
              若关闭（不允许）：张三完成了阶梯一并领取了奖励，当他再完成阶梯二的要求时，不可领取阶梯二的奖励
            </template>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item v-if='model.isOpnePrize'>
        <div class='swicth-item'>
          <span>仅会员可领取奖励</span>
          <el-switch v-model="model.prizeLadderRule" :active-value='1' :inactive-value='0' :disabled="isStating"/>
        </div>
        <div class="qrcode-bottom-view">
          <span class="remind-view"></span>
          非会员注册入会后才可领取奖励
          <ns-button type='text' class='safe-btn' @click='handleGoSet'>
            去设置入会链接
          </ns-button>
        </div>
      </el-form-item>
    </el-form>
    <div class='costomcode-footer'>
      <div class='btn' @click="handlePrev">上一步，基础信息</div>
      <div class='btn current' @click="handleSubmit">下一步</div>
    </div>
    <Coupon ref="Coupon" @onChangeCoupon="getCouponMessage"></Coupon>
    <el-dialog title="选择红包"
      custom-class='full-dialog'
      class='full-dialog'
      width='1000px'
      :modal-append-to-body='true' :append-to-body='true'
      :visible.sync="redpackVisible">
      <StrategiesList v-if='redpackVisible' :chooseItem='chooseItem' ref='strategiesList' :extModel="{remainder:0,redpackType:1}" :isFormCustomCode='true'/>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="redpackVisible = false">取 消</ns-button>
        <ns-button type="primary" @click="handleSureRedPack">确 定</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DEFAULT_SETPRIZE_DATA, STEP_LIST, DEFAULT_PRIZE_ITEM } from '../../src/const'
import validates from '../../src/validates'
import ValidateUtil from '@/utils/validateUtil'
import ElInputNumber from '@nascent/nui/lib/input-number'
import StrategiesList from '@/pages/Guide/RedPacket/components/StrategiesList'
import Coupon from '../coupon'
export default {
  data () {
    // 效验库存设置
    const checkStock = (item, rule, value, callback) => {
      if (this.isEdit) {
        callback()
        return
      }
      if (parseFloat(item.prizeNumber) > parseFloat(item.validNumber)) {
        callback(new Error('发放数量不能大于剩余数量'))
      } else if (parseFloat(item.prizeNumber) === 0) {
        callback(new Error('活动奖励总数不能0'))
      } else {
        callback()
      }
    }
    const checkaddPrizeNumber = (item, rule, value, callback) => {
      if (parseFloat(item.addPrizeNumber) > parseFloat(item.validNumber)) {
        callback(new Error('数量不能大于剩余数量'))
      } else {
        callback()
      }
    }
    // 校验阶梯数字是否递增
    const checkRankNumber = (index, rule, value, callback) => {
      const { prizeRuleList } = this.model
      if (!value) {
        callback(new Error('请输入达标门槛'))
      } else {
        const pre = prizeRuleList[index - 1] ? prizeRuleList[index - 1].recruitment : 0
        const next = prizeRuleList[index + 1] ? prizeRuleList[index + 1].recruitment : Infinity
        if (value > pre && value < next) {
          callback()
        } else {
          callback(new Error('达标人数不符合按阶梯递增的规则，请核对'))
        }
      }
    }
    return {
      model: { ...DEFAULT_SETPRIZE_DATA },
      isEditSetPrize: false, // 未开始活动未开启奖励设置可编辑，已开启禁止编辑 design by zwx
      ValidateUtil: { ...ValidateUtil, checkStock, checkaddPrizeNumber, checkRankNumber },
      rules: {
        prizeType: [
          {
            required: true,
            message: '请选择发放类型',
            trigger: ['blur', 'change']
          }
        ]
      },
      prizeList: [
        {
          label: '优惠券',
          value: 1
        },
        {
          label: '红包',
          value: 2
        }
      ],
      redpackVisible: false,
      chooseItem: {}, // 如果红包记录选择的那项
      chooseIndex: -1, // 选择的下标
      maxLength: 5 // 阶梯奖励最大数
    }
  },
  props: ['data', 'isStating', 'isEdit'],
  components: { ElInputNumber, Coupon, StrategiesList },
  methods: {
    // 新增阶梯奖项
    handleAddPrizeItem () {
      this.model.prizeRuleList.push({ ...DEFAULT_PRIZE_ITEM, prizeGrade: this.model.prizeRuleList.length + 1 })
    },
    // 删除阶梯奖项
    handleDelPrizeItem (index) {
      this.model.prizeRuleList.splice(index, 1)
    },
    handleGoSet () {
      const { origin } = window.location
      window.open(origin + '/Guide/RecruitSet/NotMemberPageConfig')
    },
    /**
     * 切换奖励类型后清空奖励
     */
    handleChangePrizeType (scope, value) {
      const { $index, row } = scope
      this.$set(this.model.prizeRuleList, $index, { ...DEFAULT_PRIZE_ITEM, prizeType: value, recruitment: row.recruitment, prizeGrade: row.prizeGrade })
    },
    /**
     * 判断奖励类型
     */
    handleSetPrize (scope) {
      if (this.isStating || this.isEditSetPrize) {
        return false
      }
      const { $index, row } = scope
      this.$refs.setPrizeruleForm.validateField('prizeRuleList.' + $index + '.prizeType', (result) => {
        if (!result) {
          const { prizeType } = scope.row
          if (prizeType === 1) {
            this.getCoupon()
          } else if (prizeType === 2) {
            this.chooseItem = row
            this.redpackVisible = true
          }
        }
      })
      this.chooseIndex = $index
    },
    /**
     * 设置红包奖励
     */
    handleSureRedPack () {
      const checkedItem = this.$refs.strategiesList.checkItem
      const item = this.model.prizeRuleList[this.chooseIndex]
      // 由于要回显，这里暂时不删除弹框返回的数据,等待保存的时候重新格式化
      const minxinItem = Object.assign(item, checkedItem, {
        prizeId: checkedItem.id,
        prizeName: checkedItem.name,
        validNumber: checkedItem.remainder
      })
      this.$set(this.model.prizeRuleList, this.chooseIndex, minxinItem)
      this.redpackVisible = false
    },
    getCoupon () {
      if (this.isStating || this.isEditSetPrize) {
        return false
      }
      this.$refs.Coupon.init()
    },
    getCouponMessage (data) {
      const obj = this.model.prizeRuleList[this.chooseIndex]
      let params = {
        ...obj,
        prizeId: data.activityCouponConfigId,
        prizeName: data.couponTitle,
        validNumber: data.validNumber
      }
      this.$set(this.model.prizeRuleList, this.chooseIndex, params)
    },
    /**
     * 判断是否有重复奖品，重新计算库存是否超出
     */
    judgeDuplicatePrizes () {
      const obj = {}
      this.model.prizeRuleList.map(item => {
        const { prizeId, prizeType, validNumber, prizeNumber, addPrizeNumber = 0 } = item
        const key = '' + prizeId + prizeType
        const num = this.isEdit ? addPrizeNumber : prizeNumber
        if (obj[key]) {
          obj[key].value = parseInt(obj[key].value) + parseInt(num)
        } else {
          obj[key] = { max: validNumber, value: num }
        }
      })
      const objList = Object.values(obj)
      if (objList.length >= this.model.prizeRuleList.length) {
        return true
      }
      for (let i = 0; i < objList.length; i++) {
        const item = objList[i]
        if (item.value > item.max) {
          return false
        }
      }
      return true
    },
    remainNumber (item) {
      const prizeNumber = parseInt(item.prizeNumber) || 0
      const prizePresentsNumber = parseInt(item.prizePresentsNumber) || 0
      const num = prizeNumber - prizePresentsNumber
      return num
    },
    handlePrev () {
      this.$emit('changeStepId', 'prev')
    },
    handleSubmit () {
      this.$refs.setPrizeruleForm.validate((valid) => {
        if (valid) {
          if (this.judgeDuplicatePrizes()) {
            this.$emit('changeData', {
              key: STEP_LIST[1].dataName,
              value: this.model
            })
            this.$emit('changeStepId', 'next')
          } else {
            this.$notify.error('我也不知道提示什么，反正是错了')
          }
        }
      })
    }
  },
  mounted () {
    this.model = { ...this.data }
  }
}
</script>
<style scoped lang='scss'>
@import '@components/NewUi/styles/reset.css';
@import "../../styles/customcode.css";
.Tips {
  padding: 0 16px;
  line-height: 40px;
  color: #595959;
  background: #f2f9fe;
  height: 40px;
  border-radius: 2px;
  margin-bottom: 16px;
}
.coupon {
  /* width: 118px; */
  line-height: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  padding: 0 5px;
}
.getCoupon {
  color: #bfbfbf;
  font-size: 14px;
}
.couponText {
    width: 85%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.form-item_toptext {
  line-height: 22px;
  font-size: 12px;
  color: #595959;
  margin-bottom: 8px;
  .form-item_toptext__length {
    font-size: 14px;
    span {
      color: #0091fa;
    }
  }
  >>> .el-radio {
    line-height: 21px;
  }
}
.employee-list {
    display: flex;
    padding: 8px 0 0 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
.employee-list_item {
  display: inline-block;
  align-items: center;
  background: #f5f5f5;
  margin-right: 4px;
  margin-bottom: 8px;
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 14px;
  i {
    margin-left: 4px;
    cursor: pointer;
    display: inline;
  }
}
.employee-list_all {
  display: inline-block;
  height: 18px;
  line-height: 18px;
  color: #fff;
  width: 18px;
  text-align: center;
  border-radius: 50%;
  background: #8c8c8c;
  margin-top: 3px;
  cursor: pointer;
}
.employee-text {
  font-size: 14px;
  color: #bfbfbf;
  padding-bottom: 8px;
}
.prompt-text {
  display: flex;
  align-items: center;
  .yellow-point {
    background: #f2aa18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.question-circle {
  position: relative;
  top: 1px;
  left: 5px;
}
.form-item_time {
  display: flex;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 2px;
}
.employee-suffix {
  color: #bfbfbf;
}
.time-line-view {
  display: inline-block;
  margin-left: 8px;
}

.swicth-item {
  display: flex;
  align-items: center;
  span{
    margin-right:8px;
    font-size: 12px;
    color: #595959;
  }
}
.padding-form {
  padding-right: 22px;
  min-width: 1123px;
}
.border-round {
  border: 1px solid #D9D9D9;
}
</style>
<style scoped>
.form-item_time {
  >>> .el-form-item__label:before {
    display: none !important ;
  }
  >>> .el-form-item {
    margin-bottom: 0px;
  }
  >>> .el-form-item.is-error .el-input__inner {
    border-color: #F56C6C !important;
  }
}
.normal-from .border-round >>> .el-table__body-wrapper {
  padding-bottom: 0 !important;
}
.border-round >>> .el-table__body tr:last-child td {
  border:none;
}
.border-round >>> .el-table__body-wrapper {
  overflow: visible;
}
.border-round.el-table  {
  overflow: visible;
}
</style>
