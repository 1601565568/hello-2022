<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.customerFindCustomerList @add="onRedactFun"
      @shopEdit="shopEdit" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!--  自定义客户转移弹窗开始  -->
    <el-dialog :title="title" width="560px" height="300px" :visible.sync="shopFindListShow"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp">
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-select v-model="value" placeholder="请选择要更换的导购" >
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
  .shopFindListShow{
    width: 600px;
    height:300px;
    background-color: #fff;
    position: fixed;
    top: 40%;
    left: 40%;
    /* padding:0 50% 50% 0; */

  }
</style>

