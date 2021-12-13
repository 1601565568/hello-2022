<template>
  <div class='friendCircle'>
    <template>
      <div class="title-box">
        <div class="title-analysis">对外信息效果分析</div>
        <div class="title-right">
          <div class='shop-content'>
            <span>参与门店：</span>
            <shopSelect @callBack="handleChangeShop" :hasShopArr="shopList" shopStatus='1,-1' isDIYBtn :areaId='areaId' :areaName='areaName'>
              <template slot='btnIcon'>
                <div class='self-btn'>
                  {{(shopList&&shopList.length)?`已选择${shopList.length}个门店`:'全部'}}
                  <Icon type="shop" class='guideIds-icon'></Icon>
                </div>
              </template>
            </shopSelect>
          </div>
          <el-tabs class="title-right_time" v-model="dateValue" :timeModel="model" @tab-click="handleChangeDateType">
            <el-tab-pane v-for="item in dateList" :label="item.label" :name="item.value" :key="item.value"></el-tab-pane>
          </el-tabs>
          <div class="title-right_picker">
            <el-date-picker
              :datePickerModel="model"
              v-model="date"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              @change='handleChangeDateValue'
              :picker-options="pickerOptions"
              align="right">
            </el-date-picker>
          </div>
        </div>
      </div>
    </template>
    <div class="template-page__row">
      <div class="template-page__row-left">
        <AreaTree v-model='areaId' @input='onClickNode' @inputName='(value)=>{areaName = value}'/>
        <!-- <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下门店名称" clearable
                  @keyup.enter.native="initShopList(1)">
          <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="initShopList(1)"/>
        </el-input>
        <div style="display: flex;padding-left: 8px" class="changeShopStatus">
          <p style="margin-right: 5px">状态:</p>
          <el-checkbox-group @change="changeShopStatus" v-model="checkStatusList">
            <el-checkbox label =  '1' >正常</el-checkbox>
            <el-checkbox label = '-1' >暂停</el-checkbox>
            <el-checkbox label = '-2' >关店</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
          <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
                   node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                   :filter-node-method="onFilterNode" @node-click="onClickNode">
            <div class="subdivision-tree-node" slot-scope="{ node }" >
              <span>{{node.label}}</span>
              <span v-if="node.label === '全部'"></span>
            </div>
          </el-tree>
        </el-scrollbar>
        <el-pagination style='text-align: center' small
                       :total="shopTreePage.total"
                       :page-size="shopTreePage.size"
                       layout="prev, slot, next, jumper"
                       :current-page.sync="shopTreePage.page"
                       @current-change="initShopList">
          <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
        </el-pagination> -->
      </div>
      <div class="template-page__row-right">
        <!-- 分类 start -->
        <div class='title-tab' slot='tab'>
          <el-tabs :value="modelTab.profileId+''" @tab-click='handleTab'>
            <template v-for='item in tabList'>
              <el-tab-pane :key='item.id' :name="item.id+''" :label='item.name'></el-tab-pane>
            </template>
          </el-tabs>
        </div>
        <!-- 分类 end -->
        <!-- 数据图表 start -->
          <ns-data-analysis-charts ref="table" :date="date" :url="$api.weWork.friendsCircle.logPageByType" :areaId='areaId'></ns-data-analysis-charts>
        <!-- 数据图表 end -->
      </div>
    </div>
  </div>
</template>
<script>
import Index from './src/Analysis'
import NsDataAnalysisCharts from './NsDataAnalysisCharts'
import PageTable from '@/components/NewUi/PageTablePro'
import AreaTree from '@/components/NewUi/AreaTree'
import shopSelect from '../../Guide/components/selectShops'
Index.components = {
  PageTable, NsDataAnalysisCharts, AreaTree, shopSelect
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  ::v-deep .el-tabs__header{
    border-bottom: none;
  }
  ::v-deep .el-tabs__item.is-active:before{
    border-bottom: none;
  }
  ::v-deep .el-tabs__active-bar{
    background-color: transparent !important;
  }
  ::v-deep .title-right_time .el-tabs__item.is-active{
    text-align:center;
    color: #0091FA;
    background: #F5FBFF;
    border-radius: 4px;
    font-weight: 500;
  }
  ::v-deep .title-right_time .el-tabs__item{
    color: #595959;
    font-weight: 400;
    padding: 2px 13px 2px 13px;
    line-height: 28px;
  }
  ::v-deep .el-tabs__nav-prev{
    line-height: 62px;
    left: 12px;
  }
  ::v-deep .el-tabs__nav-next{
    line-height: 62px;
    right: 12px;
  }
  .title-tab {
    ::v-deep .el-tabs__item  {
      line-height: 51px;
      font-weight: 400;
      color: #262626;
      &.is-active {
        font-weight: 600;
        background: #fff;
        &:before {
          display: none;
        }
      }
    }
  }
  .title-right_picker{
    padding-top: 2px;
    padding-left: 24px;
    position: relative;
    &::before {
      content: " ";
      position: absolute;
      left: 6px;
      top: 50%;
      height: 20px;
      width: 1px;
      margin-top: -10px;
      background: #E8E8E8;
    }
  }
  .title-right{
    display: flex;
    .title-right_time{
      font-size: 14px;
      font-weight: 500;
    }
  }
  .template-page__row-right{
    overflow-x: hidden;
    margin-left: 16px;
    width:calc(100vw - 527px)
  }
  .title-box{
    display: flex;
    height: 48px;
    background: #FFFFFF;
    margin: -10px -10px 16px;
    justify-content: space-between;
    align-items: center;
    .title-analysis{
      font-size: 16px;
      margin-left:16px;
      font-weight: bold;
      color: #262626;
    }
    .title-right{
      margin-right:16px;
    }
  }
  ::v-deep .template-table__bar-name{
    margin: 0px 0px 0px 6px;
  }
  .tab-content-left{
    padding: 0 16px;
    font-size: 16px;
    color: #262626;
    line-height: 24px;
    font-weight: 600;
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
  .changeShopStatus >>> .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #606266!important;
  }
  .template-page__row-left {
    position: relative;
  }
  .shop-content {
    display: flex;
    font-size: 14px;
    border: 1px solid #D9D9D9;
    height: 32px;
    align-items: center;
    padding: 0 8px;
    border-radius: 2px;
    margin-right: 16px;
  }
  .self-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    .guideIds-icon {
      margin-left: 10px;
      color:#8C8C8C;
    }
  }
</style>
<style scoped>
.friendCircle >>> .el-pagination{
  box-shadow: none;
}
</style>
