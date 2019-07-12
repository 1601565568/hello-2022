<template>
<ns-page-table @add="$emit('add')" @removeDuplicate="$emit('removeDuplicate')" @dimission="$emit('dimission')"  @shopEdit="$emit('shopEdit')" :colButton='10'>
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
          <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="请输入好友昵称/微信号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
            <!-- <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i> -->
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

        <el-form-item label="个人号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.wid"  clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="微信昵称：">
          <el-form-grid>
              <el-input v-model="model.friendNick" clearable ></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="好友备注：">
          <el-form-grid>
            <el-input  v-model="model.remark" clearable>

            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="微信号：">
          <el-form-grid>
            <el-input v-model="model.wName" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="添加时间：">
          <el-date-picker
            v-model="model.addTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近交聊时间：">
          <el-form-grid>
            <el-date-picker
              v-model="model.lastTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
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

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" :width="50"></el-table-column>
        <el-table-column prop="friendNick" label="微信好友" align="left" width="88">
          <template slot-scope="scope">
            {{scope.row.friendNick?scope.row.friendNick:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="left" width="130">
          <template slot-scope="scope">
            {{scope.row.gender>=0?scope.row.gender>=1?'女':'男':'未知'}}
          </template >
        </el-table-column>
        <el-table-column prop="areaName" label="地区" align="left" width="130">
          <template slot-scope="scope">
            {{scope.row.areaName?scope.row.areaName:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="tag" label="标签" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.tag?scope.row.nickname:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="wid" label="个人号" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.wid?scope.row.wid:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="num" label="朋友圈互动数" align="left">
          <template slot-scope="scope">
            赞我：{{scope.row.likeMe}}; 赞他：{{scope.row.likeHim}}。
            <br>
            评我：{{scope.row.commentMe}}; 评他：{{scope.row.commentHim}}。
          </template>
        </el-table-column>
        <el-table-column prop='count' label="最近交流时间" align="left" width="180">
          <template >
            <ns-button style="color:#0091FA" type="text">-</ns-button>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="添加好友时间" align="left" width="60">
        </el-table-column>

        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="120">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA"  @click="onRedactFun(scope.row.wid)" type="text">详情</ns-button>
              <ns-button style="color:#0091FA"  type="text" @click="sendWechatMsg(scope.row)">聊天</ns-button>
              <ns-button style="color:#0091FA"  type="text" >打标</ns-button>
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
</template>

<script>
import friend from './src/NsTableFriend'
export default friend
</script>
<style>
.scope_row_count{
  color: blue;
}
</style>
