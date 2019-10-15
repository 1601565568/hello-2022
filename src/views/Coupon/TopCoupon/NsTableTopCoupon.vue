<template>
  <ns-page-table @add-coupon="$emit('add-coupon')" @update-coupon="$emit('update-coupon')" @open-detail="$emit('open-detail', obj)">
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
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.couponTitle" placeholder="请输入优惠券名称" @keyup.enter.native="$quickSearchAction$('couponTitle')">
            <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name"
                  @click="$quickSearchAction$('couponTitle')"/>
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
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="优惠券名称：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model.trim="model.couponTitle">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="面额：" label-width="90px">
          <el-form-grid size="xmd">
            <el-select v-model="model.denominations" placeholder="请选择">
              <el-option label="3元" value="300" :key="300"></el-option>
              <el-option label="5元" value="500" :key="500"></el-option>
              <el-option label="10元" value="1000" :key="1000"></el-option>
              <el-option label="50元" value="5000" :key="5000"></el-option>
              <el-option label="100元" value="10000" :key="10000"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：" label-width="90px">
          <el-form-grid>
            <el-select v-model="model.couponStatus" placeholder="请选择">
              <el-option label="未过期" value="0" :key="0"></el-option>
              <el-option label="已过期" value="1" :key="1"></el-option>
            </el-select>
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
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
        stripe
        resizable v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type="default" prop="login_account"
                         label="优惠券" dbcolumn="login_account" column="login_account" align="center"
                         :sortable="false" width="200">
          <template slot-scope="scope">
            <div class="coupons" v-if="!overdue(scope.row.end_time)">
              <div class="coupon-block">
                <span class="coupon-cor top"></span>
                <div class="coupon-content">
                  <div class="coupon-price">{{scope.row.denominations/100}}</div>
                  <div class="coupon-word">
                    <div class="coupon-word__rule">{{scope.row.coupon_condition == 0?'无门槛使用': '订单满 '+scope.row.coupon_condition/100+' 元'}}</div>
                    <div class="coupon-word__tip">元优惠券</div>
                  </div>
                </div>
                <span class="coupon-cor bottom"></span>
                <div class="coupon-shade">
                  <span>已过期</span>
                </div>
              </div>
            </div>
            <div class="coupons is-deadline" v-else>
              <div class="coupon-block">
                <span class="coupon-cor top"></span>
                <div class="coupon-content">
                  <div class="coupon-price">{{scope.row.denominations/100}}</div>
                  <div class="coupon-word">
                    <div class="coupon-word__rule">{{scope.row.coupon_condition == 0?'无门槛使用': '订单满 '+scope.row.coupon_condition/100+' 元'}}</div>
                    <div class="coupon-word__tip">元优惠券</div>
                  </div>
                </div>
                <span class="coupon-cor bottom"></span>
                <div class="coupon-shade">已过期</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="user_name"
                         label="优惠券说明"  dbcolumn="user_name" column="user_name" align="left" :sortable="false">
          <template slot-scope="scope">
            <p>优惠券名称：{{scope.row.coupon_title}}</p>
            <p>类型：{{scope.row.coupon_type ==0 ? '代金券': '折扣券'}}</p>
            <p>使用条件：{{scope.row.coupon_condition == 1?'无门槛使用': '订单满 '+scope.row.coupon_condition/100+' 元'}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="department_name"
                         label="有效时间" dbcolumn="department_name" column="department_name" align="center" :sortable="false">
          <template slot-scope="scope">
            <p>{{scope.row.start_time}}</p>
            <p>{{scope.row.end_time}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="role_name"
                         label="发送情况" dbcolumn="role_name" column="role_name" align="center"
                         :sortable="false">
          <template slot-scope="scope">
            <p>未发放：{{scope.row.unused_count}}张</p>
            <p>发放中：{{scope.row.using_count}}张</p>
            <p>已发放：<a  @click="showDetail(scope.row)">{{scope.row.used_count}}</a>张</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" label="支持客道精灵"
                         align="center" :sortable="false" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.coupon_jingling_power"
              :active-value="0"
              :inactive-value="1" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="100">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope">
            </ns-table-column-operate-button>
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
import NsTableTopCoupon from './src/NsTableTopCoupon'
export default NsTableTopCoupon
</script>
<style scoped>
  @import "@theme/variables.pcss";
  /* 优惠券结构 */
  .coupons {
    overflow:hidden;
    display: inline-block;
    vertical-align: middle;
  }
  .coupon-block {
    position: relative;
    border: 1px solid var(--theme-color-danger);
    padding: var(--default-padding-base) var(--default-padding-small);
    background: var(--theme-color-white);
    line-height: 18px;
  }
  .coupon-cor:before, .coupon-cor:after {
    content: '';
    position: absolute;
    display:inline-block;
    background: var(--theme-color-white);
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border:1px solid var(--theme-color-danger);
  }
  .coupon-cor.top:before {
    left: -5px;
    top: -5px;
    border-top:1px solid var(--theme-color-white);
    border-left:1px solid var(--theme-color-white);
  }
  .coupon-cor.top:after{
    right:-5px;
    top:-5px;
    border-top:1px solid var(--theme-color-white);
    border-right:1px solid var(--theme-color-white);
  }
  .coupon-cor.bottom:before {
    left:-5px;
    bottom:-5px;
    border-bottom:1px solid var(--theme-color-white);
    border-left:1px solid var(--theme-color-white);
  }
  .coupon-cor.bottom:after{
    right:-5px;
    bottom:-5px;
    border-bottom:1px solid var(--theme-color-white);
    border-right:1px solid var(--theme-color-white);
  }
  .coupon-content {
    display: table;
  }
  .coupon-price {
    display: table-cell;
    vertical-align: middle;
    font-size: 26px;
    font-weight: bold;
    padding-right: 5px;
    color: var(--theme-color-danger);
  }
  .coupon-word {
    display: table-cell;
  }
  .coupon-word__rule {
    background: var(--theme-color-danger);
    color: var(--theme-color-white);
    padding: 1px 2px;
  }
  .coupon-word__tip {
    font-size: 14px;
    color: var(--theme-color-danger);
    font-weight: bold;
  }
  .is-gray-bg .coupon-cor:before,
  .is-gray-bg .coupon-cor:after{
    background: var(--theme-base-border-color-primary);
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td .coupon-cor:before,
  .el-table--enable-row-hover .el-table__body tr:hover>td .coupon-cor:after{
    background-color: var(--theme-base-border-color-primary);
  }
  /* 已过期 */
  .coupons .is-deadline {
    .coupon-shade {
      display: inline-block;
    }
    .coupon-block,.coupon-cor:before,.coupon-cor:after{
      border:1px solid var(--theme-base-border-color-primary);
    }
    .coupon-price,.coupon-word__tip{
      color:#999;
    }
    .coupon-word__rule{
      background-color: #ccc;
    }
  }
  .coupon-shade {
    position: absolute;
    border: 3px solid var(--theme-color-danger);
    color: var(--theme-color-danger);
    font-size: 16px;
    font-weight: bold;
    top: 10px;
    right: 5px;
    display: none;
    padding: 2px;
    transform: rotate(-10deg);
    -ms-transform: rotate(-10deg);
    -moz-transform: rotate(-10deg);
    -webkit-transform: rotate(-10deg);
    -o-transform: rotate(-10deg);
  }
</style>
