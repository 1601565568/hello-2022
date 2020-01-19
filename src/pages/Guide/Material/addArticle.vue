
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="addMaterialbox">
  <el-dialog
    :title="modalTit"
    :close-on-click-modal=false
    :visible.sync="dialogVisible"
    width="1200px" response-limit :show-scroll-x=false
    :before-close="handleClose">
    <div class="flex flex-between" style='align-items:flex-start'>
      <div class="comDialogBoxConOut" v-show='saveObj.articleType' style='flex:1'>
        <el-form :model="saveObj" :rules="rules" ref="Form1">
          <el-form-item  prop="title">
              <el-input type="text" maxlength='50' placeholder="请输入标题，长度在4-50个字符以内" v-model="saveObj.title" clearable></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="saveObj" :rules="rules" ref="Form1">
        <el-form-item  prop="url">
        <el-input placeholder="请输入合法链接"  size="medium" v-model="saveObj.url">
          <template slot="prepend">外链:</template>
        </el-input>
        </el-form-item>
        </el-form>

        <p style='margin-top:10px'><Icon type="info-circle" theme="filled" className="text-tips">外链的内容仅在H5版本中显示，不会出现在小程序中</Icon></p>
      </div>
      <div v-show='!saveObj.articleType' style='flex:1'>
        <div class='mb10'>
          <el-form :model="saveObj" :rules="rules" ref="Form2">
          <el-form-item  prop="title">
            <el-input  type="text" v-model="saveObj.title" maxlength='50' placeholder="请输入标题，长度在4-50个字符以内" clearable></el-input>
          </el-form-item>
          </el-form>
        </div>
        <vue-ueditor-wrap :config="myConfig" v-model="detail" @ready="editorReady"  @beforeInit="addCustomButtom"></vue-ueditor-wrap>
      </div>

      <el-form :model="saveObj" :rules="rules" ref="addForm"  style="margin-left:20px">
        <!--<el-form-item  prop="article">
            <el-radio-group v-model="saveObj.articleType">
                <el-radio :label=0>添加文章
                </el-radio>
                <el-radio :label=1>添加外链文章
                </el-radio>
            </el-radio-group>
          </el-form-item>-->

          <el-form-item label="推广文案：" prop="content">
            <el-form-grid size="xxmd">
              <el-input resize="none" type="textarea" maxlength='10000' v-model="saveObj.content" placeholder="可在此输入推广文案，限制长度在10000个字符以内。"></el-input>
            </el-form-grid>
          </el-form-item>

          <div class="materialItem">

            <a target="_blank" class="shareBox">
              <img :src="saveObj.imageList[0] ? saveObj.imageList[0] : require('../../../assets/small-logo.png')" />
              <div class="tit">{{saveObj.title}}</div>
            </a>
          </div>

          <p>
            <el-upload class="upload-demo"
              :action="this.$api.core.sgUploadFile('test')"
              accept=".jpg,.jpeg,.png,.bmp,.gif"
              :show-file-list="false"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              >

              <ns-button size="small" type="text">{{saveObj.imageList[0] ? '修改封面图' : '添加封面图'}}</ns-button>
              <span>（建议尺寸：800*800）</span>
            </el-upload></p>
          <el-form-item  prop="subdivisionId" label="所属分组：" style='margin-top:20px' label-width="70px">
            <el-select v-model="saveObj.subdivisionId" placeholder="请选择" clearable>
                    <el-option v-for="item in groudList"
                        :key="item.subdivision_id"
                        :label="item.subdivision_name"
                        :value="item.subdivision_id">
                        </el-option>
                    </el-select>
          </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">保存</ns-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dialogImgVisible">
  <img width="100%" :src="dialogImageUrl" alt>
</el-dialog>
<articleLink ref="articleLink" :callBack="articleSaveFun"></articleLink>

