<template>
  <div>
    <template>
      <div class='title-box'>
        <div class='title-analysis'>企业信息栏效果分析</div>
        <div class='title-right'>
          <el-radio-group v-model="analysisDays" @change="onClickEchatsTime" class='float-left'>
            <el-radio-button label="1">昨天</el-radio-button>
            <el-radio-button label="2">7天</el-radio-button>
            <el-radio-button label="3">近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            class="float-right"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format = "timestamp"
            :unlink-panels = true
            :default-time="['00:00:00', '00:00:00']">
          </el-date-picker>
        </div>
      </div>
    </template>
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下门店名称/导购姓名" clearable
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
              <!-- 后端返回的是组件，不建议增加status字段 -->
              <!-- <span class="text-error">{{node.status === 2 ? '(员工已离职)':''}}</span> -->
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
        </el-pagination>
      </div>
      <div class="template-page__row-right">
        <page-table title='数据分析' class='title-tab_box'>
          <!-- 分类 start -->
          <div class='title-tab' slot='title'>
            <template v-for='item in tabList'>
              <div :class='`tab-item ${item.id === checkedTab ? "active":""}`' :key='item.id' @click='handleChangeTab(item.id)'>{{item.label}}</div>
            </template>
          </div>
          <!-- 分类 end -->
        </page-table>
        <!-- 数据图表 start -->
        <ns-data-analysis-charts ref="table" :url="$api.weWork.weWorkCustomer.queryAnalysisListByDate"></ns-data-analysis-charts>
        <!-- 数据图表 end -->
      </div>
    </div>
  </div>
</template>
<script>
import Index from './src/Analysis'
import NsDataAnalysisCharts from './NsDataAnalysisCharts'
import PageTable from '@/components/NewUi/PageTablePro'
Index.components = {
  PageTable, NsDataAnalysisCharts
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
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
  .title-tab {
    display: flex;
    margin-left: 16px;
    position: relative;
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
</style>
