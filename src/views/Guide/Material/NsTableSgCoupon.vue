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
          <el-input ref="quickText" style="width: 250px" v-model="model.couponTitle" placeholder="请输入优惠券名称或编码" @keyup.enter.native="$quickSearchAction$('couponTitle')">
            <Icon fontType="el-icon-search" className="el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('couponTitle')"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon className="el-icon--right" v-if="_data._queryConfig.expand" fontType="el-icon-arrow-up"/>
            <Icon className="el-icon--right" v-else fontType="el-icon-arrow-down"/>
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
        <el-form-item label="优惠券：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.couponTitle" placeholder="请输入优惠券名称或编码">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="卡券类型：">
          <el-form-grid size="xmd" >
            <el-form-item prop="storeCouponType">
              <el-select  v-model="model.couponType" clearable filterable placeholder="请选择卡券类型">
                <el-option label="代金券" value="1"></el-option>
                <el-option label="折扣券" value="2"></el-option>
                <el-option label="兑换券" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：">
          <el-form-grid size="xmd">
            <el-form-item prop="storeCouponState">
              <el-select  v-model="model.couponStatus" clearable filterable placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="失效时间：" prop="time">
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

        <el-table-column :show-overflow-tooltip="true" type="default" prop="activityId" align="left" :width="200"
                         label="面额" :sortable="false">
          <template slot-scope="scope">
            <couponItem :itemObj="scope.row"></couponItem>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="title" align="left"
                         label="卡券信息" :sortable="false" :width="260">
          <template slot-scope="scope">
            <span class="w80">优惠券名称:</span>{{scope.row.couponTitle}}<br>
            <span class="w80">使用条件:</span>{{scope.row.useConditionStr}}<br>
            <span class="w80">优惠券编码:</span>{{scope.row.couponCode}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" align="center"
                         label="有效时间" :sortable="false" width="200">
          <template slot-scope="{row}">
            <div v-if="row.dateValidType == 0">
              <div>{{row.startTime}}</div>
              <div>{{row.endTime}}</div>
            </div>
            <div v-if="row.dateValidType == 1">
              <div>领取后第{{row.afterGetValidDays}}天有效</div>
              <div>有效期{{row.validDays}}天</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="createTime" align="center"
                         label="创建时间" :sortable="false" width="200">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="couponTotal" align="center"
                         label="配额" :sortable="false" >
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="type" align="center"
                         label="状态" :sortable="false" >
          <template slot-scope="scope">{{scope.row.couponStatus == '0' ? "禁用" : "启用"}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="couponType" align="center"
                         label="发放门店" :sortable="false" >
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">公用</span>
            <a href="javascript:" @click="showListDialog(scope.row.activityCouponId)" v-else>{{scope.row.shopTotal}}</a>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->

  </ns-page-table>

</template>

<script>
import NsTableSgCoupon from './src/NsTableSgCoupon'
import NsDatetime from 'web-crm/src/components/NsDatetime'
import couponItem from 'web-crm/src/components/NsCouponItem'
NsTableSgCoupon.components = {
  NsDatetime,
  couponItem

}
export default NsTableSgCoupon
</script>

<style scoped>
.w80{width: 76px;text-align: right; display: inline-block;}
</style>
