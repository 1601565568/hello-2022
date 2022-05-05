<template>
  <div>
    <ElDialog width="812px" title="小程序" :visible="visible" :before-close="close" @open="open" :show-scroll-x="false" modal-append-to-body append-to-body>
      <template slot="title">
        <div class="title">
          新增小程序
          <!-- <el-popover placement="bottom-start" width="360" trigger="hover">
            <template slot="reference">
              <Icon type="ns-help" class="icon" />
            </template>
            <div class="ns-help-box">
              <img src="./images/miniprogram.png" alt="" />
            </div>
          </el-popover> -->
        </div>
      </template>
      <div class="link-container-view" v-if="visible">
        <div class="link-left-view">
          <ElForm :rules="rules" ref="searchform" :model="defaultModel">
            <!-- <ElFormItem>
              <div class="message-headling">跳转小程序：</div>
            </ElFormItem> -->
            <ElFormItem label="小程序APPID" prop="appid" label-width="110px">
              <ElInput
                type="text"
                maxlength="30"
                minlength="5"
                :input="(defaultModel.appid = defaultModel.appid.replace(/(^\s*)|(\s*$)/g, ''))"
                placeholder="最长30个字符"
                v-model="defaultModel.appid"
                show-word-limit
                class="input_title_textarea"
              />
            </ElFormItem>
            <ElFormItem label="小程序路径" prop="path" label-width="110px">
              <tag-area
                class="tag-area"
                v-model='defaultModel.path'
                :maxlength="255"
                :showEmoji='false'
                :showTextEmoji='false'
                ref="tagContent"
                placeholder="输入链接地址"
                tag="wise"
                :tools="placeholderLink"
                emojiClass=''
                @inputLength="inputLength"
              />
              <!-- <div class="link-url-view">
                <div class="link-top-parma">
                  <span>点击插入</span>
                  <span v-for="(item, index) in placeholderLink" :key="index">
                    <span class="base-parma" type="text"  @click="insertPlaceHolderToWeb(item.value)">{{item.label}}</span>
                  </span>
                  <span v-if="viewRange === 1">
                    <span class="base-parma" type="text" @click="brandDialogVisible = true">品牌id</span>
                  </span>
                </div>
                <ElInput
                  ref="appModelPath"
                  type="textarea"
                  maxlength="255"
                  minlength="1"
                  clearable
                  :input="(defaultModel.path = defaultModel.path.replace(/(^\s*)|(\s*$)/g, ''))"
                  placeholder="输入链接地址"
                  v-model="defaultModel.path"
                  class="link-url-textarea"
                  show-word-limit
                />
              </div> -->
            </ElFormItem>
            <ElFormItem label-width="110px" style="margin-top:-20px">
              <div class="remind-text-view">
                <div>
                  <span>请先在企业微信后台将小程序配置到工作台</span>
                  <!-- <span style="color:#0094FC;">&nbsp;&nbsp;配置说明&nbsp;&nbsp;</span> -->
                  <!-- <span style="color:#0094FC;">去配置</span> -->
                  <MiniConfigHelp/>
                </div>
                <div>
                  <span>小程序链接后面需要带上html</span>
                  <el-popover placement="top-start" title="" width="300" trigger="hover" content="">
                    <slot>
                      <p>1.小程序路径后需要带上.html,如pages/member/test.html</p>
                      <p>2.需要添加传参时,需在路径后添加“?”,多个参时用“&”隔开，如pages/member/test.html?id=1&number=2</p>
                    </slot>
                    <span style="color:#0094FC;" slot="reference">&nbsp;&nbsp;输入说明</span>
                  </el-popover>
                </div>
              </div>
            </ElFormItem>
            <!-- <ElFormItem label="" label-width="110px">
              <ns-button type="text" v-for="(item, index) in placeholderLink" :key="index" @click="insertPlaceHolderToWeb(item.value)">&lt;{{ item.label }}&gt;</ns-button>
              <ns-button v-if="viewRange === 1" type="text" @click="brandDialogVisible = true">&lt;品牌id&gt;</ns-button>
            </ElFormItem> -->
            <!-- <ElFormItem label-width="83px">
              <span style="color: #8C8C8C;">
                请先在企业微信后台将小程序配置到工作台
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
            </ElFormItem> -->
            <!-- <ElFormItem>
              <div class="message-headling">小程序卡片展示：</div>
            </ElFormItem> -->
            <ElFormItem label="小程序标题" prop="title" label-width="110px">
              <ElInput
                type="text"
                maxlength="20"
                minlength="1"
                clearable
                :input="(defaultModel.title = defaultModel.title.replace(/(^\s*)|(\s*$)/g, ''))"
                placeholder="最长20个中文字符"
                v-model="defaultModel.title"
                show-word-limit
                class="input_title_textarea"
              />
            </ElFormItem>
            <ElFormItem label="封面图：" prop="image" label-width="110px" class="el-form-validate__box">
              <el-form-item prop="image">
                <div class="link-upload-view">
                  <div class="img-url__logo">
                    <div v-if="defaultModel.image" class="upload-mask-view">
                      <div class="upload-img-mask" @click="changeUploadFile">
                        <i class="iconfont icon-ns-deal1" style="font-size:18px;"></i>
                      </div>
                      <img :src="defaultModel.image" class="img-url__avatar" />
                    </div>
                    <div v-else>
                      <i class="el-icon-plus link-avatar-uploader-icon"></i>
                    </div>
                    <drap-upload
                      ref="drapUpload"
                      :scale='1.25'
                      scaleTip='1'
                      v-model='defaultModel.image'
                      :isNeedCrop='true'
                      :showPont='false'
                      :drag='false'
                      :maxSize='2'
                      @input="handleAvatarSuccess"
                    >
                    </drap-upload>
                  </div>
                </div>
              </el-form-item>
              <!-- <ElUpload
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
              </ElUpload> -->
              <!-- <div>
                请上传格式为jpg、png的图片，建议长宽比例为5:4，大小不超过2M
              </div> -->
            </ElFormItem>
            <ElFormItem label-width="110px" style="margin-top:-25px">
              <div class="text-secondary">上传限制：建议比例5:4，小于2M，jpg、png、jpeg格式</div>
            </ElFormItem>
            <!-- <ElFormItem label-width="83px">
              <span style="color: #8C8C8C;">
                请上传格式为jpg、png的图片，建议长宽比例为5:4，大小不超过2M
              </span>
            </ElFormItem> -->
          </ElForm>
        </div>
        <div class="link-line-view"></div>
        <div class="link-right-view" style="min-height:550px">
          <div class="show-phone-view" style="padding: 16px 16px 8px 16px">
            <div class="show-mini-info">
              <div class="show-mini-head-img"></div>
              <div class="show-mini-head-name">小程序名称</div>
            </div>
            <div class="show-mini-title">{{defaultModel.title || '小程序标题'}}</div>
            <div class="show-mini-img">
              <img class="show-min-image" v-if="defaultModel.image" :src="defaultModel.image"/>
              <img class="show-min-image" v-else :src="defaultUrl"/>
            </div>
            <div class="show-min-line"></div>
            <div class="show-mini-info">
              <span class="iconfont icon-xiaochengxu2" style="color:#7586DB;"></span>
              <div class="show-mini-head-name">小程序</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <NsButton @click="close">取消</NsButton>
        <NsButton @click="confirm" type="primary">保存</NsButton>
      </span>
    </ElDialog>
    <!-- 选择品牌弹窗 -->
    <NsBrandDialog :appendToBody="true" :visible.sync="brandDialogVisible" @confirm="insertPlaceHolderToWeb" />
  </div>
