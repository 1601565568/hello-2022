<template>
  <!-- 实施状态跟踪页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.支持查看区域的门店下的导购所加的微信好友，查看好友总数、好友消费、好友成为会员数；<br>
        2.针对数据波动曲线，可以及时感知某次活动下的好友变化，沉淀成功经验；<br>
        3.好友会员数指好友成为会员的数量，好友购买率指下过订单的好友与全部好友的占比。<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="advancedSearch">
        <el-form label-width="90px"
                 :inline="true" :model="model">
          <el-form-item label="体系：" label-width="60px">
            <view-select :showTitle="false" :viewList="viewList" ref="viewSelect" v-model="model.viewId" @change="viewChange"/>
          </el-form-item>
          <el-form-item label="工作门店：">
            <!-- <el-form-grid size="md">
              <ns-droptree ref="shopCateTree" placeholder="请选择门店分类" :lazy="true" :data="shopAreaData" :filter-lazy-nodes="filterShopArea" :load="loadShopAreaNode" :multiple="false" v-model="model.shopArea" clearable></ns-droptree>
            </el-form-grid> -->
            <el-form-grid size="md" style="margin-left:10px">
              <el-select-load v-model="model.shopId" :options="shopOptions" filterable clearable :page-sizes="20" placeholder="选择门店">
              </el-select-load>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="员工姓名：">
            <el-form-grid size="md">
              <el-input el-input v-model.trim="model.userName" placeholder="请输入员工姓名" maxlength="20"></el-input>
            </el-form-grid>
          </el-form-item>
          <!--<el-form-item label="个人微信号：">
            <el-form-grid size="md">
              <el-input el-input v-model.trim="model.wxNo" placeholder="请输入个人微信号" maxlength="20"></el-input>
            </el-form-grid>
          </el-form-item>-->
          <el-form-item label="时间筛选：">
            <el-form-grid>
              <ns-datetime type="date" v-model="model.time" size="md"  :clearable="false">
              </ns-datetime>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="onSearch">{{$t('operating.search')}}</ns-button>
            <ns-button @click="reset">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <div class="template-table__main" v-loading="loadingtable">
          <!-- 暂无数据结构 -->
          <div class="no-data" v-if="!isChart">
            <ns-no-data>{{$t('prompt.noData')}}</ns-no-data>
          </div>
          <template v-if="isChart">
            <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
          </template>
        </div>
      </template>
      <!-- 表格-结束 -->
    </ns-page-table>
    <div class="template-page__table content-style">
      <div class="page-block__title">
        <p class="el-inline-block">
          数据报表
        </p>
       <ns-button v-if="isChart" type="text" class="float-right clearfix" @click="onExportReport"><Icon type="download" />导出报表</ns-button>
      </div>
     <el-table stripe :data="tableData" style="width: 100%" v-loading="loadingtable">
        <el-table-column prop="date" width="110" label="日期" align="center">
        </el-table-column>
       <el-table-column prop="allFriendsCount" label="总好友数" align="right">
       </el-table-column>
       <el-table-column prop="newAddFriendsCount" label="新增好友数" align="right">
       </el-table-column>
       <el-table-column prop="allMemberCount" label="好友会员总数" align="right">
       </el-table-column>
       <el-table-column prop="newAddMemberCount" label="新增好友会员数" align="right">
       </el-table-column>
       <el-table-column prop="friendsPayments" label="好友付款金额" align="right">
       </el-table-column>
       <el-table-column prop="friendsPaymentsUnit" label="好友客单价" align="right">
       </el-table-column>
       <el-table-column prop="friendsPaymentsRadio" label="好友购买率" align="right">
       </el-table-column>
      </el-table>
    </div>
    <ns-export-report ref="exportData"></ns-export-report>
  </div>
  <!-- /实施状态跟踪页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .template-page__table {
    margin-top: var(--default-margin-small);
    h3 {
      height: 45px;
      line-height: 50px;
      font-size: var(--dafault-font-size-xlarge);
      font-weight: normal;
    }

    .padding-base {
      >>> .el-table--group, >>> .el-table--border {
        &:not(:first-child) {
          border-top: none;
        }
      }
    }
  }
  .template-table__main {
    background-color: var(--theme-color-white);
  }

  .analysis-content {

    box-shadow: var(--default-box-shadow-base);

    >>> .echarts {
      overflow: hidden;
    }

    /* 组织架构树组件样式优化 */

    >>> .vo-basic {
      top: 0 !important;
      overflow: inherit !important;

      .orgchart {
        .topLine, .rightLine, .downLine, .leftLine {
          border-width: 1px;
          border-color: var(--theme-base-border-color-primary);
        }

        .downLine {
          width: 1px;
          background-color: var(--theme-base-border-color-primary);
        }

        .node {
          width: 140px;
          padding: 0;
          margin: 0 var(--default-margin-base);
          border-radius: var(--default-radius-mini);
          border: 1px solid var(--theme-base-border-color-primary);

          &.focused, &:hover {
            background-color: transparent;
          }

          .title {
            height: auto;
            padding: var(--default-padding-base) 0;
            background-color: var(--theme-color-primary);
          }

          &.bg-success {
            .title {
              background: var(--theme-color-success);
            }
          }

          &.bg-warning {
            .title {
              background: var(--theme-color-warning);
            }
          }

          &.text-secondary {
            .right-part {
              color: var(--theme-font-color-secondary);
            }
          }

          i {
            display: none;
          }

          .info-list {
            display: flex;
            align-items: center;

            div {
              flex: 1;
            }
          }

          p {
            color: var(--theme-font-color-secondary);
            font-size: var(--default-font-size-small);
          }

          span {
            color: var(--theme-color-warning);
          }
        }
      }
    }
  }
</style>
