<template>
  <div>
    <ns-table-guide ref="table1" :url=$api.guide.guide.customerFindCustomerList @add="onRedactFun"
      @shopEdit="shopEdit" @showTag="showTagData" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!--更换导购弹窗-->
    <el-dialog :title="title" :visible.sync="shopFindListShow" width="800px" @close="closeDialog">
      <!--  搜索开始  -->
      <div class="search">
        <el-form class="el_form" ref="table_filter_form" :model="model" label-width="60px" :inline="true">
          <el-form-item label="关键字：">
            <el-form-grid size="xmd">
              <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入工号/姓名/手机号" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="所属门店：">
            <el-form-grid>
              <el-select placeholder="请选择所属门店" v-model="model.shop" clearable filterable>
                <el-option v-for="shop in shopList" :label="shop.shopName" :value="shop.id"
                          :key="shop.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="searchAction(model)">搜索</ns-button>
          <ns-button @click="resetInputAction">重置</ns-button>
        </div>
      </div>
      <!--  搜索结束  -->
      <!--  表格开始  -->
      <el-table ref="table" :data="particularsObj" stripe @selection-change="guideChange">
        <el-table-column  width="25">
          <template slot-scope="scope">
            <div class="customerManage">
              <el-radio :label="scope.$index" v-model="radio"  @change.native="getCurrentRow(scope.row,scope.$index)"></el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="workId" label="工号" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.workId || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.mobile || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="所属门店" align="left" width="180">
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
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 新客户详情弹窗-->
    <el-dialog
      title="详情"
      :visible.sync="shopKuhuShow"
      width="900px" height="500px" class="dialog-container"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" @close="closeDetailDialog">
      <div class="dialog-container__msg">
        <div class="dialog-avatar">
          <el-image
            style="width: 80px; height: 80px"
            :src="items.customerHeadImage|| defaultImage"
            mode="mfit" class="dialog-avatar__headportrait">
          </el-image>
          <div class="dialog-avatar__figure" v-if="items.sex === 1 || items.sex === 0">
            <Icon v-if="items.sex === 1" type="men" className="dialog-avatar__figure--male" />
            <!-- 女生图标-->
            <Icon v-else type="women" className="dialog-avatar__figure--female"/>
          </div>
<!--          <div class="dialog-avatar__figure">-->
<!--            &lt;!&ndash; 男生图标&ndash;&gt;-->
<!--            <i class="dialog-avatar__figure&#45;&#45;male" v-if="items.sex===1"><Icon type="nan1"/></i>-->
<!--            &lt;!&ndash; 女生图标&ndash;&gt;-->
<!--            <i class="dialog-avatar__figure&#45;&#45;female" v-if="items.sex===0"><Icon type="nv1"/></i>-->
<!--          </div>-->
          <div class="dialog-avatar__level" v-if="items.grade>0">
            {{items.gradeName}}
          </div>
        </div>
        <el-form label-width="100px">
          <el-form-item label="姓名：" class="el-inline-block">
            <el-form-grid size="xs">{{items.customerName}}</el-form-grid>
          </el-form-item>
<!--          <el-form-item label="会员折扣：" class="el-inline-block dialog-favorable">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{items.discount || '-'}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;discount"><Icon type="icon_discount"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->
          <el-form-item class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="discount" className="dialog-favorable__text dialog-favorable__text--discount"/>
                <div class="dialog-title__text">会员折扣</div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{items.discount || '-'}}折</span>
            </el-form-grid>
          </el-form-item>
          <!--新的积分展示信息-->
          <el-form-item v-if="integralIsShow[1]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                <div class="dialog-title__text" v-if="integralName[1].length<6">
                  {{integralName[1]}}
                </div>
                <div v-else>
                  <el-tooltip placement="bottom">
                    <div slot="content">{{integralName[1]}}</div>
                    <span class="dialog-conceal">{{integralName[1]}}</span>
                  </el-tooltip>
                </div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{integralIsNum[1] || 0}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-else label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>

<!--          <el-form-item :label="integralName[1]+'：'" class="el-inline-block dialog-favorable" v-if="integralIsShow[1]">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{integralIsNum[1]}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;integration"><Icon type="icon_integration"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->

          <el-form-item v-if="integralIsShow[4]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                <div class="dialog-title__text" v-if="integralName[4].length<6">
                  {{integralName[4]}}
                </div>
                <div v-else>
                  <el-tooltip placement="bottom">
                    <div slot="content">{{integralName[4]}}</div>
                    <span class="dialog-conceal">{{integralName[4]}}</span>
                  </el-tooltip>
                </div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{integralIsNum[4] || 0}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-else label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>

