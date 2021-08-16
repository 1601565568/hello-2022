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
        <el-form-item v-show="_data._queryConfig.expand === false" label="优惠券名称或编码：">
          <el-input ref="quickText" style="width: 200px" v-model="model.couponTitle" placeholder="请输入优惠券名称或编码" @keyup.enter.native="$quickSearchAction$('couponTitle')" clearable>
            <!--<Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name"-->
                  <!--@click="$quickSearchAction$('couponTitle')"/>-->
          </el-input>
          <!-- <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
          <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button> -->
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
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="优惠券：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.couponTitle" placeholder="请输入优惠券名称或编码" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="卡券类型：" prop="storeCouponType">
          <el-form-grid size="xmd" >
            <el-select  v-model="model.couponType" clearable filterable placeholder="请选择卡券类型">
              <el-option label="代金券" value="1"></el-option>
              <el-option label="折扣券" value="2"></el-option>
              <el-option label="兑换券" value="3"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：" prop="storeCouponState">
          <el-form-grid size="xmd">
            <el-select  v-model="model.couponStatus" clearable filterable placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
              <el-option label="已作废" value="2"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="有效时间：">
          <el-form-grid  prop="dateType">
          <el-select
            style="width:120px"
            v-model="model.dateType" placeholder="请选择">
            <el-option
              v-for="item in dateTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-grid>
          <el-form-grid prop="time" style="margin-left: 5px;">
          <el-date-picker
            v-model="model.validTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            align="right">
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
      <div style="margin-top:20px;background-color:white;padding:10px">
        <el-table ref="table" :data="_data._table.data" class="new-table_border drawer-table"
                  v-loading.lock="_data._table.loadingtable"
                  max-height="800"
                  :header-row-style="{'height': '48px'}"
                  :cell-style="{ 'padding-top': '12px', 'padding-bottom' : '12px'}"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column :show-overflow-tooltip="true" type="default" prop="activityId" width="210px"
                          label="面额" :sortable="false">
            <template slot-scope="scope">
              <couponItem :itemObj="scope.row"></couponItem>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                          label="卡券信息" :sortable="false" width="270px">
            <template slot-scope="scope">
              <span>优惠券名称:{{scope.row.couponTitle}}</span><br>
              <span>使用条件:{{scope.row.useConditionStr}}</span><br>
              <span>优惠券编码:{{scope.row.couponCode}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default"
                          label="有效时间" :sortable="false" width="166px">
            <template slot-scope="{row}">
              <div v-if="row.dateValidType == 0">
                <span>{{row.startTime}}</span><br>
                <span>~</span><br>
                <span>{{row.endTime}}</span>
              </div>
              <div v-if="row.dateValidType == 1">
                <span>领取后第{{row.afterGetValidDays}}天生效</span><br>
                <span>有效期{{row.validDays}}天</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="createTime"
                          label="创建时间" :sortable="false" width="180px">
          </el-table-column>
          <el-table-column label="分配渠道" width="100px" align="center">
            <template slot-scope="scope">
              {{scope.row.apportionChannel === 1 ? '活动分发': '导购分发'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="couponTotal"
                          label="配额" :sortable="false" width="100px" align="center">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="type"
                          label="状态" :sortable="false" width="100px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid == 1" class="text-base text-invalid">已作废</span>
              <span v-else>
                  <span v-if="scope.row.couponStatus == 0" class="text-base text-disable">禁用</span>
                  <span v-else class="text-base text-enable">启用</span>
              </span>
              <!-- <span :class="scope.row.isValid == 1 ? 'text-yellow': scope.row.couponStatus == 0 ? 'text-error' : 'text-success'">
                {{scope.row.isValid == 1 ? '已作废': scope.row.couponStatus == '0' ? "禁用" : "启用"}}
              </span> -->
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="couponType"
                          label="发放门店" :sortable="false" width="100px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">公用</span>
              <a href="javascript:" @click="showListDialog(scope.row.activityCouponId)" v-else>{{scope.row.shopTotal}}</a>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="couponType"
                          label="发放情况" :sortable="false" width="115px" align="center">
            <template slot-scope="scope">
              已领取：{{scope.row.noUseTotal?scope.row.noUseTotal:'0'}}&nbsp;张<br>
              已使用：{{scope.row.useTotal?scope.row.useTotal:'0'}}&nbsp;张
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="couponType"
                          label="启用" :sortable="false" width="100px" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.start"
                active-color="#13ce66"
                inactive-color="#8C8C8C">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="couponType"
                          label="操作" :sortable="false" width="100px" align="center">
                          <div style="color:#0094FC;font-size:14px">编辑</div>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination" background
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
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import couponItem from '@nascent/ecrp-ecrm/src/components/NsCouponItem'
NsTableSgCoupon.components = {
  NsDatetime,
  couponItem

}
export default NsTableSgCoupon
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @import '@components/NewUi/styles/reset.css';

  .w80{
    text-align: right;
    width: 76px;
    display: inline-block;
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
  .text-base {
    color: rgba(0,0,0,0.85);
    padding: 0 10px;
    display: inline-block;
    border-radius: 2px;
    font-size: 12px;
  }
  .text-invalid {
    background: #FFF4E6;
    border: 1px solid #FFD8A8;
  }
  .text-disable {
    background: #FFEFE6;
    border: 1px solid #C34120;
  }
  .text-enable {
    background: #EDFAE1;
    border: 1px solid #C2F099;
  }
  .drawer-table {
    padding: 0;
    font-size: 14px;
    font-weight: 400;
  }
</style>
