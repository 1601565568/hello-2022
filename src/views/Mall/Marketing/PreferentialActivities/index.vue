<template>
  <div class="template-page">
    <div v-show="!showEdit">
      <el-tabs v-model="activityActive" @tab-click="tabClick">
        <el-tab-pane label="所有" name="all"></el-tab-pane>
        <el-tab-pane label="未开始" name="notStart"></el-tab-pane>
        <el-tab-pane label="进行中" name="ongoing"></el-tab-pane>
        <el-tab-pane label="已结束" name="finished"></el-tab-pane>
      </el-tabs>
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        </template>
        <!-- 简单搜索 -->
        <template slot="searchSearch">
          <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="_data._queryConfig.expand === false">
              <el-input ref="quickText" v-model.trim="quickSearchModel.name" placeholder="活动名称" @keyup.enter.native="$quickSearchAction$('name')">
                <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('name')"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 简单搜索-结束 -->
        <!-- 表格 -->
        <template slot="table">
          <el-table ref="table" :data="_data._table.data" class="template-table__main"
                    stripe resizable v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column prop="name" label="活动名称" width="200" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态	" width="80" align="center">
              <template slot-scope="{row}">
                <span v-if="row.state === 0" class="text-error">未开始</span>
                <span v-else-if="row.state === 1" class="text-success">执行中</span>
                <span v-else-if="row.state === 2">已结束</span>
              </template>
            </el-table-column>
            <el-table-column label="有效时间" align="center" width="320">
              <template slot-scope="{row}">
                {{row.startTime}} ~ {{row.endTime}}
              </template>
            </el-table-column>
            <el-table-column label="订单实付金额" align="right">
              <template slot-scope="{row}">
                <span v-if="row.totalPayment">￥{{row.totalPayment}}</span>
                <span v-else>￥0</span>
              </template>
            </el-table-column>
            <el-table-column prop="tradeCount" label="付款订单数" align="right"></el-table-column>
            <el-table-column prop="customerCount" label="付款人数" align="right"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="120">
              <template slot-scope="scope">
                <ns-table-column-operate-button :buttons="_data._table.operate_buttons" :prop="scope"></ns-table-column-operate-button>
              </template>
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
        </template>
        <!-- 分页-结束 -->
      </ns-page-table>
    </div>
    <div v-show="showEdit">
      <edit ref="edit" @showList = "showList"></edit>
    </div>
    <div v-show="showView">
      <detail ref="detail" @close=" closeView"></detail>
    </div>
  </div>
</template>

<script>
import index from './src/index'
import edit from './edit'
import detail from './detail'
index.components = {
  edit, detail
}
export default index
</script>
