<template>
  <div>
    <BindDevice :visible.sync="bindDeviceDialog.visible" :guide='bindDeviceDialog.guide' @reload='$reload'/>
    <ns-page-table :colButton='10'>
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
          <el-form-item v-show="_data._queryConfig.expand === false" label="姓名：">
            <el-input ref="quickText" style="width: 180px" v-model="model.name" placeholder="请输入姓名" @keyup.enter.native="$quickSearchAction$('name')" clearable>
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

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true" @keyup.enter.native="$searchAction$()">
          <el-form-item label="账号：">
            <el-form-grid size="xmd">
              <el-input autofocus=true v-model="model.workId" placeholder="请输入账号" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-form-grid size="xmd">
              <el-input autofocus=true v-model="model.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工号：">
            <el-form-grid size="xmd">
              <el-input autofocus=true v-model="model.workNumber" placeholder="请输入工号" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-form-grid size="xmd">
              <el-input autofocus=true v-model="model.nickname" placeholder="请输入昵称" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.mobile" placeholder="手机号码" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工作门店：">
            <el-form-grid size="xmd">
              <shop-select-load placeholder="请选择工作门店"
                                v-model="model.shop"
                                @clear="setShopNull"
                                clearable/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="员工类型：">
            <el-form-grid size="xmd">
              <el-select placeholder="请选择职务" v-model="model.job" clearable @clear="setJobNull">
                <el-option label="全部" :value=null ></el-option>
                <el-option label="店长" :value="1"></el-option>
                <el-option label="导购" :value="0"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="员工状态：">
            <el-form-grid size="xmd">
              <el-select placeholder="请选择职务" v-model="model.guideState" clearable @clear="setGuideStateNull">
                <el-option label="全部" :value=null ></el-option>
                <el-option label="在职" :value="1"></el-option>
                <el-option label="离职" :value="2"></el-option>
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

        <el-table ref="table"  :data="_data._table.data" stripe @selection-change="handleSelectionChange"
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')" >
          <el-table-column prop="work_id" label="账号" align="left" min-width="88">
            <template slot-scope="scope">
              {{scope.row.work_id?scope.row.work_id:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="left" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="工号" align="left" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.work_number ? scope.row.work_number : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码" align="left" min-width="100"></el-table-column>
          <el-table-column prop="shopName,count" min-width="150" label="工作门店" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <ns-button :class="[fuscous==='QA'?fuscousQA:fuscousIcon]" @click="scopeRowCount(scope.row)" v-if="scope.row.count > 1" type="text">{{scope.row.count}}家</ns-button>
              <div v-else>
                {{ scope.row.shopName ? scope.row.shopName : '-' }}
                <span :class="scope.row.shopStatus > 0 ? '' : 'text-error'">
                    {{scope.row.shopStatus === -1 ?  '(门店暂停营业)':scope.row.shopStatus === -2?'(门店已闭店)':''}}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="job" label="员工类型" align="center" width="80">
            <template slot-scope="scope">{{scope.row.job == 1 ? "店长" : (scope.row.job == 0 ? "导购" : "-" ) }}
            </template>
          </el-table-column>
          <el-table-column prop="role_name" label="所属角色" align="left" min-width="200">
          </el-table-column>
          <el-table-column prop="status" label="员工状态" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 2">
                <p class="text-error">已离职</p>
              </div>
              <div v-else-if="scope.row.status === 1">
                <p class="text-primary">在职</p>
              </div>
              <div v-else >
                <p>暂停使用</p>
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
import guide from './src/NsTableGuide'
export default guide
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
.fuscousQA{
  color:#0C4CFF ;
}
.fuscousIcon{
  color: rgb(0, 145, 250);
}
</style>
