<template>
  <div>
    <el-dialog
     title="新增优惠券发放"
     width="960px"
     :visible.sync="addCouponDialogVisible"
    >
    <div class="addCouponDialogVisible">
        <el-form ref="form" :model="activityModel" label-width="80px" class="form-main">
            <el-form-item label="优惠券：" prop="coupon_id">
              <el-form-grid size="xmd">
                  <div class="choose-coupon" @click="onOpenCoupon()">
                      <p v-if="activityModel.coupon_id">请选择优惠券</p>
                      <p v-else class="text">123123123</p>
                      <Icon type="couponicon" />
                  </div>
              </el-form-grid>
              <el-form-grid block class="text-primary">
                  <Icon type="info-circle"/> 选择中台已新增的优惠券至导购系统
              </el-form-grid>
            </el-form-item>
          <el-form-item label="剩余数量：">
            <el-form-grid size="xmd">
              <el-form-item prop="store_coupon_total">
                <div class="disabled">不限量</div>
                <!-- <div class="disabled">{{storeModel.remainingQuantity}}</div> -->
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="配额：" required>
              <el-form-grid size="xmd">
                  <el-form-item prop="coupon_total">
                  <el-input
                    style="width: 360px"
                    placeholder="请输入正整数"
                    type="number"
                    v-model="activityModel.coupon_total"
                    auto-complete="off">
                  </el-input>
                  <!-- <el-input v-if="activityModel.type ==1" disabled="disabled" placeholder="请输入正整数" type="number" v-model="activityModel.coupon_total"
                              auto-complete="off" @change="activityCouponTotal()"></el-input> -->
                  </el-form-item>
              </el-form-grid>
              <el-form-grid block class="text-primary">
                  <Icon type="info-circle"/>  设置优惠券的数量
              </el-form-grid>
          </el-form-item>
          <el-form-item label="分配方式：" required>
              <el-form-grid>
                  <el-form-item prop="type">
                  <el-radio-group v-model="activityModel.type">
                      <el-radio :label="0" @change="onChangeDistributionMode" >公用</el-radio>
                      <el-radio :label="1" @change="onChangeDistributionMode" >自由分配</el-radio>
                  </el-radio-group>
                  </el-form-item>
              </el-form-grid>
              <el-form-grid block class="text-info"><Icon type="info-circle" theme="filled" />公用：所有门店共享配额；自由分配：默认均分，可再行调整</el-form-grid>
          </el-form-item>
          <el-form-item>
            <StoreList></StoreList>
          </el-form-item>
          <div class="coupon">
              <div class="coupon-preview">优惠券预览区</div>
              <div class="coupon-box">
                  <img :src="bgcoupon" v-if="true"/>
                  <div class="couponCard" v-if="false">
                    <img src="./img/cash_coupon.png"/>
                    <!-- <img src="./img/discount_coupon.png"/>
                    <img src="./img/exchange_coupon.png"/> -->
                    <div class="couponCard-top">
                      <div class="couponCard-top__left">
                        <!-- 现金券 -->
                        <div class="money">￥<span>0.1</span></div>
                        <!-- 兑换券 -->
                        <!-- <div class="couponType3"><span>礼</span></div> -->
                        <!-- 折扣券 -->
                        <!-- <div class="couponType2">
                          <span class="couponType2_number">3</span>
                          <span class="couponType2_number2">.4</span>
                          <span class="couponType2_text">折</span>
                        </div> -->
                      </div>
                      <div class="couponCard-top__right">
                        <p class="couponCard-top__right__time">圣诞活动现金券现金券</p>
                        <p>2020/10/19 00:00:00 - 2020/10/28 23:59:59</p>
                        <p>创建人：admin</p>
                        <p>使用说明：至多显示一行多余…悬停TIPS显示全部</p>
                        <p>备注：这是备注内容</p>
                      </div>
                    </div>
                    <div class="couponCard-bottom">
                      无门槛
                    </div>
                  </div>
              </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSaveActivityCoupon" title="save"  :disabled = "forbidden">保存</ns-button>
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
@import "./src/index.scss";
</style>
