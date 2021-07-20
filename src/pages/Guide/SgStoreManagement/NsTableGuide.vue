<template>
  <div calss="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-input ref="quickText" v-model="shopTreePage.areaName" placeholder="请输入区域名称" clearable>
          <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name"/>
        </el-input>
        <el-scrollbar ref='pageLeft' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
          <el-tree
            v-if="model.areaId"
            class="filter-tree"
            ref="shopTree"
            :data="digitalShopList"
            highlight-current
            node-key="id"
            :show-checkbox="false"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :current-node-key="model.areaId"
            :default-expanded-keys="[model.areaId]"
            :filter-node-method="onFilterNode"
            @node-click="onClickNode"
          >
            <span
              class="filter-tree-node"
              slot-scope="{ node }"
            >
              <Icon class="icon" type="cate" />
              <span class="item">{{node.label}}</span>
            </span>
          </el-tree>
        </el-scrollbar>
        <el-pagination style='text-align: center' small
                       :total="shopTreePage.total"
                       :page-size="shopTreePage.size"
                       layout="prev, slot, next, jumper"
                       :current-page.sync="shopTreePage.page"
                       @current-change="initDigitalShopList">
          <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
        </el-pagination>
      </div>
      <div class="template-page__row-right">
        <el-scrollbar ref="pageRight">
          <nsPageTable @synchronousStores="$emit('synchronousStores')" @showShop="$emit('showShop')"
                         @dimission="$emit('dimission')" @allDelete="$emit('allDelete')" @shopEdit="$emit('shopEdit')">
            <template slot="head"><div class="head">{{model.areaName}}<span>{{_data._pagination.total}}个</span></div></template>
            <!-- 按钮 -->
            <template slot="buttons">
              <div class="template-table-buttons">
                <div class="el-form-grid">
                  <ns-button type="primary" :disabled="select" @click="downloadQrod">批量下载招募码</ns-button>
                </div>
              </div>
            </template>
            <!-- 按钮-结束 -->

            <!-- 简单搜索 -->
            <!-- el-form 需添加 @submit.native.prevent 配置 -->
            <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
            <template slot="searchSearch">
              <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
                <el-form-item v-if="viewRange === 1" v-show="_data._queryConfig.expand === false" label="视角：">
                  <ViewSelect :showTitle="false" v-model="model.viewId" :initViewId.sync="model.viewId"></ViewSelect>
                </el-form-item>
                <el-form-item v-show="_data._queryConfig.expand === false" label="线下门店名称/ID：">
                  <el-input ref="quickText" style="width: 200px" v-model="model.name" placeholder="请输入线下门店名称/ID"
                            @keyup.enter.native="$searchAction$('searchform')" clearable>
                  </el-input>
                  <ns-button type="primary" @click="$searchAction$('searchform')" class="searchbtn">搜索</ns-button>
                  <ns-button @click="$resetInputAction$('searchform')" class="resetbtn">重置</ns-button>
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
              <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
                <el-form-item v-if="viewRange === 1" label="视角：">
                  <ViewSelect :showTitle="false" v-model="model.viewId" :initViewId.sync="model.viewId"></ViewSelect>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-form-grid size="xmd">
                    <el-input style="width:200px" autofocus=true  v-model="model.shopName" placeholder="请输入线下门店名称"
                              clearable></el-input>
                  </el-form-grid>
                </el-form-item>

                <el-form-item label="门店ID：">
                  <el-form-grid size="xmd">
                    <el-input style="width:200px" autofocus=true  v-model="model.shopId" placeholder="请输入线下门店ID"
                              clearable></el-input>
                  </el-form-grid>
                </el-form-item>

                <el-form-item label="门店类型：">
                  <el-form-grid>
                    <el-select placeholder="请选择门店类型" style="width:200px" v-model="model.shopType" clearable filterable>
                      <el-option v-for="shop in shopLeiXing" :label="shop.label" :value="shop.value"
                                 :key="shop.value"></el-option>
                    </el-select>
                  </el-form-grid>
                </el-form-item>

                <el-form-item label="手机号：">
                  <el-form-grid size="xmd">
                    <el-input style="width:200px" autofocus=true v-model="model.phone" placeholder="请输入手机号"
                              clearable></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="营业状态：">
                  <el-form-grid>
                    <el-select placeholder="请选择营业状态" style="width:200px" v-model="model.shopStatus" clearable filterable>
                      <el-option v-for="shop in operatingStatus" :label="shop.label" :value="shop.value"
                                 :key="shop.value"></el-option>
                    </el-select>
                  </el-form-grid>
                </el-form-item>

                <el-form-item label="门店地址："  prop="area">
                  <el-form-grid width="200" prop="area">
                    <ns-area :props="searchform.key" @change="onAreaChange" v-model="model.area"
                             clearable></ns-area>
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
              <el-table ref="table" v-loading.lock="_data._table.loadingtable"  @selection-change="handleSelectionChange" :data="_data._table.data" stripe>
                <el-table-column type="selection" :selectable="selectable" align="center" :width="50">
                </el-table-column>
                <el-table-column prop="shopName" label="线下门店名称&ID" align="left" width="150">
                  <template slot-scope="scope">
                    {{scope.row.shopName || '-'}}
                    <p>ID:{{scope.row.id}}</p>
                  </template>
                </el-table-column>

                <el-table-column prop="shopType,count" label="类型" align="center" width="100">
                  <template slot-scope="scope">
                    {{scope.row.shopType === 'ZYD'?'直营店':scope.row.shopType === 'JMD'?'加盟店':scope.row.shopType ===
                    'LYD'?'联营店':'-'}}
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="门店地址" align="left">
                  <template slot-scope="scope">
                    {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+''+scope.row.city+''+scope.row.district}}{{scope.row.address || '-'}}
                  </template>
                </el-table-column>
                <el-table-column prop="areaName" label="所在区域" align="left">
                </el-table-column>
                <el-table-column prop="originalCreateTime" label="创建时间" align="left">
                </el-table-column>
                <!-- <el-table-column prop="digitalShopName" label="关联数字门店" align="left">
                  <template slot-scope="scope">
                    <ns-button style="color:#0091FA" @click="scopeRowCount(scope.row.id)" v-if="scope.row.count > 1"
                               type="text">{{scope.row.count}}家
                    </ns-button>
                    <div v-else>
                      {{scope.row.digitalShopName || '-'}}
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="phone" label="联系方式" align="left" width="150">
                  <template slot-scope="scope">
                    {{scope.row.phone || '-'}}
                  </template>
                </el-table-column>
                <el-table-column prop="shopStatus" label="状态" align="center" width="100">
                  <template slot-scope="scope">
                <span :class="scope.row.shopStatus > 0 ? 'text-success' : scope.row.shopStatus === -1 ? 'text-error' : ''">
                  {{scope.row.shopStatus === 0?'删除':scope.row.shopStatus === 1?'正常':scope.row.shopStatus ===
                  -1?'暂停':'关店'}}
                </span>
                  </template>
                </el-table-column>
                <el-table-column label="招募码" align="center" width="120">
                  <template slot-scope="scope" v-if="scope.row.shopStatus == 1 || scope.row.shopStatus == -1">
                    <ns-button type="text"><i @click="elIconMenu(scope.row)"><Icon className="icon-erweima" type="erweima"/></i></ns-button>
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
          </nsPageTable>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import guide from './src/NsTableGuide'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
