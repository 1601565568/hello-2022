<!--
 * @Descripttion: 智能欢迎语列表组件
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-08-17 16:43:50
 -->
<template>
  <ns-page-table ref="mainTable"
    ><!-- :colButton="10" -->

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
            v-model="model.name"
            :placeholder="cloudPlatformType === 'ecrp' ? '请输入昵称' : '请输入备注名'"
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
        <el-form-item :label="cloudPlatformType === 'ecrp' ? '昵称：' : '备注名：'">
          <el-form-grid>
            <el-input
              autofocus="true"
              v-model.trim="model.name"
              :placeholder="cloudPlatformType === 'ecrp' ? '请输入昵称' : '请输入备注名'"
              clearable
            ></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="选择员工：" label-width="80px">
          <div class="template-search__box">
            <span v-if="model.userIds && model.userIds.length>0">
                已选择{{model.userIds.length}}个
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
                v-model="model.userIds"
                v-if="cloudPlatformType === 'ecrp'"
              ></NsGuideDialog>
                <NsGuideWeChatDialog
                  :selfBtn='false'
                  :appendToBody='false'
                  :isButton="false"
                  :auth="true"
                  :switchAreaFlag="1"
                  type="primary"
                  btnTitle="选择"
                  dialogTitle="选择成员"
                  v-model="model.userIds"
                  v-else>
                  <!-- <template slot='selfBtn'>
                    <div class='self-btn'>
                      {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个成员`:'全部'}}
                      <Icon type="geren"
                            class='guideIds-icon'></Icon>
                    </div>
                  </template> -->
                </NsGuideWeChatDialog>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="首次添加时间：" label-width="100px">
          <el-form-grid size="xlg">
            <el-date-picker
              v-model="model.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              @change="changeTime"
              align="right"><!-- value-format="yyyy-MM-dd HH-mm-ss" :default-time="['00:00:00', '23:59:59']" -->
            </el-date-picker>
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
        <el-table-column prop="avatar" label="头像" align="left" :sortable="false" width="100">
          <template slot-scope="scope">
            <div v-if="!scope.row.avatar">
              <img src="../images/head_demo.svg" width="60" height="60"/>
            </div>
            <div v-else>
              <img :src="checkUrl(scope.row.avatar)" width="60" height="60"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="cloudPlatformType === 'ecrp' ? '昵称' : '姓名/备注名'" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}{{cloudPlatformType === 'ecrp' ? '' : `/${scope.row.remark}`}}
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="所属员工" align="center">
          <template slot-scope="scope">
            {{scope.row.COUNT}}人
          </template>
        </el-table-column>
        <el-table-column label="首次添加时间" align="center">
          <template slot-scope="scope">
            {{scope.row.add_time}}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="操作"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <ns-table-column-operate-button
              :buttons="
                scope.row.type === 9 &&
                String(scope.row.account ? scope.row.account : '') !== 'admin'
                  ? []
                  : _data._table.table_buttons
              "
              :prop="scope"
            >
            </ns-table-column-operate-button>
          </template>
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
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
NsTableRepeatCustomer.components = {
  NsGuideDialog,
  NsGuideWeChatDialog
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
