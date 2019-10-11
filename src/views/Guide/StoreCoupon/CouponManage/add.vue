<template>
  <div class="form-main">
    <div class="viewBoxTit">
      <span class="fl">新增门店优惠券</span>
      <span class="fr"><ns-button @click="backList('back')">返回列表</ns-button></span>
    </div>
    <el-form
    ref="addForm"
    label-width="110px"
    :model="saveObj"
    v-loading="loading"
    :rules="addRules"
    :element-loading-text="$t('prompt.loading')">
    <el-form-item label="优惠券类型：" required>
      <el-radio-group v-model="saveObj.storeCouponType">
        <el-radio :label="1">代金券</el-radio>
        <el-radio :label="2">折扣券</el-radio>
        <el-radio :label="3">兑换券</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="优惠券名称：" prop="storeCouponTitle">
      <el-input type="text"  class="comInput" maxlength=10  v-model="saveObj.storeCouponTitle" placeholder="10个字以内"></el-input>
    </el-form-item>
    <el-form-item  v-show="saveObj.storeCouponType===1" label="面额：" prop="storeCouponValue">
      <el-input class="comInput" v-model="saveObj.storeCouponValue" type="number"><span slot="append">元</span></el-input>
    </el-form-item>
    <el-form-item v-show="saveObj.storeCouponType===2" label="折扣：" prop="storeCouponValue">
      <el-input class="comInput"  v-model="saveObj.storeCouponValue" type="number"><span slot="append">折</span></el-input>
    </el-form-item>
    <el-form-item v-show="saveObj.storeCouponType===3" label="兑换物品：" prop="storeCouponValue">
      <el-input class="comInput"  v-model="saveObj.storeCouponValue" type="number"><span slot="append">元</span></el-input>
    </el-form-item>
    <el-form-item label="发行量：" required>
      <el-radio-group v-model="saveObj.issueAmountType">
      <el-radio :label="1">
        <el-input style="width:100px" v-model="saveObj.maxIssueAmount" type="number">
          <span slot="append">张</span>
        </el-input>
      </el-radio>
      <el-radio :label="0">不限</el-radio>
    </el-radio-group>
  </el-form-item>
  <!-- 有效时间 start -->
  <el-form-item label="有效时间：" required>
    <el-form-grid>
      <el-form-item>
        <el-radio-group v-model="saveObj.dateValidType">
          <el-radio :label="0">固定时间</el-radio>
          <el-radio :label="1">相对时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  prop="isSelectTime" :rules="{ required: true, message: '请选择有效时间', trigger: 'change' }" v-if="saveObj.dateValidType===0">
        <el-date-picker
        v-model="couponTimeArr"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="couponTimeFun"
        >
      </el-date-picker>
      </el-form-item>
      <el-form-item v-if="saveObj.dateValidType===1">
        <el-form-grid>领取后第</el-form-grid>
        <el-form-grid size="xs">
          <el-form-item prop="afterGetValidDays">
            <el-input  type="number" v-model="saveObj.afterGetValidDays"></el-input>
          </el-form-item>
        </el-form-grid>
        <el-form-grid>天有效，有效期</el-form-grid>
        <el-form-grid size="xs">
          <el-form-item prop="validDays">
            <el-input v-model="saveObj.validDays"  type="number"><span slot="append">天</span></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <el-form-item   v-if="saveObj.dateValidType===1">
        <el-form-grid>有效截止日期</el-form-grid>
        <el-form-grid size="xmd">
          <el-form-item  prop="isSelectEndTiem" :rules="{ required: true, message: '请选择有效时间', trigger: 'change' }">
            <el-date-picker type="datetime"  @change="couponEndTimeFun" placeholder="选择日期" v-model="saveObj.endDateTime"></el-date-picker>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
    </el-form-grid>
  </el-form-item>
     <!-- 有效时间 end -->
     <!-- 使用条件 start -->
     <el-form-item label="使用条件：">
        <el-radio-group v-model="saveObj.useCondition.type">
          <el-form-item>
            <el-radio :label="0">无门槛</el-radio>
          </el-form-item>
          <el-form-item  v-show="saveObj.storeCouponType === 1 || saveObj.storeCouponType === 2">
            <el-radio :label="1">
              <el-form-grid>订单满</el-form-grid>
              <el-form-grid size="xs">
                <el-form-item prop="tradeAmount">
                  <el-input  type="number" v-model="saveObj.useCondition.tradeAmount"><span slot="append">元</span></el-input>
                </el-form-item></el-form-grid>
              <el-form-grid >
                <el-select style="width:100px" v-model="saveObj.useCondition.logic">
                  <el-option label="且" :value="'and'"></el-option>
                  <el-option label="或" :value="'or'"></el-option>
                </el-select>
              </el-form-grid>
              <el-form-grid>订单商品满</el-form-grid>
              <el-form-grid size="xs">
                <el-form-item prop="itemAmount">
                  <el-input  type="number" v-model="saveObj.useCondition.itemAmount"><span slot="append">件</span></el-input>
                </el-form-item>
              </el-form-grid>
            </el-radio>
          </el-form-item>
          <el-form-item v-show="saveObj.storeCouponType === 1 || saveObj.storeCouponType === 2">
            <el-radio :label="2" >
              <el-form-grid>同一订单同一商品第</el-form-grid>
              <el-form-grid size="xs">
                <el-form-item prop="itemCount">
                  <el-input  type="number" v-model="saveObj.useCondition.itemCount"><span slot="append">件</span></el-input>
                </el-form-item>
              </el-form-grid>
              <el-form-grid></el-form-grid>
            </el-radio>
          </el-form-item>
          <!-- 兑换券条件start -->
          <el-form-item v-show="saveObj.storeCouponType === 3">
            <el-radio :label="2" >
              <el-form-grid>加</el-form-grid>
              <el-form-grid size="xs">
                <el-form-item prop="itemCount">
                  <el-input v-model="saveObj.itemCount"  type="number"><span slot="append">元</span></el-input>
                  可用
                </el-form-item>
              </el-form-grid>
              <el-form-grid></el-form-grid>
            </el-radio>
          </el-form-item>
          <el-form-item v-show="saveObj.storeCouponType === 3">
            <el-radio :label="4">
              <el-form-grid>买指定商品可用
                <el-form-item v-show="saveObj.useCondition.type==4">
                  <ns-goods-select v-model="saveObj.giftArr"></ns-goods-select>
                </el-form-item>
              </el-form-grid>
            </el-radio>
          </el-form-item>
        </el-radio-group>
    </el-form-item>
    <!-- 使用条件 end -->
    <!-- 使用范围start -->
      <div class="addTit">使用范围</div>
      <el-form-item label="筛选商品：" v-show="saveObj.storeCouponType === 1 || saveObj.storeCouponType === 2">
        <el-form-grid>
          <el-form-item>
            <el-radio-group v-model="saveObj.useRange.itemRangeType">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">包含指定商品</el-radio>
              <el-radio :label="2">排除指定商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="saveObj.useRange.itemRangeType!==0">
          <el-form-item>
            <el-radio-group v-model="saveObj.useRange.itemContainType">
              <el-radio :label="0">全部包含</el-radio>
              <el-radio :label="1">只包含</el-radio>
              <el-radio :label="2">部分包含</el-radio>
            </el-radio-group>
          </el-form-item>
          </div>
        </el-form-grid>
        <el-form-item v-if="saveObj.useRange.itemRangeType !== 0" prop="goods">
          <ns-goods-select v-model="saveObj.goods"></ns-goods-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="指定门店：">
        <el-form-grid>
          <el-form-item>
            <el-radio-group v-model="saveObj.useRange.shopRangeType">
               <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">仅限所选门店</el-radio>
                <el-radio :label="2">排除所选门店</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form-grid>
        <el-form-item v-show="saveObj.useRange.shopRangeType!=0">
        <el-form-grid size="lg">
          <el-form-item prop="shopIds">
            <ns-shop-select v-model="shopArr" :area="saveObj.area" :channel="saveObj.channel"
                            :params="$parent.careType === 'PayConcern' ? {isOnline: 1}: {}"></ns-shop-select>
          </el-form-item>
        </el-form-grid>
        <Icon v-if="$parent.careType === 'PayConcern'" fontType="el-icon-info" className="text-tips">付款关怀仅支持线上店铺，不选则默认全部店铺</Icon>
        <Icon v-else fontType="el-icon-info" className="text-tips">不选则默认全部店铺</Icon>
      </el-form-item>
      </el-form-item>

    <!-- 使用范围end -->
     <el-form-item label="单数限制：">
        <el-radio-group v-model="saveObj.tradeCountValidType">
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">
            <el-form-grid>第</el-form-grid>
            <el-form-grid size="xxs">
              <el-form-item prop="tradeCountValid">
                <el-input type="number" v-model="saveObj.tradeCountValid"></el-input>
              </el-form-item>
            </el-form-grid>
            <el-form-grid>单可用</el-form-grid>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 可用时段start -->
       <el-form-item label="可用时段：">
        <el-radio-group v-model="saveObj.validTime.type">
          <el-radio :label="0">全部时段</el-radio>
          <el-radio :label="1">部分时段</el-radio>
        </el-radio-group>
        <el-form-grid v-if="saveObj.validTime.type===1" size="xxmd">
          <el-form-item prop="validTime">
            <el-time-picker is-range clearable arrow-control
            @change="validTimeFun"
            format="HH:mm:ss" v-model="validTimeArr"
                            range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
            </el-time-picker>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <!-- 不可用日期start -->
      <el-form-item label="不可用日期：">
        <el-radio-group v-model="saveObj.invalidDate.type">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">指定日期</el-radio>
        </el-radio-group>
        <el-form-grid v-if="saveObj.invalidDate.type===1" size="xxmd">
          <el-form-item prop="invalidDateList">
            <el-date-picker type="dates" v-model="invalidDateList" placeholder="选择一个或多个日期"></el-date-picker>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <!-- 领券限制start -->
      <el-form-item label="领券限制：">
      <el-form-grid size="xmd">
        <el-form-item prop="maxIssueCount">
          <el-input v-model="saveObj.maxIssueCount" type="number"><span slot="append">张</span></el-input>
        </el-form-item>
      </el-form-grid>
    </el-form-item>
