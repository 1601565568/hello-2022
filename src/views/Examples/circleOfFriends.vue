<template>
  <div class="talk-chat">
    <ns-button @click="dialogVisible = true">发朋友圈</ns-button>
    <!-- 发朋友圈弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="540px"
      class="dialog-content">
      <el-form ref="form" label-width="80px">
        <el-form-item label="选择个人号：">
          <el-select placeholder="全部" class="el-block">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="朋友圈内容：" class="dialog-content__subtance">
          <div class="dialog-detail" style="padding: 10px; border: 1px solid #ddd;">
            <el-input type="textarea" :rows="8" placeholder="这一刻的想法...."  v-model="textarea">
            </el-input>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false">
              <img v-if="imageUrl" src="" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <ns-button @click="dialogVisible = false">取 消</ns-button>
         <ns-button type="primary" @click="dialogVisible = false">确 定</ns-button>
      </span>
    </el-dialog>
    <!-- 发朋友圈弹窗-->
  </div>
</template>
<script>
import ElUpload from 'nui-v2/lib/upload';
export default {
  components: {
    ElUpload
  },
  data () {
    return {
      dialogVisible: false,
      textarea: ''
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  @component-namespace dialog {
    @b content {
      margin-right: 20px;
      @e subtance {
        margin-top: 20px;
      }
    }
  }
  >>> .el-dialog__header {
    padding: 10px 20px !important;
  }
  >>> .el-dialog__body {
    padding: 0 20px;
  }
  .avatar-uploader {
    padding: 0 6px;
    margin-top: 20px;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 62px;
      height: 62px;
      line-height: 62px;
      text-align: center;
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  >>> .el-textarea__inner {
    border: none;
  }
  .dialog-detail >>>.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }
</style>
