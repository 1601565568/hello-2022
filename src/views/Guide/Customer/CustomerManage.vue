<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.customerFindCustomerList @add="onRedactFun"
      @shopEdit="shopEdit" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!--  自定义客户转移弹窗开始  -->
    <el-dialog :title="title" width="560px" height="300px" :visible.sync="shopFindListShow" @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
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
    <el-dialog :title="title" :visible.sync="shopKuhuShow" width="600px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
    <div>
      <div class="kehuBox-main">
        <div class="kehuBox-main-top">
          <p>
            <img :src="items.image" class="man-img">
            <span class="man-name">{{items.gradeName}}</span>
            <span>{{items.grade}}</span>
          </p>
          <!-- <p class="p-button">X</p> -->
        </div>
        <div>
          <div class="kehuBox-main-span">
            <el-row>
              <el-col :span='8'><span>姓名：{{items.customerName}}</span></el-col>
              <el-col :span='8'><span>会员卡：{{items.memberCard}}</span></el-col>
              <el-col :span='8'><span>生日：{{items.birthday}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>性别：{{items.sex === 1?'男':'女'}}</span></el-col>
              <el-col :span='8'><span>手机号：{{items.mobile}}</span></el-col>
              <el-col :span='8'><span>地址：{{items.province+'/'+items.city}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='8'><span>积分：{{items.point}}</span></el-col>
              <!-- <el-col :span='8'><span>优惠券：{{items.point}}</span></el-col> -->
            </el-row>
            <!-- <p> <span>性别：{{items.sex}}</span><span>手机号：{{items.mobile}}</span><span>地址：{{items.address}}</span></p>
            <p> <span>积分：{{items.point}}</span> <span>{{items.point}}</span></p> -->
          </div>
          <div>
            <p class="p-title">会员印象：</p>
            <p>{{items.impression}}</p>
            <p class="p-title">会员标签：</p>
            <p v-for="item in items.tagList" :key="item.id">
              <span>{{item.name+':'+item.value}}</span>
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
</style>