<!--          <el-form-item :label="integralName[4]+'：'" class="el-inline-block dialog-favorable" v-if="integralIsShow[4]">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{integralIsNum[4]}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;integration"><Icon type="icon_integration"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->
          <el-form-item label="手机：" class="el-inline-block">
            <el-form-grid size="xs">{{items.mobile}}</el-form-grid>
          </el-form-item>

          <el-form-item v-if="integralIsShow[0]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                <div class="dialog-title__text" v-if="integralName[0].length<6">
                  {{integralName[0]}}
                </div>
                <div v-else>
                  <el-tooltip placement="bottom">
                    <div slot="content">{{integralName[0]}}</div>
                    <span class="dialog-conceal">{{integralName[0]}}</span>
                  </el-tooltip>
                </div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{integralIsNum[4] || 0}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-else label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>

<!--          <el-form-item :label="integralName[0]+'：'" class="el-inline-block dialog-favorable" v-if="integralIsShow[0]">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{integralIsNum[0]}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;integration"><Icon type="icon_integration"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->

          <el-form-item v-if="integralIsShow[2]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                <div class="dialog-title__text" v-if="integralName[2].length<6">
                  {{integralName[2]}}
                </div>
                <div v-else>
                  <el-tooltip placement="bottom">
                    <div slot="content">{{integralName[2]}}</div>
                    <span class="dialog-conceal">{{integralName[2]}}</span>
                  </el-tooltip>
                </div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{integralIsNum[2] || 0}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-else label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>

<!--          <el-form-item :label="integralName[2]+'：'" class="el-inline-block dialog-favorable" v-if="integralIsShow[2]">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{integralIsNum[2]}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;integration"><Icon type="icon_integration"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->
          <el-form-item label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：" class="el-inline-block">
            <el-form-grid size="xs">
              <span v-if="items.customerRemark && items.customerRemark.length<16">
                sd
                {{items.customerRemark||'-'}}
              </span>
              <div v-else>
                <el-tooltip :content="items.customerRemark" placement="bottom">
                  <div slot="content">{{items.customerRemark||'ces'}}</div>
                  <span class="dialog-hidden">{{items.customerRemark}}</span>
                </el-tooltip>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="coupon" className="dialog-favorable__text dialog-favorable__text--coupon"/>
                <div class="dialog-title__text">优惠券</div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{items.couponNum||0}}</span>
            </el-form-grid>
          </el-form-item>
