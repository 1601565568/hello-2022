<template>
  <div>
    <ns-page-table :colButton='10' @open-dialog="$emit('open-dialog','add','新增智能欢迎语')">
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
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false" label="标题名称：">
            <el-input ref="quickText" style="width: 180px" v-model="model.title" placeholder="请输入欢迎语标题" @keyup.enter.native="$quickSearchAction$('title')" clearable>
            </el-input>
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
      <!-- 简单搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true" @keyup.enter.native="$searchAction$()">
          <el-form-item label="标题名称：">
            <el-form-grid size="xmd">
              <el-input style="width:180px"  v-model="model.title" placeholder="请输入欢迎语标题" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-input style="visibility:hidden;height:0px;"></el-input>
        </el-form>

        <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
          <ns-button @click="$resetInputAction$()">重置</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table ref="table"  :data="_data._table.data" stripe >
          <el-table-column :show-overflow-tooltip="true" prop="title" align="left" min-width="30">
            <template slot="header">
              标题
              <el-tooltip content="员工未设置欢迎语时，将使用默认欢迎语">
                <Icon type="question-circle"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{scope.row.title?scope.row.title:'-'}}
              <ns-button v-if="scope.row.type === 9" type="primary" size="mini" round class="btn-append">
                默认
              </ns-button>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center" min-width="30">
            <template slot-scope="scope">
              {{scope.row.updateTime?scope.row.updateTime:'-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="30">
            <template slot="header">
              使用范围
              <el-tooltip content="多个欢迎语情况下的发送优先级：员工欢迎语>门店欢迎语>默认欢迎语">
                <Icon type="question-circle"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.shopCount > 0 || scope.row.count > 0">
                <ns-button style="color:#0091FA" @click="onShowShopScope(scope.row)" v-if="scope.row.shopCount > 0" type="text">{{scope.row.shopCount}}家店铺</ns-button>
                <ns-button style="color:#0091FA" @click="onShowEmployeeScope(scope.row)" v-if="scope.row.count > 0" type="text">{{scope.row.count}}名员工</ns-button>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="发送时间限制" align="center" min-width="30">
            <template slot="header">
              发送时间限制
              <el-tooltip content="欢迎语发送可能受网络影响导致发送延迟，超过该时间限制后则不再会自动发送">
                <Icon type="question-circle"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{scope.row.failureTime?scope.row.failureTime+' 秒':'无限制'}}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="30">
            <template slot-scope="{row}">
              <el-switch style="cursor:pointer" v-if="row.type === 9 && String(row.account ? row.account : '') !== 'admin'" :disabled="true" :value="row.status" :active-value="1" :inactive-value="0"
                         ></el-switch>
              <el-switch style="cursor:pointer" v-else :value="row.status" :active-value="1" :inactive-value="0"
                         :before-change="(call, currVal)=>{onStatusChange(call,currVal,row)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           min-width="30">
            <template slot-scope="scope">
              <ns-table-column-operate-button-ext v-if="scope.row.type === 9 && String(scope.row.account ? scope.row.account : '') !== 'admin'"
                                                  :prop="scope">
              </ns-table-column-operate-button-ext>
              <ns-table-column-operate-button-ext v-else :buttons="_data._table.table_buttons"
                                                  :prop="scope">
              </ns-table-column-operate-button-ext>
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
                       :current-page.sync="_data._pagination.page"
                       :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
  </div>
</template>

<script>
import welcomes from './src/NsTableWelcomes'
export default welcomes
</script>
<style>
  @import "@theme/variables.pcss";
  .del-btn {
    color: var(--theme-color-danger)
  }
</style>
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

  .btn-append {
    font-size: var(--default-font-size-small);
    transform: scale(0.84);
    width: 48px;
    cursor: default;

    &:active, &:hover, &:focus {
      background: var(--theme-font-color-info);
      border: 1px solid var(--theme-font-color-info);
    }
  }
</style>
