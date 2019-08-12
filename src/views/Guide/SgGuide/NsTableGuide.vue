<template>
  <div>
    <BindDevice :visible.sync="bindDeviceDialog.visible" :guide='bindDeviceDialog.guide' @reload='$reload'/>
<ns-page-table @add="$emit('add')" @showShop="$emit('showShop')" @dimission="$emit('dimission')"  @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')" :colButton='10'>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
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

        <el-form-item label="关键字：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" clearable></el-input>
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

        <el-form-item label="职务：">
          <el-form-grid>
            <el-select placeholder="请选择职务" v-model="model.job" clearable>
              <el-option label="店长" :value="1"></el-option>
              <el-option label="导购" :value="0"></el-option>
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

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" :width="50"></el-table-column>
        <el-table-column prop="work_id" label="工号" align="left" width="88">
          <template slot-scope="scope">
            {{scope.row.work_id?scope.row.work_id:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="left" width="100" :show-overflow-tooltip="true"></el-table-column>
<!--        <el-table-column prop="nickname" label="昵称" align="left" width="100" :show-overflow-tooltip="true">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.nickname?scope.row.nickname:'-'}}-->
<!--          </template >-->
<!--        </el-table-column>-->
        <el-table-column prop="mobile" label="手机号码" align="left" width="100"></el-table-column>
        <el-table-column prop="shopName,count" label="所属门店" align="left" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <ns-button style="color:#0091FA" @click="scopeRowCount(scope.row)" v-if="scope.row.count > 1" type="text">{{scope.row.count}}家</ns-button>
            <div v-else>
              {{scope.row.shopName?scope.row.shopName:'-'}}
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column prop='count' label="所属地区" align="left" width="180">-->
<!--          <template slot-scope="scope">-->
<!--            <ns-button style="color:#0091FA" v-if="scope.row.count > 1" type="text" @click="scopeRowCount(scope.row)">-</ns-button>-->
<!--            <div v-else>-->
<!--              {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+'/'+scope.row.city+'/'+scope.row.district}}-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="job" label="职务" align="left" width="60">
          <template slot-scope="scope">{{scope.row.job == 1 ? "店长" : "导购"}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="导购终端" align="left" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.deviceNos || '-'}}
          </template>
          <template slot='header' scope='header'>
                    <span>
                      <span>{{header.column.label}}</span>
                      <el-popover placement='bottom' width='220' trigger='hover'>
                        <div slot-scope>
                          需将员工账号与导购终端手机进行绑定，让其能够应用最伙导购系统<br>
                          <span class='tips'>注：</span>使用终端系统的，非离职的，建议不要进行客户转移</div>
                        <i slot='reference' class='icon-base icon-xiangqingyiwen table-header-icon'></i>
                      </el-popover>
                    </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 2">
              <p>已离职</p>
            </div>
            <div v-if="scope.row.status === 0 || scope.row.status === 1">
              <el-switch @change="changeState(scope.row.status,scope.row.id)" v-model="scope.row.status"
                         :active-value="1" :inactive-value="0" active-color='#13ce66' inactive-color='#888888'
                         active-text="启用" inactive-text="禁用"> </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="160px">
          <template slot-scope="scope">
            <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons"
                                            :prop="scope">
            </ns-table-column-operate-button-ext>
          </template>
        </el-table-column>
<!--        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="120">-->
<!--          <template slot-scope="scope">-->
<!--            <div>-->
<!--              <ns-button style="color:#0091FA" v-if="scope.row.status !== 2" @click="onRedactFun(scope.row)" type="text">编辑</ns-button>-->
<!--              <ns-button v-if="scope.row.status === 0 || scope.row.status === 1" style="color:#0091FA" @click="dimissionFun(scope.row)" type="text">离职</ns-button>-->
<!--              <ns-button style="color:#f00" @click="onDelsTipFun(scope.row)" type="text">删除</ns-button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->

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
import guide from './src/NsTableGuide'
export default guide
</script>
<style>
  @import "@/style/small/variables.pcss";
  .del-btn {
    color: var(--theme-color-danger)
  }
</style>
<style scoped>
  @import "@/style/small/variables.pcss";

.scope_row_count{
  color: blue;
}

  .tips {
    color: var(--theme-color-danger)
  }

  >>> .table-header-icon {
    color: var(--theme-font-color-info);
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  >>> .el-dropdown-link {
    margin-left: 5px !important;
  }
</style>
