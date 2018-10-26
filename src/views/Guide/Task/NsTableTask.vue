<template>
  <ns-page-table @edit="$emit('edit')" @add="$emit('add')" @stop="$emit('stop')" @delete="$emit('delete')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
    </template>
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" @keyup.enter.native="$quickSearchAction$('name')"
                    v-model="quickSearchModel.name" placeholder="请输入任务名称">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('name')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}<i
            :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$" placement="right" label-width="90px"
               :model="model" :rules="rules"
               :inline="true">
        <el-form-item label="名称：">
          <el-form-grid size="xmd">
            <el-form-item>
              <el-input type="text" v-model="model.name">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：">
          <el-form-grid size="xmd">
            <el-form-item>
              <el-select v-model="model.type">
                <el-option label="营销" value="0"></el-option>
                <el-option label="关怀" value="1"></el-option>
                <el-option label="分享" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：">
          <el-form-grid size="xmd">
            <el-form-item>
              <el-select v-model="model.state">
                <el-option label="执行中" value="1"></el-option>
                <el-option label="终止" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
    <!-- 表格布局-->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')"
                @sort-change="$orderChange$">
        <el-table-column prop="name" label="名称" align="left"></el-table-column>
        <el-table-column label="执行时间" align="center" width="240">
          <template slot-scope="{row}">{{moment(row.startTime) + ' 至 ' + moment(row.endTime)}}</template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.type === 0">营销</span>
            <span v-if="row.type === 1">关怀</span>
            <span v-if="row.type === 2">分享</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.state === 1" class="text-primary">执行中</span>
            <span v-if="row.state === 4" class="text-warning">已过期</span>
            <span v-if="row.state === 2" class="text-error">终止</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.operate_buttons"
                                            :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
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
</template>

<script>
  import NsTableTask from './src/NsTableTask'

  export default NsTableTask
</script>

<style scoped>

</style>
