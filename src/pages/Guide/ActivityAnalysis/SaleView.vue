
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div style="background-color: #ffffff;">
    <ns-button type="primary" style="margin: 5px 10px" @click="()=>{this.$emit('export');}">导出销售概览</ns-button>
    <!-- table start -->
    <div>
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        @sort-change=changeTableSort
        tooltip-effect="dark"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="guideName" label="导购" align="left">
          <template slot-scope="scope">
            <pop-item :detail="scope.row"></pop-item>
          </template>
        </el-table-column>
        <el-table-column prop="guideName" label="工号" align="left">
          <template slot-scope="scope">
            {{scope.row.workId ? scope.row.workId : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="门店" align="left">
          <template slot-scope="scope">
            {{scope.row.shopName ? scope.row.shopName : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" :sortable="'custom'" label="订单总金额" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.orderAmount ? scope.row.orderAmount : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="orderTimes" :sortable="'custom'" label="订单笔数" align="right">
          <template slot-scope="scope">
            {{scope.row.orderTimes ? scope.row.orderTimes : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="averagePrice" :sortable="'custom'" label="每笔单价" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.averagePrice ? scope.row.averagePrice : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="buyerNum" :sortable="'custom'" label="购买人数" align="right">
          <template slot-scope="scope">
            {{scope.row.buyerNum ? scope.row.buyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="priceUnit" :sortable="'custom'" label="客单价" align="right">
          <template slot-scope="scope">
            ￥{{scope.row.priceUnit ? scope.row.priceUnit : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerNum" :sortable="'custom'" label="购买好友数" align="right">
          <template slot-scope="scope">
            {{scope.row.friendBuyerNum ? scope.row.friendBuyerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="friendBuyerRate" :sortable="'custom'" label="平均好友购买率" align="right">
          <template slot-scope="scope">
            {{scope.row.friendBuyerRate ? scope.row.friendBuyerRate : 0}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
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
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import loadLost from './mixins/loadLost'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import PopItem from './components/PopItem'
import TabPane from './components/TabPane'
import moment from 'moment'

export default {
  mixins: [listPageMixin, loadLost],
  data () {
    return {
      sortName: 'orderAmount' // 排序名称 默认按订单总金额降序排序
    }
  },
  components: {
    PopItem
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .btn-detele {
    margin-left: var(--default-margin-base);
  }
  .template-search__box {
    display: flex;
    > div + span {
      margin-left: var(--default-margin-small);
    }
  }
</style>
