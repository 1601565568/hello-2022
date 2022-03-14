<template>
  <el-form label-width="100px" :rules="rules" :model="model" ref="ruleForm" :class="[ENV==='QA' && 'styQA']">
    <el-form-item label="菜单名称：" prop="name">
      <el-input
        maxlength="4"
        minlength="1"
        clearable
        show-word-limit
        placeholder="请输入菜单名称"
        v-model.trim="model.name"
      ></el-input>
    </el-form-item>
    <el-form-item label="菜单图标：" prop="icon">
      <!-- <div style=""> -->
      <el-upload
        class="avatar-uploader"
        :action="$api.core.sgUploadFile('test')"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="model.icon" :src="model.icon" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="prompt-text">
        <p><span class="yellow-point"></span></p>
        <span class="prompt-text__text"
          >建议：尺寸36*36px，小于100kb，jpg、png、jpeg格式</span
        >
      </div>
    </el-form-item>
    <el-form-item label="跳转页面：" class="jumpToPage" >
      <el-radio v-model="model.type" :label="1">第三方小程序</el-radio>
      <el-radio v-model="model.type" :label="2"
        >当前小程序</el-radio
      ></el-form-item
    >
    <el-form-item label="小程序appID：" prop="appId" v-if="model.type === 1">
      <el-input placeholder="请输入appID" v-model.trim="model.appId"></el-input>
    </el-form-item>
    <el-form-item
      label="小程序路径："
      prop="pageUrl"
      required
      :rules="[
        {
          required: true,
          message: '请输入小程序路径',
          trigger: ['blur', 'change']
        },
        {
          validator: validates.validateActivityIntroduction.bind(
            this,
            pageUrlLength
          ),
          trigger: ['blur', 'change']
        }
      ]"
    >
      <tag-area
        v-model.trim="model.pageUrl"
        tag="wise"
        ref="testText"
        :tools="tools"
        placeholder="请输入路径"
        @inputLength="inputLength"
        ><span slot="w-textarea_tools_right">
          <el-popover
            placement="top"
            popper-class="form-item_popover"
            width="480"
            trigger="click"
          >
            <div class="popover-content">
              <h4>使用说明</h4>
              <p>1、小程序路径需添加传参时，需在路径后添加“?”</p>
              <p>如：/pages/workbench/recruit?`导购账号参数名`=导购账号</p>
              <p>2、添加多个占位符时，多个传参之间需使用“&”进行连接</p>
              <p>如：/pages/workbench/recruit?`导购账号参数名`=导购账号&`导购姓名参数名`=导购姓名</p>
            </div>
            <span class="form-item_exmple" slot="reference">查看示例说明</span>
          </el-popover></span
        ></tag-area
      >
    </el-form-item>
  </el-form>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import TagArea from '@/components/NewUi/TagArea'
import validates from './validates'
export default {
  components: { ElUpload, TagArea },
  props: {
    addMenuData: {
      type: Object
    },
    tools: {
      type: Array
    }
  },
  data () {
    return {
      ENV: process.env.VUE_APP_THEME,
      model: {},
      validates,
      pageUrlLength: 0,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 0, max: 5, message: '长度在 0 到 4 个字符', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请上传选中图片' }],
        appId: [{ required: true, message: '请输入小程序appid' }]
      }
    }
  },
  // watch: {
  //   addMenuData: {
  //     handler (newValue) {
  //       this.model = JSON.parse(JSON.stringify({
  //         ...newValue,

  //       }))
  //     }
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.model = {
        ...this.addMenuData,
        pageUrl: this.addMenuData.pageUrl
          ? this.stringTohtml(this.addMenuData.pageUrl)
          : ''
      }
    },
    handleAvatarSuccess (res, file, item, check) {
      if (res.success) {
        this.model.icon = res.result.url
        this.$notify.success('图片上传成功')
      } else {
        this.$notify.error(res.msg)
      }
    },
    beforeAvatarUpload (file) {
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jepg/png的图片格式')
        return false
      }
      if (file.size / 1024 > 1024) {
        this.$notify.warning('上传图片不得大于1MB')
        return false
      }
    },
    // 替换标签成模板
    htmlToString (html) {
      let newHtml = html
        .replace(/<wise.*?\bclass="/g, '{')
        .replace(/">.*?<\/wise>/g, '}')
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        // newHtml = newHtml.replace(regexp, `${item.id}=\${${item.id}}`)
        newHtml = newHtml.replace(regexp, `{${item.id}}`)
      })
      return newHtml
    },
    // 替换模板成标签
    stringTohtml (string) {
      let html = string
      this.tools.map(item => {
        // const regexp = new RegExp(item.id + '=\\${' + item.id + '}', 'g')
        const regexp = new RegExp('{' + item.id + '}', 'g')
        html = html.replace(
          regexp,
          `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`
        )
      })
      return html
    },
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    inputLength (length) {
      this.pageUrlLength = length
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('pageUrl')
    },
    onSave () {
      let _this = this
      return new Promise((resolve, reject) => {
        // resolve(true)
        _this.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              ...this.model,
              pageUrl: this.htmlToString(this.model.pageUrl)
            })
          } else {
            let meg = '请填写正确的值'
            reject(meg)
            return false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50;
  line-height: 50px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}
.avatar-uploader-icon:hover {
  border-color: #409eff ;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.prompt-text {
  display: flex;
  align-items: flex-start;
  color: #595959;
  .yellow-point {
    background: #f2aa18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .prompt-text__text {
    flex: 1;
  }
}
.popover-content {
  padding: 13px 10px;
  font-size: 14px;
  h4 {
    color: #8c8c8c;
    margin-bottom: 13px;
  }
  p {
    color: #262626;
  }
}
.form-item_exmple {
  font-size: 12px;
  color: #0068b3;
  cursor: pointer;
}
</style>
<style>
.jumpToPage .el-checkbox__label {
  font-size: 14px !important;
  color: #303133 !important;
}
</style>
<style scoped>
.styQA >>> .avatar-uploader-icon:hover{
    border-color:#2153D4!important ;
}
  .styQA >>> .el-radio__input.is-checked .el-radio__inner{
      border-color: #2153D4;
  background-color: #2153D4;
  }
  .styQA >>> .form-item_exmple {
    color:#2153D4 ;
  }
</style>
