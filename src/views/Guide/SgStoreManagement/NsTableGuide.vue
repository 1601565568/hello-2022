<template>
  <!-- <ns-page-table @add="$emit('add')"  @allDelete="$emit('allDelete')" @onAddCustomer="$emit('onAddCustomer')" @quit="$emit('quit')" @shopEdit="$emit('shopEdit')" @ondelete="$emit('ondelete')"> -->
  <ns-page-table @synchronousStores="$emit('synchronousStores')" @showShop="$emit('showShop')" @dimission="$emit('dimission')"  @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')" >
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
        <el-form-item label="门店名称：" v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.shopName" placeholder="请输入门店名称" @keyup.enter.native="$quickSearchAction$('name')" clearable>
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
        <el-form-item label="门店名称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.shopName" placeholder="请输入门店名称" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="门店类型：">
          <el-form-grid>
            <el-select placeholder="请选择门店类型" v-model="model.shop_type" clearable filterable>
              <el-option v-for="shop in shopLeiXing" :label="shop.label" :value="shop.value"
                         :key="shop.value"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="联系电话：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.phone" placeholder="请输入联系电话" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <!-- <el-form-item label="所属地区：">
          <el-form-grid>
            <el-select placeholder="请选择所属地区" v-model="model.affiliatingArea" clearable filterable>
              <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id"
                         :key="shop.id"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item> -->

        <el-form-item label="所属地区：" style="margin-right:0;" prop="area">
          <el-form-grid width="300" prop="area">
            <ns-area  :props="searchform.key" @change="onAreaChange" change-on-select v-model="searchform.area" clearable></ns-area>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="营业状态：">
          <el-form-grid>
            <el-select placeholder="请选择营业状态" v-model="model.shopStatus" clearable filterable>
              <el-option v-for="shop in operatingStatus" :label="shop.label" :value="shop.value"
                         :key="shop.value"></el-option>
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
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table" :data="_data._table.data" stripe >
        <!-- <el-table-column type="selection" width="42" class="table_selection"></el-table-column> -->
        <el-table-column prop="shopName" label="门店名称" align="left" width="220">
          <template slot-scope="scope">
            {{scope.row.shopName || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="shopStatus" label="营业状态" align="left" width="100">
          <template slot-scope="scope">
            {{scope.row.shopStatus === 0?'删除':scope.row.shopStatus === 1?'正常营业':scope.row.shopStatus === -1?'暂停':'已关店'}}
          </template>
        </el-table-column>
         <el-table-column prop="mobile" label="地区" align="left" >
          <template slot-scope="scope">
            {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+'/'+scope.row.city+'/'+scope.row.district}}
          </template >
        </el-table-column>
        <el-table-column prop="address" label="详细地址" align="left" >
          <template slot-scope="scope">
            {{scope.row.address || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="shopType,count" label="门店类型" align="left" width="180">
          <template slot-scope="scope">
            <ns-button style="color:#0091FA" @click="scopeRowCount(scope.row.id)" v-if="scope.row.count > 1" type="text">{{scope.row.count}}家</ns-button>
            <div v-else>
              {{scope.row.shopType === 'ZYD'?'直营店':scope.row.shopType === 'JMD'?'加盟店':scope.row.shopType === 'B'?'天猫':'淘宝'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="left" width="180">
          <template slot-scope="scope">
              {{scope.row.phone || '-'}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="招募码" align="left" width="120">
          <template slot-scope="scope">
              <ns-button  type="text"><i class="el-icon-menu" @click="elIconMenu"></i></ns-button>
          </template>
        </el-table-column> -->
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
</template>

<script>
  import guide from './src/NsTableGuide'
  export default guide
</script>
<style>
.scope_row_count{
  color: blue;
}
.el-icon-menu{
  font-size: 24px;
}
</style>
