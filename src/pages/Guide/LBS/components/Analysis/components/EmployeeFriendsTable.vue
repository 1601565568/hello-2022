<template>
  <page-table class='no-padding' :tableBarShow='false'>
    <template slot='table'>
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        @sort-change="handleSort"
        style="width: 100%">
        <el-table-column
          prop="avatar"
          label="头像">
          <template slot-scope="scope">
            <div class='avatar-img'>
              <img :src='scope.row.avatar'/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="昵称">
        </el-table-column>
         <el-table-column
          prop="memberOrNo"
          label="是否为会员">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="所属门店">
          <template slot-scope="scope">
            <div class="scope-title">
              {{scope.row.shopName||''}}{{scope.row.state === 3 ? '（已从活动移除）' : ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="员工">
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="工号">
          <template slot-scope="scope">
            {{scope.row.workNumber || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          sortable="custom">
            <template slot="header">
              <span>
                <span>添加时间 </span>
                <el-tooltip content="活动期间内，添加好友的退款订单金额">
                  <!-- <Icon type="question-circle" /> -->
                </el-tooltip>
              </span>
            </template>
        </el-table-column>
          <el-table-column
          prop="tradeCount"
          >
             <template slot="header">
              <span>
                <span>订单转化数 </span>
                <el-tooltip content="活动期间内，该好友的订单转化数">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
        </el-table-column>
          <el-table-column
          prop="payment"
          >
           <template slot="header">
              <span>
                <span>订单转化金额 </span>
                <el-tooltip content="活动期间内，该好友的订单转化金额">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
        </el-table-column>
           <el-table-column
          prop="refundFee"
          >
           <template slot="header">
              <span>
                <span>退款金额 </span>
                <el-tooltip content="活动期间内，该好友的退款订单金额">
                  <Icon type="question-circle" />
                </el-tooltip>
              </span>
            </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 页面 start -->
    <template slot='pagination'>
      <el-pagination v-if="_data._pagination.enable"
                      class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts"
                      :total="_data._pagination.total"
                      :current-page="_data._pagination.page"
                      :page-size="_data._pagination.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
    </template>
    <!-- 页面 end -->
  </page-table>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      url: this.$api.guide.lbs.getFriendsFriends,
      statusList: {
        1: {
          value: ' 由成员邀请入群（直接邀请入群）',
          color: 'info'
        },
        2: {
          value: '由成员邀请入群（通过邀请链接入群）',
          color: 'warning'
        },
        3: {
          value: '扫码入群',
          color: 'success'
        }
      },
      model: {}
    }
  },
  components: {
    PageTable
  },
  props: {
    propsModel: {
      default () {
        return {}
      }
    }
  },
  mixins: [tableMixin],
  methods: {
    handleSort (val) {
      const { order, prop } = val
      this.$emit('onSort', { sortType: order === 'ascending' ? 1 : 0, sortName: prop })
    }
  },
  watch: {
    propsModel: {
      handler (newVal) {
        this.model = { ...newVal, sortName: 'created' }
        this.$searchAction$()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .template-table.no-padding {
    padding: 0;
  }
  .avatar-img {
    height: 32px;
    width: 32px;
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
