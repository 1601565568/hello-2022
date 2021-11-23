<template>
  <div class="prize-view">
    <el-form
      label-width="110px"
      label-position="left"
      :model="model"
      size="medium"
      class="normal-from"
      :rules="rules"
      ref="setPrizeruleForm"
    >
      <template v-if="model.prizeStatus">
        <el-form-item class="larger-item" label="奖品设置" prop="prizeSendPlan">
          <el-select
            :disabled="isStating || isEditSetPrize"
            v-model="model.prizeSendPlan"
            placeholder="请选择奖励"
            class="NsUi_select"
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
        <el-form-item>
          <el-table
            ref="table"
            class="new-table_border"
            :data="model.prizeRuleList"
          >
            <!-- <el-table-column type="default" label="阶梯">
              <template slot-scope="scope">
                阶梯{{[ '一', '二', '三', '四', '五' ][scope.$index]}}
              </template>
            </el-table-column> -->
            <el-table-column type="default" label="达标门槛（人）" min-width="120"  :sortable="false">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'prizeRuleList.' + scope.$index + '.recruitment'"
                >
                  <el-input-number
                    :disabled="isStating || isEditSetPrize"
                    style="width:118px;"
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
                    }
                  ]"
                >
                  <el-select
                    :disabled="isStating || isEditSetPrize"
                    v-model="scope.row.prizeType"
                    placeholder="请选择奖励"
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
                  <div class="coupon" @click="getCoupon">
                    <p v-if="!scope.row.prizeId" class="getCoupon">
                      请选择
                    </p>
                    <p v-else class="couponText">{{ scope.row.prizeName }}</p>
                    <Icon type="couponicon" />
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column type="default" min-width="150"  label="剩余数量" :sortable="false">
              <template slot-scope="scope">
                <p>{{ scope.row.validNumber }}</p>
              </template></el-table-column
            >
            <el-table-column type="default" min-width="150"  label="活动奖励总数" :sortable="false">
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
            <el-table-column type="default" min-width="150"  label="活动剩余数量" :sortable="false" v-if="isEdit && !isCopy">
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
              min-width="150"
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
            <!-- <el-table-column type="default" label="操作">
              <ns-button type="text" @click="updateStair('add')">新增</ns-button>
              <ns-button type="text" @click="updateStair('del')">删除</ns-button>
            </el-table-column> -->
          </el-table>
          <div class="remind-view">
            <span class="remind-color"></span>
            <span>活动奖励总数用完后，将不再对符合获奖规则的消费者发放奖励</span>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <Coupon ref="Coupon" @onChangeCoupon="getCouponMessage"></Coupon>
  </div>
