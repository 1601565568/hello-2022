<template>
  <div>
    <ns-page-table>
      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false" label="标题名称：">
            <el-input ref="quickText" style="width: 180px" v-model="model.title" placeholder="请输入好友名称" @keyup.enter.native="$quickSearchAction$('title')" clearable>
            </el-input>
            <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
            <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
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
        <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true" @keyup.enter.native="$searchAction$()">
          <el-form-item label="好友名称：">
            <el-form-grid size="xmd">
              <el-input style="width:180px"  v-model="model.title" placeholder="请输入好友名称" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-input style="visibility:hidden;height:0px;"></el-input>
        </el-form>

        <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
          <ns-button @click="$resetInputAction$()">重置</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table"  :data="_data._table.data" stripe >
          <el-table-column prop="title" label="微信好友" align="left" min-width="30">
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="left" min-width="30">
            <template slot-scope="scope">
              {{scope.row.sex?scope.row.sex:'男'}}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="添加好友时间" align="center" min-width="30">
            <template slot-scope="scope">
              {{scope.row.updateTime?scope.row.updateTime:'2019-05-28 15:57:30'}}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最近交流时间" align="center" min-width="30">
            <template slot-scope="scope">
              <span>发送：{{scope.row.updateTime?scope.row.updateTime:'2019-05-28 15:57:30'}}</span>
              <span>接收：{{scope.row.updateTime?scope.row.updateTime:'2019-05-28 15:57:30'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="guideName" label="导购" align="center" min-width="30">
            <template slot-scope="scope">
              {{scope.row.guideName?scope.row.guideName:'-'}}
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
</template>
<script>
import friendCnt from './src/TableFriendCnt'
export default friendCnt
</script>
