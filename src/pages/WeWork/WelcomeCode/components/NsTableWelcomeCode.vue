<!--
 * @Descripttion: 智能欢迎语列表组件
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-11 10:51:15
 -->
<template>
  <ns-page-table ref='mainTable'><!-- :colButton="10" -->

    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form
        :model="quickSearchModel"
        class="pull-right" :inline="true">
        <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText"
              v-model="model.content"
              placeholder="请输入欢迎语内容"
              clearable style="width: 180px"/> <!-- @keyup.enter.native="$quickSearchAction$('content')" -->
              <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
              <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>
        <el-form-item>
          <ns-button type="text"
                    @click.native.prevent="$handleTabClick">
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
        <ns-button type="primary" @click.native.prevent="$searchAction$()">{{ $t("operating.search") }}</ns-button>
        <ns-button @click.native.prevent="$resetInputAction$()">{{ $t("operating.reset") }}</ns-button>
      </div>
    </template>

    <template slot="table">
      <el-table ref="table" :data="_data._table.data" stripe  v-loading.lock="_data._table.loadingtable"
      :element-loading-text="$t('prompt.loading')">
        <el-table-column  width="200"  align="center" prop="content">
        <template slot="header">
          欢迎语
          <el-tooltip content="配置后，客户将在添加员工为微信好友时，发送欢迎语">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
      </el-table-column>
        <el-table-column prop="annexType" label="附带" align="center">
          <template slot-scope='scope'>
            {{convertAnnexType(scope.row.annexType)}}
          </template>
        </el-table-column>
        <el-table-column prop="scope" min-width="80" label="
        使用范围" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.employeeCount <= 0 && scope.row.channelCount <= 0">-</div>
              <div v-else>
                <ns-button style="color:#0091FA" @click="onShowEmployeeScope(scope.row)" v-if="scope.row.employeeCount > 0" type="text">{{scope.row.employeeCount}}名员工</ns-button>
                <span v-if="scope.row.employeeCount > 0 && scope.row.channelCount > 0">,</span>
                <ns-button v-if="scope.row.channelCount > 0" style="color:#0091FA" @click="onShowChannelScope(scope.row)" type="text">{{scope.row.channelCount}}个渠道</ns-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center">
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
import NsTableWelcomeCode from './src/NsTableWelcomeCode.js'
export default NsTableWelcomeCode
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .scope_row_count{
    color: blue;
  }

  .tips {
    color: var(--theme-color-danger)
  }

  >>> .table-header-icon {
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  >>> .el-dropdown-link {
    margin-left: 5px !important;
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
