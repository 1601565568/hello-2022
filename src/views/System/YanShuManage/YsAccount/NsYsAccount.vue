<template>
  <ns-page-table @open-dialog="$emit('open-dialog', 'add', '新增通道账号')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true"  @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.ys_account" placeholder="请输入通道账号"
                    @keyup.enter.native="$quickSearchAction$('ys_account')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('ys_account')"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')"
                @sort-change = "$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "ys_account"
                         label = "通道账号" align = "left" :sortable = "false">
          <template slot-scope="scope">
            <template>
              {{scope.row.ys_account}}
            </template>
          </template>
        </el-table-column>

        <!--  暂时不显示，后期可能要用，不要删除
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "sms_balance"
                         label = "短信余量" align = "right" width = "120" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.sms_balance && scope.row.sms_balance != 0">
              -
            </template>
            <template v-else>
              {{scope.row.sms_balance}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "email_balance"
                         label = "邮件余量" dbcolumn = "email_balance" column = "email_balance"
                         align = "right" width = "120" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.email_balance && scope.row.email_balance != 0">
              -
            </template>
            <template v-else>
              {{scope.row.email_balance}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "total_price"
                         label = "累计充值(元)" align = "right" width = "120" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.total_price && scope.row.total_price != 0">
              -
            </template>
            <template v-else>
              {{scope.row.total_price}}
            </template>
          </template>
        </el-table-column>-->
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "use_range"
                         label = "应用品牌" dbcolumn = "use_range" column = "use_range"
                         align = "left" width = "800px" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.use_range">
              -
            </template>
            <template v-else>
              {{scope.row.use_range}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "state"
                         label = "状态" dbcolumn = "state" column = "state" align = "center"
                         :sortable = "false" width="80px">
          <template slot-scope="scope">
            <template v-if="scope.row.state === 1">
              <span class="dot-success">正常</span>
            </template>
            <template v-else>
              <span class="dot-danger ">停用</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width = "160px" >
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                     :page-sizes = "_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>
<script>
import NsYsConfigAddInfo from './src/NsYsAccount'
export default NsYsConfigAddInfo
</script>
