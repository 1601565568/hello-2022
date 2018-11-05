<template>
  <!--<ns-page-table @open-dialog="$emit('open-dialog','add','新增线下店铺')">-->
  <ns-page-table @open-dialog="onOpenDialog" @query-shop="queryShop">
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
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.shop_name" placeholder="请输入店铺名称" @keyup.enter.native="$quickSearchAction$('shop_name')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('shop_name')"></i>
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
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model"  :inline="true">
        <el-form-item label="店铺名称：">
          <el-form-grid size="xmd">
            <el-form-item prop = "shop_name" >
              <el-input type="text" placeholder="请输入店铺名称" v-model = "model.shop_name">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <!--<el-form-item label="店铺编号：">-->
          <!--<el-form-grid size="xmd">-->
            <!--<el-form-item prop = "uid" >-->
              <!--<el-input type="text" v-model = "model.uid">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-form-grid>-->
        <!--</el-form-item>-->
        <el-form-item label="所属地区："  class="el-inline-block" style="margin-right:0;">
          <el-form-grid width="150.4"height="55" prop="area" size="xmd">
            <ns-area  :props="key" @change="onChange" v-model="model.area"></ns-area>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属渠道：">
          <el-form-grid size="xmd">
            <el-form-item prop = "channelCode" >
              <ns-select  v-model="model.channel_code" filterable clearable placeholder="请选择渠道"
                          :url="$api.core.channel.queryOptionChannel">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属品牌：">
          <el-form-grid size="xmd">
            <el-form-item prop = "brandId" >
              <ns-select  v-model="model.brand_id" filterable clearable placeholder="请选择所属品牌"
                          :url="$api.core.brand.queryOptionBrand">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="门店类型：">
          <el-form-grid size="xmd">
            <el-form-item prop = "type">
              <el-select placeholder="请选择门店类型" v-model="model.type" filterable clearable>
                <el-option label="直营" value="ZYD"></el-option>
                <el-option label="加盟" value="JMD"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe @selection-change="onHandleSelectChange"
                resizable v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45"></el-table-column>-->
        <el-table-column :show-overflow-tooltip="true" type="default" prop="shopName" label="店铺名称"
                         dbcolumn="shopName" column="shopName" align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.shopName && scope.row.shopName != 0">
              -
            </template>
            <template v-else>
              {{scope.row.shopName}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="shop_status" label="营业状态" align="center" width="120" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.shopStatus == 1">
              <span class="dot-success ">正常营业</span>
            </template>
            <template v-else-if="scope.row.shopStatus == -1">
              <span class="dot-danger">暂停</span>
            </template>
            <template v-else-if="scope.row.shopStatus == -2">
              <span class="dot-danger">已关店</span>
            </template>
            <template v-else-if="scope.row.shopStatus == 0">
              <span class="dot-danger">删除</span>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="address" label="所属地区" dbcolumn="address"
                         column="address" align="center"  :sortable="false">
          <template slot-scope="scope">
            {{scope.row.province}}/{{scope.row.city}}/{{scope.row.distinct}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="address" label="地址" dbcolumn="address"
                         column="address" align="center"  :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.address && scope.row.address != 0">
              -
            </template>
            <template v-else>
              {{scope.row.address}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="open_shop_time" label="开业时间" dbcolumn="open_shop_time"
                         column="address" align="center"  :sortable="false">
          <template slot-scope="scope">
              {{scope.row.open_shop_time}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="contact_json" label="联系方式" dbcolumn="contact_json"
                         column="contact_json" align="center" width="150" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="操作"
                         align="center"
                         width="100">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
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
</template>
<script>
  import NsTableOfflineShop from './src/NsTableOfflineShop'
  import NsArea from 'components/NsArea'
  NsTableOfflineShop.components = {
    NsArea
  }
  export default NsTableOfflineShop
</script>
