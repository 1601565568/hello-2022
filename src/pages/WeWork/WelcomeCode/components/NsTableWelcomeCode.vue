<template>
  <ns-page-table ref='mainTable' :colButton="10">

    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form
        :model="quickSearchModel"
        :line="true"
        @submit.native.prevent
        class="pull-right"
      >
        <el-form-item
          v-show="_data._queryConfig.expand === false"
          label="欢迎语内容："
        >
          <el-input ref="quickText" style="width: 180px" v-model="model.content" placeholder="请输入欢迎语内容" @keyup.enter.native="$quickSearchAction$('content')" clearable />
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
          <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
        <el-form-item label="欢迎语内容：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.content" placeholder="请输入欢迎语内容" clearable></el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>

    <template slot="table">
      <el-table ref="table"  :data="_data._table.data" stripe>
        <el-table-column prop="content" label="欢迎语" align="left">
        </el-table-column>
        <el-table-column prop="annex_type" label="附带" align="center">
          <template slot-scope='scope'>
            {{convertAnnexType(scope.row.annex_type)}}
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" align="center">
        </el-table-column>
        <el-table-column prop="scope" min-width="150" label="
        使用范围" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <ns-button style="color:#0091FA" @click="onShowEmployeeScope(scope.row)" v-if="scope.row.employeeCount > 1" type="text">{{scope.row.employeeCount}}名员工</ns-button>
              <div v-else>
                {{scope.row.employeeName ? scope.row.employeeName : '-'}}
              </div>
              /
              <ns-button style="color:#0091FA" @click="onShowChannelScope(scope.row)" v-if="scope.row.channelCount > 1" type="text">{{scope.row.channelCount}}个渠道</ns-button>
              <div v-else>
                {{scope.row.channelName ? scope.row.channelName : '-'}}
              </div>
            </template>
          </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           width="160px">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                      :page-sizes="_data._pagination.sizeOpts"
                      :total="_data._pagination.total"
                      :current-page.sync="_data._pagination.page"
                      :page-size="_data._pagination.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="$sizeChange$"
                      @current-change="$pageChange$">
      </el-pagination>
    </template>
  </ns-page-table>
</template>
<script>
import component from './NsTableWelcomeCode.js'
export default component
</script>
