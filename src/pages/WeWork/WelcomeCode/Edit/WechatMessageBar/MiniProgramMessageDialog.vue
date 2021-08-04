<template>
  <div>
    <ElDialog width="600px" title="小程序" :visible="visible" :before-close="close" @open="open" :show-scroll-x="false" modal-append-to-body append-to-body>
      <template slot="title">
        <div class="title">
          小程序
          <el-popover placement="bottom-start" width="360" trigger="hover">
            <template slot="reference">
              <Icon type="ns-help" class="icon" />
            </template>
            <div class="ns-help-box">
              <img src="./images/miniprogram.png" alt="" />
            </div>
          </el-popover>
        </div>
      </template>
      <div class="margin-lr-small">
        <ElForm :rules="rules" ref="searchform" :model="defaultModel">
          <ElFormItem>
            <div class="message-headling">跳转小程序：</div>
          </ElFormItem>
          <ElFormItem label="小程序appId：" prop="appid" label-width="100px">
            <ElInput
              type="text"
              maxlength="30"
              minlength="5"
              clearable
              :input="(defaultModel.appid = defaultModel.appid.replace(/(^\s*)|(\s*$)/g, ''))"
              placeholder="请输入小程序appId,长度在5-30个字符以内"
              v-model="defaultModel.appid"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="小程序路径：" prop="path" label-width="100px">
            <ElInput
              ref="appModelPath"
              type="text"
              maxlength="255"
              minlength="1"
              clearable
              :input="(defaultModel.path = defaultModel.path.replace(/(^\s*)|(\s*$)/g, ''))"
              placeholder="请输入小程序路径,长度在1-255个字符以内"
              v-model="defaultModel.path"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="" label-width="100px">
            <ns-button type="text" v-for="(item, index) in placeholderLink" :key="index" @click="insertPlaceHolderToWeb(item.value)">&lt;{{ item.label }}&gt;</ns-button>
            <ns-button v-if="viewRange === 1" type="text" @click="brandDialogVisible = true">&lt;品牌id&gt;</ns-button>
          </ElFormItem>
          <ElFormItem label-width="83px">
            <span style="color: #8C8C8C;">
              请先在企业微信后台将小程序配置到工作台，否则无法触发欢迎语
              <MiniConfigHelp />
            </span>
          </ElFormItem>
          <ElFormItem label-width="83px">
            <span style="color: #8C8C8C;">
              注:小程序路径后需要带上.html
              <el-popover placement="top-start" title="" width="300" trigger="hover" content="">
                <slot>
                  <p>1.小程序路径后需要带上.html,如pages/member/test.html</p>
                  <p>2.需要添加传参时,需在路径后添加“?”,多个参时用“&”隔开，如pages/member/test.html?id=1&number=2</p>
                </slot>
                <el-button slot="reference" style="color:#1890ff">示例说明</el-button>
              </el-popover>
            </span>
          </ElFormItem>
          <ElFormItem>
            <div class="message-headling">小程序卡片展示：</div>
          </ElFormItem>
          <ElFormItem label="标题：" prop="title" label-width="100px">
            <ElInput
              type="text"
              maxlength="20"
              minlength="1"
              clearable
              :input="(defaultModel.title = defaultModel.title.replace(/(^\s*)|(\s*$)/g, ''))"
              placeholder="请输入标题,长度在1-20个字符以内"
              v-model="defaultModel.title"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="封面图：" prop="image" label-width="100px" class="el-form-validate__box">
            <ElUpload
              :action="this.$api.core.sgUploadFile('message')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".jpg,.jpeg,.png"
              clearable
              class="message-upload"
            >
              <img v-if="defaultModel.image" :src="defaultModel.image" class="message-upload__avatar" />
              <Icon type="plus" className="message-upload__tip" v-else />
            </ElUpload>
          </ElFormItem>
          <ElFormItem label-width="83px">
            <span style="color: #8C8C8C;">
              请上传格式为jpg、png的图片，建议长宽比例为5:4，大小不超过2M
            </span>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="close">取消</NsButton>
        <NsButton @click="confirm" type="primary">确定</NsButton>
      </span>
    </ElDialog>
    <!-- 选择品牌弹窗 -->
    <NsBrandDialog :appendToBody="true" :visible.sync="brandDialogVisible" @confirm="insertPlaceHolderToWeb" />
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import MiniConfigHelp from './MiniConfigHelp/index.vue'
import NsBrandDialog from '@/components/NsBrandDialog'

