<template>
  <div>
    <ns-table-more-account ref="table" :url=$api.guide.moreAccount.findList  @uploadFile="uploadFile" @ElSliderChange="ElSliderChange" @BlurIput="BlurIput" @wxCodeUrl="wxCodeUrl">
    </ns-table-more-account>
    <!-- 上传二维码弹窗开始 -->
    <el-dialog :title="title" :visible.sync="dialogUploadVisible" @click="closeDialog" width="350px" >
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <div>查看二维码:</div>
        <ul class="comUploadList">
          <div v-if="wxCodeUrlImage">
            <img style="width:99px;height:99px;border-radius:5px" v-if="wxCodeUrlImage" :src="wxCodeUrlImage" class="avatar">
          </div>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-upload
          class="avatar-uploader"
          :action="$api.core.sgMoreAccountUploadFile(rowId+'')"
          accept=".jpg,.jpeg,.png,.bmp,.gif"
          :on-success="handleAvatarSuccess" :show-file-list="false" >
          <ns-button class="dialog-footer_button" type="primary">更换二维码</ns-button>
        </el-upload>
      </div>
    </el-dialog>
    <!-- 上传二维码弹窗结束 -->
  </div>
</template>

<script>
import List from './src/List'
import NsTableMoreAccount from './NsTableMoreAccount'
import ElUpload from '@nascent/nui/lib/upload'
List.components = {
  NsTableMoreAccount,
  ElUpload
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
    align-items: center;
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
<style scoped>
.comUploadList{
  margin:20px 40px 10px 0;
  display:flex;
  justify-content:center
}
.dialog-footer{
  display:flex;
  justify-content:center;
}
.dialog-footer .dialog-footer_button{
  width: 251px;
  height: 38px;
  border-radius: 0
}
</style>