</div>
</template>
<script>
import api from '@/config/http'
import ElUpload from '@nascent/nui/lib/upload'
import articleLink from './components/articleLink'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    VueUeditorWrap,
    ElUpload,
    articleLink
  },
  props: {
    callBack: Function
  },
  data () {
    return {
      editorInstance: {},
      detail: '',
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      wechatPageTypeList: [{ name: '商品', id: 1 }, { name: '优惠券', id: 2 }, { name: '营销活动', id: 3 }, { name: '商品分类', id: 4 }, { name: '自定义页面', id: 5 }],
      wechatPageUrlList: [{ url: '/pages/workbench/index', id: 1 }, { url: '/pages/workbench/inde', id: 2 }, { url: '/pages/workbench/ind', id: 3 }],
      loading: false, // 防重复提交
      dialogImageUrl: '',
      modalTit: '新增素材',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      groudList: [],
      shareimgList: [],
      saveObj: {
        mType: 0,
        title: '',
        codeType: 0,
        content: '',
        url: '',
        shareUrl: '',
        imageList: [''],
        subdivisionId: null,
        articleType: 0
      },
      curMonth: 5,
      dialogVisible: false,
      dialogImgVisible: false,
      selectedArr: [],
      model: {
        sgMaterial: {},
        sgMaterialSubdivision: {}
      },
      rules: {
        title: [
          { required: true, message: '请输入素材标题', trigger: 'blur' },
          { min: 4, max: 50, message: '限制长度在4-50个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ],
        /* url: [
          { required: true, message: '请输入合法链接', trigger: 'blur' }
        ], */
        subdivisionId: [
          { required: true, message: '请选择素材分组', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入推广文案', trigger: 'blur' },
          { min: 0, max: 10000, message: '限制长度在10000个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ]

      }
    }
  },
  created: function () {},
  methods: {
    addPic () {
      this.detail = '<p><span style="background-color: rgb(0, 0, 0); color: rgb(255, 255, 255);">141324企鹅为全额完全v</span><br/></p>'
    },
    selectArticleLink () {
      this.$nextTick(() => {
        this.$refs.articleLink.showToggle()
      })
    },
    articleSaveFun (obj) {
      if (obj.type === 0) {
        this.editorInstance.execCommand('link', {
          href: obj.text,
          _href: obj.codeTarget,
          title: obj.text,
          // target: '_blank',
          class: 'applet'
        })
      } else if (obj.type === 1) {
        this.editorInstance.execCommand('insertimage', {
          src: obj.img,
          width: '100',
          height: '100',
          class: 'applet',
          href: obj.codeTarget
        })
      }
    },
    addCustomButtom (editorId) {
      // let that = this
      // window.UE.registerUI('test-button', function (editor, uiName) {
      //   editor.registerCommand(uiName, {
      //     execCommand: function () {
      //       editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`)
      //     }
      //   })
      //   var btn = new window.UE.ui.Button({
      //     name: uiName,
      //     title: '小程序链接',
      //     cssRules: `width:36px !important;height:39px !important; background-image: url('${linkBtn}') !important;background-size: cover;`,
      //     onclick: function () {
      //       that.selectArticleLink()
      //     }
      //   })
      //   editor.addListener('selectionchange', function () {
      //     var state = editor.queryCommandState(uiName)
      //     if (state === -1) {
      //       btn.setDisabled(true)
      //       btn.setChecked(false)
      //     } else {
      //       btn.setDisabled(false)
      //       btn.setChecked(state)
      //     }
      //   })
      //   return btn
      // })
    },
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.detail || '') // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.detail = this.editorInstance.getContent()
      })
    },
    // linkChange (url) {
    //   console.log('url:', url)
    //   if (url.indexOf('http') < 0 || url.indexOf('https') < 0) {
    //     this.$notify.error('路径必须带http或者是https格式！')
    //   }
    // },
    showToggle (obj, groudArr) {
      this.groudList = groudArr
      // 数据重置
      this.detail = ''
      this.modalTit = '新增素材'
      this.saveObj = {
        title: '',
        content: '',
        url: '',
        shareUrl: '',
        imageList: [''],
        subdivisionId: null,
        articleType: 0,
        mType: 0
      }
      if (obj.id) {
        let that = this
        this.modalTit = '编辑素材'
        this.$http.fetch(this.$api.guide.queryMaterial, { id: obj.id })
          .then(resp => {
            resp.result.articleType = (resp.result.url ? 1 : 0)
            that.saveObj = resp.result
            that.detail = resp.result.textContent || ''
          // console.log(that.detail)
          })
          .catch(resp => {
            that.$notify.error(getErrorMsg('查询失败', resp))
          })
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分组
    async loadGroup () {
      // 组装选择的门店
      await this.$http
        .fetch(this.$api.guide.materialSubdivision.querySubTableList, {
          length: 100
        })
        .then(resp => {
          this.groupList = resp.result.data
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 提交保存
    saveFun () {
      this.$refs.addForm.validate(valid => {
        this.$refs.Form1.validate(valid1 => {
          this.$refs.Form2.validate(valid2 => {
            if (valid && valid1 && valid2) {
              this.doSave()
            }
          })
        })
      })
    },
    async doSave () {
      this.loading = true
      let parms = {
        content: this.saveObj.content,
        id: this.saveObj.id,
        imageList: this.saveObj.imageList,
        mType: 0,
        subdivisionId: this.saveObj.subdivisionId,
        title: this.saveObj.title
      }
      if (this.saveObj.articleType) {
        parms.url = this.saveObj.url
      } else {
        parms.textContent = this.detail
      }
      await this.$http
        .fetch(this.$api.guide.materialEdit, parms)
        .then(resp => {
          this.handleClose()
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    handleClose () {
      // 置空
      this.saveObj.imageList = []
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    },
    // 处理上传图片
    handleAvatarSuccess: function (res, file) {
      this.$set(this.saveObj.imageList, 0, res.result.url)
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 500) {
        this.$notify.warning('上传图片不得大于500KB')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|bmp|BMP|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jepg/png/bmp/gif的图片格式')
        return false
      }
    },
    // uploadFile: function(file) {
    //   var _this = this;
    //   let param = new FormData();
    //   param.append("file", file.file);
    //   _this.$http
    //     .fetch(this.$api.core.sgUploadFile("test"), param)
    //     .then(resp => {
    //       if (this.saveObj.m_type === 0) {
    //         // 链接就先置空
    //         this.saveObj.imageList = [];
    //       }
    //       this.saveObj.imgUrl = this.imageRoot + resp.result.fileKey;
    //       this.saveObj.imageList.push(this.imageRoot + resp.result.fileKey);
    //       console.log(this.saveObj.imgUrl);
    //       //   _this.model.sgMaterial.saveObj.imageList =
    //       //     _this.imageRoot + resp.result.fileKey
    //     })
    //     .catch(resp => {
    //       this.$notify.error("上传图片失败" + resp.result);
    //     });
    // },
    handleRemove (file, fileList) {
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogImgVisible = true
    }
  }
}
</script>
<style scoped>
/* .shareBox {
    height: 60px;
    padding: 5px;
    margin: 5px 0;
    background-color: #e4eaec;
    border-radius: 1px;
    display: -webkit-box;
    justify-content: center;
    align-items: center;
    max-width: 300px;
    overflow: hidden;
    img {
      width: 50px;
      height: 50px;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .tit{
      color: #333;
      line-height: 1.9;
      height: 100%;
      flex:1;
      overflow: hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
    }
} */
.shareBox {
    height: 60px;
    padding: 5px;
    margin: 20px 0 0 0;
    background-color: #e4eaec;
    border-radius: 1px;
    display: block;
    max-width: 240px;
    overflow: hidden;
    img {
      width: 50px;
      height: 50px;float: left;
      margin-right: 5px;
      cursor: pointer;
      /* &:hover {
        opacity: 0.8;
      } */
    }
    .tit{
      color: #333;
      line-height: 22px;
      max-height: 44px;
      padding-top: 3px;
      overflow: hidden;
      word-break: break-word;
    }
  }
</style>

<style>
/* 此处scoped暂时不能加，等空闲了再出解决方案 */

@component-namespace addMaterialbox {
  .comUploadBox {
    width: 330px;
  }
  .comUploadBox {
    .el-upload--picture-card {
      width: 80px;
      height: 80px;
      line-height: 90px;
    }
    .el-upload--picture-card {
      img {
        width: 78px;
        height: 78px;
      }
    }
    .comUploadList {
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      li {
        float: left;
        width: 80px;
        height: 80px;
        margin: 5px 5px 5px 0;
        border-radius: 3px;
        list-style: none;
        overflow: hidden;
      }
    }
  }
  .comUploadList li.imgItem {
    position: relative;
  }
  .comUploadList li.imgItem .del {
    position: absolute;
    cursor: pointer;
    width: 80px;
    height: 80px;
    top: 0;
    left: 0;
    z-index: 5;
    text-align: center;
    line-height: 80px;
    color: #fff;
    display: none;
    background-color: black;
    opacity: 0.6;
  }
  .comUploadList li.imgItem:hover .del {
    display: block;
  }
  .comUploadList li img {
    width: 80px;
    height: 80px;
    border: 1px solid #fcfcfc;
  }
  .comUploadImg {
    width: 80px;
    height: 80px;
  }
}
.comDialogBoxConOut .el-input{
  margin:10px 0;
}
.edui-toolbar .edui-for-test-button{
  display: block !important;
  width:40px;
}
</style>
