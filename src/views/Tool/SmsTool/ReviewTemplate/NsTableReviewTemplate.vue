<template>
  <ns-page-table  @open-dialog="$emit('open-dialog','add','新增回评模板')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.templateTitle" placeholder="请输入模板标题" @keyup.enter.native="$quickSearchAction$('templateTitle')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('templateTitle')"></i>
          </el-input>
        </el-form-item>
        <!--暂时没有高级搜索-->
        <!--<el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon&#45;&#45;right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>-->
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <!--<template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>-->
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe @selection-change="onHandleSelectChange"
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45"></el-table-column>-->
        <el-table-column  type = "default" prop = "template_title"
                         label = "模板标题" align = "left" width="350" :sortable="false">
        </el-table-column>
        <el-table-column  type = "default" prop = "template"
                         label = "模板内容" align = "left" :sortable="false">
        </el-table-column>

        <el-table-column label="操作"
                         align="center"
                         width="90">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope"></ns-table-column-operate-button>

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
import NsTableReviewTemplate from './src/NsTableReviewTemplate'

export default NsTableReviewTemplate
</script>
