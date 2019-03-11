<template>
  <div>
    <NsTableGuide ref="table" :url=$api.guide.guide.findList @add="onRedactFun" @scopeRowCount="scopeRowCount"
                    @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop" @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @dimissionFun="dimissionFun" @handleSelectionChange="handleSelectionChange">
    </NsTableGuide>
    <!-- 新增修改客户开始-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
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

          <!-- <el-form-item label="所属门店：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="shops" v-if="guideValue === 1" >
                <el-select placeholder="所属门店" @change="store" v-model="subordinateStores" multiple>
                  <el-option v-for="shops in shopFindList" :label="shops.shopName" :value="shops.id" :key="shops.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="shop" v-else >
                 <el-select placeholder="所属门店" @change="store" v-model="model.sgGuideShop.shop_id" filterable >
                  <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id" :key="shop.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item> -->

          <el-form-item v-if="guideValue === 1"  label="所属门店：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="shops" >
                <el-select placeholder="所属门店" @change="store($event,row)" @blur="reduce" v-model="subordinateStores" multiple>
                  <el-option v-for="shops in shopFindList" :label="shops.shopName" :value="shops.id" :key="shops.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item v-if="guideValue === 0"  label="所属门店：" required>
            <el-form-grid size="xxmd" >
              <el-form-item prop="shop" class="styleIsPerfec">
                <el-select placeholder="所属门店" @change="store($event,row)" v-model="model.sgGuideShop.shop_id" filterable >
                  <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id" :key="shop.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="姓名：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="name">
                <el-input type="text" @change="names" v-model="model.sgGuide.name" placeholder="请输入姓名" :maxlength="20" autofocus=true clearable>
                </el-input>
              </el-form-item>
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
          <el-form-item label="手机号：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="mobile">
                <el-input v-model="model.sgGuide.mobile" @change="mobile" placeholder="请输入手机号" :maxlength="11" clearable :max="11">
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工号：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="work_id">
                <div class="page_add_guide_workid" style='display:flex'>
                  <el-form-grid size="sm"><el-input :disabled="disabledWorkPrefix"  v-model="model.sgGuide.work_prefix" @blur='blurWorkPrefix'/></el-form-grid>
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
                <el-radio-group v-model="model.sgGuideShop.updateAllGuidePrefix">
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
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>上传图片不能大于200KB</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSave(model)">{{nextStep}}</ns-button>
      </div>
    </el-dialog>
    <!--  新增修改客户结束 -->
    <!--  导购离职弹窗开始  -->
    <!-- <el-dialog title="转移客户" :visible.sync="resignFormVisible">
      <div style="height: 300px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-form label-width="100px">
          <el-row :gutter="30">
            <el-form-item label="客户总数：">
              <el-form-grid size="xxmd">
                <el-form-item>
                  <el-input type="text" v-model="customerTotal" disabled="disabled" clearable>
                  </el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="转移方式：">
              <el-form-grid size="xxmd">
                <el-form-item prop="transferWay">
                  <el-select placeholder="转移方式" v-model="transferWay">
                    <el-option value="1" label="同门店均分"></el-option>
                    <el-option value="2" label="转移给指定导购"></el-option>
                    <el-option value="3" label="自定义转移"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="resignFormVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onConfirmResign">确定</ns-button>
      </div>
    </el-dialog> -->
    <!--  导购离职弹窗结束  -->
    <!--  导购离职弹窗开始  -->
    <el-dialog title="客户转移" :visible.sync="resignFormVisible" width="75%">
      <div style="height: 300px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <div class="resignFormVisible_title">
          您正在对 {{transferName}}<span> （{{transferShopName}}）</span>的客户 <span>（共{{transferCount}}人）</span>进行转移
        </div>
        <div class="resignFormVisible_way">
          客户转移方式：
          <el-radio-group v-model="transferRadio">
            <el-radio @change="shiftChange" label="1">
              同门店均分
              <el-tooltip class="item" effect="light" content="平均分配给会员所属门店员工" placement="bottom">
               <el-button><i class="el-icon-question"></i></el-button>
              </el-tooltip>
            </el-radio>
            <el-radio @change="shiftChange" label="2">
              转移给指定导购
              <el-tooltip class="item" effect="light" content="会员全部转给选择的员工" placement="bottom">
                <el-button><i class="el-icon-question"></i></el-button>
              </el-tooltip>
            </el-radio>
            <el-radio @change="shiftChange" label="3">
              自定义转移
              <el-tooltip class="item" effect="light" content="自定义选择会员转移给选择的员工" placement="bottom">
                <el-button><i class="el-icon-question"></i></el-button>
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </div>
        <div v-if="transferRadio === '2'" class="resignFormVisible_otherShoppers">
          <div class="resignFormVisible_otherShoppers_02">
            请选择导购
          </div>
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
                        :current-page="_data.paginationss.page"
                        :page-size="_data.paginationss.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="transferShopSizeChange"
                        @current-change="transferShopPageChange">
          </el-pagination>
          <!-- 分页-结束 -->
        </div>
        <div v-if="transferRadio === '3'" class="resignFormVisible_custom">
          <div class="resignFormVisible_custom_title">
            <ns-button type="primary" @click="Setupbulksalesguide()">批量设置导购</ns-button>
            <div>还剩<span class="transferCount">&nbsp;&nbsp;{{transferCount}}&nbsp;</span>个未分配</div>
          </div>
          <div class="resignFormVisible_custom_01">
            <div class="resignFormVisible_custom_search">
              <el-form ref="table_filter_form" :model="model" label-width="60px" :inline="true">
                <el-form-item label="姓名：">
                  <el-form-grid>
                    <el-input style="width:100px" autofocus=true v-model="model.name" placeholder="请输入姓名" clearable></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="手机：">
                  <el-form-grid>
                    <el-input style="width:140px" autofocus=true v-model="model.mobile" placeholder="请输入手机号" clearable></el-input>
                  </el-form-grid>
                </el-form-item>

                <!-- <el-form-item label="会员卡号：">
                  <el-form-grid>
                    <el-input style="width:140px" autofocus=true v-model="model.workId" placeholder="请输入会员卡号" clearable></el-input>
                  </el-form-grid>
                </el-form-item> -->

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
              <ns-button type="primary" @click="customSearch()">搜索</ns-button>
              <ns-button @click="customReset()">重置</ns-button>
            </div>
          </div>
          <div>
            <el-table ref="table" :data="tableDataCustomer" stripe @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="42" class="table_selection"></el-table-column>
              <el-table-column prop="name" label="会员姓名" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.name || '-'}}
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="会员昵称" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.nickName || '-'}}
                </template>
              </el-table-column>

              <el-table-column prop="sex" label="性别" align="left" width="130">
                <template slot-scope="scope">
                  {{scope.row.sex === 0 ? '女':'男' || '-'}}
                </template>
              </el-table-column>

              <el-table-column prop="work_id" label="会员卡号" align="left">
                <template slot-scope="scope">
                  {{scope.row.work_id || '-'}}
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
                          :current-page="_data.customPagination.page"
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
        <!-- <div slot="footer" v-if="transferRadio === '3'" class="dialog-footer">
          请选择接收客户的导购:
          <el-select placeholder="请选择导购" v-model="receiveGuideId" clearable filterable >
            <el-option v-for="guide in guideList" :label="guide.name" :value="guide.id"
                      :disabled="thisGuideDisabled(guide.id)" :key="guide.id"></el-option>
          </el-select>
          <ns-button @click="onCancelCustomTransfer">取消</ns-button>
          <ns-button type="primary" @click="onSaveCustomTransfer">确定</ns-button>
        </div> -->
        <div>
          <ns-button type="primary" @click="onConfirmResign">确定转移</ns-button>
          <ns-button @click="resignFormVisible = false">取消</ns-button>
        </div>
      </div>
    </el-dialog>
    <!--  导购离职弹窗结束  -->
    <!--  批量设置到后弹窗开始 -->
    <el-dialog title="更换导购" width="700px" height="500px" :visible.sync="replaceTheShoppers">
    <div class="resignFormVisible_otherShoppers">
          <div class="resignFormVisible_otherShoppers_02">
            请选择导购
          </div>
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
              <el-table-column prop="work_id" label="工号" align="left">
                <template slot-scope="scope">
                  {{scope.row.work_id || '-'}}
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
                        :current-page="_data.paginationss.page"
                        :page-size="_data.paginationss.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="transferShopSizeChange"
                        @current-change="transferShopPageChange">
          </el-pagination>
          <!-- 分页-结束 -->
        </div>
        <div class="replaceTheShoppers">
          <ns-button @click="replaceTheShoppers = false">取消</ns-button>
          <ns-button type="primary" @click="onSaveSpecifyTransfer">确定</ns-button>
        </div>
      </el-dialog>
      <!--  批量设置到后弹窗结束-->
    <!--  批量删除员工提示弹框开始 -->
    <el-dialog title="请先转移导购的会员" width="500px" :visible.sync="allDeleteFormVisible">
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
    <!--  删除员工提示弹框开始 -->
    <el-dialog title="请先转移导购的会员" width="500px" :visible.sync="deleteFormVisible">
      <div style="height: 60px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        删除说明：
        删除需要先对该员工的客户进行转移，转移完成之后，才能操作删除
      </div>
      <div style="height:40px;overflow-x:hidden;overflow-y:auto;margin: 10px 0 0 240px;">
        <ns-button @click="deleteFormVisible = false">取消删除</ns-button>
        <ns-button type="primary" @click="transfer">前往转移</ns-button>
      </div>
    </el-dialog>
    <!--  删除员工提示弹框结束 -->
    <!--  指定导购转移弹窗开始  -->
    <el-dialog title="指定导购转移" :visible.sync="specifyTransferFormVisible" :before-close="onCancelSpecifyTransfer">
      <div style="height: 300px;overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-form label-width="100px">
          <el-row :gutter="30">
            <el-form-item label="选择导购：">
              <el-form-grid size="xxmd">
                <el-form-item>
                  <el-select placeholder="请选择指定导购" v-model="receiveGuideId" filterable>
                    <el-option v-for="guide in guideList" :label="guide.name"
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
    <!-- 指定导购转移转移弹窗结束  -->

    <!-- 选择会员归属弹窗结束  -->
    <el-dialog title="选择会员归属" :visible.sync="memberBelongingShowTow"  :before-close="onCancelCustomTransfer">
      <div style="overflow-x:hidden;overflow-y:auto;margin: 10px 0;">您好，请设置被修改掉的所属门店会员的专属导购：</div>
      <div class="user_style">会员归属方式：
        <el-radio-group v-model="memberferRadio">
          <el-radio  @change='storeOwnership' label="1">员工<el-tooltip placement="bottom"><div slot="content">会员归属导购，并且可选择会员的所属门店</div><el-button><i class="el-icon-question"></i></el-button></el-tooltip></el-radio>
          <el-radio  @change='storeOwnership' label="2">门店<el-tooltip placement="bottom"><div slot="content">会员归属原门店，专属导购为空</div><el-button><i class="el-icon-question"></i></el-button></el-tooltip></el-radio>
        </el-radio-group>
      </div>
      <div v-if="storeOwnershipDisplay && memberferRadio === '2'">
        <el-form ref="table_filter_form" :model="model" label-width="60px" :inline="true">
          <el-form-item label="所属门店：" class="elFormItem">
            <el-form-grid>
              <el-select placeholder="请选择所属门店" v-model="model.shop" clearable filterable>
                <el-option v-for="shop in subordinateStores" :label="shop.shopName" :value="shop.id"
                          :key="shop.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="memberBelongingShowTow = false">取消</ns-button>
        <ns-button type="primary" @click="membershipRetention(model)">保存</ns-button>
      </div>
    </el-dialog>
    <!-- 选择会员归属弹窗开始  -->

    <!--  自定义客户转移弹窗开始  -->
    <!-- <el-dialog title="自定义转移" :visible.sync="customFormVisible"  :before-close="onCancelCustomTransfer">
      <div style="overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-table ref="chooseCustomer" :data="tableDataCustomer" @select="selectRow" @select-all="selectAll" stripe>
          <el-table-column type="selection"  width="40" align="center" disabled></el-table-column>
          <el-table-column prop="registerTime" label="加入时间" align="center" width="200"></el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="center" width="100"></el-table-column>
          <el-table-column prop="memberCard" label="会员卡" align="center"></el-table-column>
          <el-table-column prop="name" label="会员姓名" align="center" width="100"></el-table-column>
        </el-table>
      </div>
      分页
      <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                     :page-sizes="_data.paginations.sizeOpts"
                     :total="_data.paginations.total"
                     :current-page="_data.paginations.page"
                     :page-size="_data.paginations.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="customerSizeChange"
                     @current-change="customerPageChange">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        请选择接收客户的导购:
        <el-select placeholder="请选择导购" v-model="receiveGuideId" clearable filterable >
          <el-option v-for="guide in guideList" :label="guide.name" :value="guide.id"
                     :disabled="thisGuideDisabled(guide.id)" :key="guide.id"></el-option>
        </el-select>
        <ns-button @click="onCancelCustomTransfer">取消</ns-button>
        <ns-button type="primary" @click="onSaveCustomTransfer">确定</ns-button>
      </div>
    </el-dialog> -->
    <!--  更换门店弹窗开始 -->
    <el-dialog :title="shopTitle" width="560px" height="150px" :visible.sync="shopFindListShow" @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form>
          <el-form-item>
            <el-form-grid size="lg">
              <el-select v-model="model.sgGuideShop.shop_id" @change="changeShop" placeholder="请选择要更换的门店">
                <el-option  v-for="item in shopFindList" :key="item.id"  :label="item.shopName"  :value="item.id"></el-option>
              </el-select>
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
        <el-table ref="table" :data="shopFindLists" >
          <el-table-column prop="name" label="所属门店" align="left" width="320">
            <template slot-scope="scope">
              {{scope.row.name || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="所属地区" align="left" width="320">
            <template slot-scope="scope">
              {{scope.row.address || '-'}}
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="scopeRowCountShow_footer">
          <ns-button class="scopeRowCountShow_button" @click="scopeRowCountShow = false">关闭</ns-button>
        </div>
      </el-dialog>
    <!-- 所属门店查看详情结束 -->
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="title"  :visible.sync="memberBelongingShow" width="460px" >
      <el-form>
      <el-form-item label="会员归属方式：" required>
        <el-form-grid size="xxmd">
          <el-radio-group v-model="model.sgGuideShop.memberBelonging" @change="memberBelonging">
            <el-radio :label="1">员工<i class="el-icon-question"></i></el-radio>
            <el-radio :label="2">门店<i class="el-icon-question"></i></el-radio>
          </el-radio-group>
        </el-form-grid>
      </el-form-item>
      </el-form>
      <div v-if="memberBelongingShows" class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-select v-model="model.sgGuideShop.shop_id" @change="changeMemberBelonging" placeholder="请选择要更换的门店" :size="medium">
          <el-option  v-for="item in shopFindList" :key="item.id"  :label="item.shopName"  :value="item.id"></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="memberBelongingShow = false">取消</ns-button>
        <ns-button type="primary" @click="memberBelongingEnsure(model)">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 所属门店查看详情结束 -->
  </div>
</template>

<script>
  import List from './src/List'
  import NsTableGuide from './NsTableGuide'
  List.components = {
    NsTableGuide
  }
  export default List
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
  .scopeRowCountShow_footer{
    margin: 10px 0 10px 0;
  }
</style>
<style>
  .styleIsPerfec{
    height:28px!important;
  }
  .resignFormVisible_title{
    height:40px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    background-color:#FFDEAD;
    font-size:14px;
    padding-left:10px;
    margin-bottom:10px
  }
  .resignFormVisible_way{
    line-height: 40px;
    display:flex;
    align-items: center;
    padding-left:10px;
    border-bottom:1px solid #aaaaaa;
  }
  .resignFormVisible_otherShoppers{
    margin-bottom:30px;
  }
  .resignFormVisible_otherShoppers_01{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_otherShoppers_search{
    padding:10px 0 10px 0;
  }
  .resignFormVisible_otherShoppers_02{
    line-height: 40px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    font-size:14px;
    border-bottom:1px solid #aaaaaa;
    padding-left:10px;
  }
  .resignFormVisible_custom{
    margin-bottom:30px;
  }
  .resignFormVisible_custom_title{
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding:0 10px 0 10px;
    font-size:13px;
    line-height: 40px;
    border-bottom:1px solid #aaaaaa;
  }
  .transferCount{
    color:#FF0000;
  }
  .resignFormVisible_custom_01{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_custom_search{
    padding-top:5px;

  }
  .template-table__more-btns{
    padding-left:-3px !important;
  }
  .dialog-footer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .replaceTheShoppers{
    display:flex;
    justify-content: flex-end;
    align-items: center;
    margin:10px 10px 20px 0;
  }
  .el-scrollbar__bar.is-vertical {
    width: 0!important;
    top: 2px;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
    left: 2px;
  }
  .user_style{
    margin-bottom:20px
  }
  .elFormItem{
    margin-bottom: 17px!important;
  }
</style>


