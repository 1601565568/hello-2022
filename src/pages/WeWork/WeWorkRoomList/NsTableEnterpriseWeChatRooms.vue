<template>
  <div>
    <ns-page-table @edit="$emit('edit')" @add="$emit('add')" @batch-edit="$emit('batch-edit')" :colButton="6">
      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.title" placeholder="请输入群名称" @keyup.enter.native="$quickSearchAction$('title')">
              <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="$quickSearchAction$('title')"/>
            </el-input>
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
        <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="$searchAction$" class="surround-btn"
                 :model="model" :rules="rules" :inline="true">
          <el-form-item label="群名称：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.title">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="群主：">
            <el-form-grid size="xmd">
              <el-select-load v-model="model.chatroomLeaderWxid" :options="chatroomLeaders" :page-sizes="20" filterable clearable placeholder="请输入群主">
              </el-select-load>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="创建时间：" prop="time">
            <el-form-grid>
              <ns-datetime  v-model="model.buildTime"></ns-datetime>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <template slot="table">
        <!-- 表格 -->
        <el-table ref="table" :data="_data._table.data" class="template-table__main" resizable
                  v-loading.lock="_data._table.loadingtable"
                  stripe
                  :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$" @selection-change="onHandleSelectChange">
          <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                           label="群名称" :sortable="false" align="left">
            <template slot-scope="scope">
              <ns-wechat-emoji :data="scope.row.title ? scope.row.title : '暂无群名称'"></ns-wechat-emoji>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="chatroom_leader_nick"
                           label="群主" :sortable="false" align="center">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.chatroom_leader_nick}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="count"
                           label="群人数" :sortable="false"  align="center">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="build_time"
                           label="创建时间" :sortable="false"  align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.build_time">
                {{scope.row.build_time.substring(0,10)}}
              </div>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" label="操作" :sortable="false" align="left">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                              :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <!-- 分页 -->
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts"
                       :total="_data._pagination.total"
                       :current-page="_data._pagination.page"
                       :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
  </div>
</template>
<script>
import NsTableWeChatRooms from './src/NsTableEnterpriseWeChatRooms'

export default NsTableWeChatRooms
</script>
