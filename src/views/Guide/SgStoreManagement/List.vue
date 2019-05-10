<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.findShopListOnCondition @synchronousStores="onRedactFun" @scopeRowCount="scopeRowCount"
        @elIconMenu="elIconMenu" @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop" @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="title"  :visible.sync="memberBelongingShow" width="750px" >
      <div class="recruitingcode_title">
        <div class="recruitingcode">
          <i class="iconfont icon-erweima"></i>
        </div>
        <div>
          <div><template><el-checkbox v-model="checked"></el-checkbox></template>会员注册时是否需要关注公众号</div>
          <div>勾选此选项，则下载为微信公众号二维码；否则，下载为会员开卡小程序码。</div>
        </div>
      </div>
      <div>
        <el-row class="elrow">
          <el-col :span="8" class="elrow_size">尺寸</el-col>
          <el-col :span="8">公众号二维码<i class="el-icon-question"><div class="publicnumberqrCode"><img src="../../../assets/putongerweima.png"></div></i></el-col>
          <el-col :span="8">小程序二维码<i class="el-icon-question"><div class="smallprogramqrCode"><img src="../../../assets/xiaochengxu.png"></div></i></el-col>
        </el-row>
        <el-row class="elrow_first">
          <el-col  :span="8">
            <div>小尺寸：适用于屏幕类、宣传册等</div>
            <span class="last_div">边长约8cm，最佳扫码距离0.5m</span>
          </el-col>
          <el-col v-if="checked" class="elrow_firstcol" :span="8"><ns-button  type="text"><a :href="url+0+'&shopId='+succeedObj.shopId+'&size='+0"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8"><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
          <el-col v-if="!checked" class="elrow_firstcol" :span="8"><ns-button  type="text"><a :href="url+1+'&shopId='+succeedObj.shopId+'&size='+0"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8"><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
        </el-row>
        <el-row class="elrow_second">
          <el-col :span="8">
            <div>中尺寸：适用于海报、展架等</div>
            <div class="last_div">边长约15cm，最佳扫码距离1m</div>
          </el-col>
          <el-col v-if="checked" class="elrow_firstcol" :span="8"><ns-button  type="text"><a :href="url+0+'&shopId='+succeedObj.shopId+'&size='+1"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8"><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
          <el-col v-if="!checked" class="elrow_firstcol" :span="8"><ns-button  type="text"><a :href="url+1+'&shopId='+succeedObj.shopId+'&size='+1"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8"><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
        </el-row>
        <el-row class="elrow_thirdly">
          <el-col :span="8">
            <div>大尺寸：适用于幕布、大型广告等</div>
            <div class="last_div">边长约50cm，最佳扫码距离2.5m</div>
          </el-col>
          <el-col v-if="checked" class="elrow_firstcol" :span="8" ><ns-button  type="text"><a :href="url+0+'&shopId='+succeedObj.shopId+'&size='+2"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8" ><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
          <el-col v-if="!checked" class="elrow_firstcol" :span="8" ><ns-button  type="text"><a :href="url+1+'&shopId='+succeedObj.shopId+'&size='+2"><i class="iconfont icon-xiazai"></i></a></ns-button></el-col>
          <el-col v-else class="elrow_firstcol" :span="8" ><ns-button  type="text"><a href="javascript:void(0)"><i class="iconfont icon-xiazai" style="color:#aaa"></i></a></ns-button></el-col>
        </el-row>
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
  .elrow{
    background-color: #f0f3f5;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: 40px;
    padding-left:10px;
    margin-top: 15px
  }
  .elrow .el-col{
    display: flex;
    justify-content: center;
    align-items: center
  }
  .elrow .elrow_size{
    display: flex;
    justify-content:flex-start;
    align-items: center
  }
  .elrow_first, .elrow_second, .elrow_thirdly{
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: 30px;
    padding-left: 10px;
    margin-top: 15px
  }
  .elrow_first .elrow_firstcol, .elrow_second .elrow_firstcol, .elrow_thirdly .elrow_firstcol{
    display: flex;
    justify-content: center;
    align-items: center
  }
  .elrow_first, .elrow_second, .elrow_thirdly{
    display: flex;
    align-items: center
  }
  .elrow_first .last_div, .elrow_second .last_div, .elrow_thirdly .last_div{
    font-size: 12px;
    font-weight: normal;
  }
  .recruitingcode_title{
    display: flex;
    justify-content: flex-start;
  }
  .recruitingcode{
    margin: 10px 30px 0 0;
  }
  .recruitingcode .icon-erweima{
    font-size: 40px;
    font-weight: 600;
    color:#409EFF;
  }
  .icon-xiazai{
    font-size: 20px;
  }
  .el-icon-question:hover .publicnumberqrCode{
    display: block
  }
  .el-icon-question:hover .smallprogramqrCode{
    display: block
  }
  .el-col-8{
    position: relative;
  }
  .publicnumberqrCode{
    z-index: 99;
    opacity: 0.5;
    position: absolute;
    left: 70px;
    bottom: -150px;
    display: none;
    width: 150px;
    height: 150px;
  }
  .smallprogramqrCode{
    z-index: 99;
    opacity: 0.5;
    position: absolute;
    left: 70px;
    bottom: -150px;
    display: none;
    width: 150px;
    height: 150px;
  }
</style>