export default {
  components: {
    ElUpload,
    MiniConfigHelp,
    NsBrandDialog
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
          appid: '', // 小程序的appid
          title: '', // 小程序消息的title
          image: '', // 小程序消息的封面图
          path: ''
        }
      }
    }
  },
  computed: {
    /**
     * 视角范围 1-不同品牌不同视角，2-不同区域不同视角
     */
    viewRange () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange
    }
  },
  data () {
    var validateAppId = (rule, value, callback) => {
      let code = value.substring(0, 2)
      if (code === 'wx') {
        callback()
      } else {
        callback(new Error('小程序AppId不符合规范'))
      }
    }

    return {
      brandDialogVisible: false,
      defaultModel: {
        appid: '', // 小程序的appid
        title: '', // 小程序消息的title
        image: '', // 小程序消息的封面图
        path: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1-20个字符以内', trigger: 'blur' }
        ],
        appid: [
          { required: true, message: '请输入小程序appId', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5-30个字符以内', trigger: 'blur' },
          { required: true, validator: validateAppId, trigger: 'blur' }
        ],
        image: [{ required: true, message: '请传入图片', trigger: 'blur' }],
        path: [
          { required: true, message: '请输入小程序路径', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在1-255个字符以内', trigger: 'blur' }
        ]
      },
      placeholderLink: [
        {
          label: '集团ID',
          value: '{groupId}'
        },
        {
          label: '好友userid',
          value: '{userId}'
        },
        {
          label: '导购userid',
          value: '{guideUserId}'
        },
        {
          label: '导购账号',
          value: '{guideAccount}'
        },
        {
          label: '导购工号',
          value: '{workNumber}'
        },
        {
          label: '导购ID',
          value: '{guideId}'
        },
        {
          label: '员工工作门店',
          value: '{shopId}'
        },
        {
          label: '随机数标识',
          value: '{random}'
        },
        {
          label: '时间戳',
          value: '{timestamp}'
        }
      ]
    }
  },
  mounted () {},
  methods: {
    // 为链接插入预留字段
    insertPlaceHolderToWeb (append) {
      if (this.defaultModel.path === undefined) {
        this.defaultModel.path = ''
      }
      this.defaultModel.path += append
      this.moveToCursor()
    },
    // 重新定位光标
    moveToCursor () {
      let oTextarea = this.$refs.appModelPath.$el.children[0]
      oTextarea.select()
    },
    // 上传图片是否成功事件
    handleAvatarSuccess (res, file) {
      this.defaultModel.image = res.result.url
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG、JPEG、PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    open () {
      if (this.content !== null) {
        this.defaultModel = this.content
      }
    },
    // 关闭弹框
    close () {
      this.defaultModel = {
        appid: '', // 小程序的appid
        title: '', // 小程序消息的title
        image: '', // 小程序消息的封面图
        path: ''
      }
      this.$refs.searchform.clearValidate()

      this.$emit('update:visible', false)
    },
    // 新增
    confirm () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('confirm', { type: 'miniprogram', content: this.defaultModel })
          this.close()
        }
      })
    }
  }
}
</script>
<style scoped>
@import '@theme/variables.pcss';
.title {
  line-height: 24px;
  font-size: 16px;
  color: #33393e;
}

.ns-help-box {
  margin: 10px 14px;
  img {
    width: 100%;
  }
}

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
      background: rgba(0, 0, 0, 0.4);
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
      transform: translate(-50%, -50%);
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
    >>>>.el-dialog__headerbtn {
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
