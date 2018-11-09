<template>
  <div>
    <ns-table-sg-coupon ref="table" @showListDialogMain="showListDialogFun" :url=$api.guide.guide.findList @add="addCoupon"></ns-table-sg-coupon>
    <!-- 新增弹窗 -->
    <el-dialog ref="addCouponDialog"  :title="title" :visible.sync="addCouponDialogVisible" width="800px">

      <el-form ref="form" :rules="rules" :model="activityModel" label-width="120px" class="form-main">
        <el-form-item label="优惠券：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="coupon_id">
              <el-select v-model="activityModel.coupon_id" :placeholder="$t('prompt.select')" @change="storeCouponChange">
                <el-option v-for="coupon in storeCouponList" :label="coupon.storeCouponTitle"
                           :key="coupon.id" :value="coupon.id"></el-option>
              </el-select>
            </el-form-item>

          </el-form-grid>
        </el-form-item>

        <el-form-item label="总数量：" v-if="activityModel.coupon_id > 0">
          <el-form-grid size="xmd">
            <el-form-item prop="store_coupon_total" v-if="storeModel.maxType == 0">
              <el-input disabled="disabled" value="不限量"></el-input>
            </el-form-item>
            <el-form-item prop="store_coupon_total" v-if="storeModel.maxType > 0">
              <el-input disabled="disabled" type="number" v-model="storeModel.couponTotal"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="配额：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="coupon_total" :rules = "{required:true, message:'配额不能为空'}">
              <el-input v-if="activityModel.type ==0" placeholder="请输入正整数" type="number" v-model="activityModel.coupon_total"
                        auto-complete="off" @change="activityCouponTotal()"></el-input>
              <el-input v-if="activityModel.type ==1" disabled="disabled" placeholder="请输入正整数" type="number" v-model="activityModel.coupon_total"
                        auto-complete="off" @change="activityCouponTotal()"></el-input>
            </el-form-item>
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
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>公用：所有门店共享配额；自由分配：默认均分，可再行调整</el-form-grid>
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
                {{storeModel.startTime}} -- {{storeModel.endTime}}
              </p>
              <p class="text-secondary" v-if="storeModel.dateType == 1">
                领取{{storeModel.after_get_valid_days}}天有效，有效时间天数{{storeModel.valid_days}}
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
        <el-form>
          <el-form-item label="门店名称：">
            <el-form-grid size="xmd">
              <el-input type="text" v-model="shopSearch.shopName">
              </el-input>
            </el-form-grid>
            <ns-button type="primary" @click="onSearchShop">搜索</ns-button>
          </el-form-item>
        </el-form>

        <!-- 搜索结束 -->

        <!--嵌套门店列表-->
        <el-table :data="shopList">
          <el-table-column prop="shopName" label="门店名称" align="left" width="300"></el-table-column>
          <el-table-column prop="address" label="所属地区" align="center" width="300">
          </el-table-column>
          <el-table-column prop="shopCouponNumber" label="配额" align="center" width="100">
            <template slot-scope="scope">
              <el-input type="number" @change="inputChange(scope.row)" v-model="scope.row.shopCouponNumber" width="60"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <!--嵌套门店列表-结束-->

        <!--分页开始-->
        <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                       :page-sizes="_data.paginations.sizeOpts"
                       :total="_data.paginations.total"

                       :current-page="_data.paginations.page"
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
        <ns-save type="primary" @click="onSaveActivityCoupon" title="save"  :disabled = "forbidden"></ns-save>
      </div>

    </el-dialog>
    <!-- 新增弹窗结束 -->
    <list-dialog ref="listDialogDom"></list-dialog>
  </div>
</template>

<script>
  import List from './src/CouponList'
  import NsTableSgCoupon from './NsTableSgCoupon'
  import listDialog from './listDialog.vue'

  List.components = {
    NsTableSgCoupon,
    listDialog
  }
  export default List
</script>


<style scoped>
  @import "../../../style/small/variables.pcss";
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
</style>
