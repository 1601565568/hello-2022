<template>
  <div>
    <BindDevice :visible.sync="bindDeviceDialog.visible" :guide='bindDeviceDialog.guide' @reload='$reload'/>
    <ns-page-table @add="$emit('add')" @showShop="$emit('showShop')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" @shopEdit="$emit('shopEdit')" :colButton='10'>
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
          <el-form-item label="员工：" v-if="!_data._queryConfig.expand">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.name" @keyup.enter.native="$quickSearchAction$('name')" placeholder="请输入员工姓名" clearable></el-input>
            </el-form-grid>
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
        <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
          <el-form-item label="选择员工：">
            <ElFormGrid>
              <NsGuideDialog :auth="false" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="model.guideIds"></NsGuideDialog>
            </ElFormGrid>
            <ElFormGrid>
              已选择<span class="text-primary">{{model.guideIds? model.guideIds.length: 0}}</span>个导购员工
            </ElFormGrid>
          </el-form-item>
          <el-form-item label="微信账号：">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.wxAccount" @keyup.enter.native="$quickSearchAction$('wxAccount')" placeholder="搜索微信号/微信昵称" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="验证信息：">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.validateMsg" @keyup.enter.native="$quickSearchAction$('validateMsg')" placeholder="请输入验证信息" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="自动通过：">
            <el-form-grid>
              <el-select placeholder="全部" v-model="model.isOpen" clearable @clear="setJobNull">
                <el-option label="开启" :value="2"></el-option>
                <el-option label="关闭" :value="1"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
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

        <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" :width="50"></el-table-column>
          <el-table-column prop="personnel" label="员工" align="left" min-width="88">
            <template slot-scope="scope">
              {{scope.row.name?scope.row.name:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="wxAccount" label="微信账号" align="left" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.wxnick?scope.row.wxnick:'-'}}({{scope.row.wxaccount?scope.row.wxaccount:'-'}})
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" label="自动通过" align="center" min-width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.isopen === 1">
                <p>关闭</p>
              </div>
              <div v-else-if="scope.row.isopen === 2">
                <p>开启</p><p>{{ scope.row.begin_time?scope.row.begin_time:'-' }}-{{ scope.row.end_time?scope.row.end_time:'-' }}</p>
              </div>
              <div v-else >
                <p>-</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="interval" label="通过时间间隔" align="left" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.isopen === 1">
                -
              </div>
              <div v-else-if="scope.row.isopen === 2">
                {{ scope.row.mininterval?scope.row.mininterval:'-' }}-{{ scope.row.maxinterval?scope.row.maxinterval:'-' }}秒
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="当前排队好友数" align="right" min-width="120">
            <template slot='header' scope='header'>
              <span>
                <span>{{header.column.label}}</span>
                <el-tooltip content="当前个人号等待自动通过的好友数">
                  <Icon type="question-circle"/>
                </el-tooltip>
              </span>
            </template>
            <template slot-scope="scope">
              {{ scope.row.waitNum?scope.row.waitNum:0 }}
            </template>
          </el-table-column>
          <el-table-column prop="joinQueue" label="加入队列" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.isopen === 1">
                -
              </div>
              <div v-else-if="scope.row.isopen === 2">
                <div v-if="scope.row.joinqueue === 1">
                  <p>关闭</p>
                </div>
                <div v-else-if="scope.row.joinqueue === 2">
                  <p>开启</p>
                </div>
                <div v-else >
                  <p>-</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="validatemsg" label="验证信息" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.validatemsg?scope.row.validatemsg:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="matchMode" label="匹配类型" align="left" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.matchmode === 1">
                <p>模糊匹配</p>
              </div>
              <div v-else-if="scope.row.matchmode === 2">
                <p>全部匹配</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           width="160px">
            <template slot-scope="scope">
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
import autoPass from './src/NsTableAutoPass'
export default autoPass
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
</style>
