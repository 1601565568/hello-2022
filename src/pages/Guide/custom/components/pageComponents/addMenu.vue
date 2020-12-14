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
      <el-radio v-model="model.type" :label="0">第三方小程序</el-radio>
      <el-radio v-model="model.type" :label="1"
        >当前小程序</el-radio
      ></el-form-item
    >
    <el-form-item label="小程序appID：" prop="appId" v-if="model.type === 0">
      <el-input placeholder="请输入appID" v-model="model.appId"></el-input>
    </el-form-item>
    <el-form-item
      label="小程序路径："
      prop="pageUrl"
      required
      :rules="[
        {
          required: true,
          message: '请输入活动介绍',
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
        v-model="model.pageUrl"
        tag="wise"
        ref="testText"
        :maxlength="1000"
        :tools="tools"
        placeholder="请输入路径"
        @inputLength="inputLength"
        ><span slot="w-textarea_tools_right">
          <el-popover
            placement="bottom-start"
            popper-class="form-item_popover"
            width="480"
            trigger="click"
          >
            <div class="popover-content">
              <h4>使用说明</h4>
              <p>1、小程序路径需添加占位符时，需在路径后添加“?”</p>
              <p>如：/pages/workbench/recruit?导购账号</p>
              <p>2、添加多个占位符时，多个占位符之间需使用“&”进行连接</p>
              <p>如：/pages/workbench/recruit?导购账号&导购姓名</p>
            </div>
            <span class="form-item_exmple" slot="reference">查看示例</span>
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
    }
  },
  data () {
    return {
      tools: [
        {
          tooltip: '导购账号',
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/icon-daogou.png',
          type: 'tag',
          text: '导购账号',
          id: 'GUIDE_ACCOUNT_NUMBER',
          value: '导购账号'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/guideNumer.png',
          type: 'tag',
          text: '导购工号',
          id: 'GUIDE_JOB_NUMBER',
          value: '导购工号'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/guideID.png',
          type: 'tag',
          text: '导购ID',
          id: 'GUIDE_ID',
          value: '导购ID'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/distributionStore.png',
          type: 'tag',
          text: '导购工作门店',
          id: 'GUIDE_WORK_SHOP',
          value: '导购工作门店'
        }
      ],
      model: {},
      validates,
      pageUrlLength: 0,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 0, max: 5, message: '长度在 0 到 4 个字符', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请上传图片' }],
        appId: [{ required: true, message: '请上传选中图片' }],
        pageUrl: [{ required: true, message: '请上传选中图片' }]
      }
    }
  },
  watch: {
    addMenuData: {
      handler (newValue) {
        this.model = JSON.parse(JSON.stringify(newValue))
        console.log(this.model)
      },
      deep: true,
      immediate: true
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
      let newHtml = html
        .replace(/<wise.*?\bclass="/g, '{')
        .replace(/">.*?<\/wise>/g, '}')
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        newHtml = newHtml.replace(regexp, `${item.id}=\${${item.id}}`)
      })
      return newHtml
    },
    // 替换模板成标签
    stringTohtml (string) {
      this.tools.map(item => {
        const regexp = new RegExp(`${item.id}=\${${item.id}}`, 'g')
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
<style></style>

<style scoped lang="scss">
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
  cursor: default;
}
</style>
