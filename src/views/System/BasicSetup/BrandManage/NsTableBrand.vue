<template>
  <ns-page-table @update-tags="$emit('update-tags')" @add-tags="$emit('add-tags')" @relation-tags="$emit('relation-tags')">
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
          <el-input ref="quickText" v-model.trim="quickSearchModel.tag_name" placeholder="请输入品牌名称" @keyup.enter.native="$quickSearchAction$('tag_name')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('tag_name')"></i>
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
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="品牌名称：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model.trim="model.tag_name">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="添加时间：">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="model.time"></ns-datetime>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="描述：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model.trim="model.remark">
            </el-input>
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
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
               :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :width="45" :render-header="renderProductId">
          <template slot-scope="scope">
            <!-- 无权限时，配置disabled，实现方法：:disabled="判断值"  -->
            <el-checkbox v-if="scope.row.tag_type != 0" v-model="scope.row.isSelect" @change="indexSelection"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="tag_name"
                         label="品牌名称" :sortable="false" :width="200"  align="left">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="member_scene"
                         label="会员场景" :sortable="false" :width="100"  align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.member_scene === 1">
              交易即会员
            </template>
            <template v-if="scope.row.member_scene === 2">
              注册即会员
            </template>
            <template v-if="scope.row.member_scene === 0">
              未知
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="businessName"
                         label="业务平台" :sortable="false" :width="400"  align="left">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="remark"
                         label="描述" :sortable="false">
        <template slot-scope="scope">
          <template v-if="!scope.row.remark && scope.row.remark != 0">
            -
          </template>
          <template v-else>
            {{scope.row.remark}}
          </template>
        </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="160">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope" class="text-left">
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
import NsTableBrand from './src/NsTableBrand'

export default NsTableBrand
</script>
