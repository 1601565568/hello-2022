<template>
  <div>
    <page-table :searchCol="24" :diyTitle="true">
      <template slot="title">
        <div class="head-router">
          <span>企微好友营销审核</span>
        </div>
      </template>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model.trim="model.name" placeholder="请输入活动名称" @keyup.enter.native="onSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="onSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="创建时间：" class='el-form__change'>
            <el-date-picker
              v-model="model.createTime"
              type="datetimerange"
              @change="getCreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建人：">
            <ns-select v-model="model.employeeId" @input="getCreater" filterable clearable :url="$api.marketing.weworkMarketing.getEmployee"/>
          </el-form-item>
        </el-form>
      </template>
      <template slot='table'>
        <el-table ref="table" :data="_data._table.data" class="new-table_border"
                  v-loading.lock="_data._table.loadingtable" :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$" :row-style="tableRowClassName">

          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="活动名称">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
            sortable="0">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="predictSendTime"
            label="发送方式"
            sortable="2">
            <template slot-scope="scope">
              <template>
                {{scope.row.predictSendTime + '' === 'null' ? '立即发送' : '定时发送'}}
              </template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="predictSendTime"
            label="执行时间"
            sortable="2">
            <template slot-scope="scope">
              <template>
                {{scope.row.predictSendTime + '' === 'null' ? '-' : scope.row.predictSendTime}}
              </template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="tradeTagName"
            label="营销对象">
            <template slot-scope="scope">
              <!-- {{scope.row.userGroupIds.split(',').length}} -->
              <template v-if="scope.row.customerType === 1"> 个客户分群</template>
              <template v-else-if="scope.row.customerType === 2">
                <template v-if="scope.row.marketingType === 3"> 个员工
                </template>
                <template v-else> 个员工全部好友</template>
              </template>
              <template v-else-if="scope.row.customerType === 3"> 个微信群</template>
              <template v-else> 个群主</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="employee.name"
            label="创建人">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            label="操作">
            <template slot-scope="scope">
              <ns-table-column-operate-button
                :buttons="_data._table.table_buttons"
                :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template>
    </page-table>
  </div>
</template>

<script>
import NsTableActivityExamine from './src/NsTableActivityExamine'
export default NsTableActivityExamine
</script>

<style lang="scss" scoped>
@import "@/components/NewUi/styles/reset.css";
.search-icon {
  font-size: 27px;
}
</style>
