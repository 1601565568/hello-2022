<template>
<div calss="NsTableGuide_main">
        <div class="template-page__row-left">
          <el-input ref="quickText" style="width: 190px" v-model="filterTreeText" placeholder="输入店铺名称/导购姓名" clearable>
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i>
          </el-input>
          <div :class="offsetHeight?'elTrees':'elTree'" ref="elTree" :style="{ 'height' : height + 'px'}">
            <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
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
          <el-input ref="quickText" style="width: 250px" v-model="model.mobile" placeholder="手机号" @keyup.enter.native="$searchAction$()" clearable>
            <!-- <i class="el-icon-search el-input__icon" slot="suffix" moblie="moblie" @click="$searchAction$()"></i> -->
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

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="姓名：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="手机号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.mobile" placeholder="请输入手机号" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="昵称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.nickName" placeholder="请输入昵称" clearable></el-input>
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

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" align="center" :width="50"></el-table-column>
        <el-table-column prop="name" label="会员姓名" align="left" width="100">
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.mobile?scope.row.mobile:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="grade,memberCard" label="会员类型/卡号" align="left" >
          <template slot-scope="scope">
              <div v-if="scope.row.memberCard !==null || scope.row.grade !== null">
                <span>{{(scope.row.grade === '0' || scope.row.grade === null) ? '非会员':'会员'+scope.row.grade}}/</span>
                <span>{{scope.row.memberCard === undefined ? '-':scope.row.memberCard}}</span>
                <!-- {{(scope.row.grade === '0' || scope.row.grade === null) ? '-'+ ' / ' +scope.row.memberCard === undefined?'-':scope.row.memberCard:'会员' + scope.row.grade + ' / '+scope.row.memberCard}} -->
              </div>
              <div v-if="scope.row.memberCard == null && scope.row.grade === null">
                未绑卡
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.nickName?scope.row.nickName:'-'}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="关注状态" align="left" width="180">
          <template slot-scope="scope">
            {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+'/'+scope.row.city+'/'+scope.row.district}}
          </template>
        </el-table-column> -->
        <el-table-column prop="guideName" label="专属导购" align="left" width="180">
          <template slot-scope="scope">
              {{scope.row.guideName ? scope.row.guideName : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="招募时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.activateTime?moment(scope.row.activateTime):'-'}}
            </template>
        </el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="60">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" @click="onRedactFun(scope.row)" type="text">详情</ns-button>
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
import NsTableGuide from './src/NsTableGuide'
export default NsTableGuide
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