<!--          <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">-->
<!--            <el-form-grid size="xs">-->
<!--              <span>{{items.couponNum||0}}</span>-->
<!--              <i class="dialog-favorable__text dialog-favorable__text&#45;&#45;coupon"><Icon type="icon_coupon"/></i>-->
<!--            </el-form-grid>-->
<!--          </el-form-item>-->
          <!--新的积分展示信息-->
          <el-form-item v-if="integralIsShow[3]" class="el-inline-block dialog-favorable">
            <template slot="label">
              <div class="dialog-title">
                <Icon type="integration" className="dialog-favorable__text dialog-favorable__text--integration dialog-favorable__text--space"/>
                <div class="dialog-title__text" v-if="integralName[3].length<6">
                  {{integralName[3]}}
                </div>
                <div v-else>
                  <el-tooltip placement="bottom">
                    <div slot="content">{{integralName[3]}}</div>
                    <span class="dialog-conceal">{{integralName[3]}}</span>
                  </el-tooltip>
                </div>
                <div class="dialog-title__colon">：</div>
              </div>
            </template>
            <el-form-grid size="xs">
              <span>{{integralIsNum[3] || 0}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-else label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
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
                  <el-form-grid size="xxmd">{{items.fansStatus?items.fansStatus===1?'已关注':items.fansStatus===0?'未关注':'未知':'-'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.memberCard}}</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.sex === 1?'男':items.sex === 0?'女':'未知'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.bindTime||'-'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.email||'-'}}</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.province}}</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.address||'-'}}</el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">自定义属性</div>
              <el-form label-width="180px" class="dialog-basic__form" >
                <el-form-item :label="tag.name+'：'" class="el-inline-block" v-for="tag in items.tagList" :key="tag.id">
                  <el-form-grid size="xxmd">{{tag.value}}</el-form-grid>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="交易信息" name="transaction" v-model="rfmInfo">
            <div class="dialog-transaction">
              <el-form class="dialog-transaction__form">
                <el-form-item label="当前客户累计交易额（元）">
                  <el-popover
                    placement="bottom"
                    width="200"
                    trigger="hover"
                    content="交易成功订单的总金额（包含退款金额）">
                    <i class="xiangqingyiwen-icon dialog-doubt" slot="reference"><Icon type="question-circle" /></i>
                  </el-popover>
                </el-form-item>
                <el-form-item class="dialog-merchandise">
                  <el-form-grid class="dialog-merchandise__money">¥{{rfmInfo.tradeAmount}}</el-form-grid>
                  <el-form-grid class="dialog-merchandise__frequency">（交易次数：{{rfmInfo.tradeAllTimes||0}}）</el-form-grid>
                </el-form-item>
                <el-form-item class="dialog-detail">
                  <el-form-grid size="md">
                    回购周期：{{rfmInfo.buyBackAllPeriod}}
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="（最近一次交易成功时间-第一次交易成功时间）/（交易成功次数-1）">
                      <i class="xiangqingyiwen-icon dialog-doubt" slot="reference"><Icon type="question-circle" /></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    笔单价：{{rfmInfo.priceUnit}}元
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="交易成功总额/交易成功订单数（包含退款）">
                      <i class="xiangqingyiwen-icon dialog-doubt" slot="reference"><Icon type="question-circle" /></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    连带率：{{rfmInfo.itemUnit}}件
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="交易成功订单商品数量/交易成功订单数（包含退款）">
                      <i class="xiangqingyiwen-icon dialog-doubt" slot="reference"><Icon type="question-circle" /></i>
                    </el-popover>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="最近交易：">
                  <el-form-grid size="xxlg">
                    {{rfmInfo.lastSuccessTime}}
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="最近一笔交易成功时间">
                      <i class="xiangqingyiwen-icon dialog-doubt" slot="reference"><Icon type="question-circle" /></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="xmd" class="dialog-checkbtn">
                    <ns-button type="text">查看历史</ns-button>
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
                        -
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <!--                  <el-form-grid class="dialog-formitem__type">-->
                      <!--                    变更类型：-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(0)">搜索</ns-button>
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
                    <el-table-column prop="integral" label="增减积分" align="center">
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
                        -
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <!--                  <el-form-grid class="dialog-formitem__type">-->
                      <!--                    变更类型：-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(1)">搜索</ns-button>
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
                    <el-table-column prop="integral" label="增减积分" align="center">
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
                        -
                      </el-form-grid>
                      <el-form-grid size="md">
                        <el-date-picker type="datetime" placeholder="请选择" v-model="endTime" format="yyyy-MM-dd 23:59:59"
                                        value-format="yyyy-MM-dd 23:59:59" @change="disposeEndTime">
                        </el-date-picker>
                      </el-form-grid>
                      <!--                  <el-form-grid class="dialog-formitem__type">-->
                      <!--                    变更类型：-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(2)">搜索</ns-button>
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
                    <el-table-column prop="integral" label="增减积分" align="center">
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
                      <!--                  <el-form-grid class="dialog-formitem__type">-->
                      <!--                    变更类型：-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(3)">搜索</ns-button>
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
                    <el-table-column prop="integral" label="增减积分" align="center">
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
                      <!--                  <el-form-grid class="dialog-formitem__type">-->
                      <!--                    变更类型：-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <!--                  <el-form-grid size="md">-->
                      <!--                    <el-select v-model.trim="model.type" placeholder="请选择">-->
                      <!--                      <el-option-->
                      <!--                        v-for="item in typeArray"-->
                      <!--                        :key="item.key"-->
                      <!--                        :label="item.value"-->
                      <!--                        :value="item.key"/>-->
                      <!--                    </el-select>-->
                      <!--                  </el-form-grid>-->
                      <el-form-grid>
                        <ns-button type="primary" @click="seachIntegral(4)">搜索</ns-button>
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
                    <el-table-column prop="integral" label="增减积分" align="center">
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
    </el-dialog>
    <!-- 打标签-->
    <el-dialog
      title="自定义属性"
      :visible.sync="showTag"
      width="900px" height="500px" @close="closeTag">
      <div>
        <el-form>
          <el-form-item>
            已选{{attribute}}属性，{{attributeValue}}属性值
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-grid>
                  <ns-button @click="restTag">清空选择</ns-button>
                </el-form-grid>
              </el-col>
              <!-- 4.0版本搜索功能未完成，4.1版本后再添加 20190917 -->
