<template>
<div class="template-page">
  <el-form label-width="150px" ref="form" :model="model" :rules="rules">
        <div class="form-grid">
          <div class="form-grid__title">基础信息</div>
          <div class="form-grid__content">
            <el-form-item label="活动名称：" required>
              <el-form-grid size="xlg">
                <el-form-item prop="name">
                  <el-input v-model.trim="model.name"></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="活动说明：">
              <el-form-grid size="xlg">
                <el-form-item>
                  <el-input type="textarea" v-model.trim="model.remark"></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="有效时间：" required>
              <el-form-grid size="xlg" style='width:320px'>
                <el-form-item prop="activityTime">
                  <!-- <el-date-picker v-model="model.activityTime" type="datetimerange"
                                  :picker-options="pickerOptions"></el-date-picker> -->
                  <el-date-picker
                    v-model="model.activityTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="选择开始日期"
                    end-placeholder="选择结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="拼团类型：">
              <el-form-grid size="xlg">
                <el-form-item>
                  <el-radio-group v-model="model.type">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                  </el-radio-group>
                  <i class='el-icon-question'></i>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="选择商品：">
              <el-form-grid size="xlg">
                <el-form-item>
                  <ns-button @click='' type='primary'>添加商品</ns-button>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="参团人数：">
              <el-form-grid size="xlg">
                <el-form-item>
                   <el-input placeholder="" v-model="model.start" class="input-with-select">
                    <span  slot="append" placeholder="请选择">人</span>
                  </el-input>

                  <span>-</span>
                   <el-input placeholder="" v-model="model.end" class="input-with-select">
                    <span  slot="append" placeholder="请选择">人</span>
                  </el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="拼团计时：">
               <el-select v-model="model.day" placeholder="请选择">
                    <el-option
                      v-for="item in dayArr"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                </el-select>
              <el-select v-model="model.hour" placeholder="请选择">
                  <el-option
                    v-for="item in hourArr"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-select v-model="model.min" placeholder="请选择">
                  <el-option
                    v-for="item in minArr"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>

            </el-form-item>

          </div>
        </div>
        <!-- <div class="form-grid">
          <div class="form-grid__title">营销设置</div>
          <div class="form-grid__content">
            <el-table ref="ruleTable" :data="tableList" class="template-table__main atLeft"
                      stripe resizable  border>
              <el-table-column prop="level" label="层级" width="100" align="center"></el-table-column>
              <el-table-column label="优惠门槛" width="300" align="center">
                <template slot-scope="{row}">
                  <span>满</span>
                  <el-form-grid size="sm">
                    <el-input type="number" v-model.trim="row.restrict"></el-input>
                  </el-form-grid>
                  <el-form-grid>
                    <el-select style="width:60px" v-model="row.type">
                      <el-option label="元" :value="1"></el-option>
                      <el-option label="件" :value="0"></el-option>
                    </el-select>
                  </el-form-grid>
                </template>
              </el-table-column>
              <el-table-column label="优惠方式（可多选）" align="left">
                <template slot-scope="{row}">
                  <div class="td-priceCheep">
                      <div class="fl td-priceCheep-left">
                        <el-checkbox v-model="row.usePaymentPreferential">金额优惠</el-checkbox>
                      </div>
                      <div  class="atLeft fl">
                        <el-radio-group v-model="row.paymentPreferentialType">
                          <el-radio :label="0">
                            <span>减</span>
                            <el-input style="width:120px" type="number" v-model.trim="row.amount"></el-input>
                            <span>元</span>
                          </el-radio>
                          <el-radio :label="1">
                            <span>打</span>
                            <el-input style="width:120px" type="number" v-model.trim="row.discount"></el-input>
                            <span>折</span>
                          </el-radio>
                        </el-radio-group>
                      </div>
                  </div>
                  <div class="td-priceCheep">
                      <div class="fl td-priceCheep-left">
                        <el-checkbox v-model="row.usePostagePreferential">免邮</el-checkbox>
                      </div>
                      <div  class="atLeft fl">
                          <span>编辑包邮区域</span>
                           <area-Select ref="area" v-model="goodsInfo" @change="addGoods"
                               :params="goodsQueryParams" :table-api="$api.guide.marketing.findGoodsList"></area-Select>

                           <ns-button type='text' circle='circle'><i class="el-icon-question"></i></ns-button>
                      </div>
                  </div>

                  <div class="td-priceCheep">
                      <div class="fl td-priceCheep-left">
                        <el-checkbox v-model="row.giveCoupon">送优惠券</el-checkbox>
                      </div>
                      <div class="atLeft fl">
                          <div   v-for="(coupon, index) in row.coupons">
                            <el-form-grid size="xmd">
                              <el-select placeholder="请选择优惠券" v-model="couponList.id" filterable @change="setCouponTitle(coupon)">
                                <el-option v-for="c in couponList" :label="c.couponTitle" :key="c.couponId" :value="c.couponId"></el-option>
                              </el-select>
                            </el-form-grid>
                            <el-form-grid size="sm">
                              <el-input v-model.trim="coupon.num"><template slot="append">张</template></el-input>
                            </el-form-grid>
                            <el-form-grid v-show="index > 0">
                              <ns-button @click="deleteCoupon(row.coupons, index)"><i class="el-icon-delete"></i>
                              </ns-button>
                            </el-form-gri>
                            <el-form-grid v-show="index === row.coupons.length-1">
                              <ns-button @click="addCoupon(row.coupons)"><i class="el-icon-plus"></i></ns-button>
                            </el-form-grid>
                          </div>
                      </div>
                  </div>
                   <div class="td-priceCheep">
                      <div class="fl td-priceCheep-left">
                        <el-checkbox v-model="row.giveGift">送赠品</el-checkbox>
                      </div>
                      <div class="atLeft fl">
                          <div   v-for="(coupon, index) in row.coupons">
                            <el-form-grid size="xmd">
                              <el-select placeholder="还未创建赠品" v-model="couponList.id" filterable @change="setCouponTitle(coupon)">
                                <el-option v-for="c in couponList" :label="c.couponTitle" :key="c.couponId" :value="c.couponId"></el-option>
                              </el-select>
                            </el-form-grid>
                            <el-form-grid size="sm">
                              <el-input v-model.trim="coupon.num"><template slot="append">张</template></el-input>
                            </el-form-grid>
                            <el-form-grid v-show="index > 0">
                              <ns-button @click="deleteCoupon(row.coupons, index)"><i class="el-icon-delete"></i>
                              </ns-button>
                            </el-form-grid>
                            <el-form-grid v-show="index === row.coupons.length-1">
                              <ns-button @click="addCoupon(row.coupons)"><i class="el-icon-plus"></i></ns-button>
                            </el-form-grid>
                          </div>
                      </div>

                  </div>





                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="{row}">
                  <ns-button @click="deleteRule(row)"
                             type="text"><i
                    class="el-icon-delete"></i>
                  </ns-button>
                </template>
              </el-table-column>
            </el-table>
            <template>
              <div class="addNewRule">
                <span class="text-primary" @click="addNewRule"><span class="el-icon-circle-plus"> 新增一级优惠</span></span>
              </div>
            </template>
          </div>
        </div> -->
        <!-- <div class="form-grid">
          <div class="form-grid__title">参与活动商品</div>
          <div class="form-grid__content">
            <el-radio-group v-model="model.goodsType" @change="goodsTypeChange">
              <div  class="atLeft">
                <el-radio :label="0" :disabled="!model.goodsOptional">全部商品参加</el-radio>
              </div>
              <div class="atLeft"><el-radio :label="1">部分商品参加</el-radio></div>
            </el-radio-group>
            <div class="atLeft" v-show="model.goodsType === 1">
              <sg-goods-Select ref="goods" v-model="goodsInfo" @change="addGoods"
                               :params="goodsQueryParams" :table-api="$api.guide.marketing.findGoodsList"></sg-goods-Select>
              <activity-goods-table ref="goodsTable" @delete="deleteGoods"></activity-goods-table>
            </div>
          </div>
        </div> -->
        <!-- <div class="form-grid border-bottom__none">
          <div class="form-grid__title">参与活动门店</div>
          <div class="form-grid__content">
            <el-radio-group v-model="model.shopType" @change="shopTypeChange">
              <div class="atLeft">
                <el-radio :label="0" :disabled="!model.shopOptional">全部门店参加</el-radio>
              </div>
              <div class="atLeft">
                <el-radio :label="1">部分门店参加</el-radio>
              </div>
            </el-radio-group>
            <div class="atLeft" v-show="model.shopType === 1">
              <select-shops ref="shops" :callBack="addShop" :hasShopArr="shopInfo" :params="shopQueryParams"
                            :api="$api.guide.marketing.findShopList"></select-shops>
              <activity-shop-table ref="shopsTable" @delete="deleteShops"></activity-shop-table>
            </div>
          </div>
        </div> -->
      </el-form>
</div>
</template>

<script>
  import create from './src/create'
  create.components = {}
  export default create
</script>

<style scoped>
.el-form{
  background-color:#ffffff;
}
</style>
