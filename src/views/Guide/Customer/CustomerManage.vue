<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.customerFindCustomerList @add="onRedactFun"
      @shopEdit="shopEdit" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!--  自定义客户转移弹窗开始  -->
    <el-dialog :title="title" width="560px" height="300px" :visible.sync="shopFindListShow" @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;text-align:center">
        <el-select v-model="value" placeholder="请选择要更换的导购">
          <el-option
            v-for="item in shopFindList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!--  自定义客户转移弹窗结束  -->
    <el-dialog :title="title" :visible.sync="shopFindListShow" width="800px" >
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
          <!-- <el-radio v-model="radio" label="1">备选项</el-radio> -->
          <template slot-scope="scope">
            <div class="customerManage">
              <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row,scope.$index)"></el-radio>
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
                     :current-page="_data.pagination.page"
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
    <el-dialog :title="title" :visible.sync="shopKuhuShow" width="600px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
    <div>
      <div class="kehuBox-main">
        <div class="kehuBox-main-top">
          <p>
            <img :src="items.image" class="man-img" v-if="items.image !== null">
            <span v-if="items.image === null" class="img-show"></span>
            <span class="man-name">{{items.gradeName || items.customerName}}</span>
            <span>{{items.grade === 0 ? '' : "VIP" + items.grade}}</span>
          </p>
        </div>
        <div>
          <div class="kehuBox-main-span">
            <el-row>
              <el-col :span='8'><span>姓名：{{items.customerName|| '-'}}</span></el-col>
              <el-col :span='8'><span>会员卡：{{items.memberCard|| '-'}}</span></el-col>
              <el-col :span='8'><span>生日：{{items.birthday || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>性别：{{items.sex === 1?'男':'女'}}</span></el-col>
              <el-col :span='8'><span>手机号：{{items.mobile|| '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <span>
                  地区：{{items.province === null&&items.city === null&&items.district === null?'-':items.province+' / '+items.city+' / '+items.district}}
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
              <!-- <el-col :span='8'><span>优惠券：{{items.point}}</span></el-col> -->
            </el-row>
            <!-- <p> <span>性别：{{items.sex}}</span><span>手机号：{{items.mobile}}</span><span>地址：{{items.address}}</span></p>
            <p> <span>积分：{{items.point}}</span> <span>{{items.point}}</span></p> -->
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
</style>
<style>
.customerManage .el-radio .el-radio__label{
  display: none !important
}
</style>