import ViewSelect from '@/components/NsViewSelect'
import nsPageTable from '@/components/NsPageTable/index'
guide.components = {
  NsArea,
  ViewSelect,
  nsPageTable
}

export default guide
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .icon-erweima {
    font-weight: 500;
    font-size: 30px;
  }
  .scope_row_count {
    color: blue;
  }

  .el-icon-menu {
    font-size: 24px;
  }
  .head {
    font-size: 14px;
    padding: 5px 0;
  }
  .head span{
    margin-left: 5px;
    color: #999;
  }
  .template-page__row-left {
    width: 220px;
    position: absolute;
    left: 210px;
    top: 70px;
    z-index: 2;
    overflow: hidden;
    >>> .el-input {
      margin-bottom: var(--default-margin-base);
    }
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
    margin: 0 10px 10px 435px;
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
      margin: 0 10px 10px 435px;
    }
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
  .el-tree {
    overflow-x: hidden;
  }
  >>> .el-pagination__jump {
    margin-left: unset !important;
  }
  .filter-tree-node {
    display: flex;
    align-items: center;
  }
  .filter-tree-node > .icon {
    color:#0091fa;
    font-size: 14px
  }
  .filter-tree-node > .item {
    font-size: 12px;
    width: 80%;
    margin-left: 3px;
    display: inline-block;
    white-space: nowrap;
    word-break: break-all;
    /* text-overflow: ellipsis; */
    /* overflow: hidden; */
  }
  .question-circle {
    margin-left: -5px;
  }
</style>
