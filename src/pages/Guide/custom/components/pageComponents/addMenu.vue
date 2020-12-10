<template>
  <el-form label-width="100px" :rules="rules" :model="model" ref="ruleForm">
    <el-form-item label="菜单名称：" prop="name">
      <el-input
        maxlength="4"
        placeholder="请输入菜单名称"
        v-model="model.name"
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
          >建议：建议：尺寸36*36px，小于100kb，jpg、png、jpeg格式</span
        >
      </div>
    </el-form-item>
    <el-form-item label="跳转页面：">
      <el-radio v-model="model.radio" label="1">第三方小程序</el-radio>
      <el-radio v-model="model.radio" label="2"
        >当前小程序</el-radio
      ></el-form-item
    >
    <el-form-item label="小程序appID：" prop="name">
      <el-input placeholder="请输入appID" v-model="model.appId"></el-input>
    </el-form-item>
    <el-form-item label="小程序路径：" prop="name">
      <tag-area
        v-model="model.activityIntroduction"
        tag="wise"
        ref="testText"
        :maxlength="1000"
        :tools="tools"
        placeholder="请输入路径"
        @inputLength="inputLength"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import TagArea from '@/components/NewUi/TagArea'
export default {
  components: { ElUpload, TagArea },
  data () {
    return {
      tools: [
        {
          type: 'tag',
          text: '导购账号',
          id: 'GUIDE_ACCOUNT_NUMBER',
          value: '导购账号'
        },
        {
          type: 'tag',
          text: '导购工号',
          id: 'GUIDE_JOB_NUMBER',
          value: '导购工号'
        },
        {
          type: 'tag',
          text: '导购ID',
          id: 'GUIDE_ID',
          value: '导购ID'
        },
        {
          type: 'tag',
          text: '导购工作门店',
          id: 'GUIDE_WORK_SHOP',
          value: '导购工作门店'
        }
      ],
      model: {
        icon: ''
      },
      rules: {}
    }
  },
  methods: {
    handleAvatarSuccess (res, file, item, check) {
      if (res.success) {
        this.model.icon = res.result.url
        this.$notify.success('图片上传成功')
      } else {
        this.$notify.error(res.msg)
      }
    },
    async beforeAvatarUpload (file) {
      const success = await this.imgSize(file)
      return success
    },
    imgSize (file) {
      let _this = this
      // const isLt2M = (file.size / 1024 / 1024 / 1024) * 10 < 50

      return new Promise((resolve, reject) => {
        let url = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
          // let valid = img.width / img.height === 1
          // if (!isLt2M) {
          //   _this.$notify.error('上传图片大小小0K')
          //   return
          // }
          // let success = isLt2M
          resolve(true)
        }
        img.src = url.createObjectURL(file)
      })
    },
    // 替换标签成模板
    htmlToString (html) {
      return html
        .replace(/<wise.*?\bclass="/g, '{')
        .replace(/">.*?<\/wise>/g, '}')
    },
    // 替换模板成标签
    stringTohtml (string) {
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        string = string.replace(
          regexp,
          `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`
        )
      })
      return string
    },
    // 生成随机ID
    getGuid () {
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    inputLength (length) {
      console.log(length)
    }
  }
}
</script>
<style scoped>
.avatar-uploader {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>
