<template>
  <ns-page-table>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!--按钮结束-->
    <!-- 简单搜索 开始 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.target" placeholder="请输入收件邮箱"
                    name="email_addr"
                    icon="search" @keyup.enter.native="$quickSearchAction$('target')"
                    :on-icon-click="$quickSearchAction$">
            <i class="el-icon-search el-input__icon" slot="suffix" name="email_addr" @click="$quickSearchAction$('target')"></i>
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
    <!-- 简单搜索 结束-->
    <!-- 高级搜索 开始 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="$searchAction$"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="收件邮箱：">
          <el-form-grid size="xmd">
            <el-form-item prop="target">
              <el-input type="text" v-model.trim="model.target" placeholder="请输入收件邮箱">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发件人：">
          <el-form-grid size="xmd">
            <el-form-item prop="send_name">
              <el-input type="text" v-model.trim="model.send_name" placeholder="请输入发件人">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发件邮箱：">
          <el-form-grid size="xmd">
            <el-form-item prop="send_addr">
              <el-input type="text" v-model.trim="model.send_addr" placeholder="请输入发件邮箱">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送来源：">
          <el-form-grid size="xmd">
            <el-form-item prop="source_model">
              <ns-select v-model="model.source_model"
                         :url="$api.touch.emailSend.getSourceModelsOption"
                         filterable clearable
                         placeholder="请选择发送来源" :multiple="false">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送状态：">
          <el-form-grid size="xmd">
            <el-form-item prop="send_status">
              <el-select v-model="model.send_status"
                         filterable clearable
                         placeholder="请选择发送状态" :multiple="false">
                <el-option label="失败" :value="0"></el-option>
                <el-option label="成功" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送时间：" class="el-inline-block">
          <ns-datetime startPlaceholder="请选择开始时间" endPlaceholder="请选择结束时间" v-model="model.time"></ns-datetime>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <!-- 高级搜索 结束-->
    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table" stripe resizable
                v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')"
                @sort-change="$orderChange$">
        <el-table-column type="default"
                         prop="title_name"
                         label="邮箱标题"
                         align="left"
                         width="330"
                         :sortable="false">
        </el-table-column>
        <el-table-column type="default"
                         prop="target"
                         label="收件邮箱"
                         align="left">
        </el-table-column>
        <el-table-column type="default"
                         prop="sourceName"
                         label="发送来源"
                         align="left">
        </el-table-column>
        <el-table-column type="default"
                         prop="send_name"
                         label="发件人"
                         align="left"
                         width="100">
        </el-table-column>
        <el-table-column type="default"
                         prop="send_addr"
                         label="发送邮箱"
                         align="left">
        </el-table-column>
        <el-table-column type="default"
                         prop="send_time"
                         label="发送时间"
                         align="center"
                         width="160"
                         :sortable="_data._table._CUSTOM_">
        </el-table-column>
        <el-table-column  type="default"
                         prop="send_status"
                         label="发送状态"
                         align="center"
                         width="100"
                         :sortable="_data._table._CUSTOM_">
          <template slot-scope="scope">
            <span v-if='scope.row.send_status ==0' class="text-error">失败</span>
            <span v-if='scope.row.send_status ==1' class="text-success">成功</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="80">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <!-- 表格-结束 -->
    <!-- 分页 -->
    <template slot="pagination">
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
  import NsTableEmailSendLogs from './src/NsTableEmailSendLogs'
  export default NsTableEmailSendLogs
</script>
