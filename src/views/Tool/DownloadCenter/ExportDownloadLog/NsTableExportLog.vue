<template>
  <ns-page-table>
    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.alias_file_name" placeholder="请输入文件名称"
                    @keyup.enter.native="$quickSearchAction$('alias_file_name')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name"
               @click="$quickSearchAction$('alias_file_name')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i
              :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
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
        <el-form-item label="文件名称：">
          <el-form-grid size="xmd">
            <el-input type="text" v-model.trim="model.alias_file_name">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="下载人：">
          <el-form-grid size="xmd">
            <el-input type="text" v-model.trim="model.login_account">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="下载时间：">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="model.exportTime" format="yyyy-MM-dd"></ns-datetime>
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
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')">
        <el-table-column :show-overflow-tooltip="true" type="default" prop="alias_file_name"
                         label="文件名称" :sortable="false" align="left">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="user_name"
                         label="下载人" :sortable="false" align="center">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="create_time"
                         label="下载时间" :sortable="false" align="center">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="client_ip" align="center"
                         label="IP地址" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="下载状态" prop="download_state" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.download_state === 0">
              失败
            </template>
            <template v-if="scope.row.download_state === 1">
              成功
            </template>
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
import NsTableExportLog from './src/NsTableExportLog'

export default NsTableExportLog
</script>
