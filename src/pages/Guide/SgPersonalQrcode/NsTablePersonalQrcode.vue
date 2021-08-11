<template>
  <div>
    <BindDevice :visible.sync="bindDeviceDialog.visible" :guide='bindDeviceDialog.guide' @reload='$reload'/>
    <ns-page-table @add="$emit('add')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" :colButton='10'>
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
          <el-form-item label="" v-if="!_data._queryConfig.expand">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.name" placeholder="聚合二维码名称" @keyup.enter.native="$quickSearchAction$('name')" clearable></el-input>
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
          <el-form-item label="聚合码名称：">
            <el-input  autofocus=true v-model="model.name" @keyup.enter.native="$quickSearchAction$('name')" placeholder="请输入聚合二维码名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="子码：">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.personal" @keyup.enter.native="$quickSearchAction$('personal')" placeholder="请输入子码名称" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="排序方式：">
            <el-form-grid>
              <el-select
                style="width:100px"
                v-model="model.type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid>
              <el-select
                style="width:100px"
                v-model="model.sortType" placeholder="请选择">
                <el-option
                  v-for="item in sortTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-form-grid>
              <el-select placeholder="全部" v-model="model.creatorName" clearable @clear="setJobNull">
                <el-option value="" label="全部" />
                <el-option
                  v-for="val in creatorList"
                  :key="val.creatorName"
                  :label="val.creatorName"
                  :value="val.creatorName"
                ></el-option>
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

        <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange" @sort-change="orderByInviteFriendNum">
          <el-table-column prop="personnel" label="聚合码名称" align="left" min-width="88">
            <template slot-scope="scope">
              {{scope.row.name?scope.row.name:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="personnels" label="子码" align="left" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.personnels?scope.row.personnels:'-'}}
            </template>
          </el-table-column>
          <div v-if="memberManagePlan == 1">
            <el-table-column prop="personnels" label="投放渠道" align="left" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.channelName?scope.row.channelName:'-'}}
              </template>
            </el-table-column>
          </div>
          <el-table-column prop="num" v-if="memberManagePlan == 2" label="扫描次数" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.num?scope.row.num:'0' }}
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.creatorName?scope.row.creatorName:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="聚合二维码" align="center" min-width="100">
            <template slot-scope="scope">
              <ns-button style="color:#0091FA; font-size:20px;" size="mini" @click="qrcodeLink(scope.row)" type="text">
                <Icon type="erweima"/>
              </ns-button>
            </template>
          </el-table-column>
          <el-table-column v-if="memberManagePlan == 1" prop="poster" label="海报" align="center" min-width="100">
            <template slot-scope="scope">
              <ns-button style="color:#0091FA; font-size:20px;" size="mini" @click="posterLink(scope.row)" type="text">
              <Icon type="tupian"/>
              </ns-button>
            </template>
          </el-table-column>
          <el-table-column v-if="memberManagePlan == 1" prop="inviteFriendSum" align="center" sortable="custom" min-width="120">
            <template slot="header">
              引流好友数
              <el-tooltip class="help" content="通过聚合码添加企业成员的好友数">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{ scope.row.type === 0 ? scope.row.inviteFriendSum : '-' }}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="160px">
            <template slot-scope="scope">
              <div v-if="memberManagePlan == 1">
                <ns-table-column-operate-button-ext :buttons="_data._table.qywx_table_buttons" :prop="scope">
                </ns-table-column-operate-button-ext>
              </div>
              <div v-if="memberManagePlan == 2">
                <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons" :prop="scope">
                </ns-table-column-operate-button-ext>
              </div>
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
import personalQrcode from './src/NsTablePersonalQrcode'
export default personalQrcode
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
