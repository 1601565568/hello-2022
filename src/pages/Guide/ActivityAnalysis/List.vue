
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div style="background-color: #ffffff;">
    <ns-button type="primary"
               style="margin: 5px 10px" @click="()=>{this.$emit('export');}">导出联系概况</ns-button>
    <!-- table start -->
    <div>
      <el-table ref="multipleTable"
                :data="dataList"
                v-loading="loading"
                :element-loading-text="$t('prompt.loading')"
                @sort-change="changeTableSort"
                tooltip-effect="dark"
                stripe
                style="width: 100%">
        <el-table-column prop="guideName"
                         label="导购"
                         width="160"
                         fixed>
          <template slot-scope="scope">
            <pop-item :detail="scope.row"></pop-item>
          </template>
        </el-table-column>
        <el-table-column prop="guideName"
                         label="工号"
                         width="160"
                         fixed>
          <template slot-scope="scope">
            {{scope.row.workId ? scope.row.workId : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="门店"
                         width="180"
                         fixed>
          <template slot-scope="scope">
            {{scope.row.shopName ? scope.row.shopName : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="newFriendNum"
                         :sortable="'custom'"
                         label="新增好友"
                         width="180"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.newFriendNum ? scope.row.newFriendNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="newCustomerNum"
                         :sortable="'custom'"
                         label="新增会员"
                         width="120"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.newCustomerNum ? scope.row.newCustomerNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="momentsNum"
                         :sortable="'custom'"
                         label="发朋友圈数"
                         width="140"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.momentsNum ? scope.row.momentsNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="activePrivateChatNum"
                         :sortable="'custom'"
                         label="主动会话数"
                         width="240"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.activePrivateChatNum ? scope.row.activePrivateChatNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="clientReplyNum"
                         :sortable="'custom'"
                         label="客户回复"
                         width="120"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.clientReplyNum ? scope.row.clientReplyNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="clientReplyRate"
                         :sortable="'custom'"
                         label="客户回复率"
                         width="140"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.clientReplyRate ? scope.row.clientReplyRate : 0}}%
          </template>
        </el-table-column>
        <el-table-column prop="receivePrivateChatNum"
                         :sortable="'custom'"
                         label="客户发起会话数"
                         width="140"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.receivePrivateChatNum ? scope.row.receivePrivateChatNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="replyNum"
                         :sortable="'custom'"
                         label="响应数"
                         width="120"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.replyNum ? scope.row.replyNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="notReplayNum"
                         :sortable="'custom'"
                         label="未回复客户数"
                         width="140"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.notReplayNum ? scope.row.notReplayNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="averageReplyTime"
                         :sortable="'custom'"
                         label="平均首次响应时长"
                         width="140"
                         align="right">
          <template slot-scope="scope">
            {{scope.row.averageReplyTime ? scope.row.averageReplyTime : 0}}s
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination v-if="pagination.enable"
                   class="template-table-pagination"
                   :page-sizes="pagination.sizeOpts"
                   :total="pagination.total"
                   :current-page.sync="pagination.page"
                   :page-size="pagination.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange">
    </el-pagination>
    <!-- table end -->
    <!-- 编辑弹窗 -->
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
      sortName: 'newFriendNum' // 排序名称 默认按新增好友数降序排序
    }
  },
  components: {
    PopItem
  }
}
</script>
<style scoped>
@import '@theme/variables.pcss';
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
