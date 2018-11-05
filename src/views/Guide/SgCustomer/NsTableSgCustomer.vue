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
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.transName" placeholder="请输入转出人" @keyup.enter.native="$quickSearchAction$('transName')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('transName')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="转出人：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.transName" placeholder="请输入转出人">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="转入人：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.receiveName" placeholder="请输入转入人">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="转移类型：">
          <el-form-grid size="xmd" >
            <el-form-item prop="transMethod">
              <el-select  v-model="model.transType" clearable filterable placeholder="请选择转移方式">
                <el-option label="门店均分" value="1"></el-option>
                <el-option label="指定导购转移" value="2"></el-option>
                <el-option label="自定义转移" value="3"></el-option>
                <el-option label="店长转移" value="4"></el-option>
                <el-option label="导购自离" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-form-grid size="xmd">
            <el-form-item prop="transType">
              <el-select  v-model="model.operationType" clearable filterable placeholder="请选择转移类型">
                <el-option label="品牌转移" value="0"></el-option>
                <el-option label="门店转移" value="1"></el-option>
                <el-option label="导购自离" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="转移时间：" prop="time">
          <el-date-picker
            v-model="model.validTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            align="right">
          </el-date-picker>
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

        <el-table-column :show-overflow-tooltip="true" type="default" prop="transName" align="left"
                         label="转出人" :sortable="false" :width="350">
          <template slot-scope="scope">
            {{scope.row.transName}} [{{scope.row.transShopName}}]
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="receiveName" align="left"
                         label="转入人" :sortable="false" :width="350">
          <template slot-scope="scope">
            {{scope.row.receiveName}} [{{scope.row.receiveShopName}}]
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="customer_num" align="left"
                         label="转移人数" :sortable="false" :width="260">
          <template slot-scope="scope">
            <a href="javascript:" @click="showListDialog(scope.row.id)">{{scope.row.customer_num}}</a>
          </template>

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="trans_type" align="left"
                         label="转移类型" :sortable="false" >
          <template slot-scope="scope">
            <span v-if="scope.row.trans_type == 1">
              门店均分
            </span>
            <span v-if="scope.row.trans_type == 2">
              指定导购转移
            </span>
            <span v-if="scope.row.trans_type == 3">
              自定义转移
            </span>
            <span v-if="scope.row.trans_type == 4">
              店长转移
            </span>
            <span v-if="scope.row.trans_type == 5">
              导购自离
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="operation_type" align="left"
                         label="操作类型" :sortable="false" >
          <template slot-scope="scope">
            <span v-if="scope.row.operation_type == 0">
              品牌转移
            </span>
            <span v-if="scope.row.operation_type == 1">
              门店转移
            </span>
            <span v-if="scope.row.operation_type == 2">
              导购自离
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="operation" align="left"
                         label="操作人ID" :sortable="false" >
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="create_time" align="left"
                         label="转移时间" :sortable="false" >
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>


      <el-dialog :visible.sync="showCustomerDialogVisible" width="800px" :before-close="onCancleDialog" :vetically=true>
        <div style="overflow-x:hidden;overflow-y:auto;">
          <el-table :data="customerData">
            <el-table-column prop="customerName" label="姓名" align="center" width="200"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center" width="150">
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
            <el-table-column prop="mobile" label="手机号" align="center" width="200">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
          </el-table>
        </div>
        <!--分页开始-->
        <el-pagination class="template-table-pagination"
                       :page-sizes="paginations.sizeOpts"
                       :total="_data.paginations.total"
                       :current-page="_data.paginations.page"
                       :page-size="_data.paginations.size"
                       layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </el-dialog>

    </template>
    <!-- 分页-结束 -->

  </ns-page-table>

</template>

<script>
  import NsTableSgCustomer from './src/NsTableSgCustomer'
  import NsDatetime from 'components/NsDatetime'
  import couponItem from 'components/NsCouponItem'
  NsTableSgCustomer.components = {
    NsDatetime,
    couponItem

  }
  export default NsTableSgCustomer
</script>

<style scoped>
.w80{width: 76px;text-align: right; display: inline-block;}
</style>
