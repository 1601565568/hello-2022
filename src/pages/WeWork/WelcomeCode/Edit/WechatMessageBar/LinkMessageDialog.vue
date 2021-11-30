<template>
  <el-dialog
    width="800px"
    title="新增链接"
    :visible="visible"
    :before-close="close"
    @open="open"
    modal-append-to-body
    append-to-body
  >
    <!-- <template slot="title">
      <div class="title">
        链接
        <el-popover
          placement="bottom-start"
          width="360"
          trigger="hover"
        >
          <template slot="reference">
            <Icon type="ns-help" class="icon"/>
          </template>
          <div class="ns-help-box">
            <img src="./images/link.png" alt="">
          </div>
        </el-popover>
      </div>
    </template> -->
    <div class="link-container-view">
      <div class="link-left-view">
        <el-form
          ref="searchform"
          label-width="110px"
          :model="defaultModel"
          :rules="rules"
        >
          <!-- <el-form-item label="跳转链接：" class="message-headling"> </el-form-item> -->
          <el-form-item label="跳转链接" prop="custom" label-width="110px" required>
            <el-radio-group v-model="defaultModel.custom" @change="linkRadioChange">
              <el-radio :label="1" size="xxs">自定义链接</el-radio>
              <el-radio :label="2" size="xxs">系统预置链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="defaultModel.custom === 2"
            label="选择链接"
            prop="settingId"
          >
            <el-select
              v-model="defaultModel.settingId"
              @change="systemPresetChange"
              placeholder="请选择"
            >
              <el-option
                v-for="item in presetLink"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item
            v-if="defaultModel.custom === 2 && viewRange === 1"
            label="选择品牌"
            prop="settingId"
          >
            <el-select
              v-model="defaultModel.brandId"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in brandList"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="网页地址"
            prop="link"
            clearable
            show-word-limit
          >
            <el-input
              ref="linkModelLink"
              type="textarea"
              :disabled="defaultModel.custom === 2"
              v-model="defaultModel.link"
            />
          </el-form-item>
          <el-form-item
          >
            <el-form-grid>
              <span v-for="(item, index) in placeholderLink" :key="index">
                <ns-button v-if="defaultModel.custom === 1" type="text"  @click="insertPlaceHolderLink(item.value)">&lt;{{item.label}}&gt;</ns-button>
              </span>
              <span v-if="viewRange === 1">
                  <ns-button v-if="defaultModel.custom === 1" type="text" @click="brandDialogVisible = true">&lt;品牌id&gt;</ns-button>
              </span>
            </el-form-grid>
          </el-form-item>
          <!-- <el-form-item label="消息展示内容：" class="message-headling"> </el-form-item> -->
          <el-form-item
            label="链接标题"
            prop="title"
            label-width="110px"
          >
            <el-form-grid size="xxmd">
              <el-input
                :disabled="disabled"
                type="text"
                maxlength="20"
                minlength="1"
                show-word-limit
                placeholder="最长20个中文字符"
                v-model.trim="defaultModel.title"
                class="input_title_textarea"
              />
            </el-form-grid>
          </el-form-item>
          <el-form-item
            label="文案描述"
            prop="desc"
            label-width="110px"
          >
            <div>
              <el-input
                :disabled="disabled"
                type="textarea"
                maxlength="50"
                minlength="1"
                clearable
                show-word-limit
                placeholder="最长50个中文字符"
                v-model.trim="defaultModel.desc"
                class="input_textarea"
              />
            </div>
          </el-form-item>
          <el-form-item label="封面图" prop="image" label-width="110px" class="el-form-validate__box">
            <el-upload
              :disabled="disabled"
              :action="uploadUrl"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              clearable
              class="message-upload"
            >
              <img v-if="defaultModel.image" :src="defaultModel.image" class="message-upload__avatar">
              <Icon v-else type="plus" className="message-upload__tip"/>
            </el-upload>
            <div class="text-secondary">上传限制：建议比例1:1，小于2M，jpg、png、jpeg格式</div>
          </el-form-item>
          <!-- <el-form-item v-show="defaultModel.custom === 1">
            <div class="text-secondary">请上传格式为JPG、JPEG、PNG的图片，建议长宽比例为5:4，大小不超过10M</div>
          </el-form-item> -->
          <el-form-item v-show="defaultModel.custom === 2">
            <el-form-grid>
              <span class="tmp-tips text-info">
                <Icon type="info-circle" theme="filled" />
              </span>
              招募链接编辑位置为获客引流-会员引流-招募页面配置
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div class="link-right-view"></div>
    </div>
    <span slot="footer">
      <NsButton @click="close">取消</NsButton>
      <NsButton @click="confirm" type="primary">确定</NsButton>
    </span>
    <!-- 选择品牌弹窗 -->
    <NsBrandDialog :appendToBody="true" :visible.sync="brandDialogVisible" @confirm="insertPlaceHolderLink"/>
  </el-dialog>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
