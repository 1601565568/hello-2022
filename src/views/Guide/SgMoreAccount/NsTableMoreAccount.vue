<template>
  <ns-page-table  @synchronization="$emit('synchronization')" @addPersonalNumber="$emit('addPersonalNumber')" @batchBindShoppingGuide="$emit('batchBindShoppingGuide')"  @showShop="$emit('showShop')" @dimission="$emit('dimission')"  @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')" >
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
        <el-form-item label="微信号/昵称：" v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.keyword" placeholder="请输入微信号/昵称" @keyup.enter.native="$quickSearchAction$('name')" clearable>
          </el-input>
          <ns-button type="primary" @click="$searchAction$('searchform')">搜索</ns-button>
          <ns-button @click="$resetInputAction$('searchform')">重置</ns-button>
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
        <el-form-item label="微信号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.wechatId" placeholder="请输入微信号" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="微信昵称：">
          <el-form-grid>
            <el-form-grid size="xmd">
              <el-input style="width:180px" autofocus=true v-model="model.wechatId" placeholder="请输入微信昵称" clearable></el-input>
            </el-form-grid>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="关联导购：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.guideInfo" placeholder="请输入姓名/工号" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="绑定门店：">
          <el-form-grid>
            <el-select placeholder="请选择绑定门店" v-model="model.shopId" clearable filterable>
              <el-option v-for="shop in shopList" :label="shop.shopName" :value="shop.id"
                         :key="shop.id"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="状态：">
          <el-form-grid>
            <el-select placeholder="请选择营业状态" v-model="model.status" clearable filterable>
              <el-option v-for="shop in operatingStatus" :label="shop.label" :value="shop.value"
                         :key="shop.value"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$('searchform')">搜索</ns-button>
        <ns-button @click="$resetInputAction$('searchform')">重置</ns-button>
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
        <el-table-column type="selection" width="42" class="table_selection"></el-table-column>
        <el-table-column prop="wechatId" label="个人号" align="left">
          <template slot-scope="scope">
            {{scope.row.wechatId || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="shopStatus" label="二维码" align="left" width="150">
          <template slot-scope="scope">
            <div v-if="!scope.row.wxCodeUrl">
              <!--@click="uploadFile(scope.row)"-->
              <el-upload class="upload-demo" :action="$api.core.sgMoreAccountUploadFile(scope.row.id+'')" @change="logo"
                         accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card"
                         :on-success="handleAvatarSuccess">
                  <ns-button style="color:#0091FA" type="text">
                    点击上传
                  </ns-button>
                </el-upload>
            </div>
            <div v-if="scope.row.wxCodeUrl">
              <img width="60px" height="60px" v-if="scope.row.wxCodeUrl" :src="scope.row.wxCodeUrl" class="avatar">
            </div>
          </template>
        </el-table-column>
         <el-table-column prop="wechatName" label="微信昵称" align="center" >
          <template slot-scope="scope">
            {{scope.row.wechatName || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="guideNames" label="关联导购" align="center" >
          <template slot-scope="scope">
            {{scope.row.guideNames || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="status" label="状态" align="left" width="180">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status === 0" type="text">已登陆</span>
              <span style="color:#F00" v-if="scope.row.status !== 0" type="text">未登录</span>
            </div>
          </template >
        </el-table-column>
        <el-table-column prop="phone" label="操作" align="left" width="180">
            <template slot-scope="scope">
                <div>
                    <ns-button style="color:#0091FA" @click="onBindingFun(scope.row)" type="text">绑定</ns-button>
                    <ns-button style="color:#0091FA" @click="onRemoveFun(scope.row)" type="text">移除</ns-button>
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
import ElUpload from 'nui-v2/lib/upload'
import moreAccount from './src/NsTableMoreAccount'
moreAccount.components = {
  ElUpload
}

export default moreAccount
</script>
<style>
.scope_row_count{
  color: blue;
}
.el-icon-menu{
  font-size: 24px;
}
</style>
