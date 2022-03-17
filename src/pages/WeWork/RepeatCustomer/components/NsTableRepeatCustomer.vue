<!--
 * @Descripttion: 智能欢迎语列表组件
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-08-17 16:43:50
 -->
<template>
  <page-table ref="mainTable" :searchCol="24">
    <template slot='search'>
      <el-form :inline="true" :model="model" class='form-inline_top'>
        <el-form-item label="参与员工：">
          <NsGuideDialog v-if="cloudPlatformType === 'ecrp'"
            :validNull="true"
            :guideUrl="this.$api.core.sysUser.queryGuidePageByUserId"
            :guideFindUrl="this.$api.core.sysUser.guideFindUrl"
            :selfBtn='true'
            :appendToBody='true'
            :isButton="false"
            :auth="true"
            type="primary"
            btnTitle=""
            dialogTitle="选择员工"
            v-model="model.userIds"
            @input="handleChangeGuide"
            :isOpenDialogAfterRequest='true'>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.userIds&&model.userIds.length)?`已选择${model.userIds.length}个员工`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
          <NsGuideWeChatDialog
            :selfBtn='true'
            :isButton="false"
            :auth="true"
            :appendToBody="true"
            :switchAreaFlag="1"
            type="primary"
            btnTitle=""
            dialogTitle="选择成员"
            v-model="model.userIds"
            @input="handleChangeGuide"
            v-else>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.userIds&&model.userIds.length)?`已选择${model.userIds.length}个成员`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideWeChatDialog>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.name" :placeholder="cloudPlatformType === 'ecrp' ? '请输入昵称/备注名' : '请输入姓名/备注名'"  @keyup.enter.native="handleSearch">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="首次添加时间：" class='el-form__change'>
          <el-date-picker
            v-model="model.timeRange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            @change="changeTime"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </template>
    <!-- :colButton="10" -->

    <template slot="table">
      <el-table
        ref="table"
        :data="_data._table.data"
        class="new-table_border"
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
        <el-table-column :label="cloudPlatformType === 'ecrp' ? '昵称/备注名' : '姓名/备注名'" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}{{scope.row.remark ? `/${scope.row.remark}` : ''}}
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
  </page-table>
</template>

<script>
import NsTableRepeatCustomer from './src/NsTableRepeatCustomer.js'
import PageTable from '@/components/NewUi/PageTable'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
NsTableRepeatCustomer.components = {
  PageTable,
  NsGuideDialog,
  NsGuideWeChatDialog
}
export default NsTableRepeatCustomer
</script>
<style scoped>
@import "@theme/variables.pcss";
@import "./styles/reset.css";

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
<style lang="scss" scoped>
::v-deep .el-input .el-input__suffix-inner svg{
  padding: 2px;
}
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .self-btn {
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    .guideIds-icon {
      color:#C0C4CC;
    }
  }
</style>