import NsBrandDialog from '@/components/NsBrandDialog'

export default {
  components: {
    ElUpload,
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
          custom: 1, // 链接类型
          settingId: null, // 预置链接的链接id
          link: '', // H5消息页面url 必填
          title: '', // H5消息标题
          desc: '', // H5消息摘要
          image: '', // H5消息封面图片URL
          brandId: null
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
    return {
      brandDialogVisible: false,
      uploadUrl: this.$api.core.sgUploadFile('message'),
      disabled: false,
      // 系统预置链接集合
      presetLink: [],
      defaultModel: {
        custom: 1, // 链接类型
        settingId: null, // 预置链接的链接id
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        image: '', // H5消息封面图片URL
        brandId: null
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
  mounted () {
  },
  methods: {
    // 上传图片是否成功事件
    handleAvatarSuccess (uploadRes, file) {
      this.defaultModel.image = uploadRes.result.url
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpg' || 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG、JEPG、PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt10M
    },
    insertPlaceHolderLink (append) {
      this.$refs.linkModelLink.focus()
      this.defaultModel.link = this.defaultModel.link + append
    },
    systemPresetChange (e) {
      this.presetLink.forEach(value => {
        if (e === '') {
          this.defaultModel = {
            custom: 1, // 链接类型
            settingId: null, // 预置链接的链接id
            link: '', // H5消息页面url 必填
            title: '', // H5消息标题
            desc: '', // H5消息摘要
            image: '', // H5消息封面图片URL
            brandId: null
          }
          return
        }
        if (value.id === e) {
          this.defaultModel.link = value.url
          this.defaultModel.image = value.picture
          this.defaultModel.title = value.title
          this.defaultModel.desc = value.content
          this.defaultModel.settingId = e
        }
      })
    },
    getSystemPresetLink () {
      this.$http.fetch(this.$api.guide.systemPreset.getLink, { type: 1 }).then(resp => {
        if (resp.success && resp.result != null) {
          this.presetLink = resp.result
        }
      })
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

        if (this.defaultModel.custom === 2) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      }

      this.getSystemPresetLink()
    },
    linkRadioChange () {
      this.defaultModel = {
        custom: this.defaultModel.custom, // 链接类型
        settingId: null, // 预置链接的链接id
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        image: '', // H5消息封面图片URL
        brandId: null
      }

      this.$refs.searchform.clearValidate()

      if (this.defaultModel.custom === 2) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    // 关闭弹框
    close () {
      this.defaultModel = {
        custom: 1, // 链接类型
        settingId: null, // 预置链接的链接id
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        image: '', // H5消息封面图片URL
        brandId: null
      }
      this.disabled = false
      this.$refs.searchform.clearValidate()
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('confirm', { type: 'link', content: this.defaultModel })
          this.close()
        }
      })
    }
  }
}
</script>
<style scoped>
@import "@theme/variables.pcss";
@import "./styles/link.css";
.link-container-view {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.link-left-view {
  width: 60%;
}
.link-right-view {
  width: 40%;
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
    transform: translate(-50%,-50%);
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
