<template>
  <div>
    <ns-page-table :colButton="6">
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        <span>总充值：</span><span class="text-success">{{rechargeTotal}}</span>
        <span>元，</span>
        <span>总消费：</span><span class="text-error">{{payTotal}}</span>
        <span>元</span>
      </template>
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.searchName" placeholder="会员名称或手机号" @keyup.enter.native="$quickSearchAction$('searchName')">
              <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix"
                @click="$quickSearchAction$('searchName')"/>
            </el-input>
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
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="$searchAction$" class="surround-btn"
                 :model="model" :rules="rules" :inline="true">
          <el-form-item label="会员信息：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.searchName" placeholder="请输入会员名称或手机号">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="类型：" label-width="90px">
            <el-form-grid size="xmd">
              <el-select v-model="model.type" placeholder="请选择">
                <el-option label="充值" value="0" :key="0"></el-option>
                <el-option label="消费" value="2" :key="2"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="单号：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.orderCode" placeholder="请输入单号">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="时间：">
            <el-form-grid size="xlg">
              <el-date-picker v-model="model.time" type="datetimerange" range-separator="至"
                              start-placeholder="开始日期" end-placeholder="结束日期">
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
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="name" label="会员名(手机号)"></el-table-column>
          <el-table-column prop="typeName" label="类型" width='80' align="center"></el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <div v-if="row.action === 1" class="text-success">+{{row.money}}</div>
              <div v-if="row.action === 2" class="text-error">-{{row.money}}</div>
              </template>
          </el-table-column>
          <el-table-column prop="after_balance" label="此会员余额" align="right"></el-table-column>
          <el-table-column prop="order_code" label="单号" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="left"></el-table-column>
          <el-table-column prop="create_time" label="时间" width="160" align="center"></el-table-column>
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
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
