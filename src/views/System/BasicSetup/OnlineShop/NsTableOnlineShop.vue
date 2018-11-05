<template>
  <ns-page-table @open-dialog="$emit('open-dialog','add','新增线上店铺')">
    <!-- 按钮 --><!--$emit('open-dialog','add','新增线上店铺')-->
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
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="$searchAction$" class="surround-btn"
               :model="model"  :inline="true">
        <el-form-item label="店铺名称："  prop = "shop_name" >
          <el-form-grid size="xmd">
              <el-input type="text" v-model.trim = "model.shop_name" placeholder="请输入店铺名称">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="店铺编号：" prop = "uid" >
          <el-form-grid size="xmd">
              <el-input type="text" v-model.trim = "model.uid" placeholder="请输入店铺编号">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属平台："  prop = "platform" >
          <el-form-grid size="xmd">
              <el-select v-model="model.platform" multiple placeholder="请选择所属平台">
                <el-option
                  v-for="item in platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属渠道："  prop = "channelCode" >
          <el-form-grid size="xmd">
              <ns-select  v-model="model.channels" filterable clearable placeholder="请选择所属渠道"
                          :url="$api.core.channel.queryOptionChannel" >
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属品牌："  prop = "brandId" >
          <el-form-grid size="xmd">
              <ns-select  v-model="model.brands" filterable clearable placeholder="请选择所属品牌"
                          :url="$api.core.brand.queryOptionBrand">
              </ns-select>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
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
        <el-table-column type="selection" align="center" :width="45"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="shopName" label="店铺名称"
                         dbcolumn="shopName" column="shopName" align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.shop_name && scope.row.shop_name != 0">
              -
            </template>
            <template v-else>
              {{scope.row.shop_name}}
            </template>
          </template>
        </el-table-column>
       <!-- <el-table-column :show-overflow-tooltip="true" type="default" prop="uid" label="店铺编号"
                         dbcolumn="uid" column="uid" align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.uid && scope.row.uid != 0">
              -
            </template>
            <template v-else>
              {{scope.row.uid}}
            </template>
          </template>
        </el-table-column>-->
        <el-table-column :show-overflow-tooltip="true" type="default" prop="channels" label="所属渠道"
                         align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.channels && scope.row.channels != ''">
              -
            </template>
            <template v-else>
              {{scope.row.channels}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="platform" label="平台"
                         align="left" width="80" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.platform && scope.row.platform != 0">
              -
            </template>
            <template v-else>
              {{scope.row.platform}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="brands" label="关联品牌"
                        align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.brands && scope.row.brands != 0">
              -
            </template>
            <template v-else>
              {{scope.row.brands}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="create_time" label="创建时间" dbcolumn="create_time"
                         column="create_time" align="center" width="150" :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.create_time && scope.row.create_time != 0">
              -
            </template>
            <template v-else>
              {{scope.row.create_time}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="shop_status" label="授权状态" dbcolumn="shop_status"
                         column="shop_status" align="center" width="120" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.expires_in === null">
              <span class="text-warning">未授权</span>
            </template>
            <template v-else-if="isExpire(scope.row.expires_in) && scope.row.shop_status == 1">
              <span class="text-success">正常</span>
            </template>
            <template v-else-if="isExpire(scope.row.expires_in) && scope.row.shop_status == -1">
              <span class="text-warning">锁定</span>
            </template>
            <template v-else-if="!isExpire(scope.row.expires_in) && scope.row.shop_status != 0">
              <span class="text-error">过期</span>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </template>
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
  import NsTableOnlineShop from './src/NsTableOnlineShop'
  export default NsTableOnlineShop
</script>