<!--              <el-col :span="16" style="text-align: right">-->
<!--                <el-form-grid>-->
<!--                  <el-input  placeholder="请输入属性名称"></el-input>-->
<!--                </el-form-grid>-->
<!--                <el-form-grid>-->
<!--                  <ns-button type="primary">搜索</ns-button>-->
<!--                </el-form-grid>-->
<!--              </el-col>-->
            </el-row>
          </el-form-item>
        </el-form>
        <el-table ref="table" :data="tagData" stripe>
          <el-table-column prop="name" label="属性名称" width="350"></el-table-column>
          <el-table-column label="属性值" prop="value">
            <template slot-scope="scope">
              <div style="padding: 5px 0;">
                <!--输入框-->
                <el-input v-model="scope.row.value"
                          placeholder="请输入内容"
                          autosize size="small"
                          v-if="scope.row.tagType === 0" @change="addText(scope.row)" clearable></el-input>
                <!--下拉选-->
                <el-select v-model="scope.row.value"  placeholder="请选择" v-else-if="scope.row.tagType === 1" clearable @change="addSelect(scope.row)">
                  <el-option
                    v-for="item in scope.row.tagArr.split('|')" :key="item" :label="item"
                    :value="item" >
                  </el-option>
                </el-select>
                <!--日期-->
                <el-date-picker
                  v-model="scope.row.value"
                  type="date"
                  value-format="yyyy-MM-dd" placeholder="请选择日期"
                   v-else-if="scope.row.tagType===2" @change="addDate(scope.row)" >
                </el-date-picker>
                <!--单选框-->
                <el-radio-group v-model="scope.row.value" v-else-if="scope.row.tagType === 3" >
                  <el-radio v-for="item1 in scope.row.tagArr.split('|')" :label="item1" :key="item1"
                            @change="addRadio(scope.row,item1)">{{item1}}</el-radio>
                </el-radio-group>
                <!-- 复选框 -->
                <el-checkbox-group v-model="checkboxObject[scope.row.id]" v-else-if="scope.row.tagType === 4"  >
                  <el-checkbox v-for="item in scope.row.tagArr.split('|')" :label="item" :key="item"
                               @change="addCheckbox(scope.row,item)"></el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="closeTag">取 消</ns-button>
        <ns-button type="primary" @click="saveTag">保存</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CustomerManage from './src/CustomerManage'
