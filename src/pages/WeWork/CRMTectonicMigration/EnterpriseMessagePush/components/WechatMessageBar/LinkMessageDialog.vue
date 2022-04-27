<template>
  <el-dialog
    width="812px"
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
    <div class="link-container-view" v-if="visible">
      <div class="link-left-view">
        <el-form
          ref="searchform"
          label-width="110px"
          :model="defaultModel"
          :rules="rules"
        >
          <!-- <el-form-item label="跳转链接：" class="message-headling"> </el-form-item> -->
          <el-form-item label="跳转链接" v-if="cloudPlatformType === 'ecrp'" prop="custom" label-width="110px" required>
            <el-radio-group v-model="defaultModel.custom" @change="linkRadioChange">
              <el-radio :label="1">自定义链接</el-radio>
              <el-radio :label="2">系统预置链接</el-radio>
            </el-radio-group>
            <div v-if="defaultModel.custom === 2" style="display:inline-block;">
              <div class="run-link-view">
                <div class="run-item-select">
                  <el-select
                    v-model="defaultModel.settingId"
                    placeholder="请选择"
                    :default-first-option="true"
                    @change="systemPresetChange"
                    style="width: 120px;"
                  >
                    <el-option
                      v-for="item in presetLink"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="run-icon-view">
                  <Icon
                    type="ns-arrow-drowdown"
                    style="color: #8C8C8C;"
                  />
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item
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
          </el-form-item> -->
          <el-form-item
            v-if="defaultModel.custom === 2 && viewRange === 1"
            label=""
            prop="settingId"
          >
            <label slot="label"><span style="display:inline-block;width:10px;"></span>选择品牌</label>
            <div class="run-link-view">
              <div class="run-item-select">
                <el-select
                  v-model="defaultModel.brandId"
                  placeholder="请选择"
                  filterable
                  :default-first-option="true"
                  style="width: 120px;"
                >
                  <el-option
                    v-for="item in brandList"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="run-icon-view">
                <Icon
                  type="ns-arrow-drowdown"
                  style="color: #8C8C8C;"
                />
              </div>
            </div>
            <!-- <el-select
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
            </el-select> -->
          </el-form-item>
          <el-form-item
            label="网页地址"
            prop="link"
            clearable
            show-word-limit
          >
            <tag-area
              v-if="defaultModel.custom === 1"
              class="tag-area"
              className="friend-link_input"
              v-model='defaultModel.link'
              :showEmoji='false'
              :showTextEmoji='false'
              ref="tagContent"
              placeholder="输入链接地址"
              tag="wise"
              :tools="placeholderLink"
              emojiClass=''
            />
            <div class="link-url-view" v-if="defaultModel.custom === 2">
              <el-input
                ref="linkModelLink"
                type="textarea"
                :disabled="defaultModel.custom === 2"
                v-model="defaultModel.link"
                class="link-url-textarea"
                placeholder="输入链接地址"
              />
            </div>
            <div v-if="defaultModel.custom === 2" class="remind-text-view" style="margin-top:4px;">
              以下信息可在：获客引流/会员引流/招募页面配置的导购招募页面设置编辑修改
              <span class="edit-link-text" @click="toEditLinkPage">编辑招募信息&nbsp;&nbsp;</span>
              <span class="edit-link-text" @click="reloadLink">刷新</span>
            </div>
          </el-form-item>
          <!-- <el-form-item
          >
            <el-form-grid>
              <span v-for="(item, index) in placeholderLink" :key="index">
                <ns-button v-if="defaultModel.custom === 1" type="text"  @click="insertPlaceHolderLink(item.value)">&lt;{{item.label}}&gt;</ns-button>
              </span>
              <span v-if="viewRange === 1">
                  <ns-button v-if="defaultModel.custom === 1" type="text" @click="brandDialogVisible = true">&lt;品牌id&gt;</ns-button>
              </span>
            </el-form-grid>
          </el-form-item> -->
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
          <el-form-item label="" label-width="110px" class="el-form-validate__box">
            <label slot="label"><span style="display:inline-block;width:10px;"></span>封面图</label>
            <el-form-item prop="imageUrl">
              <div class="link-upload-view">
                <div class="img-url__logo">
                  <div v-if="defaultModel.image" class="upload-mask-view">
                    <div class="upload-img-mask" @click="changeUploadFile" v-if="defaultModel.custom === 1">
                      <i class="iconfont icon-ns-deal1" style="font-size:18px;"></i>
                    </div>
                    <img :src="defaultModel.image" class="img-url__avatar" />
                  </div>
                  <div v-else>
                    <i class="el-icon-plus link-avatar-uploader-icon"></i>
                  </div>
                  <div v-if="defaultModel.custom === 1">
                    <drap-upload
                      ref="drapUpload"
                      :scale='1'
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
              </div>
            </el-form-item>
            <!-- <el-upload
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
            </el-upload> -->
            <div class="text-secondary">上传限制：建议比例1:1，小于2M，jpg、png、jpeg格式</div>
          </el-form-item>
          <!-- <el-form-item v-show="defaultModel.custom === 1">
            <div class="text-secondary">请上传格式为JPG、JPEG、PNG的图片，建议长宽比例为5:4，大小不超过10M</div>
          </el-form-item> -->
          <!-- <el-form-item v-show="defaultModel.custom === 2">
            <el-form-grid>
              <span class="tmp-tips text-info">
                <Icon type="info-circle" theme="filled" />
              </span>
              招募链接编辑位置为获客引流-会员引流-招募页面配置
            </el-form-grid>
          </el-form-item> -->
        </el-form>
      </div>
      <div class="link-line-view"></div>
      <div class="link-right-view">
        <div class="show-phone-view">
          <div class="show-title">{{defaultModel.title || '链接标题'}}</div>
          <div class="show-content-view">
            <div class="show-content">{{defaultModel.desc || '文案描述'}}</div>
            <img class="show-img" :src="defaultModel.image " v-if="defaultModel.image"/>
            <img class="show-img" :src="defaultUrl" v-else/>
          </div>
        </div>
      </div>
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
// import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
import NsBrandDialog from '@/components/NsBrandDialog'
import TagArea from '@/components/NewUi/TagArea'
import DrapUpload from '@/components/NewUi/DrapUpload'
export default {
  components: {
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
      cloudPlatformType: '',
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
        image: [
          { required: true, message: '请传入图片', trigger: 'blur' }
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
      defaultUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/mini-icon.jpg'
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
    reloadLink () {
      this.getSystemPresetLink()
    },
    toEditLinkPage () {
      this.$router.push({ path: '/Guide/RecruitSet/RecruitPageConfig' })
    },
    // 上传图片是否成功事件
    handleAvatarSuccess (url) {
      this.defaultModel.image = url
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
      this.initData()
      if (this.content !== null) {
        this.defaultModel = { ...this.content }
        if (this.defaultModel.custom === 1 && this.defaultModel.link) {
          this.$nextTick(() => {
            this.defaultModel.link = this.$refs.tagContent.stringTohtml(this.defaultModel.link)
            this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = this.defaultModel.link
            this.$refs.tagContent.currentText = this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerText
          })
        }
        if (this.defaultModel.custom === 2) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      } else {
        this.$nextTick(() => {
          this.defaultModel.link = this.$refs.tagContent.stringTohtml('')
          this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = ''
        })
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
    initData () {
      this.defaultModel = {
        custom: 1, // 链接类型
        settingId: null, // 预置链接的链接id
        link: '', // H5消息页面url 必填
        title: '', // H5消息标题
        desc: '', // H5消息摘要
        image: '', // H5消息封面图片URL
        brandId: null
      }
      // this.defaultModel.link = this.$refs.tagContent.stringTohtml('')
      // this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = ''
    },
    // 关闭弹框
    close () {
      this.initData()
      this.disabled = false
      this.$refs.searchform.clearValidate()
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          const obj = { ...this.defaultModel }
          if (this.defaultModel.custom === 1) {
            obj.link = this.$refs.tagContent.htmlToString(this.defaultModel.link)
          }
          this.$emit('confirm', { type: 'link', content: obj })
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
.edit-link-text {
  color:#0094FC;
  cursor: pointer;
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
