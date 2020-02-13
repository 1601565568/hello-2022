<template>
  <div>
    <BindDevice :visible.sync="bindDeviceDialog.visible" :guide='bindDeviceDialog.guide' @reload='$reload'/>
    <ns-page-table @shopEdit="$emit('shopEdit')" :colButton='10'>
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
          <el-form-item v-show="_data._queryConfig.expand === false" label="工号/姓名/昵称/手机号：">
            <el-input ref="quickText" style="width: 180px" v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
              <!--             <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="$quickSearchAction$('name')"/>-->
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
          <el-table-column prop="name" label="员工" align="left" min-width="88">
            <template slot-scope="scope">
              {{scope.row.name?scope.row.name:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="wxAccount" label="微信账号" align="left" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.wxNick?scope.row.wxNick:'-'}}({{scope.row.wOwnerName?scope.row.wOwnerName:'-'}})
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" label="自动通过" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.isOpen?scope.row.isOpen:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="interval" label="通过时间间隔" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.minInterval?scope.row.minInterval:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="当前排队好友数" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.minInterval?scope.row.minInterval:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="joinQueue" label="加入队列" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.joinQueue?scope.row.joinQueue:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="validateMsg" label="验证信息关键字" align="left" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.validateMsg?scope.row.validateMsg:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="matchMode" label="匹配类型" align="left" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.matchMode === 0">
                <p>模糊匹配</p>
              </div>
              <div v-if="scope.row.matchMode === 1">
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
