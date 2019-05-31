
<template>
  <!-- 优惠券详情弹窗  wanrengang 20180724 -->
  <div>
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      :response-limit = false
      width="1000px"
      :before-close="handleClose">
      <div class="comDialogBoxCon">
        <div class="console-sub-title clearfix">
            <div class="pull-left">
                <h5>
                    <span>基本信息</span>
                </h5>
            </div>
        </div>
        <table class="table table-bordered" style="margin-top:0">
            <tbody>
                <tr>
                    <td style="width:50%">
                        <span class="w80">订优惠券名称:</span>
                        <span class="value">{{viewObj.couponTitle}}</span>
                    </td>
                    <td style="width:50%">
                         <span class="w80">优惠券类型:</span>
                        <span class="value" v-if="viewObj.couponType==1">
                            代金券
                        </span>
                        <span class="value" v-if="viewObj.couponType==2">
                            折扣券
                        </span>
                        <span class="value" v-if="viewObj.couponType==3">
                            兑换券
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="width:50%">
                        <span class="w80">有效时间:</span>

                        <span class="value">
                            <span v-if="viewObj.dateValidType===0">
                                {{viewObj.startTime}}--{{viewObj.endTime}}
                            </span>
                            <span v-else>
                                领取{{viewObj.afterGetValidDays}}天后生效;
                                有效期{{viewObj.validDays}}天;有效截止日期:{{viewObj.endTime}}
                            </span>
                        </span>
                    </td>
                    <td style="width:50%">

                         <span class="w80">发行量:</span>
                        <span class="value">
                            {{viewObj.maxIssueAmount?viewObj.maxIssueAmount+'张':'不限'}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="width:50%">
                        <span class="w80" v-if="viewObj.couponType!=3">面额:</span>
                        <span class="w80" v-if="viewObj.couponType==3">兑换物品:</span>
                        <span class="value" v-if="viewObj.couponType==1">
                           ￥{{viewObj.couponValue}}元
                        </span>
                        <span class="value" v-if="viewObj.couponType==2">
                            {{viewObj.couponValue}}折
                        </span>
                         <ul class="shopList"  v-show="viewObj.couponType==3" >
                            <li v-for="item in giftArr"  :key="item.id">{{item.title}}</li>
                        </ul>
                    </td>
                    <td style="width:50%">
                        <span class="w80">优惠券状态:</span>
                        <span class="value" v-if="viewObj.couponStatus==1">
                           启用
                        </span>
                        <span class="value" v-if="viewObj.couponStatus==0">
                           禁用
                        </span>
                        <span class="value" v-if="viewObj.couponStatus==3">
                           已过期
                        </span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="w80">使用条件:</span>
                        <span class="value">
                            {{viewObj.useConditionStr}}
                        </span>
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="console-sub-title clearfix">
            <div class="pull-left">
                <h5>
                    <span>使用范围</span>
                </h5>
            </div>
        </div>
        <table class="table table-bordered" style="margin-top:0">
            <tbody>
                <tr>
                    <td style="width:50%">
                        <span class="w80">指定门店:</span>
                        <span class="value" v-if="viewObj.useRange.shopRangeType===0">不限</span>
                        <span class="value" v-if="viewObj.useRange.shopRangeType===1">仅限以下门店</span>
                        <span class="value" v-if="viewObj.useRange.shopRangeType===2">排除以下门店</span>
                        <ul class="shopList" v-if="viewObj.useRange.shopRangeType!=0" >
                            <li v-for="item in shopArr"  :key="item.id">{{item.shopName}}</li>
                        </ul>
                    </td>
                  <td style="width:50%">
                    <span class="w80">指定商品:</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType===0">不限</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType===1">包含以下商品</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType===2">排除以下商品</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType!=0 && viewObj.useRange.itemRangeType===0">（全部包含）</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType!=0 && viewObj.useRange.itemRangeType===1">（只包含）</span>
                    <span class="value" v-if="viewObj.useRange.itemRangeType!=0 && viewObj.useRange.itemRangeType===2">（部分包含）</span>
                    <ul class="shopList" v-if="viewObj.useRange.itemRangeType!=0" >
                      <li v-for="item in goodsArr"  :key="item.sysGoodsId">{{item.title}}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                    <td style="width:50%">
                       <span class="w80"> 可用时段:</span>
                        <span class="value">
                            <span v-if="viewObj.validTime.type==0">
                                全部时段
                            </span>
                            <span v-else>
                                {{viewObj.validTime.startTime}}至{{viewObj.validTime.endTime}}
                            </span>
                        </span>
                    </td>
                    <td style="width:50%">
                       <span class="w80"> 不可用日期:</span>
                        <span class="value">
                            <span v-if="viewObj.invalidDate.type==0">
                                不限制
                            </span>
                            <span v-else>
                                {{viewObj.invalidDate.dayList}}
                            </span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="width:50%">
                        <span class="w80">领券限制:</span>
                        <span class="value">{{viewObj.maxIssueCount}}</span>
                    </td>
                    <td style="width:50%">
                      <span class="w80">单数限制:</span>
                      <span class="value">
                              {{viewObj.tradeCountValid}}
                          </span>
                    </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <span class="w80">使用说明:</span>
                    <span class="value">
                            {{viewObj.remark}}
                        </span>
                  </td>
                </tr>
            </tbody>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      loading: false, // 防重复提交
      viewObj: {
        invalidDate: {},
        validTime: {},
        useRange: {}// 范围
      },
      shopArr: [], // 指定店铺
      giftArr: [], // 兑换商品
      goodsArr: [], // 指定商品
      dialogVisible: false
    }
  },
  created: function () {},
  methods: {
    onAreaChange (e) {
    },
    showToggle (obj) {
      this.viewObj = obj
      this.dialogVisible = true
      // 有指定店铺string转数组
      if (obj.useRange.shopRangeType !== 0) {
        var jsonObj = JSON.parse(obj.useRange.shopJson)
        this.shopArr = jsonObj
      }
      // 有指定商品string转数组
      if (obj.useRange.itemRangeType !== 0) {
        var jsonGoodsObj = JSON.parse(obj.useRange.itemJson)
        this.goodsArr = jsonGoodsObj
      }
      // 有指定礼品string转数组
      if (obj.giftJson) {
        var jsonGiftObj = JSON.parse(obj.giftJson)
        this.giftArr = jsonGiftObj
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.w80{width: 76px;text-align: right; display: inline-block;}
.shopList{
    list-style: none;
    padding: 10px 15px;
    line-height: 24px;
    color: #666;

}
.shopList li{border-bottom: 1px dashed #ccc;}
.comDialogBoxCon{margin-top: 10px;padding-bottom: 10px;}
.console-sub-title {
    position: relative;
    padding-left: 16px;
    margin-bottom: -1px;
    display: table;
    width: 100%;
    z-index: 1;
    height: 40px;
    line-height: 40px;
    border: 1px solid #E1E6EB;
    border-left: 3px solid #778;
    background-color: #F4F5F9;
}
.console-sub-title h5 {
    color: #666;
    font-size: 14px;
    font-weight: normal;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
    border-spacing: 0;
}
.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
    border:1px solid #ddd;
}
.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
}
.table>tbody>tr>td{font-size: 12px;color: #666;}
.table>tbody>tr>td .value{color:#333;}
</style>