import NsTableGuide from './NsTableGuide'
import ElImage from '@nascent/nui/lib/image'
CustomerManage.components = {
  NsTableGuide,
  ElImage
}
export default CustomerManage
</script>
<!--<style scoped>-->
<!--&gt;>>.avatar-uploader .el-upload {-->
<!--    border: 1px dashed #d9d9d9;-->
<!--    border-radius: 6px;-->
<!--    cursor: pointer;-->
<!--    position: relative;-->
<!--    overflow: hidden;-->
<!--  }-->
<!--  .avatar-uploader .el-upload:hover {-->
<!--    border-color: #409EFF;-->
<!--  }-->
<!-- .avatar-uploader .avatar-uploader-icon {-->
<!--    font-size: 28px;-->
<!--    color: #8c939d;-->
<!--    width: 128px;-->
<!--    height: 128px;-->
<!--    line-height: 128px;-->
<!--    text-align: center;-->
<!--    display: inline-block;-->
<!--  }-->
<!--  .avatar {-->
<!--    width: 128px;-->
<!--    height: 128px;-->
<!--    display: block;-->
<!--  }-->
<!--  .kehuBox-main {-->
<!--    padding: 10px 20px 30px;-->
<!--  }-->
<!--  .kehuBox-main-top{-->
<!--    display: flex;-->
<!--    justify-content:space-between;-->
<!--    height: 35px;-->
<!--    line-height: 35px;-->
<!--    font-size: 12px;-->
<!--    color: #999;-->
<!--  }-->
<!--  .kehuBox-main-main{-->
<!--    display: flex;-->
<!--    align-items:flex-start;-->
<!--  }-->
<!--  .kehuBox-main-span {-->
<!--    padding: 20px 0 0;-->
<!--  }-->
<!--  .kehuBox-main-span span{-->
<!--    font-size: 12px;-->
<!--    line-height: 2.3;-->
<!--  }-->
<!--  .man-img{-->
<!--    width: 35px;-->
<!--    height: 35px;-->
<!--    border: 1px solid #999;-->
<!--    border-radius: 50%;-->
<!--    float: left;-->
<!--  }-->
<!--  .img-show{-->
<!--    width: 35px;-->
<!--    height: 35px;-->
<!--    border: 1px solid #999;-->
<!--    border-radius: 50%;-->
<!--    float: left;-->
<!--    background: url("../../../assets/default-user.png")no-repeat;-->
<!--    background-size: 33px;-->
<!--  }-->
<!--  .man-name {-->
<!--    font-size: 15px;-->
<!--    color: #000000;-->
<!--    padding-left: 10px;-->
<!--  }-->
<!--  .p-title {-->
<!--    padding: 20px 0 5px;-->
<!--    color: #000000;-->
<!--    font-weight: 600;-->
<!--  }-->
<!--  .search{-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    padding-right:20px-->
<!--  }-->
<!--  .el_form{-->
<!--    display: flex;-->
<!--    align-items: center-->
<!--  }-->
<!--  .template-table__more-btn{-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    padding:0;-->
<!--    margin-bottom: 10px;-->
<!--  }-->
<!--.dialog-footer{-->
<!--  display:flex;-->
<!--  justify-content: flex-end;-->
<!--  align-items: center;-->
<!--}-->

<!--@import "@theme/variables.pcss";-->

<!--:root {-->
<!--  &#45;&#45;dialog-font-color-red: #FF1985;-->
<!--  &#45;&#45;dialog&#45;&#45;font-color-brown: #904B00;-->
<!--}-->

