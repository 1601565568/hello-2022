<template>
  <div class="template-page">
    <ns-table-top-coupon ref="table" @add-coupon="addCoupon" @update-coupon="updateCoupon" @open-detail="openDetail"></ns-table-top-coupon>
    <el-dialog :title="title" :visible.sync="visibleCoupon"   :modal-append-to-body ="false"
               :close-on-click-modal = "false"  :before-close="onClose" width="500px">
      <el-form ref="form" placement="right" label-width="100px" :model="coupon" :rules="rules">
        <el-form-item label="优惠券名称："  class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "coupon_title" >
              <el-input type="text"
                        v-model.trim = "coupon.coupon_title"
                        placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="店铺：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "shop_id" >
              <ns-select  v-model="coupon.shop_id" filterable clearable :placeholder="$t('prompt.select')"
                          :multiple="false" :url="$api.core.common.queryShopListForTopByBrand" @change="changeShop"></ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="生效时间：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "start_time" >
              <el-date-picker v-model="coupon.start_time" type="date" placeholder="选择生效时间" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="失效时间：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "end_time" >
              <el-date-picker v-model="coupon.end_time" type="date" placeholder="选择失效时间" :picker-options="pickerOptions1"></el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="面额：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "denominations" >
              <el-select v-model="coupon.denominations" placeholder="请选择">
                <el-option label="3元" value="3" :key="3"></el-option>
                <el-option label="5元" value="5" :key="5"></el-option>
                <el-option label="10元" value="10" :key="10"></el-option>
                <el-option label="50元" value="50" :key="50"></el-option>
                <el-option label="100元" value="100" :key="100"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="满足条件：" class = "el-inline-block" required>
          <el-form-grid>
            <el-form-item >
              <el-form-grid width="50px">
                <el-radio-group v-model="coupon.condition" class="el-inline-block">
                  <el-radio  label="0" :value="0">不限
                    <el-form-item class="el-inline-block">
                      <el-tooltip placement="top" effect="light" stype=""><Icon type="info-circle" theme="filled" />
                        <div slot="content" style="width: 200px">优惠券的使用条件不能小于面额，如果选择不限，默认使用条件面额+1分。</div>
                      </el-tooltip>
                    </el-form-item>
                    </el-radio>
                  <el-radio  label="1" :value="1">订单满</el-radio>
                </el-radio-group>
              </el-form-grid>
              <el-form-item prop = "coupon_condition" v-if="coupon.condition == '1'" class="el-inline-block">
              <el-form-grid size="xs">
                  <el-input v-model.number = "coupon.coupon_condition" placeholder="请输入金额">
                    <template slot="append">元</template>
                  </el-input>
              </el-form-grid>
              </el-form-item>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="是否精灵支持：" class = "el-inline-block">
          <el-form-grid size="xmd">
            <el-form-item prop = "coupon_jingling_power" >
              <el-switch
                v-model="coupon.coupon_jingling_power"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="店铺授权：" class = "el-inline-block">
          <el-form-grid>
            <el-form-item prop = "role_id" >
              <template v-if="!expire">
                距离本次授权失效还有：
                <ns-count-down :date="authTime" type="HMS" format="HH:MM:SS" :callback="timeOut"></ns-count-down>
                <el-tooltip content="请在授权时间到期之前进行优惠券的创建！" effect="light"><Icon type="info-circle" theme="filled" /></el-tooltip>
                <ns-button type="primary" round @click="onState()">设为失效</ns-button>
              </template>
              <template v-else>
                暂未授权或授权已过期，优惠券无法创建，请用 <a @click="grantAuth">主号登录授权</a>。<el-tooltip effect="light"><Icon type="info-circle" theme="filled" />
                <div slot="content" style="width: 200px">为了保证用户数据安全，淘宝将其中一批操作价格的行为划为高危行为，高危行为需要卖家重新授权，即短授权（二次授权）。</div>
              </el-tooltip>
              </template>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">取消</ns-button>
        <ns-save @click="onSave" :loading="saveLoading"></ns-save>
      </div>
    </el-dialog>
    <el-dialog title="优惠券发送详情" :visible.sync="visibleDetail"   :modal-append-to-body ="false"
               :close-on-click-modal = "false"  :before-close="onDetailClose" width="800px">
       <ns-table-coupon-detail ref="detailTable"></ns-table-coupon-detail>
          <div slot="footer" class="dialog-footer">
            <ns-button @click="onDetailClose()">关闭</ns-button>
          </div>
    </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsTableTopCoupon from './NsTableTopCoupon'
import NsTableCouponDetail from './DetailCoupon/NsTableCouponDetail'
index.components = {
  NsTableTopCoupon,
  NsTableCouponDetail
}
export default index
</script>
