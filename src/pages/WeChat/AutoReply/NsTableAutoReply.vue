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
          <el-form-item v-show="_data._queryConfig.expand === false" label="聊天关键词：">
            <el-input ref="quickText" style="width: 180px" v-model="model.title" placeholder="请输入聊天关键词" @keyup.enter.native="$quickSearchAction$('title')" clearable>
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
          <el-form-item label="聊天关键词：">
            <el-form-grid size="xmd">
              <el-input style="width:180px"  v-model="model.title" placeholder="请输入聊天关键词" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="回复内容：">
            <el-form-grid size="xmd">
              <el-input style="width:180px"  v-model="model.title" placeholder="请输入回复内容" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="匹配方式：">
            <el-form-grid>
              <el-select placeholder="不限" style="width:200px" v-model="model.matchType" clearable filterable>
                <el-option v-for="item in matchType"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="选择店铺：">
            <ElFormGrid>
              <NsShopDialog :auth="false" type="primary" btnTitle="选择店铺" v-model="model.shopIds"></NsShopDialog>
            </ElFormGrid>
            <ElFormGrid>
              已选择<span class="text-primary">{{model.shopIds? model.shopIds.length: 0}}</span>家店铺
            </ElFormGrid>
          </el-form-item>
          <el-form-item label="选择员工：">
            <ElFormGrid>
              <NsGuideDialog :auth="false" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="model.guideIds"></NsGuideDialog>
            </ElFormGrid>
            <ElFormGrid>
              已选择<span class="text-primary">{{model.guideIds? model.guideIds.length: 0}}</span>个导购员工
            </ElFormGrid>
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

        <el-table ref="table"  :data="_data._table.data" @selection-change="handleSelectionChange" stripe >
          <el-table-column type="selection" align="center" :width="50">
          </el-table-column>
          <el-table-column prop="chatKeyWord" label="聊天关键词" align="center" min-width="30">
            <template slot-scope="scope">
              {{scope.row.chatKeyWord ? scope.row.chatKeyWord : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="回复内容" align="center" min-width="30">
            <template slot-scope="scope">
              <span v-if="JSON.parse(decodeURIComponent(scope.row.content))[0].type === 'text'">
                {{JSON.parse(decodeURIComponent(scope.row.content))[0].content}}
              </span>
              <span v-else-if="JSON.parse(decodeURIComponent(scope.row.content))[0].type === 'image'">
                图片
              </span>
              <span v-else-if="JSON.parse(decodeURIComponent(scope.row.content))[0].type === 'link'">
                链接
              </span>
              <span v-else-if="JSON.parse(decodeURIComponent(scope.row.content))[0].type === 'video'">
                视频
              </span>
              <span v-else>
                小程序
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="30">
            <template slot="header">
              使用范围
              <el-tooltip content="发送优先级: 员工聊天自动回复>门店聊天自动回复">
                <Icon type="question-circle"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.type === 9">
                <ns-button style="color:#0091FA" @click="onShowEmployeeScope(scope.row)" type="text">全部员工</ns-button>
              </div>
              <div v-else-if="scope.row.shopCount > 0 || scope.row.count > 0">
                <ns-button style="color:#0091FA" @click="onShowShopScope(scope.row)" v-if="scope.row.shopCount > 0" type="text">{{scope.row.shopCount}}家店铺</ns-button>
                <ns-button style="color:#0091FA" @click="onShowEmployeeScope(scope.row)" v-if="scope.row.count > 0" type="text">{{scope.row.count}}名员工</ns-button>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center" min-width="30">
            <template slot-scope="scope">
              {{scope.row.updateTime ? scope.row.updateTime : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="matchType" label="匹配方式" align="center" min-width="30">
            <template slot-scope="scope">
              <span v-if="scope.row.matchType === 0">模糊匹配</span>
              <span v-if="scope.row.matchType === 1">完全匹配</span>
              <span v-if="scope.row.matchType === 2">任意匹配</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="30">
            <template slot-scope="{row}">
<!--              <el-switch style="cursor:pointer" v-if="row.type === 9 && String(row.account ? row.account : '') !== 'admin'" :disabled="true" :value="row.status" :active-value="1" :inactive-value="0"-->
<!--                         ></el-switch>-->
              <el-switch style="cursor:pointer" :value="row.status" :active-value="1" :inactive-value="0"
                         :before-change="(call, currVal)=>{onStatusChange(call,currVal,row)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           min-width="30">
            <template slot-scope="scope">
<!--              <ns-table-column-operate-button-ext v-if="scope.row.type === 9 && String(scope.row.account ? scope.row.account : '') !== 'admin'"-->
<!--                                                  :prop="scope"-->
<!--                                                  :buttons="[]">-->
<!--              </ns-table-column-operate-button-ext>-->
              <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons"
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
import autoReply from './src/NsTableAutoReply'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'
autoReply.components = {
  NsTableColumnOperateButtonExt,
  NsGuideDialog,
  NsShopDialog
}
export default autoReply
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

  .table-col--content {
    position: relative;
    display: inline-block;
    padding-right: 48px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    vertical-align: middle;
  }
  .btn-append {
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -12px;
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
