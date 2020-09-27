
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div style="background-color: #ffffff;">
    <ns-button type="primary" style="margin: 5px 10px" @click="()=>{this.$emit('export');}">导出会员统计</ns-button>
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
        <el-table-column prop="recruitNum" :sortable="'custom'" label="招募会员总数" align="right">
          <template slot-scope="scope">
            {{scope.row.recruitNum ? scope.row.recruitNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="personalRecruitNum" :sortable="'custom'" label="个号招募数" align="right">
          <template slot-scope="scope">
            {{scope.row.personalRecruitNum ? scope.row.personalRecruitNum : 0}}
          </template>
        </el-table-column>
        <el-table-column prop="personalRecruitRate" :sortable="'custom'" label="个号招募比例" align="right">
          <template slot-scope="scope">
            {{scope.row.personalRecruitRate ? scope.row.personalRecruitRate : 0}}%
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
    <!-- 编辑弹窗 -->
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
import loadLost from './mixins/loadLost'
import NsGuideDialog from '@/components/NsGuideDialog'
import { API_ROOT } from '@/config/http.js'
import PopItem from './components/PopItem'
import TabPane from './components/TabPane'
import moment from 'moment'

export default {
  mixins: [listPageMixin, loadLost],
  data () {
    return {
      sortName: 'recruitNum' // 排序名称 默认按招募会员数降序排序
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
