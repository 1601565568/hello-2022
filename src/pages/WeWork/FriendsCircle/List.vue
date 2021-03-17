<template>
  <div>
    <page-table title='数据分析'>
      <!-- 分类 start -->
      <div class='title-tab' slot='title'>
        <div class='tab-content'>
          <template v-for='item in tabList'>
            <span :class='`tab-item ${item.id === model.profileId ? "active":""}`' :key='item.id' @click='changeSearchfrom({profileId:item.id})'>{{item.name}}</span>
          </template>
        </div>
      </div>
      <!-- 分类 end -->
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="样式：" class='el-form__change'>
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
        <ns-button type="primary" size='large' @click="handleDetail({})">新建</ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <template v-if='model.profileId === null'>
            <AllTable ref='allTable' :data='_data._table.data' @onDelect='onDelect' @onDetail='handleDetail'/>
          </template>
          <template v-else>
            <EachTable ref='eachTable' :data='_data._table.data' @onDelect='onDelect' @onTop='onTop' @onDetail='handleDetail'/>
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
Index.components = {
  PageTable, ElDrawer, NsShopDialog, NsGuideDialog, AllTable, EachTable
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .title-tab {
    position: relative;
    margin-left: 16px;
    overflow-x: scroll;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      height: 24px;
      width: 1px;
      margin-top: -12px;
      background: #E8E8E8;
    }
  }
  .tab-content {
    white-space: nowrap;
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
</style>
