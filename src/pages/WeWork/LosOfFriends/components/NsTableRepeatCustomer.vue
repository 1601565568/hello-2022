<!--
 * @Descripttion: 好友流失足迹按
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-08-17 16:43:50
 -->
<template>
  <ns-page-table ref="mainTable"
    ><!-- :colButton="10" -->
      <template slot="buttons">
        <ns-button @click="openFile">导出文件</ns-button>
        <ns-button @click="() => {this.$emit('Reminder')}" type="primary">提醒设置</ns-button>
      </template>
    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form
        @submit.native.prevent
        :model="quickSearchModel"
        class="pull-right"
        :inline="true"
      >
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input
            ref="quickText"
            v-model="model.searchGName"
            placeholder="请输入导购/群名"
            style="width: 180px"
            clearable
          />
          <!--  -->
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn"
            >搜索</ns-button
          >
          <ns-button @click="$resetInputAction$();" class="resetbtn"
            >重置</ns-button
          >
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click.native.prevent="$handleTabClick">
            {{ collapseText }}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'" />
          </ns-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form
        ref="table_filter_form"
        :model="model"
        label-width="60px"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="时间：">
          <el-form-grid size="xlg">
            <!-- <el-date-picker
              v-model="model.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              @change="changeTime"
              align="right">
            </el-date-picker> -->
              <el-date-picker
                  v-model="datePickerValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions1"
                  align="center"
                  @change='datePickerChange'
                >
              </el-date-picker>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="员工：">
          <div class="template-search__box">
            <span v-if="model.guideIds && model.guideIds.length>0">
                已选择{{model.guideIds.length}}个
            </span>
            <span v-else>全部</span>
            <div style="float: right;">
              <NsGuideDialog
                :isButton="false"
                :validNull="true"
                :guideUrl="this.$api.core.sysUser.queryGuidePageByUserId"
                :guideFindUrl="this.$api.core.sysUser.guideFindUrl"
                :auth="false"
                type="primary"
                btnTitle="选择"
                dialogTitle="选择员工"
                v-model="model.guideIds"
              ></NsGuideDialog>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="事件：">
          <el-form-grid>
            <el-select
              clearable
              v-model="model.searchEventType"
              :default-first-option="true"
              @change="owenerChange"
            >
              <el-option
                v-for="item in chatRoomOwner"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="">
          <el-form-grid>
            <el-input
              autofocus="true"
              v-model.trim="model.searchGName"
              placeholder="请输入导购/群名"
              clearable
            ></el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click.native.prevent="$searchAction$()">{{
          $t("operating.search")
        }}</ns-button>
        <ns-button @click.native.prevent="$resetInputAction$()">{{
          $t("operating.reset")
        }}</ns-button>
      </div>
    </template>

    <template slot="table">
      <el-table
        ref="table"
        :data="_data._table.data"
        stripe
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')"
        @sort-change="onSortChange"
      >
        <el-table-column prop="created" label="好友流失时间" align="left" :sortable="false">
        </el-table-column>
        <el-table-column prop="shopName" label="员工所属门店" align="center">
          <!-- <template slot-scope="scope">
            {{ scope.row.name }}
          </template> -->
        </el-table-column>
        <el-table-column label="员工/群名" prop="gName" align="center">
        </el-table-column>
        <el-table-column label="客户名称" prop="cName" align="center">
        </el-table-column>
        <el-table-column label="事件" align="center" prop="eventType">
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table-pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page.sync="_data._pagination.page"
        :page-size="_data._pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$"
      >
      </el-pagination>
    </template>
  </ns-page-table>
</template>

<script>
import NsTableRepeatCustomer from './src/NsTableRepeatCustomer.js'
import NsGuideDialog from '@/components/NsGuideDialog'
NsTableRepeatCustomer.components = {
  NsGuideDialog
}
export default NsTableRepeatCustomer
</script>
<style scoped>
@import "@theme/variables.pcss";

.scope_row_count {
  color: blue;
}

.tips {
  color: var(--theme-color-danger);
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
.day-view {
  display: inline-block;
  .base-text {
    font-size: 14px;
    color: #595959;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 9px;
    cursor: pointer;
  }
  .base-text-select {
    color: #0091fa;
    background: #f5fbff;
  }
  .base-un-active {
    color: #595959;
    background-color: white;
  }
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
.template-search__box {
  width: 182px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
}
.template-search__box span {
  width: 141px;
  height: 27px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
  margin-left: var(--default-margin-small);
}
</style>
