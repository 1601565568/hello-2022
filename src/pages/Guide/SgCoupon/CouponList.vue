<template>
  <div class='page_add_coupon'>
    <ns-table-sg-coupon ref="table" @showListDialogMain="showListDialogFun" :url=$api.guide.guide.findList @add="addCoupon"></ns-table-sg-coupon>
    <!-- 新增弹窗 -->
    <el-dialog ref="addCouponDialog"  :title="title"  :width="(activityModel.coupon_id > 0) ? '800px' : '380px'">

      <el-form ref="form" :rules="rules" :model="activityModel" label-width="80px" class="form-main">
        <el-form-item label="优惠券：" required>

              <el-form-grid size="xmd">
              <el-form-item prop="coupon_id">
                <el-select v-model="activityModel.coupon_id" filterable :placeholder="$t('prompt.select')"   @change="storeCouponChange" clearable>
                  <div :class="storeCouponListLength?'':'no_store_coupon'">
                    <el-option v-for="coupon in storeCouponList" :label="coupon.storeCouponTitle"
                            :key="coupon.id" :value="coupon.id" class="{storeCouponList.length == 0?'optionClass':''}"></el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-form-grid>
          <el-form-grid block class="text-primary">
            <Icon type="info-circle"/>
            选择中台已新增的优惠券至导购系统
          </el-form-grid>
        </el-form-item>
        <el-form-item label="剩余数量：" v-if="activityModel.coupon_id > 0">
          <el-form-grid size="xmd">
            <el-form-item prop="store_coupon_total" v-if="storeModel.maxType === 0">
              <el-input disabled="disabled" value="不限量"></el-input>
            </el-form-item>
            <el-form-item prop="store_coupon_total" v-if="storeModel.maxType > 0">
              <el-input disabled="disabled" type="number" v-model="storeModel.remainingQuantity"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="配额：" required>
          <el-form-grid size="xmd">
             <el-form-item prop="coupon_total">
              <el-input v-if="activityModel.type ==0" placeholder="请输入正整数" type="number" v-model="activityModel.coupon_total"
                        auto-complete="off" @change="activityCouponTotal()"></el-input>
              <el-input v-if="activityModel.type ==1" disabled="disabled" placeholder="请输入正整数" type="number" v-model="activityModel.coupon_total"
                        auto-complete="off" @change="activityCouponTotal()"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid block class="text-primary">
            <Icon type="info-circle"/>  设置优惠券的数量
          </el-form-grid>
        </el-form-item>
        <el-form-item label="分配方式：" required v-if="activityModel.coupon_id > 0">
          <el-form-grid>
            <el-form-item prop="type">
              <el-radio-group v-model="activityModel.type">
                <el-radio :label="0" @change="radioOnclick(0)" >公用</el-radio>
                <el-radio :label="1" @change="radioOnclick(1)" >自由分配</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-grid>
          <el-form-grid block class="text-info"><Icon type="info-circle" theme="filled" />公用：所有门店共享配额；自由分配：默认均分，可再行调整</el-form-grid>
        </el-form-item>
        <div class="coupon" v-if="activityModel.coupon_id > 0">
          <div class="coupon-preview">
            <div class="coupon-preview-amount text-error" v-if="storeModel.couponType == 1">
              ￥<span class="coupon-amount__large">{{storeModel.couponValue}}</span>
            </div>
            <div class="coupon-preview-amount text-error" v-if="storeModel.couponType == 2">
              <span class="coupon-amount__large">{{storeModel.couponValue}}折</span>
            </div>
            <div class="coupon-preview-title">
              <span class="coupon-title" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                {{storeModel.couponTitle}}
              </span>
              <span class="coupon-decorate" v-if="storeModel.couponType == 0">未知</span>
              <span class="coupon-decorate" v-if="storeModel.couponType == 1">代金券</span>
              <span class="coupon-decorate" v-if="storeModel.couponType == 2">折扣券</span>
              <span class="coupon-decorate" v-if="storeModel.couponType == 3">兑换券</span>
              <p class="text-secondary" v-if="storeModel.dateType == 0">
                {{storeModel.startTime}} ~~ {{storeModel.endTime}}
              </p>
              <p class="text-secondary" v-if="storeModel.dateType == 1">
                领取{{storeModel.after_get_valid_days}}天后生效，有效期{{storeModel.valid_days}}天

              </p>
            </div>
          </div>
          <div class="coupon-preview-bottom">
            <!--订单满100可用-->
            {{storeModel.conditionJson}}
          </div>
        </div>
      </el-form>
      <div v-if="activityModel.type ==1">
        <!-- 搜索开始 -->
        <el-form @submit.native.prevent>
          <el-form-item label="门店名称：">
            <el-form-grid size="xmd">
              <el-input type="text" v-model="shopSearch.shopName" @keyup.enter.native="onSearchShop">
              </el-input>
            </el-form-grid>
            <ns-button type="primary" @click="onSearchShop">搜索</ns-button>
          </el-form-item>
        </el-form>

        <!-- 搜索结束 -->

        <!--嵌套门店列表-->
        <el-table :data="shopList">
          <el-table-column prop="shopName" label="门店名称" align="left"></el-table-column>
          <el-table-column label="所属地区" align="left" >
            <template slot-scope="scope">
              <span>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.district}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shopCouponNumber" label="配额" align="center" width="100">
            <template slot-scope="scope" >
              <ElInput type="text"
                        @input="inputChange(scope.row)"
                        v-model="scope.row.shopCouponNumber"
                        maxlength="8"
                        show-word-limit
                        width="100" @focus="ChangeForbiddenStatus" @blur="delayedChangeStatus"/>
            </template>
          </el-table-column>
        </el-table>
        <!--嵌套门店列表-结束 @input="scope.row.shopCouponNumber=Number(scope.row.shopCouponNumber.replace(/[^\d]/g, ''))"-->

        <!--分页开始-->
        <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                       :page-sizes="_data.paginations.sizeOpts"
                       :total="_data.paginations.total"
                       :current-page.sync="_data.paginations.page"
                       :page-size="_data.paginations.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="shopSizeChange"
                       @current-change="shopPageChange"
                       >
        </el-pagination>
        <!--分页结束-->
        </div>

      <!--</el-form>-->

      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSaveActivityCoupon" title="save"  :disabled = "forbidden">保存</ns-button>
      </div>

    </el-dialog>
    <!-- 新增弹窗结束 -->
    <!-- <list-dialog ref="listDialogDom"></list-dialog> -->
    <couponList ref="couponList"></couponList>
  </div>
