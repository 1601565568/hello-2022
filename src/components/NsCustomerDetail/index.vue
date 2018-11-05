<template>
  <div>
    <el-dialog :title="customerModel.dialogTitle" :visible.sync="detailVisible" :modal-append-to-body ="false"
                width="1000px" class="custom-dialog" @close="onClose()" :show-scroll-x="false" height="550px">
      <!-- 顶部信息 -->
      <div class="customer-head">
        <div class="customer-head__info">
          <div class="customer-img">
            <img src="https://img.alicdn.com/bao/uploaded/i2/810764890/TB2FmCyzolnpuFjSZFjXXXTaVXa_!!810764890.png" width="120">
          </div>
          <div class="customer-info control-form">
            <div class="control-item">
              <label class="control-label">姓名：</label>
              <div class="control-content">{{customerModel.customer.customerName}}</div>
            </div>
            <div class="control-item">
              <label class="control-label">手机：</label>
              <div class="control-content">{{customerModel.customer.mobile}}</div>
            </div>
            <div class="control-item">
              <label class="control-label">性别：</label>
              <div class="control-content">
                <template v-if="customerModel.customer.sex ==1">男</template>
                <template v-if="customerModel.customer.sex ==0">女</template>
                <template v-if="customerModel.customer.sex ==-1">未知</template>
                </div>
            </div>
          </div>
        </div>
        <el-row class="customer-head__data" :gutter="30">
          <el-col :span="6" class="customer-data__item" v-for="item in customerModel.userData" :key="item.index">
            <div class="customer-data__bg">
              <span class="customer-data__num">{{item.num}}</span>
              <p class="customer-data__title">{{item.title}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 顶部信息/end -->
      <el-tabs v-model="customerModel.activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="dataBase" class="padding-tb-base">
          <el-form label-width="90px" class="text-form-unique">
            <div class="form-grid">
              <div class="form-grid__title">基本信息</div>
              <div class="form-grid__content">
                <el-row :gutter="10">
                  <el-col :span="8" v-for="item in customerModel.customer.base" :key="item.index">
                    <el-form-item :label="item.title + '：'">
                      <el-form-grid>{{item.value}}</el-form-grid>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-grid__title">自定义属性</div>
              <div class="form-grid__content">
                <el-row :gutter="10">
                  <el-col :span="8" v-for="item in customerModel.customer.userAttr" :key="item.index">
                    <el-form-item>
                      <div slot="label">
                        <template v-if="item.title.length > 7">
                          <el-tooltip :content="item.title" effect="light">
                            <div class="el-form-truncation">{{item.title}}</div>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          {{item.title}}
                        </template>
                      </div>
                      <p v-if="!item.value">：</p>
                        <template v-if="item.value != null && item.value != ''">
                          <template v-if="item.value.length > 18">
                            <el-tooltip :content="item.value" effect="light">
                              <p class="el-form-truncation">：{{item.value}}</p>
                            </el-tooltip>
                          </template>
                          <template v-else>
                            ：{{item.value}}
                          </template>
                        </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-grid__title">交易属性</div>
              <div class="form-grid__content">
                <el-row :gutter="10">
                  <el-col :span="8" v-for="item in customerModel.customer.tradeAttr" :key="item.index">
                    <el-form-item :label="item.title + '：'">
                      <el-form-grid>{{item.value}}</el-form-grid>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-grid__title">扩展属性</div>
              <div class="form-grid__content">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="触达黑名单：">
                      <el-form-grid>
                        {{customerModel.customer.touchBlackType}}
                        <el-popover
                          placement="right"
                          width="320"
                          trigger="click"
                          v-model="customerModel.customer.touchVisible">
                          <el-form>
                            <el-form-item label="设置触达黑名单">
                            </el-form-item>
                            <el-form-item label="触达黑名单：">
                              <el-form-grid size="xmd">
                                <el-checkbox-group v-model="customerModel.customer.touchList">
                                  <el-checkbox label="0">手机</el-checkbox>
                                  <el-checkbox label="1">邮件</el-checkbox>
                                  <el-checkbox label="2">微信</el-checkbox>
                                </el-checkbox-group>
                              </el-form-grid>
                            </el-form-item>
                            <div class="text-right">
                              <ns-button @click="onCloseTouch">{{$t('operating.cancel')}}</ns-button>
                              <ns-save @click="onSaveTouch()" title="confirm"></ns-save>
                            </div>
                          </el-form>
                          <i slot="reference" class="el-icon-edit" ></i>
                        </el-popover>
                      </el-form-grid>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="control-item">
                    <el-form-item label="权益黑名单：">
                      <el-form-grid>
                        {{customerModel.customer.rightBlackType}}
                        <el-popover
                          placement="right"
                          width="320"
                          trigger="click"
                          v-model="customerModel.customer.rightVisible">
                          <el-form>
                            <el-form-item label="设置权益黑名单">
                            </el-form-item>
                            <el-form-item label="权益黑名单：">
                              <el-form-grid size="xmd">
                                <el-checkbox-group v-model="customerModel.customer.rightList">
                                  <el-checkbox label="1">交易积分</el-checkbox>
                                  <el-checkbox label="3">会员等级</el-checkbox>
                                  <el-checkbox label="4">会员权益</el-checkbox>
                                </el-checkbox-group>
                              </el-form-grid>
                            </el-form-item>
                            <div class="text-right">
                              <ns-button @click="onCloseRight()">{{$t('operating.cancel')}}</ns-button>
                              <ns-save @click="onSaveRight()" ></ns-save>
                            </div>
                          </el-form>
                          <i slot="reference" class="el-icon-edit" ></i>
                        </el-popover>
                      </el-form-grid>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="control-item">
                    <el-form-item label="短信退订：">
                      <el-form-grid>
                        {{customerModel.customer.SMSUnsubscribe}}
                      </el-form-grid>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="control-item">
                    <el-form-item label="最近关怀时间：">
                      <el-form-grid>
                        {{customerModel.customer.lastCareTime}}
                      </el-form-grid>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="control-item">
                    <el-form-item label="备注：">
                      <el-form-grid>
                        {{customerModel.customer.remark}}
                      </el-form-grid>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="积分记录" name="integral" class="padding-tb-base">
          <el-form label-width="100px"
                   v-model="customerModel.integralForm">
            <el-form-item class='el-inline-block' label="变更时间：">
              <el-form-grid>
                <ns-datetime size="small" startPlaceholder="" endPlaceholder="" v-model="customerModel.integralForm.time"></ns-datetime>
              </el-form-grid>
            </el-form-item>
            <el-form-item class='el-inline-block' label="变更类型：">
              <el-form-grid size="xx">
                <ns-select  v-model="customerModel.integralForm.integralSource" filterable clearable :placeholder="$t('prompt.select')"
                            :multiple="false" :url="$api.database.interact.integralType" @change="change">
                </ns-select>
              </el-form-grid>
              <el-form-grid size="xx">
                <el-select v-model="customerModel.integralForm.integralType" clearable :placeholder="$t('prompt.select')">
                  <el-option v-for="item in customerModel.integralType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
          </el-form>
          <!-- 表格 -->
          <el-table
            :data="customerModel.integralTable"
            stripe>
            <el-table-column
              prop="integral"
              align="center"
              label="增减积分">
              <template slot-scope="scope">
                <div slot="reference">
                  <span class="integral-label" :class="{'integral-green': scope.row.integral < 0}" v-if="scope.row.operation == 1">+{{ scope.row.integral}}</span>
                  <span class="integral-label" :class="{'integral-green': scope.row.integral < 0}" v-if="scope.row.operation == 2">-{{ scope.row.integral}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="integral_create_time"
              align="center"
              label="变更时间">
            </el-table-column>
            <el-table-column
              prop="type"
              align="center"
              label="类型">
              <template slot-scope="scope">
                {{scope.row.sourceName}}-{{scope.row.typeName}}
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination v-if="customerModel.interactPagination.enable" class="template-table-pagination"
                         :page-sizes="customerModel.interactPagination.sizeOpts" :total="customerModel.interactPagination.total"
                         :current-page="customerModel.interactPagination.page" :page-size="customerModel.interactPagination.size"
                         layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
                         @current-change="pageChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="消费记录" name="consume" class="padding-tb-base">
          <el-row :gutter="20">
            <el-col :span="4">
              <ul class="data-list">
                <li v-for="item in customerModel.consumeCount" :key="item.index" >
                  <span class="data-list__num">{{item.number}}</span>
                  <p class="data-list__title">{{item.title}}</p>
                </li>
              </ul>
            </el-col>
            <el-col :span="20">
              <el-form label-width="60px"
                       v-model="customerModel.consumeForm">
                <el-form-item class='el-inline-block' label="订单编号：">
                  <el-form-grid size="xs">
                    <el-input
                      v-model="customerModel.consumeForm.outTradeId"
                      placeholder='订单编号'></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="订单状态：">
                  <el-form-grid size="xs">
                    <ns-select  v-model="customerModel.consumeForm.tradeStatus" filterable clearable :placeholder="$t('prompt.select')"
                                :multiple="false" :url="$api.core.common.getTradeStatus">
                    </ns-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="付款时间：">
                  <el-form-grid>
                    <ns-datetime size="small" startPlaceholder="" endPlaceholder="" v-model="customerModel.consumeForm.time"></ns-datetime>
                  </el-form-grid>
                </el-form-item>
                <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
              </el-form>
              <!-- 表格 -->
              <el-table
                :data="customerModel.consumeTable"
                style="width: 100%">
                <el-table-column
                  prop="out_trade_id"
                  align="center"
                  label="订单编号">
                </el-table-column>
                <el-table-column
                  prop="pay_time"
                  align="center"
                  label="付款时间">
                </el-table-column>
                <el-table-column
                  prop="payment"
                  align="center"
                  label="付款总额(元)">
                </el-table-column>
                <el-table-column
                  prop="num"
                  align="center"
                  label="商品数(元)">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <ns-table-column-operate-button :buttons="customerModel.consumeButton"
                                                    :prop="scope">
                    </ns-table-column-operate-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination v-if="customerModel.consumePagination.enable" class="template-table-pagination"
                             :page-sizes="customerModel.consumePagination.sizeOpts" :total="customerModel.consumePagination.total"
                             :current-page="customerModel.consumePagination.page" :page-size="customerModel.consumePagination.size"
                             layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
                             @current-change="pageChange">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!--<el-tab-pane label="活动参与" name="interact">
        </el-tab-pane>-->
        <el-tab-pane label="触达记录" name="touch"  class="padding-tb-base">
          <el-row :gutter="20">
            <el-col :span="4">
              <ul class="data-list">
                <li v-for="item in customerModel.touchList" :key="item.index">
                  <span class="data-list__num">{{item.number}}</span>
                  <p class="data-list__title">{{item.title}}</p>
                </li>
              </ul>
            </el-col>
            <el-col :span="20">
              <el-form label-width="70px"
                       v-model="customerModel.touchForm">
                <el-form-item class='el-inline-block' label="触达类型：">
                  <el-form-grid size="xs">
                    <el-select v-model="customerModel.touchForm.sendSource" :placeholder="$t('prompt.select')" filterable clearable>
                      <el-option v-for="item in customerModel.touchType" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="来源：" label-width="50px">
                  <el-form-grid size="xs">
                    <ns-select  v-model="customerModel.touchForm.typeMark" filterable clearable :placeholder="$t('prompt.select')"
                                :multiple="false" :url="$api.core.common.queryCareType">
                    </ns-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="触达时间：">
                  <ns-datetime size="small" startPlaceholder="" endPlaceholder="" v-model="customerModel.touchForm.time"></ns-datetime>
                </el-form-item>
                <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
              </el-form>
              <!-- 表格 -->
              <el-table
                :data="customerModel.touchTable"
                style="width: 100%">
                <el-table-column
                  prop="send_source"
                  label="触达类型" align="center">
                  <template slot-scope="scope">
                    <div slot="reference">
                      {{setTouchType(scope.row.send_source)}}
                     </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="send_time"
                  label="触达时间" align="center">
                </el-table-column>
                <el-table-column
                  prop="typeMarkName"
                  align="center"
                  label="来源">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <ns-table-column-operate-button :buttons="customerModel.touchButton" :prop="scope">
                    </ns-table-column-operate-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination v-if="customerModel.touchPagination.enable" class="template-table-pagination"
                             :page-sizes="customerModel.touchPagination.sizeOpts" :total="customerModel.touchPagination.total"
                             :current-page="customerModel.touchPagination.page" :page-size="customerModel.touchPagination.size"
                             layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
                             @current-change="pageChange">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="优惠券" name="coupon" class="padding-tb-base">
          <el-row :gutter="20">
            <el-col :span="3">
              <ul class="data-list coupon-list">
                <li @click="setCouponStatus('0')" :class="{'active':customerModel.couponStatus == '0'}">
                  <span class="data-list__num">{{customerModel.couponList.noExpiredCount}}</span>
                  <p class="data-list__title">有效</p>
                </li>
                <li @click="setCouponStatus('1')" :class="{'active':customerModel.couponStatus == '1'}">
                  <span class="data-list__num">{{customerModel.couponList.expiredCount}}</span>
                  <p class="data-list__title">已过期</p>
                </li>
                <li @click="setCouponStatus('used')" :class="{'active':customerModel.couponStatus == 'used'}">
                  <span class="data-list__num">{{customerModel.couponList.usedCount}}</span>
                  <p class="data-list__title">已使用</p>
                </li>
              </ul>
            </el-col>
            <el-col :span="21">
              <el-form label-width="75px"
                       v-model="customerModel.couponForm">
                <el-form-item class='el-inline-block' label="优惠券名称：">
                  <el-form-grid size="xs">
                    <el-input
                      v-model="customerModel.couponForm.couponTitle"
                      placeholder=''></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="来源：">
                  <el-form-grid size="xs">
                    <ns-select  v-model="customerModel.couponForm.channel" filterable clearable :placeholder="$t('prompt.select')"
                                :multiple="false" :url="$api.marketing.coupon.queryCouponChannel">
                    </ns-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="过期时间：">
                  <el-form-grid>
                    <ns-datetime size="medium" startPlaceholder="" endPlaceholder="" v-model="customerModel.couponForm.time"></ns-datetime>
                  </el-form-grid>
                </el-form-item>
                <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
              </el-form>
              <!-- 表格 -->
              <el-table
                :data="customerModel.couponTable"
                style="width: 100%">
                <el-table-column
                  align="center"
                  label="优惠券" width="200px">
                  <template slot-scope="scope">
                    <div slot="reference" class="coupon-main" :class="scope.row.coupon_status == 0 ? {'disabled': false}:{'disabled': true}">
                      <div class="coupon-data">
                        {{Fen2Yuan(scope.row.denominations)}}
                      </div>
                      <div class="coupon-text">
                        <span v-if="scope.row.coupon_condition == 0">无门槛</span>
                        <span v-if="scope.row.coupon_condition != 0">订单满{{Fen2Yuan(scope.row.denominations)}}元</span>
                        <p>元优惠劵</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="200"
                  label="优惠券说明">
                  <template slot-scope="scope">
                    <div slot="reference" class="explain-list">
                      <p>
                        优惠券名称：{{scope.row.coupon_title}}
                      </p>
                      <p>
                        类型：{{scope.row.couponTypeName}}
                      </p>
                      <p>
                        使用条件：
                        <span v-if="scope.row.coupon_condition == 0">无门槛</span>
                        <span v-if="scope.row.coupon_condition != 0">订单满{{Fen2Yuan(scope.row.denominations)}}元</span>
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="start_time"
                  align="center"
                  label="有效期">
                  <template slot-scope="scope">
                    {{scope.row.start_time}}至{{scope.row.end_time}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sendTypeName"
                  align="center"
                  label="类型">
                </el-table-column>
                <el-table-column
                  label="来源"
                  prop="channelName"
                  align="center">
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination v-if="customerModel.couponPagination.enable" class="template-table-pagination"
                             :page-sizes="customerModel.couponPagination.sizeOpts" :total="customerModel.couponPagination.total"
                             :current-page="customerModel.couponPagination.page" :page-size="customerModel.couponPagination.size"
                             layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
                             @current-change="pageChange">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="other" class="padding-tb-base">
          <el-row :gutter="20">
            <el-col :span="3">
              <ul class="data-list coupon-list">
                <li @click="setOtherType('0')" :class="{'active':customerModel.otherType == '0'}">
                  <span class="data-list__num">{{customerModel.nickCount}}</span>
                  <p class="data-list__title">昵称</p>
                </li>
                <li @click="setOtherType('1')" :class="{'active':customerModel.otherType == '1'}">
                  <span class="data-list__num">0</span>
                  <p class="data-list__title">收货地址</p>
                </li>
                <li @click="setOtherType('2')" :class="{'active':customerModel.otherType == '2'}">
                  <span class="data-list__num">0</span>
                  <p class="data-list__title">支付信息</p>
                </li>
              </ul>
            </el-col>
            <el-col :span="21">
              <el-form label-width="60px"
                       v-model="customerModel.outNickForm">
                <el-form-item class='el-inline-block' label="昵称：">
                  <el-form-grid size="xs">
                    <el-input
                      v-model="customerModel.outNickForm.outNick"
                      placeholder=''></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="来源：">
                  <el-form-grid size="xs">
                    <ns-select  v-model="customerModel.outNickForm.platform" filterable clearable :placeholder="$t('prompt.select')"
                                :multiple="false" :url="$api.core.common.queryPlatForm">
                    </ns-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class='el-inline-block' label="获取时间：">
                  <el-form-grid>
                    <ns-datetime size="small" startPlaceholder="" endPlaceholder="" v-model="customerModel.outNickForm.time"></ns-datetime>
                  </el-form-grid>
                </el-form-item>
                <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
              </el-form>
              <!-- 表格 -->
              <el-table
                :data="customerModel.outNickTable"
                style="width: 100%">
                <el-table-column
                  align="center"
                  prop="out_nick"
                  label="昵称" width="200px">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="platFormName"
                  label="来源">
                </el-table-column>
                <el-table-column
                  label="获取时间"
                  prop="create_time"
                  align="center">
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination v-if="customerModel.outNickPagination.enable" class="template-table-pagination"
                             :page-sizes="customerModel.outNickPagination.sizeOpts" :total="customerModel.outNickPagination.total"
                             :current-page="customerModel.outNickPagination.page" :page-size="customerModel.outNickPagination.size"
                             layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange"
                             @current-change="pageChange">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">关闭</ns-button>
      </div>
    </el-dialog>

    <el-dialog :title="customerModel.DetailTitle" :visible.sync="customerModel.orderVisible" :modal-append-to-body ="false"
               :vetically=true :close-on-click-modal="false" width="700px" size="tiny" class="custom-dialog">
      <span v-if="customerModel.activeName == 'consume'">
         <el-form ref="form" placement="right" label-width="100px" :model="customerModel.orderDetail">
        <el-form-item label="订单编号：" class="el-inline-block" style="width: 50%;">
          <el-form-grid>{{customerModel.orderDetail.outTradeId}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建时间：" class="el-inline-block">
          <el-form-grid>{{customerModel.orderDetail.created}}
          </el-form-grid>
        </el-form-item>
         <el-form-item label="付款金额：" class="el-inline-block" style="width: 50%;">
          <el-form-grid>¥ {{customerModel.orderDetail.payment}}（优惠：¥ {{customerModel.orderDetail.discountFee}} 含快递：¥ {{customerModel.orderDetail.postFee}}）
          </el-form-grid>
        </el-form-item>
        <el-form-item label="下单时间：" class="el-inline-block">
          <el-form-grid>{{customerModel.orderDetail.payTime}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="交易状态：">
          <el-form-grid>{{customerModel.orderDetail.TradeStatusName}}
          </el-form-grid>
        </el-form-item>
            <el-table :data="customerModel.orderDetail.order" stripe style="width: 100%">
            <el-table-column prop="date" label="商品图片" width="100px" align="center">
              <template slot-scope="scope">
                <div class="customer-img">
                  <img :src="scope.row.pic_path" width="100px">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品详情" width="250px">
              <template slot-scope="scope">
                <el-row><el-col :span="24">商品标题：{{scope.row.title}}</el-col></el-row>
                <el-row><el-col :span="24">商品编码：{{scope.row.out_item_id}}</el-col></el-row>
                <el-row v-if="scope.row.sku_properties != null"><el-col :span="24">规格：{{scope.row.sku_properties}}</el-col></el-row>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="单价" align="center" width="100px">
              <template slot-scope="scope">
                ¥{{scope.row.order_price}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="数量" align="center" width="100px">
              <template slot-scope="scope">
                {{scope.row.order_num}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="总金额" align="center" width="100px">
              <template slot-scope="scope">
                ¥{{scope.row.order_payment}}
              </template>
            </el-table-column>
          </el-table>
      </el-form>
      </span>
      <span v-if="customerModel.activeName == 'touch'">
        <el-form ref="form" placement="right" label-width="100px" :model="customerModel.touchDetail">
        <el-form-item label="触达类型：" class="el-inline-block" style="width: 50%;">
          <el-form-grid>{{customerModel.touchDetail.sendSource}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="触达时间：" class="el-inline-block">
          <el-form-grid>
            {{customerModel.touchDetail.sendTime}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="来源：">
          <el-form-grid>
            {{customerModel.touchDetail.typeMark}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="触达内容：">
          <el-input disabled type="textarea" :value="customerModel.touchDetail.content"></el-input>
        </el-form-item>
      </el-form>
      </span>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDetail()">关闭</ns-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NsCustomerDetail from './src/NsCustomerDetail'
  export default NsCustomerDetail
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  @component-namespace custom {
    @b dialog {
      .integral-label {
        color: var(--theme-font-color-danger);
        &.integral-green {
          color: green;
        }
      }
      .data-list {
        padding: 0;
        text-align: center;
        list-style: none;
        li {
          padding: var(--default-padding-larger);
          background-color: var(--theme-bg-color-base);
          & + li {
            margin-top: var(--default-margin-base);
          }
        }
        .data-list__num {
          font-weight: bold;
          font-size: var(--default-font-size-large);
        }
        .data-list__title {
          margin: 0;
          color: var(--theme-font-color-secondary);
        }
        &.coupon-list, &.other-list {
          li.active {
            background-color: var(--theme-font-color-regular);
            .data-list__num {
              color: var(--theme-color-white);
            }
            .data-list__title {
              color: var(--theme-color-white);
            }
          }
        }
      }
      .coupon-main {
        display: flex;
        border: 1px solid var(--theme-base-border-color-primary);
        padding: var(--default-padding-base);
        .coupon-data {
          font-size: 12px;
          padding: 3px;
          line-height: 40px;
          color: var(--theme-font-color-danger);
        }
        .coupon-text {
          display: grid;
          flex: 1;
          span {
            padding: var(--default-padding-small);
            color: var(--theme-color-white);
            background-color: var(--theme-font-color-danger);
          }
          p {
            text-align: left;
            margin: 0;
            color: var(--theme-font-color-danger);
          }
        }
        &.disabled {
          .coupon-data {
            color: var(--theme-font-color-secondary);
          }
          .coupon-text {
            span {
              background-color: var(--theme-font-color-secondary);
            }
            p {
              color: var(--theme-font-color-secondary);
            }
          }
        }
      }
      .explain-list {
        p {
          text-align: left;
          margin: 0;
        }
      }
    }
  }
  @component-namespace customer {
    @b head {
      display: flex;
      @e info {
        display: flex;
        @b img {
          width: 100px;
          img {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
        }
        @b info {
          .control-item {
            .control-label {
              width: 50px;
            }
          }
        }
      }
      @e data {
        flex: 1;
        margin: 0;
        padding: var(--default-padding-base);
        @b data {
          @e item {
            text-align: center;
            .customer-data__bg {
              height: 100%;
              padding: var(--default-padding-larger);
              background-color: var(--theme-bg-color-base);
              .customer-data__num {
                font-weight: bold;
                font-size: var(--default-font-size-large);
              }
              .customer-data__title {
                margin: 0;
                color: var(--theme-font-color-secondary);
              }
            }
          }
        }
      }
    }
  }
  @component-namespace form {
    @b grid {
      border: 1px solid var(--theme-base-border-color-primary);
      & + .form-grid {
        margin-top: var(--default-margin-base);
      }

      & + .el-form-item {
        margin-top: 20px;
      }

      @e title {
        height: 32px;
        padding-left: var(--default-padding-larger);
        line-height: 32px;
        color: var(--theme-font-color-primary);
        background-color: var(--theme-bg-color-primary);
      }
      @e content {
        padding: var(--default-padding-base) 0;

        .el-form-truncation {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .control-form {
    line-height: 30px;
    font-size: var(--default-font-size-small);
    color:  var(--theme-font-color-primary);
    padding-right: var(--default-padding-larger);
    .control-item {
      display: table;
      min-height: 32px;
      padding: var(--default-padding-small) 0;
      line-height: 20px;
      .control-label {
        display: table-cell;
        line-height: 1;
        text-align: right;
        width: 110px;
      }
      .control-content {
        display: table-cell;
        position: relative;
      }
    }
  }
</style>
