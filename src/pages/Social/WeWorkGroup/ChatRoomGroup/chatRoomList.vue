<template>
  <div>
    <ns-page-table @add="$emit('add')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" :colButton='10'>
      <!-- 按钮 -->
      <template slot="buttons">
        <div>
          <span>聚合码标题：{{remark || '-'}}</span>
          <ns-button type="text" @click="goback" class="template-table__bar--back">返回上一级</ns-button>
        </div>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-if="!searchType.advanced" label="群名称：">
            <el-input v-model="model.name" placeholder="请输入群名称" @keyup.enter.native="quickSearch()" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="!searchType.advanced">
            <ns-button type="primary" @click="quickSearch()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="tabSearchType">
              {{searchType.tipText}}
              <Icon :type="searchType.advanced ? 'up' : 'down'"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->
      <!-- 高级搜索 -->
      <template slot="advancedSearch" v-if="searchType.advanced">
        <el-form
          ref="table_filter_form"
          @keyup.enter.native="submitForm()"
          label-width="64px"
          class="surround-btn"
          :model="model"
          :inline="true"
        >
          <el-form-item label="群名称：">
            <el-form-grid size="xmd">
              <el-input v-model="model.name" placeholder="请输入群名称" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="群主：">
            <el-select v-model="model.owner" placeholder="请选择群主" clearable>
              <el-option v-for="item in ownerList"
                         :key="item.owner"
                         :label="item.ownerName"
                         :value="item.owner">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可加入：" label-width="80px">
            <el-select v-model="model.canJoin" clearable>
              <el-option  label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm">{{$t('operating.search')}}</ns-button>
          <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
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
        <el-table
          ref="table"
          :data="dataList"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="loading"
        >
          <el-table-column prop="personnel" label="群名称" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="personnels" label="群人数" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.person_num || '-' }}人
            </template>
          </el-table-column>
            <el-table-column prop="personnels" label="群主" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.owner_name || '-'}}{{scope.row.owner_work_num ? '('+ scope.row.owner_work_num +')':''}}
              </template>
            </el-table-column>
          <el-table-column prop="num" label="是否可加入" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.can_join && scope.row.can_join == 1 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="num"  label="群状态" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.is_delete && scope.row.is_delete == 1 ? '删除' : '正常' }}
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建时间" align="center" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.create_time || '-' }}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons" :prop="scope">
              </ns-table-column-operate-button-ext>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->
      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination.sizeOpts"
                       :total="pagination.total"
                       :current-page.sync="pagination.page"
                       :page-size="pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
  </div>
</template>

<script>
import chatRoomList from './src/chatRoomList'
export default chatRoomList
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .template-table__bar--back {
    margin-left: var(--default-margin-larger);
  }
  >>> .table-header-icon {
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  >>> .el-dropdown-link {
    margin-left: var(--default-margin-base) !important;
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
