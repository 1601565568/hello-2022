<template>
  <div>
    <ns-table-guide ref="table1" @add="handleSelectionChange"
                    @shopEdit="shopEdit" @showTag="showTagData" @onRedactFun="onRedactFun"
                    @handlereplaceShop="handlereplaceShop"
                    @offLineShopId="getOffLineShopId($event)">
    </ns-table-guide>
    <!--更换导购弹窗-->
    <el-dialog :visible.sync="shopFindListShow" width="800px" @close="closeDialog">
      <div slot="title" class="checkNumberTitle">
        <span class="dialogtitle">{{title}}</span>
        <span class="number">已选会员{{checkNumberLength}}人</span>
      </div>
      <div class="replace-rule">
        <div>更换规则：</div>
        <div>
          1、分配给多个导购时，将按照选择导购的先后顺序均分。<br/>
          2、分配逻辑为随机分配，与转移前会员专属导购身份无关。<br/>
          3、支持选择会员转移时，是否自动转移好友关系。<br/>
          <span class="remind-text"></span>90个自然日内，在职员工的每位好友仅可被转移2次
        </div>
      </div>
      <!--  搜索开始  -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <div class="search">
        <el-form class="el_form" ref="table_filter_form" :model="model" label-width="60px" :inline="true">
          <el-form-item label="关键字：">
            <!-- <el-form-grid size="xmd"> -->
              <el-input style="width:180px"
                        @keyup.enter.native="searchAction"
                        @clear="searchAction"
                        autofocus=true
                        v-model="model.name"
                        placeholder="请输入账号/姓名/手机号"
                        clearable>
              </el-input>
            <!-- </el-form-grid> -->
          </el-form-item>
          <el-form-item label="所属门店：">
            <!-- <el-form-grid size="xmd"> -->
              <shop-select-load ref="shopSelect"
                                @change="handleShoperSelectChange"
                                v-model="model.shop"
                                :sameSystemShopId='sameSystemShopId'
                                clearable/>
            <!-- </el-form-grid> -->
          </el-form-item>
          <!-- <el-form-item>
            <ns-button type="primary" @click="searchAction(model)">搜索</ns-button>
            <ns-button @click="resetInputAction">重置</ns-button>
          </el-form-item> -->
        </el-form>
      </div>
      <!--  搜索结束  -->
      <!--  表格开始  -->
      <el-table ref="table" :data="particularsObj" stripe
        @select-all="hanledSelecAllChange"
        @select="handleSelectChange"
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <!-- <el-table-column width="25">
          <template slot-scope="scope">
            <div class="customerManage">
              <el-radio :label="scope.$index" v-model="radio"  @change.native="getCurrentRow(scope.row,scope.$index)"></el-radio>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="workId" label="账号" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.workId || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="left">
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式" align="center">
          <template slot-scope="scope">
            {{scope.row.mobile || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="所属门店" align="left">
          <template slot-scope="scope">
            {{scope.row.shopName || '-'}}
          </template >
        </el-table-column>
      </el-table>
      <!--  表格结束  -->
      <!-- 分页 -->
      <el-pagination v-if="_data.pagination.enable" class="template-table-pagination"
                     :page-sizes="_data.pagination.sizeOpts"
                     :total="_data.pagination.total"
                     :current-page.sync="_data.pagination.page"
                     :page-size="_data.pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="shopSizeChange"
                     @current-change="shopPageChange">
      </el-pagination>
      <!-- 分页-结束 -->
      <div slot="footer" class="dialog-footer">
        <span class="recordChooseList">已选导购{{recordChooseList.length}}人</span>
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button @click="onlyTransMember()">仅转移会员</ns-button>
        <ns-button type="primary" @click="transAllMember()">转移会员并转移好友</ns-button>
      </div>
    </el-dialog>
    <!-- 新客户详情弹窗-->
    <el-dialog
      title="详情" width="900px" height="500px"
      :visible.sync="shopKuhuShow"
      class="dialog-container"  @close="closeDetailDialog">
       <!-- @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" -->
      <div class="dialog-container__msg">
        <div class="dialog-avatar">
          <el-image
            :width="80" :height="80"
            :src="items.customerHeadImage||require('./src/images/avartar.png')"
            mode="cover" :circle="true" class="dialog-avatar__headportrait"></el-image>
          <div class="dialog-avatar__figure" v-if="items.sex === 1 || items.sex === 0">
            <Icon v-if="items.sex === 1" type="men" className="dialog-avatar__figure--male" />
            <!-- 女生图标-->
            <Icon v-else type="women" className="dialog-avatar__figure--female"/>
          </div>
          <div class="dialog-avatar__level" v-if="items.grade>0">
            {{items.gradeName}}
          </div>
        </div>
        <el-form label-width="110px" class="dialog-form__wrapper">
          <el-form-item label="姓名：" class="el-inline-block">
            <el-form-grid size="xs">
              <div class="dialog-remark" v-if="items.customerName">
                <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="items.encCustomerName" :sensitiveData="items.customerName"></ns-sg-sensitive-button>
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
                  <Icon type="discount" className="dialog-favorable__text dialog-favorable__text--discount"/>
                  <span>会员折扣：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{items.discount || '-'}}折</div>
            </el-form-grid>
          </el-form-item>
          <!--新的积分展示信息-->
          <el-form-item v-if="integralIsShow[1]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text" v-if="integralAliasName[1].length<7">
                  <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                  <span>{{integralAliasName[1]}}：</span>
                </div>
                <div v-else class="dialog-title__text">
                  <el-tooltip :content="integralAliasName[1]">
                    <span class="dialog-conceal">{{integralAliasName[1]}}</span>
                  </el-tooltip>
                  <span>：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{integralIsNum[1] || 0}}</div>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-if="integralIsShow[4]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text" v-if="integralName[4].length<7">
                  <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                  <span>{{integralName[4]}}：</span>
                </div>
                <div v-else class="dialog-title__text">
                  <el-tooltip :content="integralName[4]">
                    <span class="dialog-conceal">{{integralName[4]}}</span>
                  </el-tooltip>
                  <span>：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remar1k">{{integralIsNum[4] || 0}}</div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机：" class="el-inline-block">
            <el-form-grid size="xs">
              <div class="dialog-remark">
                <ns-sg-sensitive-button type="phone" :defaultText="true" :encryptData="items.encMobile" :sensitiveData="items.mobile"></ns-sg-sensitive-button>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-if="integralIsShow[0]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text" v-if="integralAliasName[0].length<7">
                  <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                  <span>{{integralAliasName[0]}}：</span>
                </div>
                <div v-else class="dialog-title__text">
                  <el-tooltip :content="integralAliasName[0]">
                    <span class="dialog-conceal">{{integralAliasName[0]}}</span>
                  </el-tooltip>
                  <span>：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{integralIsNum[0] || 0}}</div>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-if="integralIsShow[2]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text" v-if="integralName[2].length<7">
                  <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                  <span>{{integralName[2]}}：</span>
                </div>
                <div v-else class="dialog-title__text">
                  <el-tooltip :content="integralName[2]">
                    <span class="dialog-conceal">{{integralName[2]}}</span>
                  </el-tooltip>
                  <span>：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{integralIsNum[2] || 0}}</div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：" class="el-inline-block">
            <el-form-grid size="xs">
              <div class="dialog-remark" v-if="items.customerRemark && items.customerRemark.length<16">
                {{items.customerRemark||'-'}}
              </div>
              <div v-else>
                <el-tooltip :content="items.customerRemark">
                  <span class="dialog-hidden">{{items.customerRemark}}</span>
                </el-tooltip>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text">
                  <Icon type="coupon" className="dialog-favorable__text dialog-favorable__text--coupon"/>
                  <span>优惠券：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{items.couponNum||0}}</div>
            </el-form-grid>
          </el-form-item>
          <!--新的积分展示信息-->
          <el-form-item v-if="integralIsShow[3]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <div class="dialog-title__text" v-if="integralName[3].length<7">
                  <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                  <span>{{integralName[3]}}：</span>
                </div>
                <div v-else class="dialog-title__text">
                  <el-tooltip :content="integralName[3]">
                    <span class="dialog-conceal">{{integralName[3]}}</span>
                  </el-tooltip>
                  <span>：</span>
                </div>
              </div>
            </template>
            <el-form-grid size="xs">
              <div class="dialog-remark">{{integralIsNum[3] || 0}}</div>
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
                  <el-form-grid size="xxmd">{{items.birthday || '-'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{ items.fansStatusVos ? (items.fansStatusVos.some((item)=>{ return item.subscribe === 1 }) ? '已关注'
                    : (items.fansStatusVos.some((item)=>{ return item.subscribe === -1 }) ? '未关注' : '未知')) : '-' }}</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.memberCard}}</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.sex === 1?'男':items.sex === 0?'女':'未知'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.activateTime||'-'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">
                    <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="items.encEmail" :sensitiveData="items.email"></ns-sg-sensitive-button>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.province}}</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">
                    <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="items.encAddress" :sensitiveData="items.address"></ns-sg-sensitive-button>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="昵称：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.outAlias||'-'}}</el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">属性标签</div>
              <el-form label-width="180px" class="dialog-basic__form" >
                <el-form-item :label="tag.name+'：'" class="el-inline-block" v-for="tag in items.tagList" :key="tag.id">
                  <el-form-grid v-if="tag.tag && tag.tag.length<=20" size="xxmd">{{tag.tag}}</el-form-grid>
                  <el-tooltip v-if="tag.tag && tag.tag.length>20"  :content="tag.tag" popper-class="table-body__tooltip">
                    <el-form-grid class="tagDisplay" size="xxmd">{{tag.tag}}</el-form-grid>
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
                  <el-form-grid class="dialog-merchandise__money">¥{{rfmInfo.tradeAmount}}</el-form-grid>
                  <el-form-grid class="dialog-merchandise__frequency">（交易次数：{{rfmInfo.tradeAllTimes||0}}）</el-form-grid>
                </el-form-item>
                <el-form-item class="dialog-detail">
                  <el-form-grid size="md">
                    回购周期：{{rfmInfo.buyBackAllPeriod}}
                    <el-tooltip content="（最近一次交易成功时间-第一次交易成功时间）/（交易成功次数-1）">
                      <Icon type="question-circle"/>
                    </el-tooltip>
                  </el-form-grid>
                  <el-form-grid size="md">
                    笔单价：{{rfmInfo.priceUnit}}元
                    <el-tooltip content="交易成功总额/交易成功订单数（包含退款）">
                      <Icon type="question-circle"/>
                    </el-tooltip>
                  </el-form-grid>
                  <el-form-grid size="md">
                    连带率：{{rfmInfo.itemUnit}}件
                    <el-tooltip content="交易成功订单商品数量/交易成功订单数（包含退款）">
                      <Icon type="question-circle"/>
                    </el-tooltip>
                  </el-form-grid>
                  <el-form-grid size="md">
                    退款次数：{{rfmInfo.refundTimes}}次
                    <el-tooltip content="计算主订单中子订单发生退款行为，就计算为1次（同一个主订单中含有多个子订单退款也只是计算一次）">
                      <Icon type="question-circle"/>
                    </el-tooltip>
                  </el-form-grid>
                  <el-form-grid size="md">
                    退款总额：{{rfmInfo.refundAmount || '0'}}元
                    <el-tooltip content="退款完成的子订单总金额">
                      <Icon type="question-circle"/>
                    </el-tooltip>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="最近交易：">
                  <el-form-grid size="xxlg">
                    {{rfmInfo.lastSuccessTime}}
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
          <el-tab-pane v-if="integralLogIsShow[0]" :label="integralName[0]" name="integral1">
            <div class="dialog-integral">
              <ns-page-table>
                <template slot="advancedSearch">
                  <el-form class="dialog-integral__form">
                    <el-form-item class="dialog-formitem">
                      <el-form-grid class="dialog-formitem__choice">
                        变更时间：
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="startTime" format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="disposeStartTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <span class="dialog-space">-</span>
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(0)" class="dialog-leftspace">搜索</ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form>
                </template>
                <template slot="table">
                  <el-table ref="table" :data="tableData[integralName[0]]"
                            stripe
                            resizable
                            @sort-change="$orderChange$"
                            row-key="id">
                    <el-table-column prop="integral" :label="'增减' + integralAliasName[0]" align="center">
                      <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.type==1">
                          {{'+ '+scope.row.total}}
                        </span>
                        <span class="text-success" v-else-if="scope.row.type==3">
                          {{'- '+scope.row.total}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="time" label="变更时间" align="center" :width="250">
                      <template slot-scope="scope">
                        {{scope.row.createTime || '_'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                      <template slot-scope="scope">
                        {{scope.row.type==1?'赠送':scope.row.type==3?'扣减':''}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <!-- 表格  结束  -->
                <!-- 分页 -->
                <template slot="pagination">
                  <el-pagination v-if="_data.integralPagination.enable" class="template-table__pagination"
                                 :page-sizes="_data.integralPagination.sizeOpts" :total="_data.integralPagination.total"
                                 :current-page="_data.integralPagination.page" :page-size="_data.integralPagination.size"
                                 layout="total, sizes, prev, pager, next, jumper" @size-change="integralSizeChange"
                                 @current-change="integralPageChange" ref="integralPage1">
                  </el-pagination>
                </template>
              </ns-page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="integralLogIsShow[1]" :label="integralName[1]" name="integral2">
            <div class="dialog-integral">
              <ns-page-table>
                <template slot="advancedSearch">
                  <el-form class="dialog-integral__form">
                    <el-form-item class="dialog-formitem">
                      <el-form-grid class="dialog-formitem__choice">
                        变更时间：
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="startTime" format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="disposeStartTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <span class="dialog-space">-</span>
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(1)" class="dialog-leftspace">搜索</ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form>
                </template>
                <template slot="table">
                  <el-table ref="table" :data="tableData[integralName[1]]"
                            stripe
                            resizable
                            @sort-change="$orderChange$"
                            row-key="id">
                    <el-table-column prop="integral" :label="'增减' + integralAliasName[1]" align="center">
                      <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.type==1">
                          {{'+ '+scope.row.total}}
                        </span>
                        <span class="text-success" v-else-if="scope.row.type==3">
                          {{'- '+scope.row.total}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="time" label="变更时间" align="center" :width="250">
                      <template slot-scope="scope">
                        {{scope.row.createTime || '_'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                      <template slot-scope="scope">
                        {{scope.row.type==1?'赠送':scope.row.type==3?'扣减':''}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <!-- 表格  结束  -->
                <!-- 分页 -->
                <template slot="pagination">
                  <el-pagination v-if="_data.integralPagination.enable" class="template-table__pagination"
                                 :page-sizes="_data.integralPagination.sizeOpts" :total="_data.integralPagination.total"
                                 :current-page="_data.integralPagination.page" :page-size="_data.integralPagination.size"
                                 layout="total, sizes, prev, pager, next, jumper" @size-change="integralSizeChange"
                                 @current-change="integralPageChange" ref="integralPage2">
                  </el-pagination>
                </template>
              </ns-page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="integralLogIsShow[2]" :label="integralName[2]" name="integral3">
            <div class="dialog-integral">
              <ns-page-table>
                <template slot="advancedSearch">
                  <el-form class="dialog-integral__form">
                    <el-form-item class="dialog-formitem">
                      <el-form-grid class="dialog-formitem__choice">
                        变更时间：
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="startTime" format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="disposeStartTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <span class="dialog-space">-</span>
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(2)" class="dialog-leftspace">搜索</ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form>
                </template>
                <template slot="table">
                  <el-table ref="table" :data="tableData[integralName[2]]"
                            stripe
                            resizable
                            @sort-change="$orderChange$"
                            row-key="id">
                    <el-table-column prop="integral" :label="'增减' + integralAliasName[2]" align="center">
                      <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.type==1">
                          {{'+ '+scope.row.total}}
                        </span>
                        <span class="text-success" v-else-if="scope.row.type==3">
                          {{'- '+scope.row.total}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="time" label="变更时间" align="center" :width="250">
                      <template slot-scope="scope">
                        {{scope.row.createTime || '_'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                      <template slot-scope="scope">
                        {{scope.row.type==1?'赠送':scope.row.type==3?'扣减':''}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <!-- 表格  结束  -->
                <!-- 分页 -->
                <template slot="pagination">
                  <el-pagination v-if="_data.integralPagination.enable" class="template-table__pagination"
                                 :page-sizes="_data.integralPagination.sizeOpts" :total="_data.integralPagination.total"
                                 :current-page="_data.integralPagination.page" :page-size="_data.integralPagination.size"
                                 layout="total, sizes, prev, pager, next, jumper" @size-change="integralSizeChange"
                                 @current-change="integralPageChange" ref="integralPage3">
                  </el-pagination>
                </template>
              </ns-page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="integralLogIsShow[3]" :label="integralName[3]" name="integral4">
            <div class="dialog-integral">
              <ns-page-table>
                <template slot="advancedSearch">
                  <el-form class="dialog-integral__form">
                    <el-form-item class="dialog-formitem">
                      <el-form-grid class="dialog-formitem__choice">
                        变更时间：
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="startTime" format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="disposeStartTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        -
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(3)">搜索</ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form>
                </template>
                <template slot="table">
                  <el-table ref="table" :data="tableData[integralName[3]]"
                            stripe
                            resizable
                            @sort-change="$orderChange$"
                            row-key="id">
                    <el-table-column prop="integral" :label="'增减' + integralAliasName[3]" align="center">
                      <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.type==1">
                          {{'+ '+scope.row.total}}
                        </span>
                        <span class="text-success" v-else-if="scope.row.type==3">
                          {{'- '+scope.row.total}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="time" label="变更时间" align="center" :width="250">
                      <template slot-scope="scope">
                        {{scope.row.createTime || '_'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                      <template slot-scope="scope">
                        {{scope.row.type==1?'赠送':scope.row.type==3?'扣减':''}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <!-- 表格  结束  -->
                <!-- 分页 -->
                <template slot="pagination">
                  <el-pagination v-if="_data.integralPagination.enable" class="template-table__pagination"
                                 :page-sizes="_data.integralPagination.sizeOpts" :total="_data.integralPagination.total"
                                 :current-page="_data.integralPagination.page" :page-size="_data.integralPagination.size"
                                 layout="total, sizes, prev, pager, next, jumper" @size-change="integralSizeChange"
                                 @current-change="integralPageChange" ref="integralPage4">
                  </el-pagination>
                </template>
              </ns-page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="integralLogIsShow[4]" :label="integralName[4]" name="integral5">
            <div class="dialog-integral">
              <ns-page-table>
                <template slot="advancedSearch">
                  <el-form class="dialog-integral__form">
                    <el-form-item class="dialog-formitem">
                      <el-form-grid class="dialog-formitem__choice">
                        变更时间：
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="startTime" format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="disposeStartTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        -
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(4)">搜索</ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form>
                </template>
                <template slot="table">
                  <el-table ref="table" :data="tableData[integralName[4]]"
                            stripe
                            resizable
                            @sort-change="$orderChange$"
                            row-key="id">
                    <el-table-column prop="integral" :label="'增减' + integralAliasName[4]" align="center">
                      <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.type==1">
                          {{'+ '+scope.row.total}}
                        </span>
                        <span class="text-success" v-else-if="scope.row.type==3">
                          {{'- '+scope.row.total}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="time" label="变更时间" align="center" :width="250">
                      <template slot-scope="scope">
                        {{scope.row.createTime || '_'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                      <template slot-scope="scope">
                        {{scope.row.type==1?'赠送':scope.row.type==3?'扣减':''}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <!-- 表格  结束  -->
                <!-- 分页 -->
                <template slot="pagination">
                  <el-pagination v-if="_data.integralPagination.enable" class="template-table__pagination"
                                 :page-sizes="_data.integralPagination.sizeOpts" :total="_data.integralPagination.total"
                                 :current-page="_data.integralPagination.page" :page-size="_data.integralPagination.size"
                                 layout="total, sizes, prev, pager, next, jumper" @size-change="integralSizeChange"
                                 @current-change="integralPageChange" ref="integralPage5">
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
    <!-- 打标签-->
    <el-dialog
      title="属性标签" response-limit :show-scroll-x=false
      :visible.sync="showTag"
      width="900px" @close="restTag(true)">
      <div>
        <el-form>
          <el-form-item>
            已选{{attribute}}属性，{{attributeValue}}属性值
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-grid>
                  <ns-button @click="restTag(false)">清空选择</ns-button>
                </el-form-grid>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-table ref="table" :data="tagData" stripe>
          <el-table-column prop="name" label="属性名称" width="350"></el-table-column>
          <el-table-column label="属性值" prop="value">
            <template slot-scope="scope">
              <div style="padding: 5px 0;">
                <!--输入框-->
                <el-input v-model="scope.row.selectValue"
                          placeholder="请输入内容"
                          autosize size="small"
                          v-if="scope.row.tagType === 1 "
                          @change="addText(scope.row)"
                          clearable
                          :disabled="scope.row.isMark" />
                <el-input v-model="scope.row.selectValue"
                          placeholder="请输入内容"
                          autosize size="small"
                          v-if="scope.row.tagType === 2 || scope.row.tagType === 3"
                          @change="addText(scope.row)"
                          @focus="focusChange"
                          @blur="blurChange"
                          clearable
                          :disabled="scope.row.isMark" />
                <!--下拉选-->
                <el-select v-model="scope.row.selectValue"
                           placeholder="请选择"
                           v-else-if="scope.row.tagType === 4"
                           clearable @change="addSelect(scope.row)"
                           :disabled="scope.row.isMark">
                  <el-option
                    v-for="item in scope.row.value.split('|')" :key="item" :label="item"
                    :value="item" >
                  </el-option>
                </el-select>
                <!--日期-->
                <el-date-picker
                  v-model="scope.row.selectValue"
                  type="date"
                  value-format="yyyy-MM-dd" placeholder="请选择日期"
                  v-else-if="scope.row.tagType===5"
                  @change="addDate(scope.row)"
                  :disabled="scope.row.isMark">
                </el-date-picker>
                <!--单选框-->
                <el-radio-group v-model="scope.row.selectValue"
                                v-else-if="scope.row.tagType === 6"
                                :disabled="scope.row.isMark" >
                  <el-radio v-for="item1 in scope.row.value.split('|')" :label="item1" :key="item1"
                            @change="addRadio(scope.row,item1)">{{item1}}</el-radio>
                </el-radio-group>
                <!-- 复选框 -->
                <el-checkbox-group v-model="scope.row.selectValue"
                                   v-else-if="scope.row.tagType === 7"
                                   :disabled="scope.row.isMark">
                  <el-checkbox v-for="item2 in scope.row.value.split('|')" :label="item2" :key="item2"
                               @change="addCheckbox(scope.row,item2)">{{item2}}</el-checkbox>
                </el-checkbox-group>
                <!--中台新增日期时间控件，前端之后实现-->
                <!--日期时间-->
                 <el-date-picker
                  v-model="scope.row.selectValue"
                  type='datetime'
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择日期"
                  v-else-if="scope.row.tagType===8"
                  :default-time="'00:00:00'"
                  @change="addDate(scope.row)"
                  :disabled="scope.row.isMark"
                  align="right">
                </el-date-picker>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="restTag(true)">取 消</ns-button>
        <ns-button type="primary" @click="saveTag" :disabled="dontSave">保存</ns-button>
      </span>
    </el-dialog>
    <replaceStore :title="title"
        ref="replaceStore"
        v-if="replaceStoreShow"
        :sameSystemShopId="sameSystemShopId"
        :checkNumberLength="checkNumberLength"
        :shopAreaTree="shopAreaTree"
        :allShopOptions="allShopOptions"
        :shopOptions="shopOptions"
        @onSave="replaceStoreonSave()"
        @close="replaceStoreShow = false"
        ></replaceStore>
    <RemindMsg ref="remindMsg"/>
    <SendMsg ref="sendMsg"/>
  </div>
</template>
<script>
import CustomerManage from './src/CustomerManage'
import NsTableGuide from './NsTableGuide'
import ElImage from '@nascent/nui/lib/image'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import replaceStore from './component/replaceStore'
import RemindMsg from './component/RemindMsg'
import SendMsg from './component/SendMsg'
CustomerManage.components = {
  NsTableGuide,
  ElImage,
  ShopSelectLoad,
  replaceStore,
  RemindMsg,
  SendMsg
}
export default CustomerManage
</script>
<style scoped>
>>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    display: inline-block;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .kehuBox-main {
    padding: 10px 20px 30px;
  }
  .kehuBox-main-top{
    display: flex;
    justify-content:space-between;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    color: #999;
  }
  .kehuBox-main-main{
    display: flex;
    align-items:flex-start;
  }
  .kehuBox-main-span {
    padding: 20px 0 0;
  }
  .kehuBox-main-span span{
    font-size: 12px;
    line-height: 2.3;
  }
  .man-img{
    width: 35px;
    height: 35px;
    border: 1px solid #999;
    border-radius: 50%;
    float: left;
  }
  .img-show{
    width: 35px;
    height: 35px;
    border: 1px solid #999;
    border-radius: 50%;
    float: left;
    background: url("../../../assets/default-user.png")no-repeat;
    background-size: 33px;
  }
  .man-name {
    font-size: 15px;
    color: #000000;
    padding-left: 10px;
  }
  .p-title {
    padding: 20px 0 5px;
    color: #000000;
    font-weight: 600;
  }
  .search{
    display: flex;
    justify-content: space-between;
    padding-right:20px
  }
  .el_form{
    display: flex;
    align-items: center
  }
  .template-table__more-btn{
    display: flex;
    align-items: center;
    padding:0;
    margin-bottom: 10px;
  }
.dialog-footer{
  display:flex;
  justify-content: flex-end;
  align-items: center;
}
.recordChooseList {
  display: inline-block;
  margin-right: 24px;
  font-size: 14px;
  color: #262626;
}
  .tagDisplay{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>

<!--<style scoped>-->
<!--.customerManage .el-radio .el-radio__label{-->
<!--  display: none !important-->
<!--}-->
<!--</style>-->

<!-- 会员详情样式-->
<style scoped>
  @import "@theme/variables.pcss";

  :root {
    --dialog-font-color-red: #FF1985;
    --dialog--font-color-brown: #904B00;
  }

  @component-namespace dialog {
    @b container {
      @e msg {
        display: flex;
        /*padding: var(--default-padding-larger) 0 var(--default-padding-larger) var(--default-padding-small);*/
        /*border-bottom: 1px solid var(--theme-base-border-color-primary);*/
        padding: var(--default-margin-small) 0 var(--default-padding-larger) var(--default-padding-small);
      }
    }
    @b avatar {
      width: 80px;
      position: relative;
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
        background-image: linear-gradient(90deg, #FFCD30 0%, #FFDD74 97%);
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
        position: relative;
        left:25px;
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
  .questioncircle {
    position: relative;
    left: -4px;
  }
  /* 去掉更换导购列表弹框单选组多余数字 */
  .customerManage >>> .el-radio__label {
    display: none;
  }
  /* 去掉分页器的阴影 */
  >>> .el-pagination {
    box-shadow: none;
  }
  .checkNumberTitle {
    height: 30px;
    display: flex;
    align-items: center;
    .dialogtitle {
      font-size: 16px;
      color: #303133;
      display: inline-block;
      margin-right: 16px;
      font-weight: bold;
    }
    .number {
      font-size: 14px;
      color: #595959;
    }
  }
  .replace-rule {
    padding: 9px 16px;
    margin-bottom: 16px;
    background: #F2F9FE;
    border-radius: 2px;
    /* height: 40px; */
    line-height: 22px;
    display: flex;
    flex-direction: row;
  }
  .remind-text {
    width: 8px;
    height: 8px;
    background: #F2AA18;
    margin-right: 8px;
    display: inline-block;
    border-radius: 50%;
  }
</style>