<!--@component-namespace dialog {-->
<!--  @b container {-->
<!--    @e msg {-->
<!--      display: flex;-->
<!--      padding: var(&#45;&#45;default-padding-larger) 0 var(&#45;&#45;default-padding-larger) var(&#45;&#45;default-padding-small);-->
<!--      border-bottom: 1px solid var(&#45;&#45;theme-base-border-color-primary);-->
<!--    }-->
<!--  }-->
<!--  @b avatar {-->
<!--    width: 80px;-->
<!--    position: relative;-->
<!--    @e figure {-->
<!--      width: 26px;-->
<!--      height: 26px;-->
<!--      position: absolute;-->
<!--      right: 2px;-->
<!--      top: -6px;-->
<!--      display: flex;-->
<!--      justify-content: center;-->
<!--      align-items: center;-->
<!--      background: var(&#45;&#45;theme-color-white);-->
<!--      border-radius: 50%;-->
<!--      @m female {-->
<!--        font-size: var(&#45;&#45;default-font-size-large);-->
<!--        color: var(&#45;&#45;dialog-font-color-red);-->
<!--      }-->
<!--      @m male {-->
<!--        font-size: var(&#45;&#45;default-font-size-large);-->
<!--        color: var(&#45;&#45;theme-color-primary);-->
<!--      }-->
<!--    }-->
<!--    @e level {-->
<!--      font-size: var(&#45;&#45;default-font-size-small);-->
<!--      color: var(&#45;&#45;dialog&#45;&#45;font-color-brown);-->
<!--      text-align: center;-->
<!--      line-height: 20px;-->
<!--      width: 64px;-->
<!--      height: 20px;-->
<!--      position: absolute;-->
<!--      left: 8px;-->
<!--      bottom: 10px;-->
<!--      background-image: linear-gradient(90deg, #FFCD30 0%, #FFDD74 97%);-->
<!--      border-radius: 18px;-->
<!--    }-->
<!--  }-->
<!--  @b hidden {-->
<!--    width: 80px;-->
<!--    max-height: 28px;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--    display: -webkit-box;-->
<!--    -webkit-line-clamp: 1;-->
<!--    -webkit-box-orient: vertical;-->
<!--  }-->
<!--  @b favorable {-->
<!--    @e text {-->
<!--      font-size: var(&#45;&#45;default-font-size-base);-->
<!--      flex-shrink: 0;-->
<!--      @m discount {-->
<!--        color: var(&#45;&#45;theme-color-danger);-->
<!--      }-->
<!--      @m integration {-->
<!--        color: var(&#45;&#45;theme-color-warning);-->
<!--      }-->
<!--      @m coupon {-->
<!--        color: var(&#45;&#45;theme-color-success);-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  @b basic {-->
<!--    @e title {-->
<!--      line-height: 36px;-->
<!--      height: 36px;-->
<!--      font-weight: bold;-->
<!--      padding-left: 14px;-->
<!--      background: var(&#45;&#45;default-table-strip-bg);-->
<!--    }-->
<!--    @e form {-->
<!--      padding: var(&#45;&#45;default-padding-xlarger) 0;-->
<!--    }-->
<!--  }-->
<!--  @b integral {-->
<!--    margin-top: var(&#45;&#45;default-margin-xlarger);-->
<!--    @e form {-->
<!--      padding-left: var(&#45;&#45;default-padding-xlarger);-->
<!--    }-->
<!--  }-->
<!--  @b formitem {-->
<!--    @e choice {-->
<!--      margin-right: 0;-->
<!--    }-->
<!--    @e type {-->
<!--      margin: 0 0 0 var(&#45;&#45;default-margin-larger);-->
<!--    }-->
<!--  }-->
<!--  @b transaction {-->
<!--    padding: var(&#45;&#45;default-padding-xlarger);-->
<!--  }-->
<!--  @b merchandise {-->
<!--    @e money {-->
<!--      font-size: var(&#45;&#45;default-font-size-large);-->
<!--      font-weight: bold;-->
<!--    }-->
<!--    @e frequency {-->
<!--      color: var(&#45;&#45;theme-font-color-secondary);-->
<!--    }-->
<!--  }-->
<!--  @b detail {-->
<!--    padding: var(&#45;&#45;default-padding-larger) 0;-->
<!--    border-bottom: 1px dashed var(&#45;&#45;theme-base-border-color-primary);-->
<!--  }-->
<!--  @b checkbtn {-->
<!--    text-align: right;-->
<!--    width: 230px;-->
<!--  }-->
<!--  @b doubt {-->
<!--    font-size: var(&#45;&#45;default-font-size-base);-->
<!--    color: var(&#45;&#45;theme-color-primary);-->
<!--    position: relative;-->
<!--    left: 5px;-->
<!--  }-->
<!--  @b title {-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    @e text {-->
<!--      text-align: right;-->
<!--      width: 68px;-->
<!--    }-->
<!--    @e colon {-->
<!--      flex-shrink: 0;-->
<!--    }-->
<!--  }-->
<!--  @b remark {-->
<!--    width: 80px;-->
<!--    white-space: nowrap;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--  }-->
<!--  @b conceal {-->
<!--    width: 68px;-->
<!--    padding-left: 5px;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--    display: -webkit-box;-->
<!--    -webkit-line-clamp: 1;-->
<!--    -webkit-box-orient: vertical;-->
<!--  }-->
<!--}-->
<!--.dialog-container >>> .el-tabs__header {-->
<!--  padding: var(&#45;&#45;default-padding-xlarger) 0 0;-->
<!--}-->
<!--</style>-->

<!--<style scoped>-->
<!--.customerManage .el-radio .el-radio__label{-->
<!--  display: none !important-->
<!--}-->
<!--</style>-->



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
        padding: var(--default-padding-larger) 0 var(--default-padding-larger) var(--default-padding-small);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
      }
    }
    @b avatar {
      width: 80px;
      position: relative;
      @e headportrait {
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
      width: 80px;
      max-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
      margin-top: var(--default-margin-xlarger);
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
    @b checkbtn {
      text-align: right;
      width: 230px;
    }
    @b doubt {
      font-size: var(--default-font-size-base);
      color: var(--theme-color-primary);
      position: relative;
      left: 5px;
    }
    @b title {
      display: flex;
      align-items: center;
      @e text {
        text-align: right;
        width: 68px;
      }
      @e colon {
        flex-shrink: 0;
      }
    }
    @b remark {
      width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @b conceal {
      width: 68px;
      padding-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .dialog-container >>> .el-tabs__header {
    padding: var(--default-padding-xlarger) 0 0;
  }
</style>
