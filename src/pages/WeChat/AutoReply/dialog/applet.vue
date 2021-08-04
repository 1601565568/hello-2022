<template>
  <div>
    <ElDialog
      width="600px"
      title="小程序"
      :visible.sync="dialogVisibleApplet"
      :before-close="close"
      :show-scroll-x=false>
      <div class="margin-lr-small">
        <ElForm :rules="rules" ref="searchform" :model="model">
          <ElFormItem>
            <div class="message-headling">跳转小程序：</div>
          </ElFormItem>
          <ElFormItem label="小程序原始Id：" prop="woaId" label-width="100px" >
            <ElInput
              type="text"
              maxlength='30'
              minlength='5'
              clearable
              :input="model.woaId=model.woaId.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入小程序原始Id,长度在5-30个字符以内"
              v-model="model.woaId"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="小程序appId：" prop="weappid" label-width="100px" >
            <ElInput
              type="text"
              maxlength='30'
              minlength='5'
              clearable
              :input="model.weappid=model.weappid.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入小程序appId,长度在5-30个字符以内"
              v-model="model.weappid"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="小程序路径：" prop="page"  label-width="100px" >
            <ElInput
              type="text"
              maxlength='255'
              minlength='1'
              clearable
              :input="model.page=model.page.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入小程序路径,长度在1-255个字符以内"
              v-model="model.page"
              ref="content"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="" label-width="100px" >
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{groupId}')"> &lt;集团ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{chatId}')"> &lt;好友微信ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{wxId}')"> &lt;导购微信ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{workId}')"> &lt;员工账号&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{guideId}')"> &lt;员工ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{shopId}')"> &lt;员工工作门店&gt; </ns-button>
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem label-width="83px" v-if="model.selectIndex!=''">
            <span class="text-primary">
              <Icon type="exclamation-circle"/>&nbsp;请确认小程序配置信息输入正确！
            </span>
          </ElFormItem>
          <ElFormItem label-width="83px" v-if="model.selectIndex!=''">
            <span class="text-primary">
              &nbsp;注:小程序路径后需要带上.html，如 pages/member/test.html?id=1
            </span>
          </ElFormItem>
          <ElFormItem>
            <div class="message-headling">小程序卡片展示：</div>
          </ElFormItem>
          <ElFormItem label="标题：" prop="title" label-width="100px" >
            <ElInput
              type="text"
              maxlength='20'
              minlength='1'
              clearable
              :input="model.title=model.title.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入标题,长度在1-20个字符以内"
              v-model="model.title"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="封面图：" prop="face"  label-width="100px" class="el-form-validate__box" >
            <ElUpload
              :action="this.$api.core.sgUploadFile('message')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" clearable class="message-upload">
              <img v-if="model.face" :src="model.face" class="message-upload__avatar">
              <Icon type="plus" className="message-upload__tip" v-else/>
            </ElUpload>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="close">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addApplet"/>
      </span>
    </ElDialog>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload
  },
  props: ['appletModel', 'dialogVisibleApplet'],
  data () {
    var validateWoaId = (rule, value, callback) => {
      let code = value.substring(0, 3)
      if (code === 'gh_') {
        callback()
      } else {
        callback(new Error('小程序原始ID不符合规范'))
      }
    }
    var validateAappId = (rule, value, callback) => {
      let code = value.substring(0, 2)
      if (code === 'wx') {
        callback()
      } else {
        callback(new Error('小程序AppId不符合规范'))
      }
    }
    return {
      model: {
        type: 'sendLittleProgram',
        title: '', // 标题
        weappid: '', // 小程序apid
        woaId: '', // 小程序原始id
        face: '', // 图片封面的cdn地址
        faceFilename: '', // 图片封面名称
        url: '', // 备用网页
        page: '' // 小程序路径
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1-20个字符以内', trigger: 'blur' }
        ],
        weappid: [
          { required: true, message: '请输入小程序appId', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5-30个字符以内', trigger: 'blur' },
          { required: true, validator: validateAappId, trigger: 'blur' }
        ],
        woaId: [
          { required: true, message: '请输入小程序原始Id', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5-30个字符以内', trigger: 'blur' },
          { required: true, validator: validateWoaId, trigger: 'blur' }
        ],
        face: [
          { required: true, message: '请传入图片', trigger: 'blur' }
        ],
        page: [
          { required: true, message: '请输入小程序路径', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在1-255个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增
    addApplet () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('addApplet', this.model)
        }
      })
    },
    // 为链接插入预留字段
    insertPlaceHolderToWeb (append) {
      if (this.model.page === undefined) {
        this.model.page = ''
      }
      this.model.page += append
      this.moveToCursor()
    },
    // 重新定位光标
    moveToCursor () {
      let oTextarea = this.$refs.content.$el.children[0]
      oTextarea.select()
    },
    // 上传图片是否成功事件
    handleAvatarSuccess (res, file) {
      this.model.face = res.result.url
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG|PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 关闭弹框
    close () {
      this.$refs.searchform.resetFields()
      this.$emit('close', 'sendLittleProgram')
    }
  },
  watch: {
    publishData () {
      this.model = this.appletModel
    }
  },
  mounted () {
    this.model = this.appletModel
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";

  /* 视频样式设置 start */
  .avatar-uploader {
    line-height: 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-color-primary-light);
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: var(--theme-color-white);
  }
  .avatar {
    width: 400px;
    height: 250px;
    display: block;
  }
  .video-avatar {
    width: 400px;
    height: 250px;
    border-radius: 4px;
  }
  /* 视频样式设置 end */

  @component-namespace message {
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  @b headling {
    font-weight: bold;
    padding: 0 var(--default-padding-larger);
    background: var(--theme-bg-color-base);
    border-radius: var(--default-radius-mini);
  }
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
  &:hover {
     border-color: var(--theme-color-primary-light);
   }
  }
  @e tip {
    font-size: var(--default-font-size-large);
    color: var(--theme-base-border-color-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  @e avatar {
    width: 100px;
    height: 100px;
    position: relative;
    top: -1px;
    left: -1px;
  }
  }
  @b videodialog {
    >>>> .el-dialog__headerbtn {
      display: none;
    }
    >>> .el-dialog__body {
      padding: 20px 0 0 0;
    }
  }
  @b spacelarger {
    margin-top: var(--default-margin-larger);
  }
  }
</style>
