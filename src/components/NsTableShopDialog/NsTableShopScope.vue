<!--
 * @Descripttion: 智能欢迎语-使用范围
 * @Author: yuye.huang
 * @Date: 2020-03-02 09:38:22
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 14:20:05
 -->
<template>
  <ns-page-table ref='table' :colButton="10">  :visible.sync="this.model.visible"
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form
        :model="model"
        :line="true"
        @submit.native.prevent
        class="pull-right"
      >
        <el-form-item>
          <el-input ref="quickText" style="width: 180px" v-model="model.shopName" placeholder="请输入门店名称"
                    @keyup.enter.native="$quickSearchAction$('shopName')" clearable />
          <ns-button type="primary" @click="$quickSearchAction$('shopName')" class="searchbtn" style="margin-right: 10px;margin-left: 5px;">搜索</ns-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table"  :data="_data._table.data" stripe
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')">
        <el-table-column prop="shop_name" label="门店名称" align="left">
        </el-table-column>
        <el-table-column prop="shop_status" label="门店状态" align="left">
          <template slot-scope="scope">
            {{scope.row.shop_status === -2 ? '锁定/暂停' : ''}}
            {{scope.row.shop_status === -1 ? '过期/已关店' : ''}}
            {{scope.row.shop_status === -0 ? '删除' : ''}}
            {{scope.row.shop_status === 1 ? '正常' : ''}}
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                      :page-sizes="_data._pagination.sizeOpts"
                      :total="_data._pagination.total"
                      :current-page.sync="_data._pagination.page"
                      :page-size="_data._pagination.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="$sizeChange$"
                      @current-change="$pageChange$">
      </el-pagination>
    </template>
  </ns-page-table>
</template>

<script>
import NsTableShopScope from './src/NsTableShopScope.js'
export default NsTableShopScope

</script>
