<template>
  <div>
    <!-- <ns-page-table @add="$emit('add')"  @allDelete="$emit('allDelete')" @onAddCustomer="$emit('onAddCustomer')" @quit="$emit('quit')" @shopEdit="$emit('shopEdit')" @ondelete="$emit('ondelete')"> -->
    <ns-page-table @add="$emit('add')" @showShop="$emit('showShop')" @viewDetails="$emit('viewDetails')"
                   @dimission="$emit('dimission')" @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')">
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons">
        </ns-table-operate-button>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <!-- <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item label="关键字：" v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
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
      </template> -->
      <!-- 简单搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <template slot="advancedSearch">
        <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

          <el-form-item label="数据模块：">
            <el-form-grid size="xmd">
              <el-select placeholder="请选择" v-model="model.moduleType" clearable filterable>
                <el-option v-for="shop in dataModule" :label="shop.label" :value="shop.value"
                           :key="shop.value"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>

           <el-form-item label="数据库ID：">
            <el-form-grid>
              <el-input style="width:180px" autofocus=true v-model="model.targetId" placeholder="请输入数据库ID" clearable></el-input>
            </el-form-grid>
             <el-form-grid><ns-button class="text-info" type="text" @click="showTargetDetail = true">查询ID</ns-button></el-form-grid>
             <el-form-grid>
               <el-tooltip content="查询数据模块中需查询数据的数据库ID" placement="right"><i class="el-icon-info text-tips"></i></el-tooltip>
             </el-form-grid>
          </el-form-item>

          <el-form-item label="所属门店：">
            <el-form-grid>
              <el-select placeholder="请选择所属门店" v-model="model.shopId" clearable filterable>
                <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id"
                           :key="shop.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="操作人：">
            <el-form-grid>
              <el-select placeholder="员工" v-model="model.terminalType" @change="terminalTypeChange" clearable filterable>
                <el-option v-for="shop in operator" :label="shop.label" :value="shop.value" :key="shop.value"></el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid v-if="model.terminalType === 2">
              <el-select placeholder="员工" v-model="model.operatorId" clearable filterable>
                <el-option v-for="shop in staffFindLists" :label="shop.name" :value="shop.id" :key="shop.id"></el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid v-if="model.terminalType === 1">
              <el-input style="width:180px" autofocus=true v-model="model.operatorName" placeholder="请输入品牌方姓名"
                        clearable></el-input>
            </el-form-grid>
            <el-form-grid v-if="model.terminalType === 3">
              <el-input style="width:180px" autofocus=true v-model="model.operatorId" placeholder="请输入操作人ID"
                        clearable></el-input>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="日志时间：" prop="time">
            <el-form-grid>
              <el-date-picker
                v-model="model.validTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                align="right">
              </el-date-picker>
            </el-form-grid>
            <el-form-grid>
              <el-tooltip content="仅支持查询最近36个月内的操作日志" placement="right"><i class="el-icon-info text-tips"></i></el-tooltip>
            </el-form-grid>
          </el-form-item>

          <!-- <el-form-item label="日志时间：">
            <el-form-grid>
              <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入数据库ID" clearable></el-input>
            </el-form-grid>
          </el-form-item> -->
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

        <el-table ref="table" :data="_data._table.data" stripe >
          <el-table-column prop="createTime" label="日志时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.createTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作类型" align="left" width="130">
            <template slot-scope="scope">
              {{scope.row.operation || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="moduleName" label="功能板块" align="left" width="120"></el-table-column>
          <el-table-column prop="shopName" label="门店" align="left">
            <template slot-scope="scope">
              {{scope.row.shopName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop='operatorName' label="操作人" align="left" width="180">
            <template slot-scope="scope">
              {{scope.row.operatorName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="operatorId" label="操作人ID" align="left" width="100">
            <template slot-scope="scope">
              {{scope.row.operatorId || "-"}}
            </template>
          </el-table-column>

          <el-table-column prop="targetId" label="数据库ID" align="center" width="160">
            <template slot-scope="scope">
              {{scope.row.targetId || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="status" :show-overflow-tooltip="true" label="修改内容" align="right" width="120">
            <template slot-scope="scope">
              <ns-button style="color:#0091FA" v-if="scope.row.status !== 2" @click="viewDetails(scope.row)" type="text">
                查看详情
              </ns-button>
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
                       :current-page="_data._pagination.page"
                       :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>

    <!--查询数据库ID弹窗-->
    <el-dialog  title="查询数据库ID" width="800px" height="605px" :visible.sync="showTargetDetail">
      <target-detail ref="targetDetail" :dataModule = "dataModule"></target-detail>
    </el-dialog></div>
</template>
<script>
import guide from './src/NsTableGuide'
export default guide
</script>
<style>
  .scope_row_count {
    color: blue;
  }
</style>
