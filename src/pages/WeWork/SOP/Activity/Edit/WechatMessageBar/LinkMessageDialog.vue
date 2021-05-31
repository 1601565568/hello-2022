<template>
  <el-dialog
    width="600px"
    title="链接"
    :visible="visible"
    :before-close="close"
    @open="open"
    modal-append-to-body
    append-to-body
  >
    <div class="margin-lr-small">
      <ElForm :rules="rules" ref="searchform" :model="defaultModel">
        <el-form-item>
          <div class="message-headling">跳转链接：</div>
        </el-form-item>
        <el-form-item label="网页地址：" prop="link"  label-width="100px" >
          <el-input
            type="textarea"
            clearable
            :input="defaultModel.link = defaultModel.link.replace(/(^\s*)|(\s*$)/g, '')"
            placeholder="请输入网页"
            v-model="defaultModel.link"
            ref="content"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="" label-width="100px" >
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{groupId}')"> &lt;集团ID&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{userId}')"> &lt;员工userid&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{workId}')"> &lt;员工账号&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{workNumber}')"> &lt;员工工号&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{guideId}')"> &lt;员工ID&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{shopId}')"> &lt;员工工作门店&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{random}')"> &lt;随机数标识&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button type="text" @click="insertPlaceHolderToWeb('{timestamp}')"> &lt;时间戳&gt; </ns-button>
          </ElFormGrid>
        </el-form-item>
        <el-form-item>
          <div class="message-headling">消息展示内容：</div>
        </el-form-item>
        <el-form-item label="标题：" prop="title" label-width="100px" >
          <ElInput
            type="text"
            maxlength='20'
            minlength='1'
            clearable
            :input="defaultModel.title = defaultModel.title.replace(/(^\s*)|(\s*$)/g, '')"
            placeholder="请输入标题,长度在1-20个字符以内"
            v-model="defaultModel.title"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="文案：" prop="desc"  label-width="100px" >
          <el-input
            type="textarea"
            maxlength='50'
            minlength='1'
            clearable
            :input="defaultModel.desc = defaultModel.desc.replace(/(^\s*)|(\s*$)/g, '')"
            placeholder="请输入文案,长度在1-50个字符以内"
            v-model="defaultModel.desc"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="封面图：" prop="imgUrl"  label-width="100px" class="el-form-validate__box">
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" clearable class="message-upload ">
            <img v-if="defaultModel.imgUrl" :src="defaultModel.imgUrl" class="message-upload__avatar">
            <Icon v-else type="plus" className="message-upload__tip"/>
          </el-upload>
        </el-form-item>
        <el-form-item label-width="83px">
          <span style="color: #8C8C8C;">
            请上传格式为jpg、png的图片，建议长宽比例为5:4，大小不超过2M
          </span>
        </el-form-item>
      </ElForm>
    </div>
    <span slot="footer">
      <NsButton @click="close">取消</NsButton>
      <NsButton @click="confirm" type="primary">确定</NsButton>
    </span>
  </el-dialog>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: function () {
        return {
          type: 'news',
          link: '', // H5消息页面url 必填
          title: '', // H5消息标题
          desc: '', // H5消息摘要
          imgUrl: '' // H5消息封面图片URL
        }
      }
    }
  },
  data () {
    return {
      uploadUrl: this.$api.core.sgUploadFile('message'),
      defaultModel: {
        type: 'news',
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        imgUrl: '' // H5消息封面图片URL
      },
      rules: {
        link: [
          { required: true, message: '请输入网页', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value.startsWith('http://') || value.startsWith('https://')) {
              callback()
            } else {
              callback(new Error(rule.message))
            }
          },
          message: '网页地址格式错误，以http://或https://开头',
          trigger: ['blur']
          }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在2-20个字符以内', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入文案', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在2-50个字符以内', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请传入图片', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    // 上传图片是否成功事件
    handleAvatarSuccess (uploadRes, file) {
      this.defaultModel.imgUrl = uploadRes.result.url
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpg' || 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG、JEPG、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 为链接插入预留字段
    insertPlaceHolderToWeb (append) {
      if (this.defaultModel.link === undefined) {
        this.defaultModel.link = ''
      }
      this.defaultModel.link += append
      this.moveToCursor()
    },
    // 重新定位光标
    moveToCursor () {
      const oTextarea = this.$refs.content.$el.children[0]
      oTextarea.select()
    },
    open () {
      if (this.content !== null) {
        this.defaultModel = { ...this.content }
      }
    },
    // 关闭弹框
    close () {
      this.defaultModel = {
        type: 'news',
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        imgUrl: '' // H5消息封面图片URL
      }
      this.$refs.searchform.clearValidate()
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.defaultModel)
          this.close()
        }
      })
    }
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
