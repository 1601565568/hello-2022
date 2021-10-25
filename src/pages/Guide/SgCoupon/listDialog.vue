
<template>
  <!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
  <div>
    <el-dialog
      title="发放门店明细"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      response-limit :show-scroll-x=false
      width="800px"
      :before-close="handleClose">
      <div class="topTip">总配额：<span class="text-error">{{topTotaObj.activityTotal}}</span>张；总领取：<span class="text-error">{{topTotaObj.couponNoUse}}</span>张；未领取：<span class="text-error">{{topTotaObj.activityTotal-topTotaObj.couponNoUse}}</span>张；总发放门店：<span class="text-error">{{topTotaObj.shopTotal}}</span>家</div>
      <el-form ref="searchform" label-width="60px" :model="searchform"  :inline="true">
        <el-form-item>
          <el-form-grid>
            <el-form-item label="所在地区：" prop="district">
              <el-form-grid width="260" prop="area">
                <ns-area  :props="searchform.key" @change="onAreaChange" v-model="searchform.area"></ns-area>
              </el-form-grid>
            </el-form-item>
          </el-form-grid>
          <el-form-grid style="margin-right: 0;">
            <el-form-item label="门店名称：" prop="shopName">
              <el-input v-model="searchform.shopName"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="resetForm('searchform')">重置</ns-button>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="comDialogBoxCon">
        <el-table
          ref="multipleTable"
          :data="dataList"
          v-loading="loading"
          :element-loading-text="$t('prompt.loading')"
          tooltip-effect="dark"
          stripe
          @selection-change="handleSelectionChange">
          <el-table-column
            label="门店名称"
            width="220"
            prop="shopName"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="所在地区"
            align="left"
          >
            <template slot-scope="scope">
              <span>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.district}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发放数量(张)"
            align="right"
            prop="shopCouponTotal"
          >
          </el-table-column>
          <el-table-column
            label="已领取(张)"
            prop="noUseTotal"
            align="right"
          >
          </el-table-column>
          <el-table-column
            label="已使用(张)"
            prop="useTotal"
            align="right"
          >
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination  class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
        <!-- table end -->
      </div>
      <span slot="footer" class="dialog-footer">
      <ns-button :loading="loading" @click="handleClose">关闭</ns-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      loading: false, // 防重复提交
      saveObj: {
        list: []
      },
      curMonth: 5,
      dialogVisible: false,
      selectedArr: [],
      topTotaObj: {
        activityTotal: 40,
        couponNoUse: 10
      },
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        },
        area: [],
        shopName: ''

      },
      dataList: [
        {
          shopName: 'shopName',
          province: 'province',
          city: 'city',
          address: 'address',
          shopCouponTotal: 400,
          useTotal: 40,
          remainTotal: 60

        }
      ],
      searchObj: {}
    }
  },
  created: function () {
    // this.searchObj.searchMap.id = 81
    // this.loadListFun()
  },
  methods: {
    onAreaChange (e) {
    },
    showToggle (id) {
      this.searchObj.searchMap.id = id
      this.loadListFun()
      this.dialogVisible = true
    },
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      this.searchObj.searchMap.province = this.searchform.area[0]
      this.searchObj.searchMap.city = this.searchform.area[1]
      this.searchObj.searchMap.district = this.searchform.area[2]
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.loadListFun()
    },
    resetForm (formName) {
      this.searchform.area = []
      this.searchform.shopName = ''
      this.searchObj.searchMap.province = null
      this.searchObj.searchMap.city = null
      this.searchObj.searchMap.district = null
      this.searchObj.searchMap.shopName = null
      this.loadListFun()
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.activityCoupon.findActivityShopCoupon, searchObj)
        .then(resp => {
          this.topTotaObj.activityTotal = resp.result.couponTotal
          this.topTotaObj.couponNoUse = resp.result.couponNoUse
          this.topTotaObj.shopTotal = resp.result.shopTotal
          this.dataList = resp.result.shopList
          this.pagination.total = parseInt(resp.result.shopTotal)
        })
        .catch(resp => {
          this.$message.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose () {
      this.dialogVisible = false
    }
  },
  components: {
    NsArea
  }
}
</script>
<style scoped>
  .comDialogBox {
    width: 600px !important;
  }
  .addItemCon {
    padding: 15px 0 0 10px;
  }
  .addTitBox {
    height: 32px;
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
  }
  .addTitText {
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    border-left: 2px solid #0091fa;
    padding: 0 8px;
  }
  .topTip {
    line-height: 32px;
    height: 32px;
  }
  .el-form--inline .el-form-item {
    margin-right: 5px !important;
  }
</style>
