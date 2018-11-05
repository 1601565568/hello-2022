<template>
  <ns-page-table @view-chat="$emit('view-chat', obj)" @edit-affair="$emit('edit-affair', obj)" @handle-affair="$emit('handle-affair', obj)" @order-list="$emit('order-list', obj)">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-button type="primary">新建事务</ns-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model="quickSearchModel.nickname" placeholder="请输入客户昵称" @keyup.enter.native="$quickSearchAction$('nickname')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('nickname')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="客户昵称：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.customerNickname">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="事务类型：">
          <el-form-grid size="xmd">
            <ns-select  v-model="model.affairsType" filterable clearable placeholder=""
                        :multiple="false"  :url="$api.core.common.queryPlatForm">
            </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="事务编号：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.affairsNumber"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.orderNumber"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发起人：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model.trim="model.initiator" disabled>
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="处理人：">
          <el-form-grid size="xmd">
            <ns-select  v-model="model.processingPerson" filterable clearable placeholder=""
                        :multiple="false"  :url="$api.core.common.queryPlatForm">
            </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="处理状态：">
          <el-form-grid size="xmd">
            <ns-select  v-model="model.processingState" filterable clearable placeholder=""
                        :multiple="false" :url="$api.database.trade.getOutState">
            </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="优先级：">
          <el-form-grid size="xmd">
            <ns-select  v-model="model.priority" filterable clearable placeholder=""
                        :multiple="false"  :url="$api.core.common.queryPlatForm">
            </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="描述关键字：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.keyWord">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建时间：" class="el-inline-block">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="model.created" key="created"></ns-datetime>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <div class="template-table__main padding-base">
        <el-tabs v-model="affairsState" @tab-click="tabStateClick">
          <el-tab-pane name="toSolved">
            <span slot="label">
              <el-badge :value="listNumber.toSolvedNumber" :max="99" class="item">
                待解决
              </el-badge>
            </span>
          </el-tab-pane>
          <el-tab-pane name="inSolved">
            <span slot="label">
              <el-badge :value="listNumber.inSolvedNumber" :max="99" class="item">
                解决中
              </el-badge>
            </span>
          </el-tab-pane>
          <el-tab-pane name="resolved">
            <span slot="label">
              <el-badge :value="listNumber.resolvedNumber" :max="99" class="item">
                已解决
              </el-badge>
            </span>
          </el-tab-pane>
          <el-tab-pane name="superExpectation">
            <span slot="label">
              <el-badge :value="listNumber.superExpectationNumber" :max="99" class="item">
                超预期
              </el-badge>
            </span>
          </el-tab-pane>
        </el-tabs>
        <!-- 排序按钮 -->
        <div class="sort-group">
          <ns-button type="text" @click="sortByClick('sortCost')" :class="{'active': sortCost}">额外成本<i class="iconfont" :class="sortCost&&iconState ? 'icon-topArr' : 'icon-downArr'"></i></ns-button>
          <ns-button type="text" @click="sortByClick('sortPriority')" :class="{'active': sortPriority}">优先级<i class="iconfont" :class="sortPriority&&iconState ? 'icon-topArr' : 'icon-downArr'"></i></ns-button>
          <ns-button type="text" @click="sortByClick('sortEstablish')" :class="{'active': sortEstablish}">创建时间<i class="iconfont" :class="sortEstablish&&iconState ? 'icon-topArr' : 'icon-downArr'"></i></ns-button>
          <ns-button type="text" @click="sortByClick('sortOverdue')" :class="{'active': sortOverdue}">超期时间<i class="iconfont" :class="sortOverdue&&iconState ? 'icon-topArr' : 'icon-downArr'"></i></ns-button>
        </div>
        <!-- 操作按钮 -->
        <div class="padding-base">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"></el-checkbox>
          <ns-button type="text">批量处理选中事务</ns-button>
          <ns-button type="text">导出所有数据</ns-button>
          <ns-button type="text">导出选中数据</ns-button>
          <ns-button type="text">批量删除选中事务</ns-button>
          <ns-button type="text">批量选中会员另存为分组</ns-button>
        </div>

        <!-- 事务列表 -->
        <input id="copyVal" class="copy-val"> <!-- 复制内容存放处 -->
        <!-- 暂无数据 -->
        <!-- <ns-no-data height="200" >{{$t('prompt.noData')}}</ns-no-data> -->

        <el-checkbox-group v-model="checkedList">
          <ul class="affairs-list">
            <!-- 事务列表-优先级类名 low-priority（低优先级）、middle-priority（中优先级）、high-priority （高优先级）-->
            <li v-for="list in dataList" :class="list.priority + '-priority'">
              <!-- 事务列表头部内容 -->
              <div class="list-head clearfix">
                <el-checkbox ></el-checkbox>
                <span class="list-head__number">
                  编号：{{list.number}}
                </span>
                <span class="list-head__type">
                  类型：{{list.type}}
                </span>
                <span class="list-head__info">
                  <!-- 客户信息及客户详情 -->
                  <el-popover
                    :title="'客户信息(' + list.name + ')'"
                    width="500"
                    trigger="hover">
                    <el-form label-width="80px" class="text-form-unique">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="姓名：">
                            <el-form-grid size="md">-</el-form-grid>
                          </el-form-item>
                          <el-form-item label="信用等级：">
                            <el-form-grid size="md">
                              <!-- 点击信用等级跳转页面 -->
                              <a target="_blank" href="#">
                                <!-- 信用等级图标类名，级数对应类名后面数字，如 credit-star2 为二星级 -->
                                <!-- credit-star1（星级-一星级）、credit-jewel1（钻石级-一钻石级）、credit-crown1（皇冠级-一皇冠级）、credit-goldCrown1（金冠级-一金冠级） -->
                                <el-tooltip effect="light" content="查看该买家的所有评价">
                                  <i class="credit-icon credit-goldCrown1"></i>
                                </el-tooltip>
                              </a>
                            </el-form-grid>
                          </el-form-item>
                          <el-form-item label="生日：">
                            <el-form-grid size="md">-</el-form-grid>
                          </el-form-item>
                          <el-form-item label="会员等级：">
                            <el-form-grid size="md">
                              <!-- gradeZero-icon 对应等级0，依次类推 -->
                              <i class="affairs-icon gradeZero-icon" v-if="list.level === 0"></i>
                              <i class="affairs-icon gradeOne-icon" v-if="list.level === 1"></i>
                              <i class="affairs-icon gradeTwo-icon" v-if="list.level === 2"></i>
                              <i class="affairs-icon gradeThree-icon" v-if="list.level === 3"></i>
                              <i class="affairs-icon gradeFour-icon" v-if="list.level === 4"></i>
                              <i class="affairs-icon gradeFive-icon" v-if="list.level === 5"></i>
                              <i class="affairs-icon gradeSix-icon" v-if="list.level === 6"></i>
                            </el-form-grid>
                          </el-form-item>
                          <el-form-item label="电话：">
                            <el-form-grid size="md">15310001000 <i class="affairs-icon phone"></i></el-form-grid>
                          </el-form-item>
                          <el-form-item label="省市：">
                            <el-form-grid size="md">浙江省杭州市江干区</el-form-grid>
                          </el-form-item>
                          <el-form-item label="地址：">
                            <el-form-grid size="md">九堡镇东方电子商务园 6幢四楼南讯软件</el-form-grid>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="累计消费：">
                            <el-form-grid size="md">0.00元(0笔)</el-form-grid>
                          </el-form-item>
                          <el-form-item label="关闭：">
                            <el-form-grid size="md">0.00元(0笔)</el-form-grid>
                          </el-form-item>
                          <el-form-item label="下单时间：">
                            <el-form-grid size="md">2018-05-03 15:33:55</el-form-grid>
                          </el-form-item>
                          <el-form-item label="订单状态：">
                            <el-form-grid size="md">等待卖家发货</el-form-grid>
                          </el-form-item>
                          <el-form-item label="订单金额：">
                            <el-form-grid size="md">0.10元(含快递：0.00元)</el-form-grid>
                          </el-form-item>
                          <el-form-item label="在本店最近一笔交易记录：" label-width="150px">
                            <el-form-grid size="md">
                              <el-tooltip effect="light" content="查看订单详情">
                                <ns-button type="text"><i class="iconfont icon-chakanwenjian"></i></ns-button>
                              </el-tooltip>
                            </el-form-grid>
                          </el-form-item>
                          <el-form-item label="事务处理：">
                            <el-form-item label="待解决：" label-width="70px">
                              <el-form-grid>
                                <ns-button type="text">3条</ns-button>
                              </el-form-grid>
                            </el-form-item>
                            <el-form-item label="解决中：" label-width="70px">
                              <el-form-grid>
                                <ns-button type="text" class="text-info">3条</ns-button>
                              </el-form-grid>
                            </el-form-item>
                            <el-form-item label="已解决：" label-width="70px">
                              <el-form-grid>
                                <ns-button type="text" class="text-success">3条</ns-button>
                              </el-form-grid>
                            </el-form-item>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <!-- 点击客户名称跳转页面 -->
                    <a target="_blank" slot="reference" href="#" class="contact-link">
                      <img border="0" src="https://amos.alicdn.com/online.aw?v=2&amp;site=cntaobao&amp;s=2&amp;charset=utf-8&amp;uid=koike99">
                      <span>{{list.name}}</span>
                    </a>
                  </el-popover>
                  <!-- 客户信息及客户详情-结束 -->
                  <el-tooltip content="点击复制客户名称" effect="light">
                    <i class="iconfont icon-copy" @click="copyName(list.name)">
                    </i>
                  </el-tooltip>

                  <el-tooltip content="点击查看聊天记录" effect="light">
                    <i class="iconfont icon-liaotian" @click="viewChat(list.name)"></i>
                  </el-tooltip>

                  <el-tooltip content="查看所有订单详情" effect="light">
                    <i class="iconfont icon-chakanwenjian" @click="orderList(list.name)"></i>
                  </el-tooltip>

                  <el-tooltip content="VIP等级名称" effect="light">
                    <i class="affairs-icon gradeZero-icon" v-if="list.level === 0"></i>
                    <i class="affairs-icon gradeOne-icon" v-if="list.level === 1"></i>
                    <i class="affairs-icon gradeTwo-icon" v-if="list.level === 2"></i>
                    <i class="affairs-icon gradeThree-icon" v-if="list.level === 3"></i>
                    <i class="affairs-icon gradeFour-icon" v-if="list.level === 4"></i>
                    <i class="affairs-icon gradeFive-icon" v-if="list.level === 5"></i>
                    <i class="affairs-icon gradeSix-icon" v-if="list.level === 6"></i>
                  </el-tooltip>
                </span>
                <span class="list-head__time">
                  预期解决时间：{{list.time}}
                </span>
                <span class="list-head__others">
                  <span>
                    额外成本：{{list.cost}}
                  </span>
                  <span>
                    状态：{{list.state}}
                  </span>
                </span>
              </div>
              <div class="list-body">
                {{list.intro}}
              </div>
              <!-- 事务列表中部介绍 -->
              <div class="list-foot clearfix">
                <span class="list-foot__handle">
                  {{list.handleTitle}}：<span class="text-info">{{list.handleContent}}</span>
                </span>
                <span class="list-foot__lastUpdate">
                  最后更新：<span>{{list.lastUpdateBy}}</span><span>{{list.lastUpdateTime}}</span>
                </span>
                <span class="float-right">
                  <el-popover
                    title="处理日志"
                    width="300"
                    trigger="hover">
                    <el-form label-width="80px" class="text-form-unique" :inline="true">
                      <el-form-item label="客服：">
                        <el-form-grid size="md">林桂华</el-form-grid>
                      </el-form-item>
                      <el-form-item label="时间：">
                        <el-form-grid size="md">
                          2018-08-02 10:51
                        </el-form-grid>
                      </el-form-item>
                      <el-form-item label="处理信息：" class="el-block">
                        都是对的
                      </el-form-item>
                    </el-form>
                    <!-- 处理事务按钮及处理信息 -->
                    <ns-button type="primary" slot="reference" @click="handleAffair(list.name)">处理</ns-button>
                  </el-popover>
                  <ns-button type="primary" @click="editAffair(list.name)">修改</ns-button>
                  <ns-button type="danger">删除</ns-button>
                </span>
              </div>
              <!-- 事务列表底部处理信息 -->
            </li>
          </ul>
        </el-checkbox-group>
      </div>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
  import NsTableAffairs from './src/NsTableAffairs'

  export default NsTableAffairs
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  /* 事务列表样式 */
  .copy-val {
    position: absolute;
    top: -1000px;
    opacity: 0;
    z-index: -1000;
  }
  .template-table__main {
    position: relative;
    background: var(--theme-color-white);
    padding-bottom: 0;
    .sort-group {
      position: absolute;
      right: 15px;
      top: 5px;
      line-height: 41px;
      .el-button--text {
        color: var(--theme-font-color-primary);
        &.active {
          color: var(--theme-color-primary);
        }
      }
      i {
        font-size: var(--default-font-size-small);
      }
    }
    >>> .el-tabs {
      .el-tabs__header {
        border-bottom: none;
        background: var(--theme-bg-color-base);
        .el-tabs__item {
          padding: 5px 20px;
        }
        .el-badge__content.is-fixed {
          top: 7px;
          right: 0;
          border: none;
        }
      }
    }
    >>> .affairs-list {
      padding: 0;
      list-style: none;
      li {
        font-size: var(--default-font-size-small);
        line-height: var(--default-form-item-small-height);
        border: 1px solid var(--theme-base-border-color-primary);
        border-radius: var(--default-radius-mini);
        &:not(:last-child) {
          margin-bottom: var(--default-margin-base);
        }
        .list-head {
          padding: 0 var(--default-padding-base);
          background: var(--theme-bg-color-base);
          > span {
            float: left;
            display: inline-block;
          }
          .el-checkbox {
            float: left;
            line-height: 26px;
          }
          .list-head__number {
            width: 16%;
            min-width: 150px;
          }
          .list-head__type {
            width: 16%;
            min-width: 150px;
          }
          .list-head__info {
            width: 300px;
            user-select: none;
            .contact-link {
              cursor: pointer;
              position: relative;
              padding-left: 20px;
              color: var(--theme-font-color-secondary);
              span {
              }
              &:hover {
                color: var(--theme-base-link-color-hover);
              }
              img {
                position: absolute;
                top: 0;
                left: 0;
              }
            }
            i {
              cursor: pointer;
              margin-left: 3px;
            }
          }
          .list-head__others {
            float: right;
            span + span {
              margin-left: var(--default-margin-larger);
            }
          }
        }
        .list-body {
          padding: var(--default-padding-base) var(--default-padding-base) 0 30px;
        }
        .list-foot {
          padding: var(--default-padding-base) var(--default-padding-base) var(--default-padding-base) 30px;
          .list-foot__handle {
            display: inline-block;
            width: 275px;
          }
          .list-foot__lastUpdate {
            span + span {
              margin-left: var(--default-margin-larger);
            }
          }
          .float-right {
            >span {
              margin-right: var(--default-margin-base);
            }
          }
        }
        &.middle-priority {
          border-color: color(var(--theme-color-primary) a(70%));
          .list-head {
            background: color(var(--theme-color-primary) a(15%));
          }
        }
        &.high-priority {
          border-color: color(var(--theme-color-danger) a(70%));
          .list-head {
            background: color(var(--theme-color-danger) a(15%));
          }
        }
      }
    }
  }
  /* 图标(会员等级及手机图标) */
  i.affairs-icon {
    cursor: default!important;
    display: inline-block;
    width: 17px;
    height: 16px;
    margin: 0;
    vertical-align: sub;
    background: url('src/small-icon.png') no-repeat;
    /* 会员等级 */
    &.gradeZero-icon {
      background-position: -1px -21px;
    }
    &.gradeOne-icon {
      background-position: -20px -21px;
    }
    &.gradeTwo-icon {
      background-position: -40px -21px;
    }
    &.gradeThree-icon {
      background-position: -61px -21px;
    }
    &.gradeFour-icon{
      background-position: -82px -21px;
    }
    &.gradeFive-icon{
      background-position: -1px -39px;
    }
    &.gradeSix-icon{
      background-position: -20px -39px;
    }
    /* 会员等级-结束 */

    /* 手机图标 */
    &.phone {
      background-position: 0 -2px;
    }
  }
  /* 图标(信用等级) */
  i.credit-icon {
    display: inline-block;
    width: 17px;
    height: 16px;
    margin: 0;
    vertical-align: sub;
    background: url('src/rank_combine.png') no-repeat;
    /* 星级图标 */
    &.credit-star1 {
      background-position: 0 2px;
      width: 18px;
    }
    &.credit-star2 {
      background-position: 0 -16px;
      width: 36px;
    }
    &.credit-star3 {
      background-position: 0 -32px;
      width: 54px;
    }
    &.credit-star4 {
      background-position: 0 -48px;
      width: 72px;
    }
    &.credit-star5 {
      background-position: 0 -64px;
      width: 90px;
    }
    /* 星级图标-结束 */
    /* 钻石图标 */
    &.credit-jewel1 {
      background-position: 0 -78px;
      width: 18px;
    }
    &.credit-jewel2 {
      background-position: 0 -94px;
      width: 36px;
    }
    &.credit-jewel3 {
      background-position: 0 -110px;
      width: 54px;
    }
    &.credit-jewel4 {
      background-position: 0 -126px;
      width: 72px;
    }
    &.credit-jewel5 {
      background-position: 0 -142px;
      width: 90px;
    }
    /* 钻石图标-结束 */
    /* 皇冠图标 */
    &.credit-crown1 {
      background-position: 0 -160px;
      width: 18px;
    }
    &.credit-crown2 {
      background-position: 0 -179px;
      width: 36px;
    }
    &.credit-crown3 {
      background-position: 0 -197px;
      width: 54px;
    }
    &.credit-crown4 {
      background-position: 0 -216px;
      width: 72px;
    }
    &.credit-crown5 {
      background-position: 0 -235px;
      width: 90px;
    }
    /* 皇冠图标-结束 */
    /* 金冠图标 */
    &.credit-goldCrown1 {
      background-position: 0 -254px;
      width: 18px;
    }
    &.credit-goldCrown2 {
      background-position: 0 -272px;
      width: 36px;
    }
    &.credit-goldCrown3 {
      background-position: 0 -291px;
      width: 54px;
    }
    &.credit-goldCrown4 {
      background-position: 0 -311px;
      width: 72px;
    }
    &.credit-goldCrown5 {
      background-position: 0 -329px;
      width: 90px;
    }
    /* 金冠图标-结束 */
  }
  /* 事务处理按钮文字颜色 */
  .text-form-unique {
    .el-button--text {
      color: var(--theme-font-color-primary);
    }
    .el-button--text.text-info {
      color: var(--theme-color-primary);
    }
    .el-button--text.text-success {
      color: var(--theme-color-success);
    }
  }
</style>
