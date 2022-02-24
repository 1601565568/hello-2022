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
      <!-- <template slot="buttons" style="margin-bottom: 0; border-radius: 0; margin-bottom: 12px">
        <ns-button @click="openFile">导出文件</ns-button>
        <ns-button @click="() => {this.$emit('Reminder')}" type="primary">提醒设置</ns-button>
      </template> -->
    <template slot="advancedSearch">
      <el-form
        :model="model"
        :inline="true"
        class='form-inline_top'
      >
        <el-form-item label="时间：" class='el-form__change'>
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
            <div class="date-view">
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
            </div>
        </el-form-item>
        <!-- <el-form-item label="员工：" style="margin-left: 16px">
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
        </el-form-item> -->
        <el-form-item :label="cloudPlatformType==='kd'?'企业微信成员:':'门店/员工:'" class="nsGuide" style="margin-left: 11px">
          <NsGuideDialog :selfBtn='true'
                          :appendToBody='true'
                          :isButton="false"
                          :auth="false"
                          type="primary"
                          btnTitle=""
                          dialogTitle="选择员工"
                          v-model="model.guideIds"
                          @input="guideIdsChange"
                          v-if="cloudPlatformType !== 'kd'">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <!-- <Icon type="geren" class='xuanzeyuangong2x'></Icon> -->
                <span class="icon-xuanzeyuangong2x iconfont" style="marginLeft: 5px"></span>
              </div>
            </template>
          </NsGuideDialog>
          <NsGuideWeChatDialog :selfBtn='true'
                               :appendToBody='true'
                               :isButton="false"
                               :auth="false"
                               type="primary"
                               btnTitle=""
                               dialogTitle="选择企业微信成员"
                               v-model="model.guideIds"
                               @input="guideIdsChange"
                               v-else>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <span class="icon-xuanzeyuangong2x iconfont" style="marginLeft: 5px"></span>
              </div>
            </template>
          </NsGuideWeChatDialog>
        </el-form-item>
        <el-form-item label="事件：" style="margin-left: 16px" class='el-form__change'>
          <div class="item-select">
            <el-select
              clearable
              v-model="model.searchEventType"
              :default-first-option="true"
              @change="owenerChange"
              style="width: 120px"
            >
              <el-option
                v-for="item in chatRoomOwner"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item  style="margin-left: 16px">
          <div class="item-input">
            <el-input
              v-model.trim="model.searchGName"
              :placeholder="cloudPlatformType==='kd' ? '请输入成员/群名' : '请输入导购/群名'"
              style="width: 152px"
              @blur="chatChange"
            ></el-input>
            <Icon type="search" style="color: #C0C4CC;"></Icon>
          </div>
        </el-form-item>
        <!-- <div class="template-table__more-btn">
          <ns-button type="primary" @click.native.prevent="searchAction">搜索</ns-button>
          <ns-button @click.native.prevent="resetInputAction">重置</ns-button>
        </div>
        <ns-button @click="() => {this.$emit('Reminder')}" class="dri_t" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">提醒设置</ns-button>
        </div> -->
        <ns-button @click="() => {this.$emit('Reminder')}" class="dri_t">提醒设置</ns-button>
        <ns-button @click="openFile" class="dri_t ari">导出文件</ns-button>
      </el-form>
    </template>

    <template slot="table">
      <el-table
        :data="dataList"
        :header-cell-style="{background:'#f5f5f5'}"
        class="table_time"
      >
        <el-table-column prop="created" label="好友流失时间" align="left">
        </el-table-column>
        <el-table-column label="员工所属门店" align="center" v-if="cloudPlatformType === 'ecrp'">
          <template slot-scope="scope">
            <el-tooltip
              placement="top-start"
              :enterable="true"
              popper-class="table-body__tooltip"
            >
              <div slot="content">{{ scope.row.shopName  || '-' }}</div>
              <span class="shop_name">{{
                scope.row.shopName || '-'
              }}</span>
            </el-tooltip>
          </template>
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
        class="template-table-pagination"
        :page-sizes="pageSizes"
        :total="total"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </template>
  </ns-page-table>
</template>

<script>
import NsTableRepeatCustomer from './src/NsTableRepeatCustomer.js'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
NsTableRepeatCustomer.components = {
  NsGuideDialog,
  NsGuideWeChatDialog
}
export default NsTableRepeatCustomer
</script>
<style scoped>
@import "@theme/variables.pcss";
@import './styles/index.css';

>>> .el-form-item__label{
  line-height: 32px;
}
>>> .template-table__bar{
  box-shadow: none;
  margin-bottom: 0;
  border-radius: 0;
  padding: 16px 16px 8px 16px;
}
>>> .table_time{
  padding: 0 16px;
  padding-top: 12px;
}
.scope_row_count {
  color: blue;
}
.dri_t{
  margin-top: 4px;
  float: right;
  width: 88px;
  height: 32px;
  line-height: 32px;
  background: #0094FC;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  color: #FFFFFF;
}
.ari{
  margin-right: 16px;
  width: 88px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  font-size: 14px;
  color: #595959;
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
>>> .template-search__chooes{
  height: 32px;
  line-height: 32px;
}
.searchbtn {
  margin-left: 11px;
}
.resetbtn {
  margin-left: var(--default-margin-larger);
}
.template-table__more-btn{
  display: inline-block;
  vertical-align: middle;
}
.shop_name{
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
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
  height: 32px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
}
.template-search__box span {
  width: 141px;
  height: 31px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
  margin-left: var(--default-margin-small);
}
.self-btn {
  max-width: 150px;
  min-width: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
}
.nsGuide >>> .el-form-item__content {
  /* border: 1px solid rgb(217, 217, 217); */
  height: 32px;
  line-height: 32px;
  margin-left: 11px;
  /* padding: 0 12px; */
}
.form-inline_top {
  .el-form-item {
    border: 1px solid #D9D9D9;
    padding: 1px 8px;
    margin-right: 16px !important;
    margin-bottom: 8px;
    height: 35px;
    box-sizing: border-box;
    border-radius: 2px;
    >>> .el-input__inner {
      border: none;
      font-size: 14px;
      min-width: 90px;
      max-width: 300px;
    }
    >>> .el-input__suffix:before {
      display: none;
    }
  }
  .date-view .el-input__inner{
    border: none;
  }
}
.fuscousQA{
 background: #2153D4;
}
.fuscousIcon{
  background: #0094FC;
}
</style>