</template>
<script>
// import ElUpload from '@nascent/nui/lib/upload'
import MiniConfigHelp from './MiniConfigHelp/index.vue'
import NsBrandDialog from '@/components/NsBrandDialog'
import TagArea from '@/components/NewUi/TagArea'
import DrapUpload from '@/components/NewUi/DrapUpload'
export default {
  components: {
    MiniConfigHelp,
    NsBrandDialog,
    TagArea,
    DrapUpload
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
     * 体系范围 1-不同品牌不同体系，2-不同区域不同体系
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

    const validateAppLink = (rule, value, callback) => {
      if (this.linkLength > 255) {
        callback(new Error(`长度在1-255个字符以内`))
      } else {
        callback()
      }
    }

    return {
      cloudPlatformType: '',
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
          { required: true, validator: validateAppLink, trigger: 'blur' }
        ]
      },
      placeholderLink: [
        {
          text: '集团ID',
          id: 'groupId',
          type: 'tag',
          value: '集团ID'
        },
        {
          text: '导购userid',
          id: 'guideUserId',
          type: 'tag',
          value: '导购userid'
        },
        {
          text: '导购账号',
          id: 'guideAccount',
          type: 'tag',
          value: '导购账号'
        },
        {
          text: '导购工号',
          id: 'workNumber',
          type: 'tag',
          value: '导购工号'
        },
        {
          text: '导购ID',
          id: 'guideId',
          type: 'tag',
          value: '导购ID'
        },
        {
          text: '员工工作门店',
          id: 'shopId',
          type: 'tag',
          value: '员工工作门店'
        },
        {
          text: '随机数标识',
          id: 'random',
          type: 'tag',
          value: '随机数标识'
        },
        {
          text: '时间戳',
          id: 'timestamp',
          type: 'tag',
          value: '时间戳'
        }
      ],
      defaultUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/mini-default-img.jpg',
      linkLength: 0
    }
  },
  mounted () {
    this.cloudPlatformType = this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    if (this.cloudPlatformType === 'kd') {
      this.placeholderLink = []
    }
  },
  methods: {
    changeUploadFile () {
      this.$refs.drapUpload.loadUploadView()
    },
    inputLength (length) {
      this.linkLength = length
      this.$refs.searchform && this.$refs.searchform.validateField('path')
    },
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
    handleAvatarSuccess (url) {
      this.defaultModel.image = url
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
      this.initData()
      if (this.content !== null) {
        this.defaultModel = this.content
        this.$nextTick(() => {
          this.defaultModel.path = this.$refs.tagContent.stringTohtml(this.defaultModel.path)
          this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = this.defaultModel.path
          this.$refs.tagContent.currentText = this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerText
        })
      } else {
        this.$nextTick(() => {
          this.defaultModel.path = this.$refs.tagContent.stringTohtml('')
          this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = ''
        })
      }
    },
    initData () {
      this.defaultModel = {
        appid: '', // 小程序的appid
        title: '', // 小程序消息的title
        image: '', // 小程序消息的封面图
        path: ''
      }
    },
    // 关闭弹框
    close () {
      this.initData()
      this.$refs.searchform.clearValidate()
      this.$emit('update:visible', false)
    },
    // 新增
    confirm () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          const obj = { ...this.defaultModel }
          obj.path = this.$refs.tagContent.htmlToString(this.defaultModel.path)
          obj.path = obj.path.replaceAll('&amp;', '&')
          // params.content = this.$refs.tagContent.htmlToString(this.pitContent)
          this.$emit('confirm', { type: 'miniprogram', content: obj })
          this.close()
        }
      })
    }
  }
}
</script>
<style scoped>
@import '@theme/variables.pcss';
@import "./styles/link.css";
.show-min-line {
  height: 1px;
  width: 100%;
  background-color: #EBEBEB;
  margin-bottom: 8px;
}
.show-mini-img {
  margin-top: 8px;
  width: 215px;
  height: 161px;
  margin-bottom: 8px;
}
.show-min-image {
  width: 215px;
  height: 161px;
}
.show-mini-title {
  font-size: 14px;
  color: #383838;
  letter-spacing: 0;
  line-height: 22px;
  margin-top: 8px;
}
.show-mini-info {
  display: flex;
  flex-direction: row;
  font-size: 12px;
  color: #909399;
}
.show-mini-head-img {
  width: 20px;
  height: 20px;
  background-color: gainsboro;
  border-radius: 10px;
}
.show-mini-head-name {
  margin-left: 8px;
}
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
      width: 110px;
      height: 110px;
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
      width: 110px;
      height: 110px;
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
