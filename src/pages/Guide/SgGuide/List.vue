<template>
  <div>
    <NsTableGuide ref="mainTable" :url=$api.guide.guide.findList @add="onRedactFun" @scopeRowCount="scopeRowCount"
                  @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop"
                  @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @dimissionFun="dimissionFun" @handleSelectionChange="handleSelectionChange">
    </NsTableGuide>
    <!-- 新增修改导购开始-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp"
               @opened='opened'>
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form :model="model.sgGuide" ref="addForm" label-width="100px" :rules="rules" >
          <el-form-item label="职务：" required>
            <el-form-grid size="xxmd">
              <el-radio-group v-model="model.sgGuideShop.job" @change="jobs">
                <el-radio :label="0">导购</el-radio>
                <el-radio :label="1">店长</el-radio>
              </el-radio-group>
            </el-form-grid>
          </el-form-item>
          <div>
            <el-form-item v-if="guideValue === 1"  label="所属门店：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="shops" >
                  <shop-select-load ref='shopSelectLoadForShop' v-model="subordinateStores"
                                    @selectShop="store($event,row)"
                                    clearable
                                    multiple
                                    :autoload='false'/>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
          <div>
            <el-form-item v-if="guideValue === 0"  label="所属门店：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="shop">
                  <shop-select-load ref='shopSelectLoadForGuide' v-model="model.sgGuideShop.shop_id"
                                    @selectShop="store($event,row)"
                                    clearable
                                    :autoload='false'/>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>

          <el-form-item label="姓名：" prop="name">
            <el-form-grid size="xxmd">
              <el-input type="text" @change="names" v-model="model.sgGuide.name" placeholder="请输入姓名" :maxlength="20" autofocus=true clearable>
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：" >
            <el-form-grid size="xxmd">
              <el-form-item prop="nickname">
                <el-input type="text" @change="nickname" v-model="model.sgGuide.nickname" placeholder="请输入昵称" :maxlength="20" clearable>
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="生日：">
            <el-form-grid size="xxmd">
              <el-form-item prop="birthday">
                <el-date-picker v-model="model.sgGuide.birthday" @change="birthday" type="date" :picker-options="pickerOptions" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="性别：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="sex">
                <el-radio-group @change="sexs" v-model="model.sgGuide.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-form-grid size="xxmd">
              <el-input v-model="model.sgGuide.mobile" @change="mobile" placeholder="请输入手机号" :maxlength="11" clearable :max="11">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工号：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="work_id">
                <div class="page_add_guide_workid" style='display:flex'>
                  <el-input :disabled="disabledWorkPrefix"  v-model="model.sgGuide.work_prefix" @change="workPrefix"/>
                  <el-input type="text" v-model="model.sgGuide.work_number" placeholder="请输入工号" :maxlength="10" clearable/>
                  <!-- @change="workIdChange" -->
                  <span style='color:transparent'>1</span>
                  <ns-button type='text' @click='updateWorkPrefix'>修改前缀</ns-button>
                </div>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="前缀：" required v-if='showUpdateAllGuidePrefix'>
            <el-form-grid size="xxmd">
              <el-form-item prop="updateAllGuidePrefix">
                <el-radio-group v-model="model.updateAllGuidePrefix">
                  <el-radio :label="1">修改所有</el-radio>
                  <el-radio :label="0">修改当前</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="头像：" class="el-inline-block">
            <el-form-grid style="width: 320px;">
              <el-form-item prop="logo">
                <el-upload class="avatar-uploader" @change="logo"
                           :action="this.$api.core.sgUploadFile('test')"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img width="200px" v-if="model.sgGuide.image" :src="model.sgGuide.image" class="avatar">
                  <Icon type="plus" className="avatar-uploader-icon" v-else />
                </el-upload>
                <span class="text-primary"><Icon type="exclamation-circle" />上传图片不能大于500KB,仅支持jpg,jpeg,png,gif格式</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSave(model)" :disabled="isHidden">确定</ns-button>
      </div>
    </el-dialog>
    <!--  新增修改客户结束 -->
    <!--  导购离职弹窗开始  -->
    <!--  v-if="transferCount" 用于判断导购没有会员时不弹窗  -->
    <el-dialog title="客户转移" :visible.sync="resignFormVisible" width="75%" v-if="resignFormVisible &&transferCount!==null" :before-close="cancelTransferToResetByOne">
      <div style="height: 300px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <div class="resignFormVisible_title">
          您正在对 {{transferName}}<span> （{{transferShopName}}）</span>的客户 <span>（共{{transferCount}}人）</span>进行转移
        </div>
        <div class="resignFormVisible_way">
          客户转移方式：
          <el-radio-group v-model="transferRadio">
            <el-radio @change="shiftChange" label="1">
              同门店均分
              <el-tooltip class="item" effect="light" content="平均分配给会员所属门店员工">
                <Icon type="question-circle" theme="filled" />
              </el-tooltip>
            </el-radio>
            <el-radio @change="shiftChange" label="2">
              转移给指定导购
              <el-tooltip class="item" effect="light" content="会员全部转给选择的员工">
                <Icon type="question-circle" theme="filled" />
              </el-tooltip>
            </el-radio>
            <el-radio @change="shiftChange" label="3">
              自定义转移
              <el-tooltip class="item" effect="light" content="自定义选择会员转移给选择的员工">
                <Icon type="question-circle" theme="filled" />
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </div>

        <div v-if="transferRadio === '2'" class="resignFormVisible_otherShoppers">
          <!-- <div class="resignFormVisible_otherShoppers_02">
            请选择导购
          </div> -->
          <div class="resignFormVisible_otherShoppers_01">
            <div class="resignFormVisible_otherShoppers_search">
              <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
                <el-form-item label="关键字：">
                  <el-form-grid size="xmd">
                    <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" clearable></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="所属门店：">
                  <el-form-grid>
                    <shop-select-load v-model="model.shop"
                                      clearable
                                      :sameSystemShopId='sameSystemShopId'/>
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="template-table__more-btns">
              <ns-button type="primary" @click="transferSearch()">搜索</ns-button>
              <ns-button @click="transferToReset()">重置</ns-button>
            </div>
          </div>
          <el-table ref="table" :data="guideList" stripe height="110">
            <el-table-column  width="24">
              <template slot-scope="scope">
                <div class="customerManage">
                  <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row,scope.$index)"></el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="workId" label="工号" align="left">
              <template slot-scope="scope">
                {{scope.row.workId || '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="left" >
              <template slot-scope="scope">
                {{scope.row.name || '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="联系方式" align="left" width="160">
              <template slot-scope="scope">
                {{scope.row.mobile || '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="shopName" label="所属门店" align="left">
              <template slot-scope="scope">
                {{scope.row.shopName || '-'}}
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination v-if="_data.paginationss.enable"  class="template-table-pagination"
                         :page-sizes="_data.paginationss.sizeOpts"
                         :total="_data.paginationss.total"
                         :current-page.sync="_data.paginationss.page"
                         :page-size="_data.paginationss.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="transferShopSizeChange"
                         @current-change="transferShopPageChange">
          </el-pagination>
          <!-- 分页-结束 -->
        </div>
        <div v-if="transferRadio === '3'" class="resignFormVisible_custom">
          <div class="resignFormVisible_custom_01">
            <div class="resignFormVisible_custom_search">
              <el-form ref="table_filter_form" :model="model" label-width="60px" :inline="true">
                <el-form-item label="姓名：">
                  <el-form-grid>
                    <el-input style="width:100px" autofocus=true v-model="customFindVo.name" placeholder="请输入姓名" clearable></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="手机：">
                  <el-form-grid>
                    <el-input style="width:140px" autofocus=true v-model="customFindVo.mobile" placeholder="请输入手机号" clearable></el-input>
                  </el-form-grid>
                </el-form-item>

                <!-- <el-form-item label="会员卡号：">
                  <el-form-grid>
                    <el-input style="width:140px" autofocus=true v-model="model.workId" placeholder="请输入会员卡号" clearable></el-input>
                  </el-form-grid>
                </el-form-item> -->

                <el-form-item label="所属门店：">
                  <el-form-grid>
                    <shop-select-load v-model="customFindVo.shop"
                                      clearable
                                      :sameSystemShopId='sameSystemShopId'/>
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="template-table__more-btns">
              <ns-button type="primary" @click="customSearch()">搜索</ns-button>
              <ns-button @click="customReset()">重置</ns-button>
            </div>
          </div>
          <div>
            <el-table ref="table" :data="tableDataCustomer" stripe @selection-change="handleSelectionChange" height="130">
              <el-table-column type="selection" align="center" :width="50"></el-table-column>
              <el-table-column prop="name" label="会员姓名" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.customerName || '-'}}
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="会员昵称" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.outNick || '-'}}
                </template>
              </el-table-column>

              <el-table-column prop="sex" label="性别" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.sex === 0 ? '女':'男' || '-'}}
                </template>
              </el-table-column>

              <el-table-column prop="memberCard" label="会员卡号" align="left">
                <template slot-scope="scope">
                  {{scope.row.memberCard || '-'}}
                </template>
              </el-table-column>

              <el-table-column prop="mobile" label="手机号" align="left" width="160">
                <template slot-scope="scope">
                  {{scope.row.mobile || '-'}}
                </template>
              </el-table-column>
              <el-table-column prop="shopName,count" label="所属门店" align="left">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.shopName || '-'}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination v-if="_data.customPagination.enable"  class="template-table-pagination"
                           :page-sizes="_data.customPagination.sizeOpts"
                           :total="_data.customPagination.total"
                           :current-page.sync="_data.customPagination.page"
                           :page-size="_data.customPagination.size"
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="customShopSizeChange"
                           @current-change="customShopPageChange">
            </el-pagination>
            <!-- 分页-结束 -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="transferRadio === '3'" class="resignFormVisible_custom_title">
          <div>还剩<span class="text-error">&nbsp;&nbsp;{{transferCount}}&nbsp;&nbsp;</span>个未分配</div>
          <ns-button class="Setupbulksalesguide" type="primary" @click="Setupbulksalesguide()">批量设置导购</ns-button>
          <ns-button @click="cancelReset">取消</ns-button>
        </div>
        <div v-if="transferRadio === '2'">
          <ns-button type="primary" @click="onConfirmResign">确定转移</ns-button>
          <ns-button @click="cancelTransferToReset">取消</ns-button>
        </div>
        <div v-if="transferRadio === '1'">
          <ns-button type="primary" @click="averageTransfer">确定转移</ns-button>
          <ns-button @click="resignFormVisible = false">取消</ns-button>
        </div>
      </div>
    </el-dialog>
    <!--  导购离职弹窗结束  -->
    <!--  批量设置到后弹窗开始 -->
    <el-dialog title="更换导购" width="700px" height="410px" :visible.sync="replaceTheShoppers">
      <div class="resignFormVisible_otherShoppers">
        <div class="resignFormVisible_otherShoppers_01">
          <div class="resignFormVisible_otherShoppers_search">
            <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
              <el-form-item label="关键字：">
                <el-form-grid size="xmd">
                  <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入工号/姓名/昵称/手机号" clearable></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="所属门店：">
                <el-form-grid>
                  <el-select placeholder="请选择所属门店" v-model="model.shop" clearable filterable>
                    <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id"
                               :key="shop.id"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
            </el-form>
          </div>
          <div class="template-table__more-btns">
            <ns-button type="primary" @click="transferSearch()">搜索</ns-button>
            <ns-button @click="transferToReset()">重置</ns-button>
          </div>
        </div>
        <el-table ref="table" :data="guideList" stripe>
          <el-table-column  width="30">
            <template slot-scope="scope">
              <div class="customerManage">
                <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row,scope.$index)"></el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="workId" label="工号" align="left">
            <template slot-scope="scope">
              {{scope.row.workId || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="left" >
            <template slot-scope="scope">
              {{scope.row.name || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.mobile || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="所属门店" align="left">
            <template slot-scope="scope">
              {{scope.row.shopName || '-'}}
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-if="_data.paginationss.enable"  class="template-table-pagination"
                       :page-sizes="_data.paginationss.sizeOpts"
                       :total="_data.paginationss.total"
                       :current-page.sync="_data.paginationss.page"
                       :page-size="_data.paginationss.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="transferShopSizeChange"
                       @current-change="transferShopPageChange">
        </el-pagination>
        <!-- 分页-结束 -->
      </div>
      <!-- <div class="replaceTheShoppers">
      </div> -->
      <div slot="footer" class="dialog-footer">
        <ns-button @click="replaceTheShoppers = false">取消</ns-button>
        <ns-button type="primary" @click="onSaveCustomTransfer">确定</ns-button>
      </div>
    </el-dialog>
    <!--  批量设置到后弹窗结束-->
    <!--  指定导购转移弹窗开始  -->
    <el-dialog title="指定导购转移" :visible.sync="specifyTransferFormVisible" :before-close="onCancelSpecifyTransfer">
      <div style="height: 300px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-form label-width="100px">
          <el-row :gutter="30">
            <el-form-item label="选择导购：">
              <el-form-grid size="xxmd">
                <el-form-item>
                  <el-select placeholder="请选择指定导购" v-model="receiveGuideId" filterable>
                    <el-option v-for="guide in guideShoppersList" :label="guide.name"
                               :disabled="thisGuideDisabled(guide.id)" :value="guide.id" :key="guide.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCancelSpecifyTransfer">取消</ns-button>
        <ns-button type="primary" @click="onSaveSpecifyTransfer">确定</ns-button>
      </div>
    </el-dialog>
    <!--  批量删除员工提示弹框开始 -->
    <el-dialog title="请先转移导购的会员" width="450px" height="165px" :visible.sync="allDeleteFormVisible">
      <div style="height: 60px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        删除说明：
        删除需要先对该员工的客户进行转移，转移完成之后，才能操作删除
      </div>
      <div style="height: 40px;overflow-x:hidden;overflow-y:auto;margin: 10px 0 0 240px;">
        <ns-button @click="allDeleteFormVisible = false">取消删除</ns-button>
        <ns-button type="primary" @click="transfer">前往转移</ns-button>
      </div>
    </el-dialog>
    <!--  批量删除员工提示弹框结束 -->
    <!-- 指定导购转移转移弹窗结束  -->
    <el-dialog title="提示" width="35%" :visible.sync="multipleStoresAreNotSupportedShow"  :before-close="bulkReplacementStores">
      <div class="bulkReplacementStores">
        <div class="bulkReplacementStores_logo text-error">
          <Icon type="close-circle" theme="filled" />
        </div>
        <div>
          <div class="user_style_text">
            员工所属门店有多门店，不允许批量{{switchStateName}}！
          </div>
          <div class="user_style text-error">
            仅支持单门店批量{{switchStateName}}！
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button type="primary" @click="bulkReplacementStores">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 批量操作提示弹窗开始  -->
    <el-dialog title="提示" width="35%" :visible.sync="returnInformationShow"  :before-close="bulkReplacementStores">
      <el-form>
        <el-form-item>
          成功{{switchStateName}} <span class="text-black">{{successCount}}</span>
          名，失败{{switchStateName}} <span class="text-black">{{failCount}}</span> 名。
        </el-form-item>
        <el-form-item>
          <span class="text-error">失败员工姓名：{{nameArr}}</span>
        </el-form-item>
        <el-form-item>
          <div class="bulkReplacementStores_cause">失败原因：有会员的员工，不能批量{{switchStateName}}，需要转移后才能批量{{switchStateName}}。</div>
        </el-form-item>
        <el-form-item>
          <span class="text-black">是否前往会员列表转移？</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <ns-button @click="bulkReplacementStores">取消</ns-button>
        <ns-button type="primary" @click="toTransfer">前往转移</ns-button>
      </div>
    </el-dialog>
    <!-- 批量操作提示弹窗结束  -->

    <!--  自定义客户转移弹窗开始  -->
    <el-dialog title="自定义转移" :visible.sync="customFormVisible"  :before-close="onCancelCustomTransfer">
      <div style="overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-table ref="chooseCustomer" :data="tableDataCustomer" @select="selectRow" @select-all="selectAll" stripe>
          <el-table-column type="selection" align="center" :width="50" disabled></el-table-column>
          <el-table-column prop="registerTime" label="加入时间" align="center" width="200"></el-table-column>
          <!-- <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column> -->
          <el-table-column prop="mobile" label="联系方式" align="center" width="100"></el-table-column>
          <el-table-column prop="memberCard" label="会员卡" align="center"></el-table-column>
          <el-table-column prop="name" label="会员姓名" align="center" width="100"></el-table-column>
          <!-- <el-table-column prop="payAmount" label="付款总金额/单数" align="center" width="100"></el-table-column> -->
          <!-- <el-table-column label="余积分" align="center" width="100"></el-table-column> -->
          <!-- <el-table-column label="公众号" align="center" width="100"></el-table-column> -->
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                     :page-sizes="_data.paginations.sizeOpts"
                     :total="_data.paginations.total"
                     :current-page.sync="_data.paginations.page"
                     :page-size="_data.paginations.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="customerSizeChange"
                     @current-change="customerPageChange">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        请选择接收客户的导购:
        <el-select placeholder="请选择导购" v-model="receiveGuideId" clearable filterable >
          <el-option v-for="guide in guideShoppersList" :label="guide.name" :value="guide.id"
                     :disabled="thisGuideDisabled(guide.id)" :key="guide.id"></el-option>
        </el-select>
        <ns-button @click="onCancelCustomTransfer">取消</ns-button>
        <ns-button type="primary" @click="onSaveCustomTransfer">确定</ns-button>
      </div>
    </el-dialog>
    <!--  更换门店弹窗开始 -->
    <el-dialog :title="shopTitle" width="350px" height="140px" :visible.sync="shopFindListShow" @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form>
          <el-form-item>
            <el-form-grid size="lg">
              <shop-select-load v-model="model.sgGuideShop.shop_id"
                                @change="changeShop"
                                clearable
                                :sameSystemShopId='sameSystemShopId'/>
            </el-form-grid>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="shopFindListShow = false">取消</ns-button>
        <ns-button type="primary" @click="replaceStores">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 更换门店弹窗开始  -->
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="memberBelongingtitle"  :visible.sync="scopeRowCountShow" width="660px" >
      <el-table ref="table" :data="shopFindLists" stripe>
        <el-table-column prop="name" label="所属门店" align="left" width="320">
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
            <span class="text-error">{{scope.row.shopState === 0 ? '(门店已删除)':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="所属地区" align="left" width="320">
          <template slot-scope="scope">
            {{scope.row.address || '-'}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <ns-button class="scopeRowCountShow_button" @click="scopeRowCountShow = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 所属门店查看详情结束 -->
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="title"  :visible.sync="memberBelongingShow" width="460px" >
      <el-form>
        <el-form-item label="会员归属方式：" required>
          <el-form-grid size="xxmd">
            <el-radio-group v-model="memberBelongingRadio">
              <el-radio @change='memberBelonging' label='1'>员工<Icon type="question-circle" theme="filled" /></el-radio>
              <el-radio @change='memberBelonging' label='2'>门店<Icon type="question-circle" theme="filled" /></el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div v-if="storeOwnershipDisplay && memberBelongingRadio === '1'" class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-select v-model="memberBelongingShopid" @change="changeMemberBelonging" placeholder="请选择要更换的门店" filterable>
          <el-option  v-for="item in memberBelongingList" :key="item.id"  :label="item.shopName"  :value="item.id"></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="memberBelongingShow = false">取消</ns-button>
        <ns-button type="primary" @click="memberBelongingEnsure(model)" :disabled="isHidden">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 所属门店查看详情结束 -->
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="title"  :visible.sync="replacementStoresHaveMembersShow" width="460px" >
      <el-form>
        <el-form-item label="会员归属方式：" required>
          <el-form-grid size="xxmd">
            <el-radio-group v-model="replacementStoresHaveMembersRadio">
              <el-radio label='1'>员工<Icon type="question-circle" theme="filled" /></el-radio>
              <el-radio label='2'>门店<Icon type="question-circle" theme="filled" /></el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="replacementStoresHaveMembersShow = false">取消</ns-button>
        <ns-button type="primary" @click="selectStoreButton()">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 所属门店查看详情结束 -->
  </div>
</template>

<script>
import List from './src/List'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableGuide from './NsTableGuide'
import ShopSelectLoad from '@/components/ShopSelectLoad'

List.components = {
  NsTableGuide,
  ElUpload,
  ShopSelectLoad
}
export default List
</script>
<style scoped>
  @import "@theme/variables.pcss";

  >>>.avatar-uploader .el-upload {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-base-link-color-hover);
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: var(--theme-font-color-secondary);
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
</style>
<style scoped>
  @import "@theme/variables.pcss";

  .resignFormVisible_title{
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #FFDEAD;
    font-size: 14px;
    padding-left: 10px;
    margin-bottom: 10px
  }
  .resignFormVisible_way{
    line-height: 40px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid #aaaaaa;
  }
  .resignFormVisible_otherShoppers_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_otherShoppers_search{
    padding: 10px 0 10px 0;
  }
  .resignFormVisible_otherShoppers_02{
    line-height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #aaaaaa;
    padding-left: 10px;
  }
  .resignFormVisible_custom_title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 10px;
    font-size: 13px;
    line-height: 40px;
  }
  .resignFormVisible_custom_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_custom_search{
    padding-top: 5px;

  }
  .template-table__more-btns{
    padding-left: -3px !important;
  }
  .dialog-footer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .replaceTheShoppers{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 10px 20px 0;
    position: relative;;
    float: right;
    bottom: 0
  }
  .el-scrollbar__bar.is-vertical {
    width: 0!important;
    top: 2px;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
    left: 2px;
  }
  .user_style_text{
    font-size: 14px;
    font-weight: 600;
  }
  .user_style{
    text-align: center;
    display: inline-block;
    background:rgba(255,0,0,0.1);
    padding: 3px 10px;
    margin-top: 10px;
    border-radius: var(--default-radius-mini);
  }
  .bulkReplacementStores{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 20px;
  }
  .bulkReplacementStores_logo{
    font-size: 24px;
    position: relative;
    top: 13px;
    left: -15px;
  }
  .Setupbulksalesguide{
    margin: 0 20px !important;
  }
  .bulkReplacementStores_cause{
    color: var(--theme-font-color-secondary);
    background: rgba(188,188,188,0.3);
    padding: 0 var(--default-padding-base);
    border-radius: var(--default-radius-mini);
  }
  >>> .el-radio-group {
    vertical-align: unset;
  }
  .text-black {
    color: var(--theme-font-color-primary);
    font-weight: bold;
  }
</style>