</template>

<script>
import List from './src/CouponList'
import NsTableSgCoupon from './NsTableSgCoupon'
import listDialog from './listDialog.vue'
import couponList from './components/couponList'
List.components = {
  NsTableSgCoupon,
  listDialog,
  couponList
}
export default List
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .coupon-form{
    text-align: right;
    padding-right: 80px;
  }
  .border-top{
    width:100%;
    height: 0;
    border-top:1px solid var(--theme-base-border-color-primary);
  }
  /* 优惠券样式 */
  .coupon{
    position: absolute;
    top:5px;
    right:60px;
    font-size:13px;
  }
  .coupon-preview{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-bottom-style:dashed;
    padding:10px;
  }
  .coupon-amount__large{
    font-size: 28px;
  }
  .coupon-preview-title{
    padding-left:15px;
  }
  .coupon-decorate{
    background: var(--theme-color-warning);
    color:#fff;
    margin-left: 10px;
    padding: 3px 6px 2px;
    font-size: 12px;
  }
  .coupon-preview-bottom{
    font-size: 12px;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-top-style:dashed;
    padding:3px 10px;
    color:var(--theme-font-color-secondary);
    margin-top: -1px;
  }
  .coupon-title{
    width: 20px;
    white-space:normal
  }
  .optionClass{
    height:60px;

  }
  .form-main{
    position: relative;
  }
</style>
<style scoped>
.page_add_coupon  .el-select-dropdown__wrap , .el-scrollbar__wrap {

      /* margin: 0 ! important */
  }

</style>
