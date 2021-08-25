<template>
  <!-- 别的地方全程照搬过来的，后面可能需要重写，我也不知道逻辑是什么 -->
  <el-dialog
    title="详情"
    width="1000px"
    height="500px"
    :visible.sync="shopKuhuShow"
    class="dialog-container"
    @close="closeDetailDialog"
  >
    <template slot="title">
      <div class="dialog-header">
        <span class="dialog-header__title">详情</span>
        <view-select class="dialog-header__select" :showTitle="false" :viewList="viewList" ref="viewSelect" v-model="viewId" @change="viewChange"/>
      </div>
    </template>
    <div class="dialog-container__msg">
      <div class="dialog-avatar">
        <el-image
          :width="80"
          :height="80"
          :src="items.customerHeadImage || require('./images/avartar.png')"
          mode="cover"
          :circle="true"
          class="dialog-avatar__headportrait"
        ></el-image>
        <div
          class="dialog-avatar__figure"
          v-if="items.sex === 1 || items.sex === 0"
        >
          <Icon
            v-if="items.sex === 1"
            type="men"
            className="dialog-avatar__figure--male"
          />
          <!-- 女生图标-->
          <Icon v-else type="women" className="dialog-avatar__figure--female" />
        </div>
        <div class="dialog-avatar__level" v-if="items.grade > 0">
          {{ items.gradeName }}
        </div>
      </div>
      <el-form label-width="110px" class="dialog-form__wrapper">
        <el-form-item label="姓名：" class="el-inline-block">
          <el-form-grid size="xs">
            <div
              class="dialog-remark"
              v-if="items.customerName && items.customerName.length < 6"
            >
              {{ items.customerName }}
            </div>
            <div
              v-else-if="items.customerName && items.customerName.length >= 6"
            >
              <el-tooltip :content="items.customerName">
                <span class="dialog-hidden">{{ items.customerName }}</span>
              </el-tooltip>
            </div>
            <div v-else>
              -
            </div>
          </el-form-grid>
        </el-form-item>
        <el-form-item class="el-inline-block dialog-favorable">
          <template slot="label">
            <div class="dialog-title">
              <div class="dialog-title__text">
                <Icon
                  type="discount"
                  className="dialog-favorable__text dialog-favorable__text--discount"
                />
                <span>会员折扣：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ items.discount || '-' }}折</div>
          </el-form-grid>
        </el-form-item>
        <!--新的积分展示信息-->
        <el-form-item
          v-if="integralIsShow[1]"
          class="el-inline-block dialog-favorable"
        >
          <template slot="label">
            <div class="dialog-title">
              <div
                class="dialog-title__text"
                v-if="integralAliasName[1].length < 7"
              >
                <Icon
                  type="integration"
                  className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"
                />
                <span>{{ integralAliasName[1] }}：</span>
              </div>
              <div v-else class="dialog-title__text">
                <el-tooltip :content="integralAliasName[1]">
                  <span class="dialog-conceal">{{ integralAliasName[1] }}</span>
                </el-tooltip>
                <span>：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ integralIsNum[1] || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <el-form-item
          v-if="integralIsShow[4]"
          class="el-inline-block dialog-favorable"
        >
          <template slot="label">
            <div class="dialog-title">
              <div class="dialog-title__text" v-if="integralName[4].length < 7">
                <Icon
                  type="integration"
                  className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"
                />
                <span>{{ integralName[4] }}：</span>
              </div>
              <div v-else class="dialog-title__text">
                <el-tooltip :content="integralName[4]">
                  <span class="dialog-conceal">{{ integralName[4] }}</span>
                </el-tooltip>
                <span>：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remar1k">{{ integralIsNum[4] || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="手机：" class="el-inline-block">
          <el-form-grid size="xs"
            ><div class="dialog-remark">{{ items.mobile }}</div></el-form-grid
          >
        </el-form-item>
        <el-form-item
          v-if="integralIsShow[0]"
          class="el-inline-block dialog-favorable"
        >
          <template slot="label">
            <div class="dialog-title">
              <div
                class="dialog-title__text"
                v-if="integralAliasName[0].length < 7"
              >
                <Icon
                  type="integration"
                  className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"
                />
                <span>{{ integralAliasName[0] }}：</span>
              </div>
              <div v-else class="dialog-title__text">
                <el-tooltip :content="integralAliasName[0]">
                  <span class="dialog-conceal">{{ integralAliasName[0] }}</span>
                </el-tooltip>
                <span>：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ integralIsNum[0] || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <el-form-item
          v-if="integralIsShow[2]"
          class="el-inline-block dialog-favorable"
        >
          <template slot="label">
            <div class="dialog-title">
              <div class="dialog-title__text" v-if="integralName[2].length < 7">
                <Icon
                  type="integration"
                  className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"
                />
                <span>{{ integralName[2] }}：</span>
              </div>
              <div v-else class="dialog-title__text">
                <el-tooltip :content="integralName[2]">
                  <span class="dialog-conceal">{{ integralName[2] }}</span>
                </el-tooltip>
                <span>：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ integralIsNum[2] || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="备注：" class="el-inline-block">
          <el-form-grid size="xs">
            <div
              class="dialog-remark"
              v-if="items.customerRemark && items.customerRemark.length < 16"
            >
              {{ items.customerRemark || '-' }}
            </div>
            <div v-else>
              <el-tooltip :content="items.customerRemark">
                <span class="dialog-hidden">{{ items.customerRemark }}</span>
              </el-tooltip>
            </div>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">
          <template slot="label">
            <div class="dialog-title">
              <div class="dialog-title__text">
                <Icon
                  type="coupon"
                  className="dialog-favorable__text dialog-favorable__text--coupon"
                />
                <span>优惠券：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ items.couponNum || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <!--新的积分展示信息-->
        <el-form-item
          v-if="integralIsShow[3]"
          class="el-inline-block dialog-favorable"
        >
          <template slot="label">
            <div class="dialog-title">
              <div class="dialog-title__text" v-if="integralName[3].length < 7">
                <Icon
                  type="integration"
                  className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"
                />
                <span>{{ integralName[3] }}：</span>
              </div>
              <div v-else class="dialog-title__text">
                <el-tooltip :content="integralName[3]">
                  <span class="dialog-conceal">{{ integralName[3] }}</span>
                </el-tooltip>
                <span>：</span>
              </div>
            </div>
          </template>
          <el-form-grid size="xs">
            <div class="dialog-remark">{{ integralIsNum[3] || 0 }}</div>
          </el-form-grid>
        </el-form-item>
        <!--          <el-form-item :label="integralName[3]+'：'" class="el-inline-block dialog-favorable" v-if="integralIsShow[3]">-->
        <!--            <el-form-grid size="xs">-->
        <!--              <span>{{integralIsNum[3]}}</span>-->
        <!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;integration"><Icon type="icon_integration"/></i>-->
        <!--            </el-form-grid>-->
        <!--          </el-form-item>-->
      </el-form>
    </div>
    <div class="dialog-container__tabs">
      <el-tabs v-model="selectedTabName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basic">
          <div class="dialog-basic">
            <div class="dialog-basic__title">基础信息</div>
            <el-form label-width="180px" class="dialog-basic__form">
              <el-form-item label="生日：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.birthday || '-'
                }}</el-form-grid>
              </el-form-item>
              <el-form-item label="公众号状态：" class="el-inline-block">
                <el-form-grid size="xxmd">
                  {{ items.fansStatusVos ? (items.fansStatusVos.some((item)=>{ return item.subscribe === 1 }) ? '已关注'
                    : (items.fansStatusVos.some((item)=>{ return item.subscribe === -1 }) ? '未关注' : '未知')) : '-' }}</el-form-grid>
              </el-form-item>
              <el-form-item label="会员卡号：" class="el-inline-block">
                <el-form-grid size="xxmd">{{ items.memberCard }}</el-form-grid>
              </el-form-item>
              <el-form-item label="性别：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.sex === 1 ? '男' : items.sex === 0 ? '女' : '未知'
                }}</el-form-grid>
              </el-form-item>
              <el-form-item label="开卡时间：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.activateTime || '-'
                }}</el-form-grid>
              </el-form-item>
              <el-form-item label="Email：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.email || '-'
                }}</el-form-grid>
              </el-form-item>
              <el-form-item label="所在地区：" class="el-inline-block">
                <el-form-grid size="xxmd">{{ items.province }}</el-form-grid>
              </el-form-item>
              <el-form-item label="详细地址：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.address || '-'
                }}</el-form-grid>
              </el-form-item>
              <el-form-item label="昵称：" class="el-inline-block">
                <el-form-grid size="xxmd">{{
                  items.outAlias || '-'
                }}</el-form-grid>
              </el-form-item>
            </el-form>
          </div>
          <div class="dialog-basic">
            <div class="dialog-basic__title">属性标签</div>
            <el-form label-width="180px" class="dialog-basic__form">
              <el-form-item
                :label="tag.name + '：'"
                class="el-inline-block"
                v-for="tag in items.tagList"
                :key="tag.id"
              >
                <el-form-grid
                  v-if="tag.tag && tag.tag.length <= 20"
                  size="xxmd"
                  >{{ tag.tag }}</el-form-grid
                >
                <el-tooltip
                  v-if="tag.tag && tag.tag.length > 20"
                  :content="tag.tag"
                  popper-class="table-body__tooltip"
                >
                  <el-form-grid class="tagDisplay" size="xxmd">{{
                    tag.tag
                  }}</el-form-grid>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="交易信息" name="transaction" v-model="rfmInfo">
          <div class="dialog-transaction">
            <el-form class="dialog-transaction__form">
              <el-form-item label="当前客户累计交易额（元）">
                <el-tooltip content="交易成功订单的总金额（包含退款金额）">
                  <i class="questioncircle"><Icon type="question-circle"/></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item class="dialog-merchandise">
                <el-form-grid class="dialog-merchandise__money"
                  >¥{{ rfmInfo.tradeAmount }}</el-form-grid
                >
                <el-form-grid class="dialog-merchandise__frequency"
                  >（交易次数：{{ rfmInfo.tradeAllTimes || 0 }}）</el-form-grid
                >
              </el-form-item>
              <el-form-item class="dialog-detail">
                <el-form-grid size="md">
                  回购周期：{{ rfmInfo.buyBackAllPeriod }}
                  <el-tooltip
                    content="（最近一次交易成功时间-第一次交易成功时间）/（交易成功次数-1）"
                  >
                    <Icon type="question-circle" />
                  </el-tooltip>
                </el-form-grid>
                <el-form-grid size="md">
                  笔单价：{{ rfmInfo.priceUnit }}元
                  <el-tooltip content="交易成功总额/交易成功订单数（包含退款）">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </el-form-grid>
                <el-form-grid size="md">
                  连带率：{{ rfmInfo.itemUnit }}件
                  <el-tooltip
                    content="交易成功订单商品数量/交易成功订单数（包含退款）"
                  >
                    <Icon type="question-circle" />
                  </el-tooltip>
                </el-form-grid>
                <el-form-grid size="md">
                  退款次数：{{ rfmInfo.refundTimes }}次
                  <el-tooltip
                    content="计算主订单中子订单发生退款行为，就计算为1次（同一个主订单中含有多个子订单退款也只是计算一次）"
                  >
                    <Icon type="question-circle" />
                  </el-tooltip>
                </el-form-grid>
                <el-form-grid size="md">
                  退款总额：{{ rfmInfo.refundAmount || '0' }}元
                  <el-tooltip content="退款完成的子订单总金额">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="最近交易：">
                <el-form-grid size="xxlg">
                  {{ rfmInfo.lastSuccessTime }}
                  <el-tooltip content="最近一笔交易成功时间">
                    <i class="questioncircle"><Icon type="question-circle"/></i>
                  </el-tooltip>
                </el-form-grid>
                <el-form-grid size="xmd" class="dialog-checkbtn">
                  <!--4.0 版本暂无查看历史功能-->
                  <ns-button type="text" v-if="false">查看历史</ns-button>
                </el-form-grid>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="integralLogIsShow[0]"
          :label="integralName[0]"
          name="integral1"
        >
          <div class="dialog-integral">
            <ns-page-table>
              <template slot="advancedSearch">
                <el-form class="dialog-integral__form">
                  <el-form-item class="dialog-formitem">
                    <el-form-grid class="dialog-formitem__choice">
                      变更时间：
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="startTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="disposeStartTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <span class="dialog-space">-</span>
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="endTime"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="yyyy-MM-dd 23:59:59"
                        @change="disposeEndTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <ns-button
                        type="primary"
                        @click="seachIntegral(0)"
                        class="dialog-leftspace"
                        >搜索</ns-button
                      >
                    </el-form-grid>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="table">
                <el-table
                  ref="table"
                  :data="tableData[integralName[0]]"
                  stripe
                  resizable
                  @sort-change="$orderChange$"
                  row-key="id"
                >
                  <el-table-column
                    prop="integral"
                    :label="'增减' + integralAliasName[0]"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="text-danger" v-if="scope.row.type == 1">
                        {{ '+ ' + scope.row.total }}
                      </span>
                      <span
                        class="text-success"
                        v-else-if="scope.row.type == 3"
                      >
                        {{ '- ' + scope.row.total }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="变更时间"
                    align="center"
                    :width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.createTime || '_' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 1
                          ? '赠送'
                          : scope.row.type == 3
                          ? '扣减'
                          : ''
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 表格  结束  -->
              <!-- 分页 -->
              <template slot="pagination">
                <el-pagination
                  v-if="_data.integralPagination.enable"
                  class="template-table__pagination"
                  :page-sizes="_data.integralPagination.sizeOpts"
                  :total="_data.integralPagination.total"
                  :current-page="_data.integralPagination.page"
                  :page-size="_data.integralPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="integralSizeChange"
                  @current-change="integralPageChange"
                  ref="integralPage1"
                >
                </el-pagination>
              </template>
            </ns-page-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="integralLogIsShow[1]"
          :label="integralName[1]"
          name="integral2"
        >
          <div class="dialog-integral">
            <ns-page-table>
              <template slot="advancedSearch">
                <el-form class="dialog-integral__form">
                  <el-form-item class="dialog-formitem">
                    <el-form-grid class="dialog-formitem__choice">
                      变更时间：
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="startTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="disposeStartTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <span class="dialog-space">-</span>
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="endTime"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="yyyy-MM-dd 23:59:59"
                        @change="disposeEndTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <ns-button
                        type="primary"
                        @click="seachIntegral(1)"
                        class="dialog-leftspace"
                        >搜索</ns-button
                      >
                    </el-form-grid>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="table">
                <el-table
                  ref="table"
                  :data="tableData[integralName[1]]"
                  stripe
                  resizable
                  @sort-change="$orderChange$"
                  row-key="id"
                >
                  <el-table-column
                    prop="integral"
                    :label="'增减' + integralAliasName[1]"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="text-danger" v-if="scope.row.type == 1">
                        {{ '+ ' + scope.row.total }}
                      </span>
                      <span
                        class="text-success"
                        v-else-if="scope.row.type == 3"
                      >
                        {{ '- ' + scope.row.total }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="变更时间"
                    align="center"
                    :width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.createTime || '_' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 1
                          ? '赠送'
                          : scope.row.type == 3
                          ? '扣减'
                          : ''
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 表格  结束  -->
              <!-- 分页 -->
              <template slot="pagination">
                <el-pagination
                  v-if="_data.integralPagination.enable"
                  class="template-table__pagination"
                  :page-sizes="_data.integralPagination.sizeOpts"
                  :total="_data.integralPagination.total"
                  :current-page="_data.integralPagination.page"
                  :page-size="_data.integralPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="integralSizeChange"
                  @current-change="integralPageChange"
                  ref="integralPage2"
                >
                </el-pagination>
              </template>
            </ns-page-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="integralLogIsShow[2]"
          :label="integralName[2]"
          name="integral3"
        >
          <div class="dialog-integral">
            <ns-page-table>
              <template slot="advancedSearch">
                <el-form class="dialog-integral__form">
                  <el-form-item class="dialog-formitem">
                    <el-form-grid class="dialog-formitem__choice">
                      变更时间：
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="startTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="disposeStartTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <span class="dialog-space">-</span>
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="endTime"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="yyyy-MM-dd 23:59:59"
                        @change="disposeEndTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <ns-button
                        type="primary"
                        @click="seachIntegral(2)"
                        class="dialog-leftspace"
                        >搜索</ns-button
                      >
                    </el-form-grid>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="table">
                <el-table
                  ref="table"
                  :data="tableData[integralName[2]]"
                  stripe
                  resizable
                  @sort-change="$orderChange$"
                  row-key="id"
                >
                  <el-table-column
                    prop="integral"
                    :label="'增减' + integralAliasName[2]"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="text-danger" v-if="scope.row.type == 1">
                        {{ '+ ' + scope.row.total }}
                      </span>
                      <span
                        class="text-success"
                        v-else-if="scope.row.type == 3"
                      >
                        {{ '- ' + scope.row.total }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="变更时间"
                    align="center"
                    :width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.createTime || '_' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 1
                          ? '赠送'
                          : scope.row.type == 3
                          ? '扣减'
                          : ''
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 表格  结束  -->
              <!-- 分页 -->
              <template slot="pagination">
                <el-pagination
                  v-if="_data.integralPagination.enable"
                  class="template-table__pagination"
                  :page-sizes="_data.integralPagination.sizeOpts"
                  :total="_data.integralPagination.total"
                  :current-page="_data.integralPagination.page"
                  :page-size="_data.integralPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="integralSizeChange"
                  @current-change="integralPageChange"
                  ref="integralPage3"
                >
                </el-pagination>
              </template>
            </ns-page-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="integralLogIsShow[3]"
          :label="integralName[3]"
          name="integral4"
        >
          <div class="dialog-integral">
            <ns-page-table>
              <template slot="advancedSearch">
                <el-form class="dialog-integral__form">
                  <el-form-item class="dialog-formitem">
                    <el-form-grid class="dialog-formitem__choice">
                      变更时间：
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="startTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="disposeStartTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      -
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="endTime"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="yyyy-MM-dd 23:59:59"
                        @change="disposeEndTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <ns-button type="primary" @click="seachIntegral(3)"
                        >搜索</ns-button
                      >
                    </el-form-grid>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="table">
                <el-table
                  ref="table"
                  :data="tableData[integralName[3]]"
                  stripe
                  resizable
                  @sort-change="$orderChange$"
                  row-key="id"
                >
                  <el-table-column
                    prop="integral"
                    :label="'增减' + integralAliasName[3]"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="text-danger" v-if="scope.row.type == 1">
                        {{ '+ ' + scope.row.total }}
                      </span>
                      <span
                        class="text-success"
                        v-else-if="scope.row.type == 3"
                      >
                        {{ '- ' + scope.row.total }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="变更时间"
                    align="center"
                    :width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.createTime || '_' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 1
                          ? '赠送'
                          : scope.row.type == 3
                          ? '扣减'
                          : ''
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 表格  结束  -->
              <!-- 分页 -->
              <template slot="pagination">
                <el-pagination
                  v-if="_data.integralPagination.enable"
                  class="template-table__pagination"
                  :page-sizes="_data.integralPagination.sizeOpts"
                  :total="_data.integralPagination.total"
                  :current-page="_data.integralPagination.page"
                  :page-size="_data.integralPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="integralSizeChange"
                  @current-change="integralPageChange"
                  ref="integralPage4"
                >
                </el-pagination>
              </template>
            </ns-page-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="integralLogIsShow[4]"
          :label="integralName[4]"
          name="integral5"
        >
          <div class="dialog-integral">
            <ns-page-table>
              <template slot="advancedSearch">
                <el-form class="dialog-integral__form">
                  <el-form-item class="dialog-formitem">
                    <el-form-grid class="dialog-formitem__choice">
                      变更时间：
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="startTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="disposeStartTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      -
                    </el-form-grid>
                    <el-form-grid size="md">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择"
                        v-model="endTime"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="yyyy-MM-dd 23:59:59"
                        @change="disposeEndTime"
                      >
                      </el-date-picker>
                    </el-form-grid>
                    <el-form-grid>
                      <ns-button type="primary" @click="seachIntegral(4)"
                        >搜索</ns-button
                      >
                    </el-form-grid>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="table">
                <el-table
                  ref="table"
                  :data="tableData[integralName[4]]"
                  stripe
                  resizable
                  @sort-change="$orderChange$"
                  row-key="id"
                >
                  <el-table-column
                    prop="integral"
                    :label="'增减' + integralAliasName[4]"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="text-danger" v-if="scope.row.type == 1">
                        {{ '+ ' + scope.row.total }}
                      </span>
                      <span
                        class="text-success"
                        v-else-if="scope.row.type == 3"
                      >
                        {{ '- ' + scope.row.total }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="变更时间"
                    align="center"
                    :width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.createTime || '_' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 1
                          ? '赠送'
                          : scope.row.type == 3
                          ? '扣减'
                          : ''
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 表格  结束  -->
              <!-- 分页 -->
              <template slot="pagination">
                <el-pagination
                  v-if="_data.integralPagination.enable"
                  class="template-table__pagination"
                  :page-sizes="_data.integralPagination.sizeOpts"
                  :total="_data.integralPagination.total"
                  :current-page="_data.integralPagination.page"
                  :page-size="_data.integralPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="integralSizeChange"
                  @current-change="integralPageChange"
                  ref="integralPage5"
                >
                </el-pagination>
              </template>
            </ns-page-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer">
      <ns-button @click="closeDetailDialog">关闭</ns-button>
    </span>
  </el-dialog>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style scoped>
@import '@theme/variables.pcss';

:root {
  --dialog-font-color-red: #ff1985;
  --dialog--font-color-brown: #904b00;
}
@component-namespace dialog {
  @b header {
    display: flex;
    align-items: center;
    @e title {}
    @e select {
      margin-left: 30px;
    }
  }
  @b container {
    @e msg {
      /* display: flex; */
      position: relative;
      /*padding: var(--default-padding-larger) 0 var(--default-padding-larger) var(--default-padding-small);*/
      /*border-bottom: 1px solid var(--theme-base-border-color-primary);*/
      padding: var(--default-margin-small) 0 var(--default-padding-larger)
        var(--default-padding-small);
    }
  }
  @b avatar {
    width: 80px;
    position: absolute;
    left: 25px;
    top: 5px;
    @e headportrait {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    @e figure {
      width: 26px;
      height: 26px;
      position: absolute;
      right: 2px;
      top: -6px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--theme-color-white);
      border-radius: 50%;
      @m female {
        font-size: var(--default-font-size-large);
        color: var(--dialog-font-color-red);
      }
      @m male {
        font-size: var(--default-font-size-large);
        color: var(--theme-color-primary);
      }
    }
    @e level {
      font-size: var(--default-font-size-small);
      color: var(--dialog--font-color-brown);
      text-align: center;
      line-height: 20px;
      width: 64px;
      height: 20px;
      position: absolute;
      left: 8px;
      bottom: 10px;
      background-image: linear-gradient(90deg, #ffcd30 0%, #ffdd74 97%);
      border-radius: 18px;
    }
  }
  @b hidden {
    display: block;
    width: 125px;
    max-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @b favorable {
    @e text {
      font-size: var(--default-font-size-base);
      flex-shrink: 0;
      @m discount {
        color: var(--theme-color-danger);
      }
      @m integration {
        color: var(--theme-color-warning);
      }
      @m coupon {
        color: var(--theme-color-success);
      }
    }
  }
  @b basic {
    @e title {
      line-height: 36px;
      height: 36px;
      font-weight: bold;
      padding-left: 14px;
      background: var(--default-table-strip-bg);
    }
    @e form {
      padding: var(--default-padding-xlarger) 0;
    }
  }
  @b integral {
    margin-top: var(--default-margin-small);
    @e form {
      padding-left: var(--default-padding-xlarger);
    }
  }
  @b formitem {
    @e choice {
      margin-right: 0;
    }
    @e type {
      margin: 0 0 0 var(--default-margin-larger);
    }
  }
  @b form {
    @e wrapper {
      font-size: 12px;
      margin-left: 100px;
      /* position: relative;
      left: 25px; */
      >>> .el-form-grid--xs {
        width: 125px;
      }
    }
  }
  @b transaction {
    padding: var(--default-padding-xlarger);
  }
  @b merchandise {
    @e money {
      font-size: var(--default-font-size-large);
      font-weight: bold;
    }
    @e frequency {
      color: var(--theme-font-color-secondary);
    }
  }
  @b detail {
    padding: var(--default-padding-larger) 0;
    border-bottom: 1px dashed var(--theme-base-border-color-primary);
  }
  /*@b checkbtn {*/
  /*  text-align: right;*/
  /*  width: 230px;*/
  /*}*/
  @b transactions {
    position: relative;
    @e checkbtn {
      position: absolute;
      right: 0;
    }
  }
  @b title {
    display: flex;
    align-items: center;
    @e text {
      text-align: right;
      width: 110px;
      .svg-icon {
        float: left;
        margin-top: 6px;
      }
    }
  }
  @b remark {
    width: 125px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @b conceal {
    display: inline-block;
    width: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    vertical-align: middle;
  }
  @b space {
    margin: 0 var(--default-margin-small);
  }
  @b leftspace {
    margin-left: var(--default-margin-small);
  }
}
.dialog-container >>> .el-tabs__header {
  padding: var(--default-padding-xlarger) 0 0;
}
>>> .el-table .cell {
  padding: 0 var(--default-padding-small);
}
</style>
