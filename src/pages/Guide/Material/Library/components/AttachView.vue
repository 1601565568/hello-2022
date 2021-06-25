<template>
  <div>
    <div class="tip-text">
      <div class="tip-reminder"></div>
      视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG格式；最多可添加9个附件
    </div>
    <el-popover placement="top-start" width="400" trigger="hover" ref="popoverView">
      <div class="library-popover">
        <div class="popover-base" @click="addCustomImg">
          <Icon type="ns-edit" class="popover-icon"></Icon>
          <span class="popver-text">自建坑位</span>
        </div>
        <div>
          <el-upload
            ref="imageListUpload"
            class="library-uploader"
            :action="this.$api.core.sgUploadFile('image')"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeGuideUpload"
            accept=".jpg,.jpeg,.png"
            list-type="picture-card"
            multiple
          >
            <div class="popover-base">
              <Icon type="tupianbeifen-5" class="popover-icon"></Icon>
              <span class="popver-text">图片</span>
            </div>
          </el-upload>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="shipinbeifen-4" class="popover-icon"></Icon>
          <span class="popver-text">视频</span>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="lianjiebeifen-4" class="popover-icon"></Icon>
          <span class="popver-text">链接</span>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="xiaochengxushouquan" class="popover-icon"></Icon>
          <span class="popver-text">小程序</span>
        </div>
      </div>
      <div class="addAttach" slot="reference"><Icon type="ns-add-border" style="margin-right:5px" />添加消息内容</div>
    </el-popover>
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
export default {
  name: 'attachView',
  components: {
    ElUpload
  },
  data () {
    return {
      name: ''
    }
  },
  methods: {
    addCustomImg () {},
    handleAvatarSuccess () {},
    beforeGuideUpload () {}
  }
}
</script>

<style scoped>
.addAttach {
  width: 136px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  line-height: 32px;
  font-size: 14px;
  color: #0094fc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.library-popover {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.popover-base {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.popver-image {
  width: 35px;
  height: 30px;
  color: red;
}
.popver-text {
  font-size: 12px;
  color: #303133;
  line-height: 20px;
  font-weight: 400;
  margin-top: 5px;
}
.popover-icon {
  font-size: 35px;
  color: #383838;
}
.tip-text {
  font-size: 12px;
  color: #595959;
  font-weight: 400;
}
.tip-reminder {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f2aa18;
  display: inline-block;
  margin-right: 4px;
}
.library-uploader >>> .el-upload--picture-card {
  width: 80px;
  height: 80px;
  border: none;
  background-color: transparent;
  color: #8c8c8c;
  line-height: 80px;
  border-radius: var(--default-radius-mini);
}
</style>
