<template>
  <ns-page-table>
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
          <el-input ref="quickText" v-model.trim="quickSearchModel.customerName" placeholder="请输入接收人" @keyup.enter.native="$quickSearchAction$('customerName')">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('customerName')"></i>
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
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="接收人：">
          <el-form-grid size="xmd">
            <el-form-item prop = "customerName" >
              <el-input type="text" v-model.trim = "model.customerName" placeholder="请输入接收人">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送公众号：">
          <el-form-grid size="xmd">
            <el-form-item>
              <ns-select  v-model="model.wxAccount" :clearable="true" filterable placeholder="请选择微信公众号"
                          :multiple="false" :url="$api.touch.wxTemplate.queryWxAccountOptions">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送来源：">
          <el-form-grid size="xmd">
            <el-form-item>
              <ns-select  v-model="model.sourceModel" :clearable="true" filterable placeholder="请选择发送来源"
                          :multiple="false" :url="$api.touch.wxSendLogs.getSourceModels">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="发送状态：">
          <el-form-grid size="xmd">
            <el-form-item >
              <el-select v-model="model.sendStatus"
                         filterable  clearable
                         placeholder="请选择发送状态" :multiple="false">
                <el-option label="失败" class="text-error" :value="0"></el-option>
                <el-option label="成功" class="text-success" :value="1"></el-option>
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
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe @selection-change="onHandleSelectChange"
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45"></el-table-column>-->
        <el-table-column type = "default" prop = "title_name" label = "标题"
                         align = "left" width = "250" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "wxAccountName" label = "微信公众号"
                         align = "left" :sortable = "false" >
        </el-table-column>
        <el-table-column  type = "default" prop = "sourceName"
                         label = "发送来源" align = "left" width = "120" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "customer_name" label = "接收人"
                         align = "left" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "create_time"
                          label = "发送时间" width = "150"  align = "center" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "sendStatus" label = "发送状态"
                        align = "center" width = "80" :sortable = "false">
          <template slot-scope="scope">
            <div v-if='scope.row.send_status===0' class="text-error">失败</div>
            <div v-if='scope.row.send_status===1' class="text-success">成功</div>
          </template>
        </el-table-column>
        <el-table-column  type = "default" prop = "wx_template_name"
                          label = "微信模板" align = "left" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "send_content"
                          label = "内容" align = "left" :sortable = "false">
          <template slot-scope="scope">
            <a onclick="">查看</a>
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
import index from './src/index'

export default index
</script>
