<template>
  <div>
    <page-table class="no-padding" :tableBarShow="false">
      <template slot="table">
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          :row-style="tableRowClassName"
          @sort-change="handleSort"
          style="width: 100%"
        >
          <el-table-column prop="shopName" label="参与门店">
            <template slot-scope="scope">
              <div class="scope-title">
                {{ scope.row.shopName || ""
                }}{{ scope.row.state === 3 ? "（已从活动移除）" : "" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="chatroomNum" label="企微聚合码">
            <template slot-scope="scope">
              <div class="scope-title">
                <div class="scope-title_text">
                  已聚合{{ scope.row.qrCodeEmployees }}人
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="adduserNum" sortable="custom" label="添加好友数">
          </el-table-column>
          <el-table-column prop="customerCountTotal" >
            <template slot="header">
              <span>
                <span>好友会员数 </span>
                <el-tooltip content="活动期间内，添加好友的会员数量">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="customerCount" >
            <template slot="header">
              <span>
                <span>新增会员数 </span>
                <el-tooltip content="活动期间内，新增的会员数量">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="tradeCount" >
            <template slot="header">
              <span>
                <span>订单转化数 </span>
                <el-tooltip content="活动期间内，添加好友的订单转化数量">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="payment" >
            <template slot="header">
              <span>
                <span>订单转化金额 </span>
                <el-tooltip content="活动期间内，添加好友的订单转化金额">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="refundFee" >
            <template slot="header">
              <span>
                <span>退款金额 </span>
                <el-tooltip content="活动期间内，添加好友的退款订单金额">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="address" width="150px" label="操作">
            <template slot-scope="scope">
              <div class="btn-context">
                <ns-button
                  type="text"
                  class="detail-btn"
                  @click="handleDetail(scope.row, scope.$index)"
                  >查看详情</ns-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页面 start -->
      <template slot="pagination">
        <el-pagination
          v-if="_data._pagination.enable"
          class="template-table__pagination"
          :page-sizes="_data._pagination.sizeOpts"
          :total="_data._pagination.total"
          :current-page="_data._pagination.page"
          :page-size="_data._pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$"
        >
        </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
    <el-drawer
      :modal="false"
      size="70%"
      @close="handleClose"
      :visible.sync="drawer"
      :with-header="false"
    >
      <div class="master-close">
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <FriendsList
        v-if="drawer"
        :timeType="model.timeType"
        :activityStartTime="model.activityStartTime"
        :activityEndTime="model.activityEndTime"
        :addFriendsStartTime="model.addFriendsStartTime"
        :addFriendsEndTime="model.addFriendsEndTime"
        :channelState= 'channelState'
        :firstQrCodeUserId = 'firstQrCodeUserId'
        :shopName="shopName"
        :shopId="shopId"
        :activeName='activityName'
        :guid="model.guid"
        :modelData='model'
        @onNext="getOhter('next', handleDetail)"
        @onPrev="getOhter('prev', handleDetail)"
      />
    </el-drawer>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import FriendsList from './FriendsList'
import log from '@/apis/weWork/log'
export default {
  data () {
    return {
      url: this.$api.guide.lbs.getFriendsByshop,
      drawer: false,
      shopId: null,
      shopName: null,
      activeIndex: -1,
      model: {},
      activeRow: {},
      channelState: null,
      firstQrCodeUserId: null
    }
  },
  components: {
    PageTable,
    ElDrawer,
    FriendsList
  },
  props: {
    propsModel: {
      default () {
        return {}
      }
    },
    activityName: {
      default () {
        return ''
      }
    }
  },
  mixins: [tableMixin],
  methods: {
    // 查看详情
    handleDetail (row, index) {
      this.activeIndex = index
      this.shopId = row.shopId
      this.shopName = row.shopName
      this.drawer = true
      this.channelState = row.channelState
      this.firstQrCodeUserId = row.firstQrCodeUserId
    },
    // 查看门店选择上一个或下一个详情
    getOhter (type, cb) {
      const { page, size, total } = this._data._pagination
      if (type === 'prev') {
        if (this.activeIndex === 0) {
          if (page === 1) {
            this.$notify.error('暂无上一个')
          } else {
            this._data._pagination.page = page - 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = this._data._table.data.length - 1
              cb(this._data._table.data[index], index)
            })
          }
        } else {
          const index = this.activeIndex - 1
          cb(this._data._table.data[index], index)
        }
      } else if (type === 'next') {
        if ((page - 1) * size + this.activeIndex + 1 >= total) {
          this.$notify.error('暂无下一个')
        } else {
          if (this.activeIndex === size - 1) {
            this._data._pagination.page = page + 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = 0
              cb(this._data._table.data[index], index)
            })
          } else {
            const index = this.activeIndex + 1
            cb(this._data._table.data[index], index)
          }
        }
      }
    },
    // 关闭详情弹框
    handleClose () {
      this.drawer = false
      this.activeIndex = -1
    },
    // 排序
    handleSort (val) {
      const { order, prop } = val
      this.$emit('onSort', { sortType: order === 'ascending' ? 1 : 0, sortName: prop })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    }
  },
  watch: {
    propsModel: {
      handler (newVal) {
        this.model = { ...newVal, sortName: 'adduserNum' }
        this.$searchAction$()
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    // console.log(this.propsModel, 'ssss')
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.template-table.no-padding {
  padding: 0;
}
.btn-context {
  display: flex;
  .detail-btn {
    margin-right: 10px;
  }
}
.master-close {
  font-size: 16px;
  padding: 16px 16px 4px 16px;
  .el-icon-close {
    cursor: pointer;
  }
}
</style>
