<template>
  <div>
    <ns-page-table @add="$emit('add')" @edit="$emit('edit')">
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons" style="margin-left: 210px;"></ns-table-operate-button>
      </template>
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item style="position: absolute; left: 0;">
            <el-form-grid size="xmd">
              <el-select placeholder="请选择门店" v-model="shopId" filterable
                         style="width: -webkit-fill-available;" @change="onShopChange">
                <el-option v-for="store in shopList" :label="store.shopName" :key="store.id" :value="store.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.title" placeholder="商品标题" @keyup.enter.native="$quickSearchAction$('title')">
              <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('title')"></i>
            </el-input>
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
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="$searchAction$" class="surround-btn"
                 :model="model" :inline="true">
          <el-form-item label="商品标题：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.title">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.goods_code">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-form-grid size="xmd">
              <el-form-item prop="category">
                <ns-droptree v-model="category" :data="treeData2" @node-click="categoryClick" clearable>
                </ns-droptree>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="状态：">
            <el-form-grid size="xmd">
              <el-select v-model="model.status" placeholder="请选择">
                <el-option label="上架中" value="1" :key="1"></el-option>
                <el-option label="已下架" value="0" :key="0"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="售价：">
            <el-form-grid size="sm">
              <el-input  type="text" v-model.trim="model.min_price"></el-input>
            </el-form-grid>
            <el-form-grid>~</el-form-grid>
            <el-form-grid size="sm">
              <el-input  type="text" v-model.trim="model.max_price"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="库存：">
            <el-form-grid size="sm">
              <el-input  type="text" v-model.trim="model.min_stock"></el-input>
            </el-form-grid>
            <el-form-grid>~</el-form-grid>
            <el-form-grid size="sm">
              <el-input  type="text" v-model.trim="model.max_stock"></el-input>
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
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column type="selection" align="center" :width="45"></el-table-column>
            <el-table-column  type="default" prop="picture_url" label="商品图片" align="center" width="80">
              <template slot-scope="scope">
                <img :src="scope.row.picture_url" width="60" height="60"/>
              </template>
            </el-table-column>
          <el-table-column prop="title" label="商品标题" width="120" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="goods_code" label="商品编码	" align="center"></el-table-column>
          <el-table-column label="SKU" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.sku_count === '0'">-</span>
              <span v-else>{{scope.row.sku_count}}个</span>
            </template>
          </el-table-column>
          <el-table-column prop="sales_price" label="售价" align="right"></el-table-column>
          <el-table-column prop="stock" label="总库存" align="right"></el-table-column>
          <el-table-column label="销量" align="right">
            <template slot-scope="scope">
              <div>
                <span class="text-primary">{{scope.row.sales_count}}</span>
                <br>
                60天：<span v-if="scope.row.hadIssueAmount" class="text-primary">{{scope.row.hadIssueAmount}}</span>
                <span v-else class="text-primary">-</span>
              </div>
            </template>
          </el-table-column>
            <el-table-column label="是否上架" align="center" width="120">
              <template slot-scope="scope">
                <el-switch :value="scope.row.status" :active-value="1" :inactive-value="0"
                           :before-change="(call, currVal)=>{onStatusChange(call,currVal,scope.row)}"></el-switch>
              </template>
            </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="80">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.operate_buttons" :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
  </div>
</template>

<script>
  import ShopGoodsTable from './src/ShopGoodsTable'
  import NsDroptree from 'components/NsDroptree'

  ShopGoodsTable.components = {NsDroptree}
  export default ShopGoodsTable
</script>

<style scoped>

</style>