</template>
<script>
import ElInputNumber from '@nascent/nui/lib/input-number'
import Coupon from './coupon'
import ValidateUtil from '@/utils/validateUtil'
import activityUtil from '@/utils/activityUtil'
import { clone } from 'lodash'
export default {
  components: { ElInputNumber, Coupon },
  props: {
    prizeModel: {
      type: Object
    },
    isStating: {
      type: Boolean
    },
    isSetPrize: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    }
  },
  watch: {
    model: {
      handler (newValue, oldValue) {
        const item = this.formartSave(newValue)
        this.$emit('updatePrize', item)
      },
      deep: true
    },
    prizeModel () {
      this.setModel()
    }
  },
  data () {
    // 效验库存设置
    const checkStock = (item, rule, value, callback) => {
      // if (this.isStating || this.isSetPrize) {
      //   callback()
      //   return
      // }
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
    return {
      model: {
        prizeStatus: 1, // 奖励机制 0 关闭 1 开启
        prizeSendPlan: 1, // 发放奖励
        prizeRuleList: [
          {
            prizeGrade: 1,
            addPrizeNumber: 0, // 新增活动奖励总数
            prizeId: null,
            recruitment: 1, // 邀请人数
            prizeName: '', // 优惠券名称
            prizeNumber: '', // 设置活动奖励总数
            validNumber: 0 // 优惠券剩余数量
          }
        ]
      },
      isEditSetPrize: false, // 未开始活动未开启奖励设置可编辑，已开启禁止编辑
      ValidateUtil: { ...ValidateUtil, checkStock, checkaddPrizeNumber },
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
        }
      ],
      isCopy: false
    }
  },
  mounted () {
    const query = this.$route.query
    const { copyGuestCodeId } = query
    this.isCopy = copyGuestCodeId && copyGuestCodeId.length > 0
    this.setModel()
  },
  methods: {
    updateStair (type) {
      this.$emit('updateStair', type)
    },
    remainNumber (item) {
      const prizeNumber = parseInt(item.prizeNumber) || 0
      const prizePresentsNumber = parseInt(item.prizePresentsNumber) || 0
      const num = prizeNumber - prizePresentsNumber
      return num
    },
    validateRules () {
      return new Promise((resolve, reject) => {
        this.$refs.setPrizeruleForm.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
    },
    setModel () {
      const query = this.$route.query
      const { copyGuestCodeId } = query
      // 未开始活动编辑状态
      if (this.isSetPrize) {
        // debugger
        this.isEditSetPrize = this.prizeModel.prizeStatus === 1 || this.prizeModel.prizeStatus// 可编辑
        if (this.prizeModel.prizeStatus === 1 || this.prizeModel.prizeStatus) {
          this.model = {
            prizeStatus: this.prizeModel.prizeStatus,
            prizeSendPlan: this.prizeModel.prizeSendPlan,
            prizeRuleList: this.prizeModel.prizeRuleList
          }
        }
      }
      if (this.isStating || (copyGuestCodeId && this.prizeModel.prizeStatus)) {
        this.model = {
          prizeStatus: this.prizeModel.prizeStatus,
          prizeSendPlan: this.prizeModel.prizeSendPlan,
          prizeRuleList: this.prizeModel.prizeRuleList
        }
      }
    },
    getCoupon () {
      if (this.isStating || this.isEditSetPrize) {
        return false
      }
      this.$refs.Coupon.init()
    },
    getCouponMessage (data) {
      const obj = this.model.prizeRuleList[0]
      let params = {
        ...obj,
        prizeId: data.activityCouponConfigId,
        prizeName: data.couponTitle,
        validNumber: data.validNumber
      }
      this.$set(this.model.prizeRuleList, 0, params)
    },
    onSave () {
      return new Promise((resolve, reject) => {
        this.$refs.setPrizeruleForm.validate((valid, object) => {
          if (valid) {
            const saveModel = this.formartSave(this.model)
            resolve(saveModel)
          } else {
            this.$notify.error(
              activityUtil.getValidatorFirstErrObj(object).message
            )
            resolve(false)
          }
        })
      })
    },
    formartSave (model) {
      const saveModel = clone(model)
      return {
        prizeStatus: saveModel.prizeStatus ? 1 : 0,
        prizeSendPlan: saveModel.prizeSendPlan,
        prizeRuleList: saveModel.prizeRuleList.map((item, index) => {
          return {
            ...item,
            prizeGrade: index + 1
          }
        })
      }
    }
  }
}
</script>
<style scoped lang='scss'>
@import '@components/NewUi/styles/reset.css';
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
  line-height: 36px;
  height: 36px;
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
.remind-view {
  position: absolute;
  top: 100px;
  left: 0;
  font-size: 12px;
  color: #595959;
  line-height: 20px;
  width: 400px;
  .remind-color {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #F2AA18;
    border-radius: 50%;
    margin-right: 8px;
  }
}
// .normal-from >>> .el-table .cell {
//   overflow: visible !important;
// }
// .normal-from >>> .el-table::before {
//   display: none;
// }
// .normal-from >>> .el-table__body-wrapper {
//   padding-bottom:20px;
// }
</style>
