<template>
  <ns-page-table @edit="$emit('edit')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" @keyup.enter.native="$quickSearchAction$('hash_name$LK')"
                    v-model="quickSearchModel.hash_name$LK" placeholder="请输入哈希名称">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('hash_name$LK')"></i>
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
      <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$" placement="right" label-width="90px" :model="model" :rules="rules"
               :inline="true">
        <el-form-item label="哈希名称：">
          <el-form-grid size="xmd">
            <el-form-item prop="hash_name$LK">
              <el-input type="text"
                        v-model="model.hash_name$LK">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="哈希类型：">
          <el-form-grid size="xmd">
            <el-form-item prop="type$LK">
              <el-select v-model="model.hash_type$EQ" clearable filterable placeholder="">
                <el-option v-for="(type,index) in $parent.types" :label="type.label" :value="type.value"
                           :key="'type'+index"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="哈希键：">
          <el-form-grid size="xmd">
            <el-form-item prop="code$LK">
              <el-input type="text"
                        v-model="model.hash_key$EQ">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="备注：">
          <el-form-grid size="xmd">
            <el-form-item prop="remark$LK">
              <el-input type="text"
                        v-model="model.remark$LK">
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
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="hash_name"
                         label="哈希名称"
                         dbcolumn="hash_name"
                         column="hash_name"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="hash_key"
                         label="哈希键"
                         dbcolumn="hash_key"
                         column="hash_key"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="hash_value"
                         label="哈希值"
                         dbcolumn="hash_value"
                         column="hash_value"
                         align="center"
                         width="140"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="hash_type"
                         label="哈希类型"
                         dbcolumn="hash_type"
                         column="hash_type"
                         align="center"
                         width="140"
                         :sortable="false">
          <template slot-scope="{row}">
            <template v-if="row.hash_type === 0">
              集团
            </template>
            <template v-if="row.hash_type === 1">
              品牌
            </template>
            <template v-if="row.hash_type === 2">
              渠道
            </template>
            <template v-if="row.hash_type === 3">
              店铺
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         type="default"
                         prop="is_write"
                         label="哈希类型"
                         dbcolumn="is_write"
                         column="is_write"
                         align="center"
                         width="80"
                         :sortable="false">
          <template slot-scope="{row}">
            <template v-if="row.is_write === 0">
              只读
            </template>
            <template v-if="row.is_write === 1">
              可写
            </template>
          </template>
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
                         type="default"
                         prop="update_time"
                         label="更新时间"
                         dbcolumn="update_time"
                         column="update_time"
                         align="center"
                         width="150"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="操作"
                         align="center"
                         width="80">
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
import NsTableHash from './src/NsTableHash'

export default NsTableHash
</script>
