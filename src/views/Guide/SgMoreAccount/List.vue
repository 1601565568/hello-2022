<template>
  <div>
    <ns-table-more-account ref="table" :url=$api.guide.moreAccount.findList  @uploadFile="uploadFile" @ElSliderChange="ElSliderChange" @BlurIput="BlurIput">
    </ns-table-more-account>
    <!-- 上传二维码弹窗开始 -->
    <el-dialog :title="title" :visible.sync="dialogUploadVisible" @click="closeDialog" width="460px" >
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form :model="model" label-width="100px">
          <el-form-item label="上传二维码：" class="el-inline-block">
            <el-form-grid style="width: 320px;">
              <ul class="comUploadList">
                <el-upload class="avatar-uploader" :action="this.$api.core.sgUploadFile('test')"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card"
                           :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </ul>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSaveImage">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 上传二维码弹窗结束 -->
  </div>
</template>

<script>
import List from './src/List'
import NsTableMoreAccount from './NsTableMoreAccount'
List.components = {
  NsTableMoreAccount
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
