<template>
  <div>
    <el-dialog
      title="新增优惠券发放"
      width="960px"
      :visible.sync="addCouponDialogVisible"
      @closed="closeDialog"
    >
      <div class="addCouponDialogVisible">
        <el-form
          ref="form"
          :model="activityModel"
          label-width="90px"
          class="form-main"
          @submit.native.prevent
        >
          <el-form-item label="优惠券" prop="coupon_id" required>
            <el-form-grid size="xmd">
              <div class="choose-coupon" @click="onOpenCoupon()">
                <p v-if="activityModel.coupon_id == 0">请选择优惠券</p>
                <p v-else class="text">{{ storeModel.couponTitle }}</p>
                <Icon type="couponicon" />
              </div>
            </el-form-grid>
            <el-form-grid block class="text-primary">
              <span class="remind-color"></span><span class="remind-text">选择中台已新增的优惠券至导购系统</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="剩余数量" v-if="activityModel.coupon_id !== 0">
            <el-form-grid prop="store_coupon_total">
              <div
                class="disabled"
                v-if="
                  storeModel.maxType == 0 && storeModel.channelConfigType == 0
                "
              >
                不限量
              </div>
              <!-- 渠道配置类型（0：不限，1：配置） -->
              <!-- <div class="disabled" v-if="storeModel.channelConfigType == 0">{{storeModel.remainingQuantity}}</div> -->
              <div class="disabled" v-else>
                {{ storeModel.remainingQuantity }}
              </div>
            </el-form-grid>
            <el-form-grid block class="text-primary">
              <span class="remind-color"></span><span class="remind-text">中台发放优惠券的剩余数量</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="总配额" required>
            <el-form-grid size="xmd">
              <el-form-item prop="coupon_total">
                <el-input
                  style="width: 360px;font-size:14px;"
                  placeholder="请输入正整数"
                  type="number"
                  v-model="activityModel.coupon_total"
                  @input="activityCouponTotal"
                  auto-complete="off"
                >
                </el-input>
              </el-form-item>
            </el-form-grid>
            <el-form-grid block class="text-primary">
              <span class="remind-color"></span><span class="remind-text">设置优惠券的数量</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item
            label="分配渠道"
            v-if="activityModel.coupon_id !== 0"
            required
          >
            <el-form-grid>
              <el-form-item prop="type">
                <el-radio-group v-model="apportionChannel" fill="red">
                  <el-radio :label="0">导购分发</el-radio>
                  <el-radio :label="1">活动分发</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <template
            v-if="apportionChannel === 1 && activityModel.coupon_id !== 0"
          >
            <el-form-item>
              <el-form-grid>
              <el-select
                style="width:360px"
                v-model="activityType"
                placeholder="请选择方法优惠券活动"
              >
                <el-option
                  v-for="item in activityTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              </el-form-grid>
              <el-form-grid block class="text-primary">
                <span class="remind-color"></span><span class="remind-text">可参与发放券的门店在活动内单独控制</span>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-if="apportionChannel === 0">
            <el-form-item
              label="分配方式"
              v-if="activityModel.coupon_id !== 0"
              required
            >
              <!-- <el-form-grid> -->
              <el-form-item prop="type">
                <el-radio-group v-model="activityModel.type">
                  <el-radio :label="0" @change="onChangeDistributionMode(0)"
                    >公用</el-radio
                  >
                  <el-radio :label="1" @change="onChangeDistributionMode(1)"
                    >自由分配</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <!-- </el-form-grid> -->
              <el-form-grid block class="text-primary">
                <span class="remind-color"></span><span class="remind-text">公用：分配门店共享配额；自由分配：手动设置分配门店的配额</span>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="分配门店"
              v-if="activityModel.coupon_id !== 0"
              required
            >
              <el-form-item prop="type">
                <el-radio-group v-model="selectShopName" fill="red">
                  <el-radio :label="0">全部门店</el-radio>
                  <el-radio :label="1">部分门店</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-grid v-if="selectShopName === 1">
                <div class="flex-box">
                  <div class="employee-list">
                    <template v-if="shopList.length > 0">
                      <p class="employee-text">共{{ shopList.length }}家门店</p>
                    </template>
                    <template v-else>
                      <p class="empty-text">请选择门店</p>
                    </template>
                    <div></div>
                  </div>
                  <div class="employee-suffix">
                    <shopSelect
                      @callBack="handleChangeShop"
                      :hasShopArr.sync="shopList"
                      isDIYBtn
                    >
                      <template slot="btnIcon">
                        <Icon type="ns-store" />
                      </template>
                    </shopSelect>
                  </div>
                </div>
              </el-form-grid>
            </el-form-item>
            <el-form-item v-show="selectShopName === 1 && shopList && shopList.length ">
              <StoreList
                ref="storeList"
                :activityModel="activityModel"
                :storeModel="storeModel"
                :shopMap="shopMap"
                :shopListAll="shopAllList"
                @changeShopMap="changeShopMap"
                @removeShop="removeShop"
              ></StoreList>
            </el-form-item>
          </template>
          <div class="coupon">
            <div class="coupon-preview">优惠券预览区</div>
            <div class="coupon-box">
              <img :src="bgcoupon" v-if="activityModel.coupon_id == 0" />
              <div class="couponCard" v-else>
                <img
                  v-if="storeModel.couponType == 1"
                  src="./img/cash_coupon.png"
                />
                <img
                  v-if="storeModel.couponType == 2"
                  src="./img/discount_coupon.png"
                />
                <img
                  v-if="storeModel.couponType == 3"
                  src="./img/exchange_coupon.png"
                />
                <div class="couponCard-top">
                  <div class="couponCard-top__left">
                    <!-- 现金券 -->
                    <div class="money" v-if="storeModel.couponType == 1">
                      ￥<span>{{ storeModel.couponValue }}</span>
                    </div>
                    <!-- 兑换券 -->
                    <div class="couponType3" v-if="storeModel.couponType == 3">
                      <span>礼</span>
                    </div>
                    <!-- 折扣券 -->
                    <template v-if="storeModel.couponType == 2">
                      <div class="couponType2">
                        <span class="couponType2_number">{{
                          splitCouponNumber(storeModel.couponValue, 0)
                        }}</span>
                        <span
                          class="couponType2_number2"
                          v-if="isShowCouponNumber"
                          >{{
                            splitCouponNumber(storeModel.couponValue, 1)
                          }}</span
                        >
                        <span class="couponType2_text">折</span>
                      </div>
                    </template>
                  </div>
                  <div class="couponCard-top__right">
                    <p class="couponCard-top__right__time">
                      {{ storeModel.couponTitle }}
                    </p>
                    <p class="text-secondary" v-if="storeModel.dateType == 0">
                      {{ storeModel.startTime }} ~~ {{ storeModel.endTime }}
                    </p>
                    <p class="text-secondary" v-if="storeModel.dateType == 1">
                      领取{{
                        storeModel.after_get_valid_days
                      }}天后生效，有效期{{ storeModel.valid_days }}天
                    </p>
                    <p>创建人：{{ storeModel.loginAccount || '-' }}</p>
                    <!-- <p>使用说明：至多显示一行多余…悬停TIPS显示全部</p> -->
                    <p :title="storeModel.useRemark">
                      使用说明:{{ storeModel.useRemark || '-' }}
                    </p>
                    <p :title="storeModel.remark">
                      备注：{{ storeModel.remark || '-' }}
                    </p>
                  </div>
                </div>
                <div class="couponCard-bottom">
                  {{ storeModel.conditionJson }}
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button
          type="primary"
          @click="onSaveActivityCoupon"
          :loading="forbidden"
          :disabled="forbidden"
          title="save"
          >保存</ns-button
        >
      </div>
    </el-dialog>
    <Coupon ref="Coupon" @onChangeCoupon="getCouponMessage"></Coupon>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang="scss">
@import './src/index.scss';
@import './src/rIndex.css';
.empty-text {
  color: #bfbfbf;
}
.flex-box {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  position: relative;
  width: 360px;
  line-height: 26px;
  height: 28px;
  padding: 0 9px;
  justify-content: space-between;
  font-size: 14px;
  .employee-text {
    color: #BFBFBF;
  }
}
.remind-color {
  width: 8px;
  height: 8px;
  background: #F2AA18;
  display: inline-block;
  border-radius: 50%;
  margin-right: 8px;
}
.remind-text {
  font-size: 12px;
  color: #595959;
  line-height: 20px;
  font-weight: 400;
}

</style>
