<template>
  <ns-page-table>
    <!-- 按钮 -->
    <template slot="searchSearch">
      <el-row class="template-table__bar-base"> 
        <el-col :span="14" >
        商品库
        </el-col>
        <el-col :span="2" @click="">
            <ns-button>导入</ns-button>
        </el-col>
        <el-col :span="2" @click="">
            <ns-button>新增</ns-button>
        </el-col>
        <el-col :span="6">
            <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
              <el-form-item v-show="_data._queryConfig.expand === false">
                <el-input ref="quickText" v-model="quickSearchModel.customerName" placeholder="请输入姓名" @keyup.enter.native="$quickSearchAction$('customerName')">
                  <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('customerName')"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="text" @click="$handleTabClick">
                  {{collapseText}}
                  <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
                </ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
    </template>
    <!-- <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template> -->
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <!-- <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model="quickSearchModel.customerName" placeholder="请输入姓名" @keyup.enter.native="$quickSearchAction$('customerName')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('customerName')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template> -->
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="商品分类：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.customerName">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.outNick">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="商品编码：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.mobile">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <!-- <el-form-item label="客户类型：">
          <el-form-grid size="xmd">
            <el-select  v-model="model.userType" filterable clearable placeholder=""
                          :multiple="false">
                <el-option label="潜客" value="0">
                </el-option>
                <el-option label="意向客户" value="1">
                </el-option>
                <el-option label="成交客户" value="2">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item> -->
        <!-- <el-form-item label="是否会员：">
          <el-form-grid size="xmd">
            <el-select  v-model="model.isExit" filterable clearable placeholder=""
                          :multiple="false">
                <el-option label="会员" value="0">
                </el-option>
                <el-option label="非会员" value="1">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item> -->
        <!-- <el-form-item label="会员等级：">
          <el-form-grid size="xmd">
            <el-select  v-model="model.memberGrade" filterable clearable placeholder=""
                          :multiple="false">
                <el-option
                  v-for="item in grades"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item> -->
        <!-- <el-form-item label="来源：">
          <el-form-grid size="xmd">
            <ns-select  v-model="model.source" filterable clearable placeholder=""
                        :multiple="false" :url="$api.core.common.getTradeFrom">
            </ns-select>
          </el-form-grid>
        </el-form-item> -->
        <!-- <el-form-item label="地址：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.address">
            </el-input>
          </el-form-grid>
        </el-form-item> -->
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
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

      <el-table ref="table" :data="tableData" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column type="selection" align="center" :width="45">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="date"
                         label="商品名称" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                         label="商品编号" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="address"
                         label="SKU" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="date"
                         label="在售门店" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                         label="总销量" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope">
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
</template>

<script>
  import index from './src/index'

  export default index
</script>
