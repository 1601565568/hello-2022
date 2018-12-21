<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.findList @add="onRedactFun"
                    @shopEdit="shopEdit" @allDelete="allDelete" @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @dimissionFun="dimissionFun" @handleSelectionChange="handleSelectionChange">
      <!-- <ns-table-guide ref="table" :url=$api.guide.guide.findList @add="onRedactFun"
      @shopEdit="shopEdit" @allDelete="allDelete" @ondelete="ondelete" @onAddCustomer="onRedactFun" @quit="quit" @handleSelectionChange="handleSelectionChange"> -->
    </ns-table-guide>
    <!-- 新增修改客户开始-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form :model="model.sgGuide" ref="addForm" label-width="100px" :rules="rules" >
          <el-form-item label="所属门店：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="shop">
                <el-select placeholder="所属门店" @change="store" v-model="model.sgGuideShop.shop_id" filterable >
                  <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id" :key="shop.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="姓名：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="name">
                <el-input type="text" @change="names" v-model="model.sgGuide.name" placeholder="请输入姓名" autofocus=true clearable>
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="nickname">
                <el-input type="text" @change="nickname" v-model="model.sgGuide.nickname" placeholder="请输入昵称" clearable>
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
                <el-input v-model="model.sgGuide.mobile" @change="mobile" placeholder="请输入手机号" clearable>
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="职务：" required>
            <el-form-grid size="xxmd">
              <el-radio-group v-model="model.sgGuideShop.job" @change="jobs">
                <el-radio :label="0">导购</el-radio>
                <el-radio :label="1">店长</el-radio>
              </el-radio-group>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工号：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="work_id">
                <div class="page_add_guide_workid" style='display:flex'>
                  <el-form-grid size="sm"><el-input :disabled="disabledWorkPrefix"  v-model="model.sgGuide.work_prefix" @blur='blurWorkPrefix'/></el-form-grid>
                  <el-input type="text" v-model="model.sgGuide.work_number" placeholder="请输入工号" clearable/>
                  <!-- @change="workIdChange" -->
                  <span style='color:transparent'>1</span>
                  <ns-button type='text' @click='updateWorkPrefix'>修改前缀</ns-button>
                </div>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="前缀：" required v-if='showUpdateAllGuidePrefix'>
            <el-form-grid size="xxmd">
              <el-form-item prop="sex">
                <el-radio-group  v-model="model.updateAllGuidePrefix">
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
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!--  新增修改客户结束 -->

    <!--  导购离职弹窗开始  -->
    <el-dialog title="转移客户" :visible.sync="resignFormVisible">
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
    </el-dialog>
    <!--  导购离职弹窗结束  -->
    <!--  批量删除员工提示弹框开始 -->
    <el-dialog title="请先转移导购的会员" width="500px" height="300px" :visible.sync="allDeleteFormVisible">
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

    <!--  自定义客户转移弹窗开始  -->
    <el-dialog title="自定义转移" :visible.sync="customFormVisible" :before-close="onCancelCustomTransfer">
      <div style="overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-table ref="chooseCustomer" :data="tableDataCustomer" @select="selectRow" @select-all="selectAll" stripe>
          <el-table-column type="selection"  width="30"></el-table-column>
          <el-table-column prop="createTime" label="加入时间" align="center" width="150"></el-table-column>
          <el-table-column prop="cName" label="姓名" align="center" width="100"></el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="center" width="100"></el-table-column>
          <el-table-column prop="memberCard" label="会员卡" align="center" width="100"></el-table-column>
          <el-table-column prop="name" label="绑定导购" align="center" width="100"></el-table-column>
          <el-table-column prop="payAmount" label="付款总金额/单数" align="center" width="100"></el-table-column>
          <el-table-column label="余积分" align="center" width="100"></el-table-column>
          <el-table-column label="公众号" align="center" width="100"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
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
    </el-dialog>
    <!--  自定义客户转移弹窗开始  -->
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
</style>

