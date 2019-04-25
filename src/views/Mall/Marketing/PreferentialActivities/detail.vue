<template>
  <el-dialog
    title="活动详情"
    width="800px" :response-limit=false
    :visible.sync="dialogVisible">
    <el-form label-width="150px" ref="form" :model="model" v-loading="loading"
             :element-loading-text="$t('prompt.loading')">
      <div class="form-grid">
        <div class="form-grid__title">基础信息</div>
        <div class="atLeft">
          <div>活动名称：{{model.name}}</div>
          <div>活动时间：{{model.startTime}} ~ {{model.endTime}}</div>
          <div>活动说明：{{model.remark}}</div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-grid__title">营销设置</div>
        <div class="form-grid__content">
          <el-table ref="ruleTable" :data="model.rules" class="template-table__main atLeft"
                    stripe resizable>
            <el-table-column prop="level" label="层级" width="100" align="center"></el-table-column>
            <el-table-column label="优惠门槛" width="300" align="center">
              <template slot-scope="{row}">
                <span>满{{row.restrict}}</span>
                <span v-if="row.type === 1">元</span>
                <span v-if="row.type === 0">件</span>
              </template>
            </el-table-column>
            <el-table-column label="优惠方式（可多选）" align="left">
              <template slot-scope="{row}">
                <div v-if="row.usePaymentPreferential">
                  <span v-if="row.paymentPreferentialType === 0">减{{row.amount}}元</span>
                  <span v-else>打{{row.discount}}折</span>
                </div>
                <div v-if="row.usePostagePreferential">免邮</div>
                <div v-if="row.giveIntegral">
                  <span>送{{row.integral}}积分</span>
                </div>
                <div v-model="row.giveCoupon">优惠券:</div>
                <div style="padding-left: 10px;" v-show="row.giveCoupon === true" v-for="(coupon, index) in row.coupons">
                  <span>【{{coupon.title}}】{{coupon.num}}张</span>
                </div>
                <!--<el-checkbox v-model="row.giveGift">送赠品</el-checkbox>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-grid__title">参与活动商品</div>
        <div class="atLeft text-primary">
          <span v-if="model.goodsType === 0">全部商品参加</span>
          <span v-else>部分商品参加</span>
          <div v-show="model.goodsType === 1">
            <activity-goods-table ref="goodsTable" :show-icon="false"></activity-goods-table>
          </div>
        </div>
      </div>
      <div class="form-grid border-bottom__none">
        <div class="form-grid__title">参与活动门店</div>
        <div class="atLeft text-primary">
          <span v-if="model.shopType === 0">全部门店参加</span>
          <span v-else>部分门店参加</span>
          <div v-show="model.shopType === 1">
            <activity-shop-table ref="shopsTable" :show-icon="false"></activity-shop-table>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
         <ns-button @click="closeDialog">关闭</ns-button>
      </span>
  </el-dialog>
</template>

<script>
import formMixin from 'web-crm/src/mixins/form'
import ActivityGoodsTable from './ActivityGoodsTable'
import ActivityShopTable from './ActivityShopTable'
export default {
  name: 'detail',
  mixins: [formMixin],
  components: { ActivityGoodsTable, ActivityShopTable },
  data: function () {
    return {
      dialogVisible: false,
      loading: false,
      model: {
        name: null,
        startTime: null,
        endTime: null,
        remark: null,
        goodsType: 1,
        shopType: 1,
        shopOptional: true,
        goodsOptional: true,
        shopInfo: [],
        goodsInfo: [],
        rules: []
      }
    }
  },
  methods: {
    showData: function (activityId) {
      let that = this
      that.loading = true
      that.$http.fetch(that.$api.guide.marketing.queryActivityDetail, { activityId: activityId }).then((resp) => {
        let data = resp.result
        that.model = data
        // 部分门店时查询门店表格
        if (data.shopType === 1) {
          that.$refs.shopsTable.findList(null, activityId)
        }
        // 部分商品时查询门店表格
        if (data.goodsType === 1) {
          that.$refs.goodsTable.findList(null, activityId)
        }
        that.loading = false
      }).catch((resp) => {
        that.$notify.error(resp.msg || '活动查询失败')
      })
    },

    closeDialog: function () {
      this.$emit('close', null)
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";

  .atLeft {
    padding-top: var(--default-padding-larger);
    padding-left: var(--default-padding-larger);
    padding-right: var(--default-padding-larger);
  }

  @component-namespace form {
    @b grid {
      border:

    1px solid

    var(--theme-base-border-color-primary

    );

      @e title {
        height: 32px;
        padding-left: var(--default-padding-larger);
        line-height: 32px;
        background-color: var(--theme-bg-color-primary);
      }
      @e content {
        padding: var(--default-padding-base) 0;
      }
    }
  }
</style>
