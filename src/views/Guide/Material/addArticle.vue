
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="addMaterialbox">
  <el-dialog
    :title="modalTit"
    :close-on-click-modal=false
    :visible.sync="dialogVisible"
    width="1200px"
    :before-close="handleClose">

    <div class="comDialogBoxCon flex flex-between" style='align-items:flex-start'>
      <div class="comDialogBoxConOut" v-show='saveObj.articleType' style='flex:1'>
        <el-form :model="saveObj" :rules="rules" >
          <el-form-item  prop="title">
            <el-form-grid size="xxmd">
              <el-input  placeholder="请在这里输入标题" v-model="saveObj.title"  size="medium"></el-input>
            </el-form-grid>
          </el-form-item>
        </el-form>

        <el-input placeholder="请输入合法链接"  size="medium" v-model="saveObj.url">
          <template slot="prepend">外链:</template>
        </el-input>
        <p style='margin-top:10px'><i class="el-icon-info text-tips">外链的内容仅在H5版本中显示，不会出现在小程序中</i></p>
      </div>
      <div v-show='!saveObj.articleType' style='flex:1'>
        <div class='mb10'>
            <el-input  type="text" v-model="saveObj.title" maxlength='50' placeholder="请输入标题，长度在4-50个字符以内" clearable size="medium"></el-input>
        </div>
        <vue-ueditor-wrap :config="myConfig" v-model="detail" @ready="editorReady" @beforeInit="addCustomDialog"></vue-ueditor-wrap>
         <!--  -->
      </div>

      <el-form :model="saveObj" :rules="rules" ref="addForm"  style="margin-left:20px">
        <el-form-item  prop="article">
            <el-radio-group v-model="saveObj.articleType">
                <el-radio :label=0>添加文章
                </el-radio>
                <el-radio :label=1>添加外链文章
                </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item  prop="content">
            <el-form-grid size="xxmd">
              <el-input resize="none" type="textarea" v-model="saveObj.content" placeholder="可在此输入推广文案"></el-input>
            </el-form-grid>
          </el-form-item>

          <div class="materialItem">

            <a target="_blank" class="shareBox">
              <!--<img @click="showImg(0, itemObj.m_type)" v-show="itemObj.imageList[0]" :src="itemObj.imageList[0]" alt="">-->
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
          <!-- <p style='margin-top:20px'>所属分组 :</p> -->
          <el-form-item  prop="subdivisionId" label="所属分组：" style='margin-top:20px'>
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
      <ns-button type="primary" :loading="loading" @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dialogImgVisible">
  <img width="100%" :src="dialogImageUrl" alt>
</el-dialog>

</div>
</template>
<script>
import api from '@/config/http'
import ElUpload from 'nui-v2/lib/upload'
// import { isURL } from '../Common/utils.js'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    VueUeditorWrap,
    ElUpload
  },
  props: {
    callBack: Function
  },
  data () {
    // var validateURL = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入链接'))
    //   } else if (!isURL(value)) {
    //     callback(new Error('路径必须带http或者是https格式！'))
    //   } else {
    //     callback()
    //   }
    // }
    // var validateURLImg = (rule, value, callback) => {
    //   if (value === undefined || value === null) {
    //     callback()
    //   } else if (!isURL(value)) {
    //     callback(new Error('请输入正确的二维码链接'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      editorInstance: {},
      detail: '',
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: true,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: '100%',
        serverUrl: 'http://47.96.228.119:8089/core/ueditor/ueditorConfig'

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
          // console.log('jkjklkjlj:00000'),
          { required: true, message: '请输入素材标题', trigger: 'blur' },
          { min: 4, max: 50, message: '限制长度为50个字以内', trigger: 'blur,change' }
        ],
        subdivisionId: [
          { required: true, message: '请选择素材分组', trigger: 'change' }
        ]

      }
    }
  },
  created: function () {},
  methods: {
    addPic () {
      this.detail = '<p><span style="background-color: rgb(0, 0, 0); color: rgb(255, 255, 255);">141324企鹅为全额完全v</span><br/></p>'
    },
    addCustomDialog (editorId) {
      window.UE.registerUI('test-dialog', function (editor, uiName) {
        // 创建 dialog
        var dialog = new window.UE.ui.Dialog({
          // 指定弹出层中页面的路径，这里只能支持页面，路径参考常见问题 2
          iframeUrl: '../../../../static/UEditor/dialogs/customizeDialogPage/customizeDialogPage.html',
          // 需要指定当前的编辑器实例
          editor: editor,
          // 指定 dialog 的名字
          name: uiName,
          // dialog 的标题
          title: '请输入小程序的链接',
          // 指定 dialog 的外围样式
          cssRules: 'width:600px;height:300px;',
          // 如果给出了 buttons 就代表 dialog 有确定和取消
          buttons: [
            {
              className: 'edui-okbutton',
              label: '确定',
              onclick: function () {
                dialog.close(true)
              }
            },
            {
              className: 'edui-cancelbutton',
              label: '取消',
              onclick: function () {
                dialog.close(false)
              }
            }
          ]
        })

        // 参考上面的自定义按钮
        var btn = new window.UE.ui.Button({
          name: 'dialog-button',
          title: '小程序链接',
          cssRules: `background-position: -500px 0`,
          onclick: function () {
            // 渲染dialog
            dialog.render()
            dialog.open()
          }
        })

        return btn
      } /* 0  指定添加到工具栏上的那个位置，默认时追加到最后 , editorId 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
    },
    // addCustomButtom (editorId) {
    //   window.UE.registerUI('test-button', function (editor, uiName) {
    //     editor.registerCommand(uiName, {
    //       execCommand: function () {
    //         editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`)
    //       }
    //     })
    //     var btn = new window.UE.ui.Button({
    //       name: uiName,
    //       title: '小程序链接',
    //       cssRules: 'background-position: -500px 0',
    //       onclick: function () {
    //         editor.execCommand(uiName)
    //       }
    //     })
    //     editor.addListener('selectionchange', function () {
    //       var state = editor.queryCommandState(uiName)
    //       if (state === -1) {
    //         btn.setDisabled(true)
    //         btn.setChecked(false)
    //       } else {
    //         btn.setDisabled(false)
    //         btn.setChecked(state)
    //       }
    //     })
    //     return btn
    //   })
    // },
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
            that.$notify.error(resp.msg)
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
          this.$notify.error(resp.msg)
        })
    },
    // 提交保存
    saveFun () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.doSave()
        }
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
          this.$notify.error(resp.msg)
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
      if (file.size / 1024 > 200) {
        this.$notify.warning('上传图片不得大于200KB')
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
      console.log(file, fileList)
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
      padding-top: 3px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      color: #333;
      line-height: 1.9;
      word-break: break-word;
    }
  }
</style>

<style >
/* 此处scoped暂时不能加，等空闲了再出解决方案 */

@component-namespace addMaterialbox {
  .comDialogBoxCon {
    padding-bottom: 20px;
  }
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
</style>
