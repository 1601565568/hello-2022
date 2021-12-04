
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
            <ns-button type="primary"  class="searchbtn" @click="exportExcel">导出</ns-button>
          </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" type="text" style="padding-left: 10px;opacity: 0.5;color: #002041;">{{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item  prop="type">
                <el-select
                style="width:100px"
                v-model="searchform.type" placeholder="请选择"
                :clearable='false'>
                <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="date">
                <el-date-picker
                  v-if="searchform.type=='1'"
                  v-model="searchform.date"
                  type="month"
                  placeholder="请选择月份"
                  :clearable='false'
                  >
                </el-date-picker>
                <el-date-picker
                    v-if="searchform.type=='2'"
                    v-model="searchform.date"
                    type="date"
                    @change="dateTiemFun"
                    placeholder="请选择日期"
                    :clearable='false'>
                </el-date-picker>
                <el-date-picker
                  v-if="searchform.type=='3'"
                  :clearable = "false" :editable = "false"
                  type="daterange"
                  v-model="searchform.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  :default-value="currentMonth"
                  @change="handleDateChange"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" class="searchbtn">搜索</ns-button>
                <ns-button @click="resetForm('searchform')" class="resetbtn">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  <!-- 简单搜索end -->
<!-- 高级搜索start -->
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item  prop="type" label="查询类型：">
            <el-select
            style="width:100px"
            v-model="searchform.type" placeholder="请选择"
            :clearable='false'>
            <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="date">
            <el-date-picker
              v-if="searchform.type=='1'"
              v-model="searchform.date"
              type="month"
              placeholder="请选择月份"
              :clearable='false'
              >
            </el-date-picker>
            <el-date-picker
                v-if="searchform.type=='2'"
                v-model="searchform.date"
                type="date"
                placeholder="请选择日期"
                :clearable='false'>
            </el-date-picker>
            <el-date-picker
                  v-if="searchform.type=='3'"
                  :clearable = "false" :editable = "false"
                  type="daterange"
                  v-model="searchform.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  :default-value="currentMonth"
                  @change="handleDateChange"
                >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店名称：" prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称" clearable @keyup.enter.native="submitForm('searchform')"></el-input>
          </el-form-item>
          <el-form-item label="所在地区：" style="margin-right:0;" prop="area">
            <el-form-grid width="300" prop="area">
              <ns-area  :props="searchform.key" @change="onAreaChange" v-model="searchform.area" clearable></ns-area>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="状态：" prop="shopStatus">
            <el-select v-model="searchform.shopStatus"  placeholder="请选择" clearable>
              <el-option  v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：" prop="shopType">
            <el-select v-model="searchform.shopType" placeholder="请选择" clearable>
              <el-option v-for="item in shopTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
          <ns-button @click="resetForm('searchform')">重置</ns-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 高级搜索end -->
  </div>
  <!-- 筛选end -->
  <!-- table start -->
  <div class="mt5">
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%">
      <el-table-column
        label="门店名称"
        prop="shopName"
        show-overflow-tooltip
        >
        <template slot='header' scope='header'>
          <span>
            <span>{{header.column.label}}</span>
            <el-tooltip content="不显示已删除门店">
              <Icon type="question-circle"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="所在地区"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span  v-if="scope.row.province">{{scope.row.province}}</span><span v-if="scope.row.city">-{{scope.row.city}}</span><span v-if="scope.row.district">-{{scope.row.district}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="77"
        align="center"
      >
      <template slot-scope="scope">
        <span>{{scope.row.shopType|shopType}}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
        align="center"
      >
      <template slot-scope="scope">
        <span :class="scope.row.shopStatus > 0 ? 'text-success' : scope.row.shopStatus === -1 ? 'text-error' : ''">{{scope.row.shopStatus|shopStatus}}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="店长"
        align="left"
        prop="guideNames"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="已招募(人)/招募指标(人)/完成率"
        align="right"
        width="230"
      >
      <template slot="header">
        已招募(人)/招募指标(人)/完成率
        <el-tooltip content="门店招募会员总数，包括门店招募和导购端手动添加会员">
          <Icon type="question-circle"/>
        </el-tooltip>
      </template>
      <template slot-scope="scope">
        <span>{{scope.row.recruitComplete}}</span>/
        <span class="text-error">
          <span v-if="!scope.row.recruitQuota || scope.row.recruitQuota<0">
            0
          </span>
          <span v-else>
            {{scope.row.recruitQuota}}
          </span>
        </span>/<span>{{scope.row.recruitCompleteRate || '-'}}</span>
      </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="100" align="right">
        <template slot="header">
          奖励(元)
          <el-tooltip content="根据该门店奖励规则，导购可获得的招募提成之和">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.recruitPrice == 0">0.00</span>
          <a href="javascript:" @click="showRecruitDialog(scope.row.shopId, scope.row.shopName)" v-else>{{$numeral(scope.row.recruitPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="已加好友(人)/加好友指标(人)/完成率"
        align="right"
        width="250"
      >
        <template slot="header">
          已加好友(人)/加好友指标(人)/完成率
          <el-tooltip content="门店新加好友总数，好友多次添加同一名导购微信不会重复计算">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{scope.row.addfriendComplete}}</span>/
          <span class="text-error">
          <span v-if="!scope.row.addfriendQuota || scope.row.addfriendQuota<0">
            0
          </span>
          <span v-else>
            {{scope.row.addfriendQuota}}
          </span>
        </span>/<span>{{scope.row.addfriendCompleteRate || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="100" align="right">
        <template slot="header">
          奖励(元)
          <el-tooltip content="根据该门店奖励规则，导购可获得的新加好友提成之和">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.addfriendPrice == 0">0.00</span>
          <a href="javascript:" @click="showAddfriendDialog(scope.row.shopId, scope.row.shopName)" v-else>{{$numeral(scope.row.addfriendPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="销售额(元)/销售指标(元)/完成率"
        align="right"
        width="230"
      >
        <template slot="header">
          销售额(元)/销售指标(元)/完成率
          <el-tooltip content="全渠道订单中下单、提货、发货门店为当前门店的交易成功订单金额-退款成功金额">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
      <template slot-scope="scope">
        <span>{{$numeral(scope.row.sellComplete).format('0,0.00')}}</span>/<span class="text-error">
          <span v-if="!scope.row.sellQuota || scope.row.sellQuota<0">
            0
          </span>
          <span v-else>
            {{$numeral(scope.row.sellQuota).format('0,0.00')}}
          </span>
          </span>/<span>{{scope.row.sellCompleteRate || '-'}}</span>
      </template>
      </el-table-column>
      <el-table-column label="提成（元）" prop="sellPrice" width="100" align="right">
        <template slot="header">
          提成(元)
          <el-tooltip content="【成单门店为该门店且成单导购为该门店导购的成单导购提成和-退款金额提成】+【专属门店为该门店且专属导购为该门店导购的专属导购提成和-退款金额提成】">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <a href="javascript:" v-if="scope.row.sellPrice == 0" @click="showSellDialog(scope.row.shopId, scope.row.shopName)">0.00</a>
          <a href="javascript:" @click="showSellDialog(scope.row.shopId, scope.row.shopName)" v-else>{{$numeral(scope.row.sellPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
  <!-- table end -->
      <!--        奖励弹窗开始        -->
      <el-dialog :title="title" :visible.sync="showRecruitDialogVisible" width="800px" :before-close="onCancleRecruitDialog" :vetically=true>
        <!-- 高级搜索 -->
        <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
        <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
        <el-form ref="table_filter_form" label-width="40px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
          <el-form-item label="姓名：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model="customerName" @keyup.enter.native="formSearch('searchform')">
              </el-input>
            </el-form-grid>
            <el-input style="visibility:hidden;height:0px;width:0px;"></el-input>
            <el-form-grid>
              <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
              <ns-button @click="formReset('searchform')">重置</ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <!-- 高级搜索-结束 -->
        <div style="overflow-x:hidden;overflow-y:auto;">
          <el-table :data="detailData" stripe>
            <el-table-column prop="guideName" label="导购"></el-table-column>
            <el-table-column prop="name" label="姓名">
                <template slot-scope="scope">
                  <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="招募时间" align="center" width="180"></el-table-column>
            <el-table-column prop="reward" label="奖励" align="right"></el-table-column>
          </el-table>
        </div>
        <!--分页开始-->
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination1.sizeOpts"
                       :total="pagination1.total"
                       :current-page.sync="pagination1.page"
                       :page-size="pagination1.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="sizeChange"
                       @current-change="pageChange"
        >
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="onCancleRecruitDialog">关闭</ns-button>
        </div>
      </el-dialog>
      <!--奖励弹窗结束-->

      <!--提成弹窗开始 -->
      <el-dialog :title="title" :visible.sync="showSellDialogVisible" width="960px" :before-close="onCancleSellDialog" :vetically=true>
        <div class="shop-remind-view">
          <div>成单导购提成：此门店员工为成单导购的订单提成（下单时的提成比例）</div>
          <div>专属导购提成：此门店员工为会员专属导购的订单提成（下单时的提成比例)</div>
          <div>订单发生退款时，则扣减对应的成单导购提成和专属导购提成</div>
        </div>
        <div class="select-data-view">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="订单信息" name="first">
              <el-form ref="table_filter_form" label-width="50px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
                <el-form-item>
                  <el-form-grid size="xmd" width="230">
                    <el-form-item label="姓名：">
                      <el-input  type="text" v-model="customerName">
                      </el-input>
                    </el-form-item>
                  </el-form-grid>
                </el-form-item>
                <el-form-grid size="xmd" width="250">
                  <el-form-item label="订单号：">
                    <el-input  type="text" v-model="tradeNo">
                    </el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  <el-form-item>
                    <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
                    <ns-button @click="formReset('searchform')">重置</ns-button>
                  </el-form-item>
                </el-form-grid>
              </el-form>
              <div>
                <el-table :data="detailData" stripe class="new-table_border drawer-table" :row-style="{ height: '48px' }">
                  <el-table-column prop="guideName" label="导购"></el-table-column>
                  <el-table-column prop="name" label="姓名">
                    <template slot-scope="scope">
                      <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="tradeId" label="订单编号"></el-table-column>
                  <el-table-column prop="payment" label="订单实付(含运费)" align="right">
                    <template slot-scope="scope">
                      {{'¥'+scope.row.payment}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="时间"></el-table-column>
                  <el-table-column prop="reward" label="提成"  align="right">
                    <template slot-scope="scope">
                      {{'¥'+scope.row.reward}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination v-if="pagination.enable" class="template-table-pagination"
                            :page-sizes="pagination1.sizeOpts"
                            :total="pagination1.total"
                            :current-page.sync="pagination1.page"
                            :page-size="pagination1.size"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="sizeChange"
                            @current-change="pageChange"
              >
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="退款信息" name="second">
              <el-form ref="table_filter_form" label-width="60px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
                <el-form-item>
                  <el-form-grid size="xmd" width="230">
                    <el-form-item label="姓名：">
                      <el-input  type="text" v-model="customerName">
                      </el-input>
                    </el-form-item>
                  </el-form-grid>
                </el-form-item>
                <el-form-grid size="xmd" width="290">
                  <el-form-item label="退款编号：">
                    <el-input  type="text" v-model="outRefundId">
                    </el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  <el-form-item>
                    <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
                    <ns-button @click="formReset('searchform')">重置</ns-button>
                  </el-form-item>
                </el-form-grid>
              </el-form>
              <div>
                <el-table :data="detailData" stripe class="new-table_border drawer-table" :row-style="{ height: '48px' }">
                  <el-table-column prop="guideName" label="导购" ></el-table-column>
                  <el-table-column prop="name" label="姓名">
                    <template slot-scope="scope">
                      <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outRefundId" label="退款编号">
                    <template slot-scope="scope">
                      {{scope.row.outRefundId || '-'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="payment" label="退款金额(含运费)"  align="right">
                    <template slot-scope="scope">
                      {{'¥'+scope.row.payment}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="orderCode" label="关联订单号"></el-table-column>
                  <el-table-column prop="createTime" label="时间" ></el-table-column>
                  <el-table-column prop="reward" label="提成"  align="right">
                    <template slot-scope="scope">
                      {{'¥'+scope.row.reward}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination v-if="pagination.enable" class="template-table-pagination"
                            :page-sizes="pagination1.sizeOpts"
                            :total="pagination1.total"
                            :current-page.sync="pagination1.page"
                            :page-size="pagination1.size"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="sizeChange"
                            @current-change="pageChange"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="onCancleSellDialog">关闭</ns-button>
        </div>
      </el-dialog>
      <!--提成弹窗结束-->

  <!--        新加好友弹窗开始        -->
  <el-dialog :title="title" :visible.sync="showAddfriendDialogVisible" width="800px" :before-close="onCancleAddfriendDialog" :vetically=true>
    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <el-form ref="table_filter_form" label-width="40px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
      <el-form-item label="昵称：">
        <el-form-grid size="xmd">
          <el-input  type="text" v-model="friendWxnick" @keyup.enter.native="formSearch('searchform')">
          </el-input>
        </el-form-grid>
        <el-input style="visibility:hidden;height:0px;width:0px;"></el-input>
        <el-form-grid>
          <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
          <ns-button @click="formReset('searchform')">重置</ns-button>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <!-- 高级搜索-结束 -->
    <div style="overflow-x:hidden;overflow-y:auto;">
      <el-table :data="detailData" stripe>
        <el-table-column prop="guideName" label="导购"></el-table-column>
        <el-table-column prop="friendWxnick" label="昵称">
          <template slot-scope="scope">
            <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encFriendWxnick" :sensitiveData="scope.row.friendWxnick"></ns-sg-sensitive-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="新加好友时间" align="center" width="180"></el-table-column>
        <el-table-column prop="reward" label="奖励" align="right"></el-table-column>
      </el-table>
    </div>
    <!--分页开始-->
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
                   :page-sizes="pagination1.sizeOpts"
                   :total="pagination1.total"
                   :current-page.sync="pagination1.page"
                   :page-size="pagination1.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="sizeChange"
                   @current-change="pageChange"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onCancleAddfriendDialog">关闭</ns-button>
    </div>
  </el-dialog>
  <!--新加好友弹窗结束-->
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'

export default {
  mixins: [listPageMixin],
  data () {
    var pagination1 = {
      enable: true,
      size: 10,
      sizeOpts: [10, 20, 50],
      page: 1,
      total: 0
    }
    let nowDate = new Date()
    return {
      activeName: 'first',
      test: 'testmy',
      typeOptions: [
        {
          value: '1',
          label: '按月查询'
        }
        // ,
        // {
        //   value: '2',
        //   label: '按日查询'
        // },
        // {
        //   value: '3',
        //   label: '按时间段查询'
        // }
      ],
      statusOptions: [
        {
          value: '1',
          label: '正常'
        },
        {
          value: '-1',
          label: '暂停'
        },
        {
          value: '-2',
          label: '关店'
        }
      ],
      shopTypeOptions: [
        {
          value: 'ZYD',
          label: '直营店'
        },
        {
          value: 'JMD',
          label: '加盟店'
        },
        {
          value: 'LYD',
          label: '联营店'
        }
      ],
      selectedArr: [],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        },
        area: [],
        shopName: '',
        date: '', // 年月份,
        dateRange: [], // 时间段
        type: '1', // 1按月、2按日
        shopStatus: '',
        shopType: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time > Date.now() - 3600 * 1000 * 24
        }
      },
      currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      // 弹窗字段
      title: null,
      detailData: null,
      showRecruitDialogVisible: false,
      showAddfriendDialogVisible: false,
      showSellDialogVisible: false,
      customerName: null,
      friendWxnick: null,
      tradeNo: null,
      shopId: null,
      type: null,
      pagination1: pagination1,
      outRefundId: null
    }
  },
  created: function () {
    // 初始化默认查询本年当月
    this.searchObj.searchMap = Object.assign(this.searchObj.searchMap, {
      type: '1', // 1按月、2按日
      date: moment(new Date()).format('YYYY-MM')// 年月份,
    })
    // 获取当前年份---默认加载当前年
    this.searchform.date = moment(new Date()).format('YYYY-MM')
    this.loadListFun()
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.outRefundId = null
      } else {
        this.tradeNo = null
      }
      this.formSearch()
    },
    handleDateChange () {
      this.searchform.date = ''
    },
    showRecruitDialog (shopId, shopName) {
      var _this = this
      _this.title = shopName + '-招募明细'
      _this.showRecruitDialogVisible = true
      _this.shopId = shopId
      _this.type = 1
      _this.findDetailData(shopId)
    },
    showAddfriendDialog (shopId, shopName) {
      var _this = this
      _this.title = shopName + '-新加好友明细'
      _this.showAddfriendDialogVisible = true
      _this.shopId = shopId
      _this.type = 2
      _this.findDetailData(shopId)
    },
    showSellDialog (shopId, shopName) {
      var _this = this
      _this.title = shopName + '-提成明细'
      _this.showSellDialogVisible = true
      _this.shopId = shopId
      _this.type = 0
      _this.findDetailData(shopId)
    },
    dateTiemFun (e) {},
    onAreaChange (e) {},
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.shopPerfList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 重置搜索
    resetForm (formName) {
      for (let attr in this.searchform) {
        if (attr !== 'date') {
          if (attr === 'type') {
            this.searchform.type = this.typeOptions[0].value
          } else if (attr === 'area') {
            this.searchform[attr] = []
          } else if (attr === 'key') {
            this.searchform.key =
            {
              children: 'children',
              label: 'label',
              value: 'label',
              disabled: 'disabled'
            }
          } else {
            this.searchform[attr] = ''
          }
        }
      }
      // this.$refs[formName].resetFields()
      this.submitForm()
    },
    // 提交搜索
    submitForm (formName) {
      if (this.searchform.type === '2') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM'
        )
      }
      // 组装搜索对象
      this.searchObj.start = 0
      this.searchObj.searchMap.province = this.searchform.area[0]
      this.searchObj.searchMap.city = this.searchform.area[1]
      this.searchObj.searchMap.district = this.searchform.area[2]
      this.searchObj.searchMap.shopType = this.searchform.shopType
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.shopStatus = this.searchform.shopStatus
      this.loadListFun()
    },
    exportExcel () {
      var url = API_ROOT + '/guide/shopperf/exportExcel'
      var form = document.createElement('form')
      if (this.searchform.type === '2') {
        form.appendChild(this.generateHideElement('date', moment(this.searchform.date).format('YYYY-MM-DD')))
      } else {
        form.appendChild(this.generateHideElement('date', moment(this.searchform.date).format('YYYY-MM')))
      }
      if (this.searchform.area.length > 0) {
        form.appendChild(this.generateHideElement('province', this.searchform.area[0]))
        form.appendChild(this.generateHideElement('city', this.searchform.area[1]))
        form.appendChild(this.generateHideElement('district', this.searchform.area[2]))
      }
      form.appendChild(this.generateHideElement('shopType', this.searchform.shopType))
      form.appendChild(this.generateHideElement('shopName', this.searchform.shopName))
      form.appendChild(this.generateHideElement('type', this.searchform.type))
      form.appendChild(this.generateHideElement('shopStatus', this.searchform.shopStatus))
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    },
    // 明细-------------------------------------------------------------------------------------------------  //
    formSearch () {
      this.pagination1.page = 1
      this.findDetailData(this.shopId)
    },
    formReset () {
      this.customerName = null
      this.tradeNo = null
      this.outRefundId = null
      this.friendWxnick = null
      this.findDetailData(this.shopId)
    },
    findDetailData (shopId) {
      var _this = this
      // 组装搜索对象
      if (_this.searchform.type === '2') {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format(
          'YYYY-MM'
        )
      }
      const negative = this.activeName === 'first' ? 0 : 1
      _this.$http.fetch(_this.$api.guide.guide.guidePerfDetailList, {
        start: (_this.pagination1.page - 1) * _this.pagination1.size,
        length: _this.pagination1.size,
        searchMap: {
          shopId: shopId,
          tradeNo: _this.tradeNo,
          name: _this.customerName,
          friendWxnick: _this.friendWxnick,
          type: this.searchform.type,
          rewardType: _this.type,
          date: _this.searchObj.searchMap.date,
          negative,
          outRefundId: _this.outRefundId
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.detailData = resp.result.data
          _this._data.pagination1.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 分页-页数改变
    pageChange (page) {
      var _this = this
      _this.pagination1.page = page
      _this.findDetailData(_this.shopId)
    },
    // 分页-大小改变
    sizeChange (pageSize) {
      var _this = this
      _this.pagination1.size = pageSize
      _this.pagination1.page = 1
      _this.guideId = null
      _this.findDetailData(_this.shopId)
    },
    // 关闭奖励弹窗
    onCancleRecruitDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.detailData = null
      _this.customerName = null
      _this.shopId = null
      _this.showRecruitDialogVisible = false
    },
    // 关闭添加好友奖励弹窗
    onCancleAddfriendDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.detailData = null
      _this.friendWxnick = null
      _this.shopId = null
      _this.showAddfriendDialogVisible = false
    },
    // 关闭提成弹窗
    onCancleSellDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.detailData = null
      _this.tradeNo = null
      _this.customerName = null
      _this.shopId = null
      _this.showSellDialogVisible = false
    }
  },
  components: {
    NsArea
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @import '@components/NewUi/styles/reset.css';
  >>>.el-form-item--small .el-form-item__label {
    text-align: left;
  }
  .el-input.el-input--small .el-input__inner {
    text-indent: 25px !important;
  }
  .mt10 {
    margin-top: var(--default-margin-larger);
  }
  .searchbtn {
    margin-left: var(--default-margin-base);
  }
  .resetbtn {
    margin-left: 9px;
  }
  .shop-remind-view {
    background-color: #F2F9FE;
    padding: 16px;
    margin-bottom: 16px;
    font-size: 14px;
    border-radius: 4px;
  }
  .select-data-view >>> .el-tabs__header {
    border: none;
    height: 46px;
    margin-left: -10px;
  }

  .select-data-view >>> .el-tabs__item.is-active {
    color: #0094fc;
  }

  .select-data-view >>> .el-tabs__active-bar {
    background: #0094fc;
  }

  .select-data-view >>> .el-tabs__item:focus.is-active.is-focus:not(:active) {
    box-shadow: none;
  }
  .drawer-table {
    padding: 0;
    font-size: 14px;
    font-weight: 400;
    margin-top: 16px;
  }
</style>
