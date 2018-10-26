<template>
  <ns-page-table @edit="$emit('edit')"  @add="$emit('add')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 简单搜索 -->
    <template slot="searchSearch">

      <el-form :model="model" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="model.name$LK"
                    @keyup.enter.native="$quickSearchAction$('name$LK')" placeholder="请输入字典名称">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('name$LK')"></i>
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

      <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$" placement="right" label-width="110px"
               :model="model" :rules="rules"
               :inline="true">
        <el-form-item label="数据字典名称：">
          <el-form-grid size="xmd">
            <el-form-item prop="name$LK">
              <el-input type="text" v-model.trim="model.name$LK">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="类型：">
          <el-form-grid size="xmd">
            <el-form-item prop="type$LK">
              <el-select v-model="model.type$LK" clearable filterable placeholder="">
                <el-option v-for="(value,key) in types" :key="key" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="编码：">
          <el-form-grid size="xmd">
            <el-form-item prop="code$LK">
              <el-input type="text"
                        v-model.trim="model.code$LK">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="备注：">
          <el-form-grid size="xmd">
            <el-form-item prop="remark$LK">
              <el-input type="text"
                        v-model.trim="model.remark$LK">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <template slot="table">
      <!-- 表格 -->
      <el-table ref="table" :data="_data._table.data"
                stripe
                class="template-table__main" resizable
                v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')"
                @sort-change="$orderChange$">
        <el-table-column
          type="selection"
          align="center"
          :width="45">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="name"
                         label="数据字典名称"
                         dbcolumn="name"
                         column="name"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="code"
                         label="编码"
                         dbcolumn="code"
                         column="code"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="type_name"
                         label="类型"
                         dbcolumn="type_name"
                         column="type_name"
                         align="center"
                         width="140"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="remark"
                         label="备注"
                         dbcolumn="remark"
                         column="remark"
                         align="left"
                         :sortable="false">
          <template slot-scope="scope">
            <template v-if="!scope.row.remark">
              -
            </template>
            <template v-else>
              {{scope.row.remark}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="操作"
                         align="center"
                         width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope"></ns-table-column-operate-button>

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
</template>

<script>
  import NsTableDataDictionary from './src/NsTableDataDictionary'

  export default NsTableDataDictionary
</script>
