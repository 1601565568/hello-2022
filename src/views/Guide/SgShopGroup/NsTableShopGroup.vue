<template>
<ns-page-table @add="$emit('add')" @showShop="$emit('showShop')" @dimission="$emit('dimission')"  @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')" :colButton='10'>
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
          <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="搜索群名称" @keyup.enter.native="$quickSearchAction$('displayname')" clearable>
          </el-input>
          <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
          <ns-button @click="$resetInputAction$()">重置</ns-button>
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
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="群名称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.displayname" placeholder="群名称" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="群主机器人：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.nickname" placeholder="群主机器人" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="机器人微信ID：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.roomowner" placeholder="机器人微信ID" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="所属门店：">
          <el-form-grid>
            <el-select placeholder="请选择所属门店" v-model="model.shop" clearable filterable>
              <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id"
                         :key="shop.id"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="群人数">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.memberCountStart" placeholder="" clearable></el-input>
            -
            <el-input style="width:180px" autofocus=true v-model="model.memberCountEnd" placeholder="" clearable></el-input>
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
        <el-table-column prop="displayname" label="群名称" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="群主AI机器人" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="机器人微信ID" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="群人数" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="所属门店" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="员工数" align="left" width="100"></el-table-column>
        <el-table-column prop="" label="操作" align="left" width="100"></el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="240">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" v-if="scope.row.status !== 2" @click="onRedactFun(scope.row)" type="text">编辑</ns-button>
              <ns-button v-if="scope.row.status === 0 || scope.row.status === 1" style="color:#0091FA" @click="dimissionFun(scope.row)" type="text">AI通知</ns-button>
              <ns-button v-if="scope.row.status === 0 || scope.row.status === 1" style="color:#0091FA" @click="dimissionFun(scope.row)" type="text">踢出员工</ns-button>
              <ns-button style="color:#f00" @click="onDelsTipFun(scope.row)" type="text">解散</ns-button>
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
import guide from './src/NsTableShopGroup'
export default guide
</script>
<style scoped>
.scope_row_count{
  color: blue;
}
</style>
