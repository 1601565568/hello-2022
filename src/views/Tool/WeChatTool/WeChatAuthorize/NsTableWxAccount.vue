<template>
  <ns-page-table>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="model" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="model.name" @keyup.enter.native="$quickSearchAction$('name')"
                    placeholder="请输入公众号">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('name')"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$" placement="right" label-width="90px" :model="model" :rules="rules"
               :inline="true">
        <el-form-item label="公众号：">
          <el-form-grid size="xmd">
              <el-input type="text" v-model.trim="model.name">
              </el-input>
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
        <el-table-column
                         type="default"
                         prop="wx_name"
                         label="公众号"
                         dbcolumn="wx_name"
                         column="wx_name"
                         align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column
          type="default"
          prop="wx_account"
          label="公众号账号"
          dbcolumn="wx_account"
          column="wx_account"
          align="left"
          :sortable="false">
        </el-table-column>
        <el-table-column
                         type="default"
                         prop="order_num"
                         label="优先级"
                         dbcolumn="order_num"
                         column="order_num"
                         align="center"
                         :sortable="false">
          <template slot-scope="{row}">
            <span @dblclick="onEditOrder">{{row.order_num}}</span>
            <input class="text-right" style="width: 25px" type="hidden" :value="row.order_num" @blur="onConfirmOrder(row,$event)"/>
          </template>
        </el-table-column>
        <el-table-column
                         type="default"
                         prop="wx_status"
                         label="授权状态"
                         dbcolumn="wx_status"
                         align="center"
                         width="100"
                         :sortable="false">
          <template slot-scope="{row}">
            <template v-if="row.wx_status === 1">
              已授权
            </template>
            <template v-else>
              未授权
            </template>
           <!-- <el-switch :before-change="(call,currVal)=>{onStateChange(call,currVal,scope.row)}" :active-value="1"
                       :inactive-value="0" v-model="scope.row.wx_status">
            </el-switch>-->
          </template>
        </el-table-column>
        <el-table-column
                         type="default"
                         prop="is_open"
                         label="启用状态"
                         dbcolumn="is_open"
                         align="center"
                         width="100"
                         :sortable="false">
          <template slot-scope="{row}">
            <el-switch :before-change="(call,currVal)=>{onStateChange(call,currVal,row)}" :active-value="1"
                       :inactive-value="0" v-model="row.is_open">
            </el-switch>
          </template>
        </el-table-column>
        <!--<el-table-column
                         label="操作"
                         align="center"
                         width="90">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>-->
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
  import NsTableWxAccount from './src/NsTableWxAccount'

  export default NsTableWxAccount
</script>
