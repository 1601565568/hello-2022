
<template>
<!-- 导购工作统计  wanrengang 20180716 -->
<div>
  <div class="template-table">
    <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="2"><ns-button type="primary"  class="searchbtn" @click="exportExcel">导出</ns-button></el-col>
          <el-col :span="22">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding-left: 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item  prop="type">
                <el-select
                style="width:120px"
                v-model="searchform.type" placeholder="请选择">
                  <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="date">
                <el-date-picker
                  v-if="searchform.type=='1'"
                  :clearable = "false" :editable = "false"
                  v-model="searchform.date"
                  type="month"
                  placeholder="请选择月份"
                  >
                </el-date-picker>
                <el-date-picker
                    v-if="searchform.type=='2'"
                    :clearable = "false" :editable = "false"
                    v-model="searchform.date"
                    type="date"
                    placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item  prop="dateRange">
                <el-date-picker
                  v-if="searchform.type=='3'"
                  :clearable = "false" :editable = "false"
                  type="daterange"
                  v-model="searchform.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="currentMonth"
                >
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="选择员工：">
                <div class="template-search__box">
                    <span v-if="searchform.guideId&&searchform.guideId.length>0">
                        已选择{{searchform.guideId.length}}个
                    </span>
                    <span v-else>全部</span>
                    <div style="float: right;">
                        <NsGuideDialog
                        :isButton="false"
                        :validNull="true"
                        :auth="false"
                        type="primary"
                        btnTitle="选择"
                        dialogTitle="选择员工"
                        v-model="searchform.guideId"
                        @input="NsGuideDialog()"
                    ></NsGuideDialog>
                    </div>
                </div>
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
  <div class="template-table-search" v-if="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item  prop="type" label="查询类型：">
            <el-select
            style="width:100px"
            v-model="searchform.type" placeholder="请选择">
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
                :clearable = "false" :editable = "false"
                v-model="searchform.date"
                type="month"
                placeholder="请选择月份"
                >
            </el-date-picker>
            <el-date-picker
                v-if="searchform.type=='2'"
                :clearable = "false" :editable = "false"
                v-model="searchform.date"
                type="date"
                placeholder="请选择日期">
            </el-date-picker>
            <el-date-picker
                  v-if="searchform.type=='3'"
                  :clearable = "false" :editable = "false"
                  type="daterange"
                  v-model="searchform.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-value="currentMonth"
                >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择员工：">
            <div class="template-search__box">
                <span v-if="searchform.guideId&&searchform.guideId.length>0">
                    已选择{{searchform.guideId.length}}个
                </span>
                <span v-else>全部</span>
                <div style="float: right;">
                    <NsGuideDialog
                        :isButton="false"
                        :validNull="true"
                        :auth="false"
                        type="primary"
                        btnTitle="选择"
                        dialogTitle="选择员工"
                        v-model="searchform.guideId"
                        @input="NsGuideDialog()"
                    ></NsGuideDialog>
                </div>
            </div>
          </el-form-item>
          <el-form-item label="门店名称："  prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号："  prop="workId">
            <el-input v-model="searchform.workId" placeholder="请输入账号"  @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="姓名："  prop="name">
            <el-input v-model="searchform.name" placeholder="请输入姓名" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item> -->
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
      <el-table-column label="账号" prop="workId" width="120">
      <template slot-scope="scope">
        {{scope.row.workId?scope.row.workId:'-'}}
      </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 2">
            {{scope.row.name }} <span v-if="scope.row.sameFlag === 1 && scope.row.work_number">({{scope.row.work_number}})</span> <span class="text-error">(已离职)</span>
          </p>
