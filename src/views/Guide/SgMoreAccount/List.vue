<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.findShopListOnCondition @synchronousStores="onRedactFun" @scopeRowCount="scopeRowCount"
        @elIconMenu="elIconMenu" @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop" @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!-- 所属门店查看详情开始 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px" >
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form :model="model.sgGuide" ref="addForm" label-width="100px" :rules="rules" >
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
        <ns-button type="primary" @click="onSave(model)">确定</ns-button>
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
</style>