<!-- 使用说明start -->
    <el-form-item label="使用说明：">
      <el-form-grid size="xlg">
        <el-form-item prop="remark">
          <el-input type="textarea" v-model="saveObj.remark"></el-input>
        </el-form-item>
      </el-form-grid>
    </el-form-item>
  <el-form-item label="">
    <ns-button type="primary" @click="saveFun('addForm')">提交保存</ns-button>
  </el-form-item>

  </el-form>
</div>
</template>
<script>
import moment from 'moment'
import NsShopSelect from '@nascent/ecrp-ecrm/src/components/NsShopSelect'
import NsGoodsSelect from '@nascent/ecrp-ecrm/src/components/NsGoodsSelect'
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    callBack: Function
  },
  data () {
    return {
      addRules: {
        storeCouponTitle: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        storeCouponValue: [
          { required: true, message: '请输入面额', trigger: 'blur' }
        ]
      },
      validTimeArr: [new Date(), new Date()], // 可用时间段
      invalidDateList: [], // 不可用日期
      couponTimeArr: [], // 有效时间
      loading: false, // 防重复提交
      shopArr: [],
      saveObj: {
        isSelectTime: '',
        isSelectEndTiem: '',
        // 订单商品
        goods: [],
        giftArr: [],
        // 店铺
        storeCouponType: 1,
        storeCouponTitle: '',
        storeCouponValue: '',
        issueAmountType: 1, // 发行量的类型
        maxIssueAmount: '',
        useCondition: {
          // 使用条件
          type: 0
        },
        useRange: {
          // 筛选商品
          itemRangeType: 0, // 商品筛选类型（0不限 1包含指定商品 2排除指定商品 ）
          shopRangeType: 0 // 门店指定类型（0不限 1仅限所选门店 2排除所选门店）
        },
        tradeCountValidType: 0, // 0表示不限
        validTime: {
          type: 0, // 可用时段类型（0全部时段 1部分时段）
          endTime: '',
          startTime: ''
        },
        invalidDate: {
          type: 0, // 不可用日期类型（0不限制 1指定日期）
          dayList: []
        },
        dateValidType: 0, // 固定时间
        endDateTime: '',

        maxIssueCount: 2, // 领券限制
        remark: ''
      },
      curMonth: 5,
      dialogVisible: true,
      selectedArr: [],
      shopList: []
    }
  },
  created: function () {},
  methods: {
    // 返回列表
    backList (val) {
      this.$emit('showList', val)
    },
    // 选择可用时间段
    validTimeFun (e) {
    },
    // 选择固定时间
    couponTimeFun (e) {
      this.saveObj.isSelectTime = 1
      var startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
      var endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')
      this.couponTimeArr = [startTime, endTime]
    },
    // 选择相对时间
    couponEndTimeFun (e) {
      this.saveObj.isSelectEndTiem = 1
      this.saveObj.endTime = moment(e).format('YYYY-MM-DD HH:mm:ss')
    },
    showToggle (data) {
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    saveFun (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 有效时间--固定
          if (this.saveObj.dateValidType === 0) {
            if (this.couponTimeArr.length === 0) {
              this.$notify.error('请选择有效时间')
              return
            }
            this.saveObj.startTime = this.couponTimeArr[0]
            this.saveObj.endTime = this.couponTimeArr[1]
          }
          this.doSaveFun()
        } else {
          return false
        }
      })

      // 回调刷新列表
      // this.$props.callBack()
    },
    async doSaveFun () {
      if (this.saveObj.validTime.type === 1) {
        // 部分时段可用
        this.saveObj.validTime.startTime = moment(this.validTimeArr[0]).format(
          'HH:mm:ss'
        )
        this.saveObj.validTime.endTime = moment(this.validTimeArr[1]).format(
          'HH:mm:ss'
        )
      }
      // 不可用日期
      if (this.invalidDateList.length > 0) {
        this.saveObj.invalidDate.dayList = []
        for (var i = 0, len = this.invalidDateList.length; i < len; i++) {
          this.saveObj.invalidDate.dayList.push(
            moment(this.invalidDateList[i]).format('YYYY-MM-DD')
          )
        }
      }
      // 若单数限制tradeCountValidType为0则
      if (this.saveObj.tradeCountValidType === 0) {
        this.saveObj.tradeCountValid = 0
      }
      if (this.saveObj.issueAmountType === 0) {
        this.saveObj.maxIssueAmount = 0
      }
      if (this.saveObj.giftArr.lenght > 0) {
        this.saveObj.giftJson = JSON.stringify(this.saveObj.giftArr)
      }
      if (this.shopArr.lenght > 0) {
        this.saveObj.useRange.shopJson = JSON.stringify(this.shopArr)
      }
      if (this.saveObj.goods.lenght > 0) {
        this.saveObj.useRange.itemJson = JSON.stringify(this.saveObj.goods)
      }
      this.loading = true
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.saveOrUpdateCoupon, this.saveObj)
        .then(resp => {
          this.$emit('showList', 'add')
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    handleClose () {
      this.dialogVisible = false
    }
  },
  components: {
    NsGoodsSelect,
    NsShopSelect
  }
}
</script>
<style scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
.viewBoxTit {
  height: 42px;
  border-bottom: 1px solid #ccc;
}
.viewBoxTit span.fl {
  font-size: 18px;
  line-height: 42px;
}
.addTit {
  font-size: 16px;
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #ccc;
  text-indent: 10px;
}
.selectBox {
  padding: 15px 0;
  width: 360px;
}
.selectBox dt {
  font-size: 14px;
  font-weight: 700;
  color: #999;
  height: 32px;
  line-height: 32px;
}
.selectBox dd {
  line-height: 24px;
  height: 24px;
  border-bottom: 1px dashed #ccc;
}
.comInput {
  width: 220px;
}
</style>
