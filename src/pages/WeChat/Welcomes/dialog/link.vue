<template>
  <div>
    <ElDialog
      width="600px"
      title="链接"
      :visible.sync="dialogVisibleWeb"
      :before-close="close"
      :show-scroll-x=false>
      <div class="margin-lr-small">
        <ElForm :rules="rules" ref="searchform" :model="model">
          <ElFormItem>
            <div class="message-headling">跳转链接：</div>
          </ElFormItem>
          <ElFormItem label="链接：" label-width="100px">
            <el-form-grid size="xxmd">
              <el-form-item prop="sex">
                <el-radio-group v-model="linkSwitch" @change="onRadio">
                  <el-radio :label="2" >自定义链接</el-radio>
                  <el-radio :label="1" >系统预置链接</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </ElFormItem>
          <ElFormItem label="选择链接：" v-if="linkSwitch===1" prop="selectIndex"  label-width="100px" >
            <el-form-grid size="md">
              <el-select v-model="model.selectIndex" clearable placeholder="请选择" @change='systemPresetChange'>
                <el-option v-for="item in presetLink"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-grid>
          </ElFormItem>
          <ElFormItem label="网页地址：" prop="url"  label-width="100px" >
            <ElInput
              type="textarea"
              clearable
              :disabled="model.selectIndex!=''"
              :input="model.url=model.url.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入网页"
              v-model="model.url"
              ref="content"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="" v-if="linkSwitch===2" label-width="100px" >
            <ElFormGrid>
              <ns-button type="text"  @click="insertPlaceHolderToWeb('{groupId}')"> &lt;集团ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{chatId}')"> &lt;好友微信ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{wxId}')"> &lt;导购微信ID&gt; </ns-button>
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem>
            <div class="message-headling">消息展示内容：</div>
          </ElFormItem>
          <ElFormItem label="标题：" prop="title" label-width="100px" >
            <ElInput
              type="text"
              maxlength='20'
              minlength='1'
              clearable
              :disabled="edit"
              :input="model.title=model.title.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入标题,长度在1-20个字符以内"
              v-model="model.title"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="文案：" prop="description"  label-width="100px" >
            <ElInput
              type="textarea"
              maxlength='50'
              minlength='1'
              clearable
              :disabled="edit"
              :input="model.description=model.description.replace(/(^\s*)|(\s*$)/g, '')"
              placeholder="请输入文案,长度在1-50个字符以内"
              v-model="model.description"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem label="封面图：" prop="image"  label-width="100px" class="el-form-validate__box">
            <ElUpload
              :disabled="edit"
              :action="this.$api.core.sgUploadFile('message')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" clearable class="message-upload ">
              <img v-if="model.image" :src="model.image" class="message-upload__avatar">
              <Icon type="plus" className="message-upload__tip" v-else/>
            </ElUpload>
          </ElFormItem>
          <ElFormItem label-width="83px" v-if="model.selectIndex!=''">
                <span class="text-primary">
                  <Icon type="exclamation-circle"/>&nbsp;招募消息展示内容可在获客引流-会员引流-招募页面配置进行自定义编辑
                </span>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="close">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addWeb"/>
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
  props: ['linkModel', 'dialogVisibleWeb', 'presetLink'],
  data () {
    return {
      linkSwitch: 2,
      model: {
        type: 'link',
        linkSwitch: 2,
        selectIndex: '', // 系统预制链接索引
        url: '', // 链接地址
        image: '', // 图片的cdn地址
        imageFilename: '', // 图片在手机上的名称
        title: '', // 链接标题
        description: '' // 链接描述
      },
      edit: false, // 预置链接是否可编辑 false:1：可编辑  true：0：不可编辑
      rules: {
        url: [
          { required: true, message: '请输入网页', trigger: 'blur' }
        ],
        selectIndex: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在2-20个字符以内', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入文案', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在2-50个字符以内', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请传入图片', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增
    addWeb () {
      this.model.linkSwitch = this.linkSwitch
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('addWeb', this.model)
        }
      })
    },
    onRadio () {
      this.$refs.searchform.clearValidate()
      this.model.selectIndex = ''
      this.model.url = ''
      this.model.image = ''
      this.model.imageFilename = ''
      this.model.title = ''
      this.model.description = ''
    },
    initRadio (type) {
      this.linkSwitch = type
    },
    // 选择预置链接
    systemPresetChange (e) {
      var _this = this
      this.presetLink.forEach(function (value, i) {
        if (e === '') {
          _this.model.url = ''
          _this.model.image = ''
          _this.model.title = ''
          _this.model.description = ''
          _this.model.selectIndex = ''
          return
        }
        if (value.id === e) {
          _this.model.url = value.url
          _this.model.image = value.picture
          _this.model.title = value.title
          _this.model.description = value.content
          _this.model.selectIndex = e
        }
      })
    },
    // 为链接插入预留字段
    insertPlaceHolderToWeb (append) {
      if (this.model.url === undefined) {
        this.model.url = ''
      }
      this.model.url += append
      this.moveToCursor()
    },
    // 重新定位光标
    moveToCursor () {
      let oTextarea = this.$refs.content.$el.children[0]
      oTextarea.select()
    },
    // 上传图片是否成功事件
    handleAvatarSuccess (res, file) {
      this.model.image = res.result.url
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
      this.linkSwitch = this.model.linkSwitch
      this.$refs.searchform.clearValidate()
      this.$emit('close', 'link')
    }
  },
  watch: {
    publishData () {
      this.model = this.linkModel
      this.linkSwitch = this.linkModel.linkSwitch
    },
    'model.selectIndex': function (o1) {
      let that = this
      if (!this.model.selectIndex) {
        this.edit = false
        return
      }
      if (o1) {
        this.presetLink.forEach(function (value) {
          if (value.id === o1) {
            if (value.edit) {
              that.edit = false
            } else {
              that.edit = true
            }
          }
        })
      } else {
        this.edit = false
      }
    }
  },
  mounted () {
    this.model = this.linkModel
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
