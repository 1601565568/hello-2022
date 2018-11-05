<template>
  <ns-page-table @add="$emit('add')" @edit="$emit('edit')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="model" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="model.templateName" @keyup.enter.native="$quickSearchAction$('templateName')"
                    placeholder="请输入模板名称">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('templateName')"></i>
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
        <el-form-item label="模板名称：">
          <el-form-grid size="xmd">
              <el-input type="text"
                        v-model.trim="model.templateName">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="模板类型：">
          <el-form-grid size="xmd">
              <el-select v-model="model.templateType"
                         filterable clearable
                         placeholder="" :multiple="false">
                <el-option v-for="option in templateTypeOptions" :key="option.value" :label="option.label"
                           :value="option.value"></el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="微信官方模板：">
          <el-form-grid size="xmd">
              <el-select
                v-model="model.templateCode"
                filterable clearable
                placeholder="" :multiple="false">
                <el-option v-for="option in $parent.wxTemplateTagsList" :key="option.wx_template_code" :label="option.wx_template_name"
                           :value="option.wx_template_code"></el-option>
              </el-select>
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
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')"
                @sort-change="$orderChange$">
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--align="center"-->
        <!--:width="30">-->
        <!--</el-table-column>-->
        <el-table-column
                         type="default"
                         prop="template_name"
                         label="模板名称"
                         dbcolumn="template_name"
                         column="template_name"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column
                         type="default"
                         prop="typeName"
                         label="模板类型"
                         dbcolumn="typeName"
                         column="typeName"
                         align="center"
                         width="80"
                         :sortable="false">

        </el-table-column>

        <el-table-column
                         type="default"
                         label="关联微信官方模板"
                         align="center"
                         :sortable="false">
          <template slot-scope="{row}">
              {{onTrans2Json(row.template_content).wxTemplateName}}
          </template>
        </el-table-column>
=
        <el-table-column
                         type="default"
                         prop="user_name"
                         label="创建人"
                         dbcolumn="user_name"
                         column="user_name"
                         align="center"
                         :sortable="false">
        </el-table-column>
        <el-table-column
                         type="default"
                         prop="create_time"
                         label="创建时间"
                         dbcolumn="create_time"
                         column="create_time"
                         align="center"
                         width="150"
                         :sortable="false">
        </el-table-column>
        <el-table-column
                         label="操作"
                         align="center"
                         width="90">
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
  import NsTableWxTemplate from './src/NsTableWxTemplate'

  export default NsTableWxTemplate
</script>
