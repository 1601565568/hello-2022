<template>
  <div>
    <page-table title=''>
      <!-- 分类 start -->
      <div class='title-tab' slot='tab'>
        <!-- <div class='tab-content'>
          <template v-for='item in tabList'>
            <span :class='`tab-item ${item.id === model.profileId ? "active":""}`' :key='item.id' @click='changeSearchfrom({profileId:item.id})'>{{item.name}}</span>
          </template>
        </div> -->
        <el-tabs :value="model.profileId+''" @tab-click='handleTab'>
          <template v-for='item in tabList'>
            <el-tab-pane :key='item.id' :name="item.id+''" :label='item.name'></el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <!-- 分类 end -->
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="样式：" class='el-form__change' v-if='model.profileId === null'>
            <el-select v-model="model.style" placeholder="请选择" @change='(value)=>{changeSearchfrom({style:value})}'>
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间：" class='el-form__change'>
            <el-date-picker
              v-model="seachDate"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-select v-model="model.founderId" placeholder="请选择" @change='(value)=>{changeSearchfrom({founderId:value})}'>
              <el-option
                v-for="item in createrList"
                :key="item.founderId"
                :label="item.name"
                :value="item.founderId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.content" placeholder="请输入内容"  @keyup.enter.native="handleSearch(model.content)" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch(model.content)"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleDetail('')">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <template v-if='model.profileId === null'>
            <AllTable ref='allTable' :data='_data._table.data' @onDelect='onDelect' @onDetail='handleDetail' @onPreview='handlePreviewGuide'/>
          </template>
          <template v-else>
            <EachTable ref='eachTable' :data='_data._table.data' @onDelect='onDelect' @onTop='onTop' @onDetail='handleDetail' @onPreview='handlePreviewGuide'/>
          </template>
        </template>
      </template>
      <!-- 表格 end -->
      <!-- 页面 start -->
      <template slot='pagination'>
        <el-pagination v-if="_data._pagination.enable"
                        class="template-table__pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
          </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
    <!-- 选择对外信息弹框 start -->
    <el-dialog ref="friendsList" :visible.sync="visible"
               title="使用员工"
               width="960px">
      <ns-table-employee-scope v-if='visible' ref='employeeTable' :data="{guideIdList}"></ns-table-employee-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="handleChangeVisible(false)">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 选择对外信息弹框 end -->
  </div>
</template>
<script>
import Index from './src/List'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElDrawer from '@nascent/nui/lib/drawer'
import NsShopDialog from '@/components/NsShopDialog'
import AllTable from './components/List/AllTable'
import EachTable from './components/List/EachTable'
import NsTableEmployeeScope from './components/List/NsTableEmployeeScope'
Index.components = {
  PageTable, ElDrawer, NsShopDialog, NsGuideDialog, AllTable, EachTable, NsTableEmployeeScope
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .title-tab {
    margin: -10px -10px 0px;
    background-color: #fff;
    .el-tabs__item  {
      line-height: 38px;
    }
  }
  .tab-content {
    white-space: nowrap;
    &::-webkit-scrollbar-thumb {
      display: none;
    }
    .tab-item {
      padding: 0 16px;
      font-size: 14px;
      color: #595959;
      cursor: pointer;
      font-weight: normal;
      &.active {
        color: #262626;
        font-weight: bold;
      }
    }
  }
  .self-btn {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    .guideIds-icon {
      color:#C0C4CC;
    }
  }
  .search-icon {
    font-size: 25px;
  }
</style>
<style scoped>
.title-tab {
  >>> .el-tabs__item  {
    line-height: 38px;
    font-weight: 400;
    color: #595959;
    &.is-active {
      font-weight: 600;
      &:before {
        display: none;
      }
    }
  }
  >>> .el-tabs__header {
    border-bottom:none;
  }
  >>> .el-tabs__nav-next,>>> .el-tabs__nav-prev {
    line-height: 48px;
  }
  >>> .el-tabs__active-bar {
    display: none;
  }
}
</style>
