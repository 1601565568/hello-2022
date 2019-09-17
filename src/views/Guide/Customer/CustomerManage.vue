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
        <el-table-column  width="30">
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
    <!-- 客户详情弹窗（已作废）-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
    <div>
      <div class="kehuBox-main">
        <div class="kehuBox-main-top">
          <p>
            <img :src="items.image ||require('../../../assets/default-user.png')" class="man-img" v-if="items.image !== null">
            <span v-if="items.image === null" class="img-show"></span>
            <span class="man-name">{{items.gradeName || items.customerName}}</span>
            <span>{{items.grade === 0 ? '' : "VIP" + items.grade}}</span>
          </p>
        </div>
        <div>
          <div class="kehuBox-main-span">
            <el-row>
              <el-col :span='8'><span>昵称：{{items.outAlias|| '-'}}</span></el-col>
              <el-col :span='8'><span>会员卡：{{items.memberCard|| '-'}}</span></el-col>
              <el-col :span='8'><span>生日：{{items.birthday || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>性别：{{items.sex === 1?'男':items.sex === 0?'女':'未知'}}</span></el-col>
              <el-col :span='8'><span>手机号：{{items.mobile|| '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                地区：
                <span v-if='items.province !== null && items.province !== ""'>
                  {{items.province}}/
                </span>
                <span v-else>
                   -/
                </span>
                <span v-if='items.city !== null && items.city !== ""'>
                  {{items.city}}/
                </span>
                <span v-else>
                  -/
                </span>
                <span v-if='items.district !== null && items.district !== ""'>
                  {{items.district}}
                </span>
                <span v-else>
                  -
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <span>
                  地址：{{items.address === null?'-':items.address}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>积分：{{result|| '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>初次来源：{{'-'}}</span></el-col>
            </el-row>
          </div>
          <div>
            <p class="p-title">会员印象：</p>
            <p>{{items.impression|| '-'}}</p>
            <p class="p-title">会员标签：</p>
            <p v-for="item in items.tagList" :key="item.id">
              <span>{{item.name===null&&item.value===null?'-':item.name+':'+item.value}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </el-dialog>
    <!-- 新客户详情弹窗-->
    <el-dialog
      title="详情"
      :visible.sync="shopKuhuShow"
      width="900px" height="500px" class="dialog-container"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="dialog-container__msg">
        <div class="dialog-avatar">
          <el-image mode="aspectFit" src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    width="80" height="80" bgColor="#FFF" circle="true"/>
          <div class="dialog-avatar__figure">
            <!-- 男生图标-->
            <i class="iconfont icon-nan1 dialog-avatar__figure--male" v-if="items.sex===1"></i>
            <!-- 女生图标-->
            <i class="iconfont icon-nv1 dialog-avatar__figure--female" v-if="items.sex===0"></i>
          </div>
          <div class="dialog-avatar__level">
            V{{items.grade}}会员
          </div>
        </div>
        <el-form label-width="100px">
          <el-form-item label="姓名：" class="el-inline-block">
            <el-form-grid size="xs">{{items.outAlias|| '-'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="会员折扣：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>8折</span>
              <i class="iconfont icon-icon_discount dialog-favorable__text dialog-favorable__text--discount"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分2：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>2460</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分5：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>1857</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机：" class="el-inline-block">
            <el-form-grid size="xs">{{items.mobile}}</el-form-grid>
          </el-form-item>
          <el-form-item label="积分1：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>3998</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分3：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>2120</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：" class="el-inline-block">
            <el-form-grid size="xs">
              <span v-if="remark.length<16">
                {{remark}}
              </span>
              <div v-else>
                <el-tooltip :content="remark" placement="bottom">
                  <div slot="content">{{remark}}</div>
                  <span class="dialog-hidden">{{remark}}</span>
                </el-tooltip>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>100</span>
              <i class="iconfont icon-icon_coupon dialog-favorable__text dialog-favorable__text--coupon"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分4：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>1257</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
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
                  <el-form-grid size="xxmd">{{items.bindTime}}</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.email}}</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.province+items.city}}</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">{{items.address}}</el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">自定义属性</div>
              <el-form label-width="180px" class="dialog-basic__form">
                <el-form-item label="希望在哪看到护肤小知识：" class="el-inline-block">
                  <el-form-grid size="xxmd">1994-08-07</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">已关注</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">12346647323683638</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">女</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">2019-08-07 10:07:09</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">Bumblebee@yeah.net</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">福建厦门市湖里区</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">金山街道软件园二期观日路22号401
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="交易信息" name="transaction">
            <div class="dialog-transaction">
              <el-form class="dialog-transaction__form">
                <el-form-item label="当前客户累计交易额（元）">
                  <el-popover
                    placement="bottom"
                    width="200"
                    trigger="hover"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                    <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                  </el-popover>
                </el-form-item>
                <el-form-item class="dialog-merchandise">
                  <el-form-grid class="dialog-merchandise__money">¥360.00</el-form-grid>
                  <el-form-grid class="dialog-merchandise__frequency">（交易次数：1）</el-form-grid>
                </el-form-item>
                <el-form-item class="dialog-detail">
                  <el-form-grid size="md">
                    回购周期：未回购
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    笔单价：360.00元
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    连带率：0件
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="最近交易：">
                  <el-form-grid size="xxlg">
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="xmd" class="dialog-checkbtn">
                    <ns-button type="text">查看历史</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分1信息" name="integralone">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分2信息" name="integraltwo">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分3信息" name="integralthree">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分4信息" name="integralfour">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分5信息" name="integralfive">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 打标签-->
    <el-dialog
      title="自定义属性"
      :visible.sync="showTag"
      width="900px" height="500px">
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
              <el-col :span="16" style="text-align: right">
                <el-form-grid>
                  <el-input  placeholder="请输入属性名称"></el-input>
                </el-form-grid>
                <el-form-grid>
                  <ns-button type="primary">搜索</ns-button>
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
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" v-else-if="scope.row.tagType===2" @change="addDate(scope.row)">
                </el-date-picker>
                <!--单选框-->
                <el-radio-group v-model="scope.row.value" v-else-if="scope.row.tagType === 3" >
                  <el-radio v-for="item1 in scope.row.tagArr.split('|')" :label="item1" :key="item1"
                            @change="addRadio(scope.row,item1)">{{item1}}</el-radio>
                </el-radio-group>
                <!-- 复选框 -->
                <el-checkbox-group v-model="checkboxList" v-else-if="scope.row.tagType === 4"  >
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
CustomerManage.components = {
  NsTableGuide
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

@import "@theme/variables.pcss";

:root {
  --dialog-font-color-red: #FF1985;
  --dialog--font-color-brown: #904B00;
}

@component-namespace dialog {
  @b container {
    @e msg {
      display: flex;
      padding: var(--default-padding-xlarger) 0 20px var(--default-padding-small);
      border-bottom: 1px solid var(--theme-base-border-color-primary);
    }
  }
  @b avatar {
    width: 80px;
    position: relative;
    @e figure {
      text-align: center;
      line-height: 26px;
      width: 26px;
      height: 26px;
      position: absolute;
      right: -10px;
      top: 0;
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
      bottom: 5px;
      background-image: linear-gradient(90deg, #FFCD30 0%, #FFDD74 97%);
      border-radius: 18px;
    }
  }
  @b hidden {
    width: 105px;
    max-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  @b favorable {
    position: relative;
    @e text {
      position: absolute;
      top: 0;
      left: -80px;
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
    color: var(--theme-color-primary);
    margin-left: var(--default-margin-small);
  }
}
.dialog-container >>> .el-tabs__header {
  padding: var(--default-padding-xlarger) 0 0;
}
</style>

<style scoped>
.customerManage .el-radio .el-radio__label{
  display: none !important
}
</style>
