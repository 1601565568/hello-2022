<template>
  <ns-page-table @add="$emit('add')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false" label="操作人：" prop="operatorName">
          <el-input ref="quickText" style="width: 200px" v-model="model.operatorName" placeholder="请输入操作人姓名" @keyup.enter.native="$searchAction$()" clearable><!-- $quickSearchAction$('outGuideName') -->
          </el-input>
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn" >搜索</ns-button><!-- @keyup.enter.native="$searchAction$()" -->
          <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="$searchAction$()" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="操作人：" prop="operatorName">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.operatorName" placeholder="请输入操作人姓名" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="转移类型：" prop="transferType">
          <el-form-grid size="xmd" >
            <el-select  v-model="model.transferType" filterable clearable placeholder="请选择转移方式">
              <el-option label="后台客户列表转移" value="0"></el-option>
              <el-option label="员工更换门店" value="1"></el-option>
              <el-option label="员工离职" value="2"></el-option>
              <el-option label="店长会员转移" value="3"></el-option>
              <el-option label="商城会员自主转移" value="4"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="转移时间：" prop="timeRange">
          <el-form-grid size="xlg">
            <el-date-picker
              v-model="model.timeRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              @change="changeTime"
              align="right"><!-- value-format="yyyy-MM-dd HH-mm-ss" :default-time="['00:00:00', '23:59:59']" -->
            </el-date-picker>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>

    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type="default" prop="taskId" align="left"
                         label="转移批次号" :sortable="false" width="180">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="operatorName" align="left"
                         label="操作人姓名" :sortable="false" width="180">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="operator" align="right"
                         label="操作人ID" :sortable="false" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.operator || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="taskCount" align="right"
                         label="转移人数" :sortable="false" width="150">
          <template slot-scope="scope">
            <a href="javascript:" @click="showListDialog(scope.row)">{{scope.row.taskCount}}</a>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="transferType" align="left"
                         label="转移类型" :sortable="false" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.transferType == 0">
              后台客户列表转移
            </span>
            <span v-else-if="scope.row.transferType == 1">
              员工更换门店
            </span>
            <span v-else-if="scope.row.transferType == 2">
              员工离职
            </span>
            <span v-else-if="scope.row.transferType == 3">
              店长会员转移
            </span>
            <span v-else-if="scope.row.transferType == 4">
              商城会员自主转移
            </span>
            <span v-else>
              未知类型
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="transferTime" align="center"
                         label="转移时间" :sortable="false" >
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination" >
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$" >
      </el-pagination>

      <el-dialog :title="title" :visible.sync="showCustomerDialogVisible" width="960px" :before-close="onCancelDialog"  :show-scroll-x="false" append-to-body :vetically=true>
        <div style="overflow-x:hidden;overflow-y:auto;">
          <el-table :data="customerData" v-loading.lock="detailLoadingTable"
                :element-loading-text="$t('prompt.loading')">
            <el-table-column prop="name" label="姓名" align="left" width="100">
              <template slot-scope="scope">
                <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" align="center" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == 0">
                  女
                </span>
                <span v-if="scope.row.sex == 1">
                  男
                </span>
                <span v-if="scope.row.sex == -1">
                  未知
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120">
              <template slot-scope="scope">
                <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encMobile" :sensitiveData="scope.row.mobile"></ns-sg-sensitive-button>
              </template>
            </el-table-column>
            <el-table-column prop="memberCard" label="会员卡号" align="center" width="150">
              <template slot-scope="scope">{{scope.row.memberCard?scope.row.memberCard:'-'}}</template>
            </el-table-column>
            <el-table-column prop="outGuideName" label="原导购" align="left" width="180">
              <template slot-scope="scope">{{scope.row.outGuideName?scope.row.outGuideName:'-'}} [{{scope.row.outShopName?scope.row.outShopName:'-'}}]</template>
            </el-table-column>
            <el-table-column prop="intoGuideName" label="新导购" align="left" width="180">
              <template slot-scope="scope">{{scope.row.intoGuideName?scope.row.intoGuideName:'-'}} [{{scope.row.intoShopName?scope.row.intoShopName:'-'}}]</template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页开始-->
        <el-pagination class="template-table-pagination"
                       :page-sizes="paginations.sizeOpts"
                       :total="_data.paginations.total"
                       :current-page.sync="_data.paginations.page"
                       :page-size="_data.paginations.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="detailSizeChange"
                      @current-change="detailPageChange"
        >
        </el-pagination>
      </el-dialog>

    </template>
    <!-- 分页-结束 -->

  </ns-page-table>

</template>

<script>
import NsTableSgCustomer from './src/NsTableSgCustomer'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import couponItem from '@nascent/ecrp-ecrm/src/components/NsCouponItem'
NsTableSgCustomer.components = {
  NsDatetime,
  couponItem

}
export default NsTableSgCustomer
</script>

<style scoped>
  @import "@theme/variables.pcss";

 .w80{width: 76px;text-align: right; display: inline-block;}
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
