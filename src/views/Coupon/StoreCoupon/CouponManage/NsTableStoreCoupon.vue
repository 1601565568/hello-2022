<template>
  <ns-page-table @edit="$emit('edit')" @add="$emit('add')">
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" @keyup.enter.native="$quickSearchAction$('name')"
                    v-model="quickSearchModel.name" placeholder="请输入优惠券名称">
            <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix"
                  @click="$quickSearchAction$('name')"/>
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
    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$"  placement="right" label-width="90px" :model="model" :rules="rules"
               :inline="true">
        <el-form-item label="优惠券名称：">
          <el-form-grid size="xmd">
            <el-form-item >
              <el-input type="text" v-model="model.name">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：">
          <el-form-grid size="xmd">
            <el-form-item>
              <el-select  v-model="model.type">
                <el-option label="代金券" value="1"></el-option>
                <el-option label="折扣券" value="2"></el-option>
                <el-option label="兑换券" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：">
          <el-form-grid size="xmd">
            <el-form-item>
              <el-select  v-model="model.status">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="未过期" value="2"></el-option>
                <el-option label="已过期" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="失效时间：">
              <el-form-grid size="xmd">
                <el-date-picker type="datetime" placeholder="开始日期" v-model="model.invalidStartTime"></el-date-picker>
              </el-form-grid>
              <el-form-grid>~</el-form-grid>
              <el-form-grid size="xmd">
                <el-date-picker type="datetime" placeholder="结束日期" v-model="model.invalidEndTime"></el-date-picker>
              </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
    <!-- 表格布局-->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')"
        @sort-change="$orderChange$">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="store_coupon_value" label="面额" align="center">
        </el-table-column>
        <el-table-column label="优惠券说明" align="left">
          <template slot-scope="{row}">
            <div>优惠券名称：{{row.store_coupon_title}}</div>
            <div v-if="row.store_coupon_type==0">类型：未知</div>
            <div v-else-if="row.store_coupon_type==1">类型：代金券</div>
            <div v-else-if="row.store_coupon_type==2">类型：折扣券</div>
            <div v-else-if="row.store_coupon_type==3">类型：兑换券</div>
          </template>
        </el-table-column>
        <el-table-column label="有效时间" align="center" width="240">
          <template slot-scope="{row}">
            <div v-if="row.date_valid_type ==0">
              <div>{{row.start_time}}</div>
              <div>{{row.end_time}}</div>
            </div>
            <div v-if="row.date_valid_type ==1">
              <div>领取后第{{row.after_get_valid_days}}天有效</div>
              <div>有效期{{row.valid_days}}天</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发放情况" align="left">
          <template slot-scope="{row}">
            <div v-if="row.max_issue_Amount !=0">发行量：不限</div>
            <div v-else>发行量：{{row.max_issue_Amount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="{row}">
            <el-switch :value="row.store_coupon_status" :active-value="1" :inactive-value="0"
              :before-change="(call, currVal)=>{onStatusChange(call,currVal,row)}"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.operate_buttons"
              :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                   :page-sizes="_data._pagination.sizeOpts"
                   :total="_data._pagination.total"
                   :current-page.sync="_data._pagination.page"
                   :page-size="_data._pagination.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="$sizeChange$"
                   @current-change="$pageChange$">
    </el-pagination>
  </ns-page-table>
</template>

<script>
import NsTableStoreCoupon from './src/NsTableStoreCoupon'
export default NsTableStoreCoupon
</script>

<style scoped>

</style>