<!--          <p v-else-if="scope.row.gsState == 0 || scope.row.gsShopId == null || (scope.row.shopId && `,${scope.row.shopId},`.indexOf(`,${scope.row.gsShopId},`) < 0)">-->
          <p v-else-if="scope.row.gsShopId != null && scope.row.shopId && `,${scope.row.shopId},`.indexOf(`,${scope.row.gsShopId},`) < 0">
            {{scope.row.name}}<span v-if="scope.row.sameFlag === 1 && scope.row.work_number">({{scope.row.work_number}})</span> <span style="color: red">(已更换门店)</span>
          </p>
          <p v-else>{{scope.row.name}}<span v-if="scope.row.sameFlag === 1 && scope.row.work_number">({{scope.row.work_number}})</span></p>
        </template>
        <template slot='header' scope='header'>
          <span>
            <span>{{header.column.label}}</span>
            <el-tooltip content="不显示已删除门店的导购">
              <Icon type="question-circle"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工号" prop="work_number" width="120">
        <template slot-scope="scope">
          {{ scope.row.work_number ? scope.row.work_number : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="门店名称" prop="shopName">
      </el-table-column>
      <el-table-column  align="right" width="230">
        <template slot="header">
          已招募(人)/招募指标(人)/完成率
          <el-tooltip content="导购在该门店招募会员总数，包括导购端手动添加会员">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
      <template slot-scope="scope">
        <span width="230">{{scope.row.recruitComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.recruitQuota === 0">
            -
          </span>
          <span v-else>
            {{scope.row.recruitQuota}}
          </span>
          </span>
        <span>/{{scope.row.completionRate || '-' }}</span>
      </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="150" align="right">
        <template slot="header">
          奖励(元)
          <el-tooltip content="根据该门店奖励规则，导购可获得的招募提成">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.recruitPrice == 0">0.00</span>
          <a href="javascript:" @click="showRecruitDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)" v-else>{{$numeral(scope.row.recruitPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
      <el-table-column label="已加好友(人)/加好友指标(人)/完成率" align="right" width="250">
        <template slot="header">
          已加好友(人)/加好友指标(人)/完成率
          <el-tooltip content="导购在该门店新加好友总数，好友多次添加同一名导购微信不会重复计算">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span width="250">{{scope.row.addfriendComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.addfriendQuota === 0">
            -
          </span>
          <span v-else>
            {{scope.row.addfriendQuota}}
          </span>
          </span>/
          <span>{{scope.row.addfriendCompleteRate || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励（元）" prop="recruitPrice" width="150" align="right">
        <template slot="header">
          奖励(元)
          <el-tooltip content="根据该门店奖励规则，导购可获得的新加好友提成">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.addfriendPrice == 0">0.00</span>
          <a href="javascript:" @click="showAddfriendDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)" v-else>{{$numeral(scope.row.addfriendPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="销售额(元)/销售指标(元)/完成率"
        align="right"
        width="250"
      >
        <template slot="header">
          销售额(元)/销售指标(元)/完成率
          <el-tooltip content="此员工为成单导购的订单金额减去退款金额（不限制下单门店为该门店）">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
      <template slot-scope="scope">
        <span>{{$numeral(scope.row.sellComplete).format('0,0.00')}}</span>/<span class="text-error">
          <span v-if="scope.row.sellQuota <= 0">-</span>
          <span v-else>{{$numeral(scope.row.sellQuota).format('0,0.00')}}</span>
          </span>/<span>{{scope.row.sellCompleteRate || '-'}}</span>
      </template>
      </el-table-column>
      <el-table-column label="提成（元）" prop="sellPrice" width="150" align="right">
        <template slot="header">
          提成(元)
          <el-tooltip content="此员工为成单导购的订单提成+专属导购的订单提成-订单退款成功金额的提成（下单时的提成比例）">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <a href="javascript:" v-if="scope.row.sellPrice == 0" @click="showSellDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)">0.00</a>
          <a href="javascript:" @click="showSellDialog(scope.row.guideId, scope.row.name,scope.row.gsShopId)" v-else>{{$numeral(scope.row.sellPrice).format('0,0.00')}}</a>
        </template>
      </el-table-column>

    </el-table>
  </div>
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

  <!--奖励弹窗开始-->
  <el-dialog :title="title" :visible.sync="showRecruitDialogVisible" width="800px" :before-close="onCancleRecruitDialog" :vetically=true>
    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
      <el-form-item label="姓名：">
        <el-input  type="text" v-model="customerName" @keyup.enter.native="formSearch('searchform')">
        </el-input>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
        <ns-button @click="formReset('searchform')">重置</ns-button>
      </el-form-item>
    </el-form>
    <!-- 高级搜索-结束 -->
    <div style="overflow-x:hidden;overflow-y:auto;">
      <el-table :data="detailData">
        <el-table-column prop="name" label="姓名">
          <template slot-scope="scope">
            <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="招募时间" align="center" width="200"></el-table-column>
        <el-table-column prop="reward" label="奖励" align="right" width="180"></el-table-column>
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

  <!--提成弹窗开始-->
  <el-dialog :title="title" :visible.sync="showSellDialogVisible" width="960px" :before-close="onCancleSellDialog" :vetically=true>
    <div class="shop-remind-view">
      <div>成单导购提成：此员工为成单导购的订单提成（下单时的提成比例）</div>
      <div>专属导购提成：此员工为会员专属导购的订单提成（下单时的提成比例）</div>
      <div>订单发生退款时，则扣减对应的成单导购提成和专属导购提成</div>
    </div>
    <div class="select-data-view">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单信息" name="first">
          <el-form ref="table_filter_form" label-width="60px" @keyup.enter.native="onSearch" class="surround-btn" :inline="true">
            <el-form-item label="姓名：">
              <el-input  type="text" v-model="customerName">
              </el-input>
            </el-form-item>
            <el-form-item label="订单号：">
              <el-input  type="text" v-model="tradeNo">
              </el-input>
            </el-form-item>
            <el-form-item>
              <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
              <ns-button @click="formReset('searchform')">重置</ns-button>
            </el-form-item>
          </el-form>
          <!-- 高级搜索-结束 -->
          <div style="overflow-x:hidden;overflow-y:auto;">
            <el-table :data="detailData" class="new-table_border drawer-table" :row-style="{ height: '48px' }">
              <el-table-column prop="name" label="姓名">
                <template slot-scope="scope">
                  <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
                </template>
              </el-table-column>
              <el-table-column prop="tradeId" label="订单编号"></el-table-column>
              <el-table-column prop="payment" label="订单实付(含运费)"  align="right">
                <template slot-scope="scope">
                  {{'¥'+scope.row.payment}}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="时间" ></el-table-column>
              <el-table-column prop="reward" label="提成"   align="right">
                <template slot-scope="scope">
                  {{'¥'+scope.row.reward}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页开始-->
          <el-pagination v-if="pagination1.enable" class="template-table-pagination"
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
            <el-form-item label="姓名：">
              <el-input  type="text" v-model="customerName">
              </el-input>
            </el-form-item>
            <el-form-item label="退款编号：">
              <el-input  type="text" v-model="outRefundId">
              </el-input>
            </el-form-item>
            <el-form-item>
              <ns-button type="primary" @click="formSearch('searchform')">搜索</ns-button>
              <ns-button @click="formReset('searchform')">重置</ns-button>
            </el-form-item>
          </el-form>
          <!-- 高级搜索-结束 -->
          <div style="overflow-x:hidden;overflow-y:auto;">
            <el-table :data="detailData" class="new-table_border drawer-table" :row-style="{ height: '48px' }">
              <el-table-column prop="name" label="姓名" >
                <template slot-scope="scope">
                  <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
                </template>
              </el-table-column>
              <el-table-column prop="outRefundId" label="退款编号">
                <template slot-scope="scope">
                  {{scope.row.outRefundId || '-'}}
                </template>
              </el-table-column>
              <el-table-column prop="payment" label="退款金额" align="right">
                <template slot-scope="scope">
                  {{'¥'+scope.row.payment}}
                </template>
              </el-table-column>
              <el-table-column prop="tradeId" label="关联订单号"></el-table-column>
              <el-table-column prop="createTime" label="时间"></el-table-column>
              <el-table-column prop="reward" label="提成" align="right">
                <template slot-scope="scope">
                  {{'¥'+scope.row.reward}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页开始-->
          <el-pagination v-if="pagination1.enable" class="template-table-pagination"
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

  <!--添加好友弹窗开始-->
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
      <el-table :data="detailData">
        <el-table-column prop="friendWxnick" label="昵称">
          <template slot-scope="scope">
            <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encFriendWxnick" :sensitiveData="scope.row.friendWxnick"></ns-sg-sensitive-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="新加好友时间" align="center" width="200"></el-table-column>
        <el-table-column prop="reward" label="奖励" align="right" width="180"></el-table-column>
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
  <!--添加好友弹窗结束-->
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import NsGuideDialog from '@/components/NsGuideDialog'

export default {
  mixins: [listPageMixin],
  components: { NsGuideDialog },
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
      outRefundId: null,
      selectedArr: [],
      typeOptions: [
        {
          value: '3',
          label: '按时间段查询'
        },
        {
          value: '2',
          label: '按日查询'
        },
        {
          value: '1',
          label: '按月查询'
        }
      ],
      searchform: {
        shopName: '',
        date: '', // 年月份,
        dateRange: [],
        guideId: [],
        type: '1', // 1按月、2按日
        workId: '',
        name: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time > Date.now() - 3600 * 1000 * 24
        }
      },
      currentMonth: `${nowDate.getFullYear()}/${nowDate.getMonth()}`,
      // 弹窗字段
      type: null,
      title: null,
      guideId: null,
      detailData: null,
      showRecruitDialogVisible: false,
      showSellDialogVisible: false,
      showAddfriendDialogVisible: false,
      customerName: null,
      friendWxnick: null,
      tradeNo: null,
      pagination1: pagination1,
      shopId: null
    }
  },
  watch: {
    'searchform.type': function (newVal) {
      if (newVal === '3') {
        this.getTime()
      }
    }
  },
  created: function () {
    // 初始化默认查询本年当月
    this.searchObj.searchMap = Object.assign(this.searchObj.searchMap, {
      type: '1', // 1按月、2按日
      date: moment(new Date()).format('YYYY-MM') // 年月份,
    })
    // 获取当前年份---默认加载当前年
    this.searchform.date = moment(new Date()).format('YYYY-MM')
    this.searchform.guideIds = []
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
    getTime () {
      var date = new Date()
      date.setDate(1)
      this.searchform.dateRange = [moment(new Date(new Date(date))).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')]
    },
    NsGuideDialog () {
      this.handleSearch()
    },
    handleSearch () {
      let params = JSON.parse(JSON.stringify(this.model))
      let param = {
        ...params,
        guideId: params.guideId.join(','),
        pageForm: params.pageForm.join(',')
      }
      this.$search({ searchMap: { ...param } })
    },
    showRecruitDialog (guideId, name, shopId) {
      var _this = this
      _this.title = name + '-招募明细'
      _this.showRecruitDialogVisible = true
      _this.guideId = guideId
      _this.shopId = shopId
      _this.type = 1
      _this.findDetailData(guideId)
    },
    showAddfriendDialog (guideId, name, shopId) {
      var _this = this
      _this.title = name + '-新加好友明细'
      _this.showAddfriendDialogVisible = true
      _this.guideId = guideId
      _this.shopId = shopId
      _this.type = 2
      _this.findDetailData(guideId)
    },
    showSellDialog (guideId, name, shopId) {
      var _this = this
      _this.title = name + '-提成明细'
      _this.guideId = guideId
      _this.type = 0
      _this.shopId = shopId
      _this.showSellDialogVisible = true
      _this.findDetailData(guideId)
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.guideperfList, searchObj)
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
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      if (this.searchform.type === '2') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format('YYYY-MM-DD')
      } else if (this.searchform.type === '1') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format('YYYY-MM')
      } else if (this.searchform.type === '3') {
        if (this.searchform.dateRange == null && this.searchform.dateRange.length < 1) {
          this.$notify.error('请选择时间段')
          return
        }
        let dateDiff = this.getDateDiff(this.searchform.dateRange[0], this.searchform.dateRange[1], 'day')
        if (dateDiff > 180) {
          this.$notify.error('查询时间间隔不能大于180天')
          this.loading = false
          return false
        }
        this.searchObj.searchMap.startDate = moment(this.searchform.dateRange[0]).format('YYYY-MM-DD')
        this.searchObj.searchMap.endDate = moment(this.searchform.dateRange[1]).format('YYYY-MM-DD')
      }
      this.clearSearch()
      if (this.searchform.guideId && this.searchform.guideId !== '') {
        this.searchObj.searchMap.guideIds = this.searchform.guideId
      }
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.name = this.searchform.name
      this.searchObj.searchMap.workId = this.searchform.workId
      this.searchObj.searchMap.type = this.searchform.type
      this.loadListFun()
    },
    getDateDiff (startTime, endTime, diffType) {
      diffType = diffType.toLowerCase()
      const sTime = new Date(startTime) // 开始时间
      const eTime = new Date(endTime) // 结束时间
      let divNum = 1 // 作为除数的数字
      if (diffType === 'second') {
        divNum = 1000
      } else if (diffType === 'minute') {
        divNum = 1000 * 60
      } else if (diffType === 'hour') {
        divNum = 1000 * 3600
      } else {
        divNum = 1000 * 3600 * 24
      }
      return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum))
    },
    // 导出
    exportExcel () {
      var url = API_ROOT + '/guide/guideperf/exportExcel'
      var form = document.createElement('form')
      if (this.searchform.type === '2') {
        form.appendChild(this.generateHideElement('date', moment(this.searchform.date).format('YYYY-MM-DD')))
      } else if (this.searchform.type === '1') {
        form.appendChild(this.generateHideElement('date', moment(this.searchform.date).format('YYYY-MM')))
      } else if (this.searchform.type === '3') {
        if (this.searchform.dateRange == null && this.searchform.dateRange.length < 1) {
          this.$notify.error('请选择时间段')
          return
        }
        let dateDiff = this.getDateDiff(this.searchform.dateRange[0], this.searchform.dateRange[1], 'day')
        if (dateDiff > 180) {
          this.$notify.error('查询时间间隔不能大于180天')
          this.loading = false
          return false
        }
        form.appendChild(this.generateHideElement('startDate', moment(this.searchform.dateRange[0]).format('YYYY-MM-DD')))
        form.appendChild(this.generateHideElement('endDate', moment(this.searchform.dateRange[1]).format('YYYY-MM-DD')))
      }
      if (this.searchform.guideId.length > 0) {
        form.appendChild(this.generateHideElement('guideIds', this.searchform.guideId))
      }
      form.appendChild(this.generateHideElement('type', this.searchform.type))
      form.appendChild(this.generateHideElement('shopName', this.searchform.shopName))
      form.appendChild(this.generateHideElement('name', this.searchform.name))
      form.appendChild(this.generateHideElement('workId', this.searchform.workId))
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
    // 重置搜索
    resetForm (formName) {
      this.searchObj.searchMap.guideIds = []
      for (let attr in this.searchform) {
        if (attr !== 'date') {
          if (attr === 'type') {
            if (this.searchform.type !== 1) {
              this.searchform.type = this.typeOptions[2].value
            }
          } else {
            this.searchform[attr] = ''
          }
        }
      }
      // this.$refs[formName].resetFields()
      this.submitForm()
    },
    // 明细//
    formSearch () {
      this.pagination1.page = 1
      this.findDetailData(this.guideId)
    },
    formReset () {
      this.pagination1.page = 1
      this.customerName = null
      this.tradeNo = null
      this.friendWxnick = null
      this.outRefundId = null
      // this.type = null
      this.findDetailData(this.guideId)
    },
    // 提成明细
    findDetailData (guideId) {
      var _this = this
      // 组装搜索对象
      if (_this.searchform.type === '2') {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format('YYYY-MM-DD')
      } else {
        _this.searchObj.searchMap.date = moment(_this.searchform.date).format('YYYY-MM')
      }
      const negative = this.activeName === 'first' ? 0 : 1
      _this.$http.fetch(_this.$api.guide.guide.guidePerfDetailList, {
        start: (_this.pagination1.page - 1) * _this.pagination1.size,
        length: _this.pagination1.size,
        searchMap: {
          guideId: guideId,
          shopId: _this.shopId,
          name: _this.customerName,
          friendWxnick: _this.friendWxnick,
          tradeNo: _this.tradeNo,
          type: _this.searchform.type,
          rewardType: _this.type,
          date: _this.searchObj.searchMap.date,
          negative,
          outRefundId: _this.outRefundId
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.detailData = (resp.result.data || []).map(o => {
            return {
              ...o,
              payment: (+o.payment || 0).toFixed(2),
              reward: (+o.reward || 0).toFixed(2)
            }
          })
          _this._data.pagination1.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 关闭自定义转移弹窗
    onCancleDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerData = null
      _this.showCustomerDialogVisible = false
    },
    // 分页-页数改变
    pageChange (page) {
      var _this = this
      _this.pagination1.page = page
      _this.findDetailData(_this.guideId)
    },
    // 分页-大小改变
    sizeChange (pageSize) {
      var _this = this
      _this.pagination1.size = pageSize
      _this.pagination1.page = 1
      // _this.guideId = null
      _this.findDetailData(_this.guideId)
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
      _this.tradeNo = null
      _this.customerName = null
      _this.guideId = null
      _this.shopId = null
      _this.showRecruitDialogVisible = false
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
      _this.customerName = null
      _this.tradeNo = null
      _this.detailData = null
      _this.guideId = null
      _this.shopId = null
      _this.showSellDialogVisible = false
    },
    // 关闭添加好友提成弹窗
    onCancleAddfriendDialog () {
      var _this = this
      _this.pagination1 = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerName = null
      _this.tradeNo = null
      _this.detailData = null
      _this.guideId = null
      _this.shopId = null
      _this.friendWxnick = null
      _this.showAddfriendDialogVisible = false
    }
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
    text-indent: 25rpx !important;
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
  .template-search__box {
  width: 182px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
}
.template-search__box span{
  width: 141px;
  height: 27px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
  margin-left: var(--default-margin-small);
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
