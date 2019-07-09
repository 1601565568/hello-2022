<template>
<div calss="NsTable_main">
        <div class="template-page__row-left">
          <el-input ref="quickText" style="width: 190px" v-model="filterTreeText" placeholder="搜索分组">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i>
          </el-input>
          <div :class="offsetHeight?'elTrees':'elTree'" ref="elTree" :style="{ 'height' : height + 'px'}">
            <el-tree class="filter-tree" ref="groupTree" :data="findGroupList" highlight-current
                  node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                  :filter-node-method="onFilterNode" @node-click="onClickNode">
              <div class="subdivision-tree-node" slot-scope="{ node }" >
                <span>{{node.label}}</span>
              </div>
            </el-tree>
          </div>
        </div>
        <div  class="template-page__row-right">
        <ns-page-table @add="$emit('add')"  @shopEdit="$emit('shopEdit')" >
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.table_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.mobile" placeholder="搜索敏感词" @keyup.enter.native="$searchAction$()" clearable>
          </el-input>
          <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
          <ns-button @click="$resetInputAction$()">重置</ns-button>
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
    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column prop="name" label="敏感词" align="left" width="100"/>
        <el-table-column prop="groupName" label="分组" align="left" width="120"/>
        <el-table-column prop="num" label="出现次数" align="left" width="120"/>
        <el-table-column prop="creatorName" label="创建人" align="left" width="180">
          <template slot-scope="scope">
              {{scope.row.creatorName}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="left" width="160">
            <template slot-scope="scope">
              {{moment(scope.row.createTime)}}
            </template>
        </el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="80">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" @click="onRedactFun(scope.row)" type="text">删除</ns-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

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
    <!-- 分页-结束 -->
  </ns-page-table>
    </div>
  </div>
</template>
<script>
import NsTable from './src/NsTable'
export default NsTable
</script>

<style scoped>
  .template-page__row-left {
    width: 220px;
    position: absolute;
    left: 210px;
    top: 70px;
    z-index: 2;
    overflow: hidden;
  }
  .template-page__row-right {
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 1;
    margin: 0;
    width: 100%;
  }
  .template-table {
    margin: 0 10px 0 440px;
  }
  @media screen and (min-width: 1624px) {
    .el-tree-node__content{
      width: 210px;
    }
    .template-page__row-left {
      width: 220px;
      position: absolute;
      left: 210px;
      top: 90px;
      z-index: 2;
      overflow: hidden;
    }
    .template-page__row-right {
      position: absolute;
      top: 90px;
      left: 0;
      z-index: 1;
      width: 100%;
      margin: 0;
    }
    .template-table {
      margin: 0 10px 0 440px;
    }
  }
</style>
<style>
.elTree{
  overflow-y: auto;
  overflow-x: hidden
}
.elTrees{
  overflow-y: hidden;
  overflow-x: hidden
}
.elTree::-webkit-scrollbar{
  width: 3px;
}
.elTrees .navTree-item .dataName{
  display: inline-block;
  width: 143px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
.elTree .navTree-item .dataName{
  display: inline-block;
  width: 143px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
</style>
