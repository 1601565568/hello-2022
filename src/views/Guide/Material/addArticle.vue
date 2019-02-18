
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="addMaterialbox">
  <el-dialog
    :title="modalTit"
    :close-on-click-modal=false
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="handleClose">

    <div class="comDialogBoxCon flex flex-between" style='align-items:flex-start'>
      <vue-ueditor-wrap :config="myConfig" v-model="saveObj.detail" @ready="editorReady"></vue-ueditor-wrap>
      <el-form :model="saveObj" :rules="rules" ref="addForm"  style="width:440px;margin-left:50px">
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
          <p><ns-button type='text'>添加封面图</ns-button>（建议尺寸：800*800）</p>
          <p style='margin-top:20px'>所属分组 :</p>
          <el-form-item  prop="subdivision_id">
            <el-select @change="selChange" v-model="saveObj.subdivision_id" placeholder="请选择" clearable>
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
import api from 'configs/http'
// import { isURL } from '../Common/utils.js'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
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
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        serverUrl: ''
      },
      wechatPageTypeList: [{name: '商品', id: 1}, {name: '优惠券', id: 2}, {name: '营销活动', id: 3}, {name: '商品分类', id: 4}, {name: '自定义页面', id: 5}],
      wechatPageUrlList: [{url: '/pages/workbench/index', id: 1}, {url: '/pages/workbench/inde', id: 2}, {url: '/pages/workbench/ind', id: 3}],
      loading: false, // 防重复提交
      dialogImageUrl: '',
      modalTit: '新增素材',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      groudList: [],
      shareimgList: [],
      saveObj: {
        m_type: 1,
        title: '',
        codeType: 0,
        content: '',
        url: '',
        shareUrl: '',
        imageList: []
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
          { min: 4, max: 20, message: '长度在4-20个字符以内', trigger: 'blur' }
        ],
        subdivision_id: [
          { message: '请选择所属分组', trigger: 'blur' }
        ],
        groud: [
          { required: true, message: '请选择素材分组', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    VueUeditorWrap
  },
  created: function () {},
  methods: {
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.detail || '') // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.detail = this.editorInstance.getContent()
      })
    },
    selChange (e) {
      console.log(e)
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
      this.saveObj = {
        m_type: 1,
        content: '',
        url: '',
        imageList: []
      }
      if (obj.id) {
        this.modalTit = '编辑素材'
        let saveObj = JSON.parse(JSON.stringify(obj))
        this.saveObj = {
          content: saveObj.content,
          id: saveObj.id,
          imageList: saveObj.imageList,
          subdivision_id: saveObj.subdivision_id,
          m_type: 1,
          url: saveObj.url,
          codeType: saveObj.code_type,
          urlId: 2
        }
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delImgFun (index) {
      if (this.saveObj.imageList.length < 2) {
        this.$notify.warning('上传图片不得少于一张')
        return false
      } else {
        this.saveObj.imageList.splice(index, 1)
      }
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
      console.log('11111111111111111')
      await this.$http
        .fetch(this.$api.guide.materialEdit, this.saveObj)
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
      console.log(res)
      if (this.saveObj.m_type === 0) {
        // 链接就先置空
        this.saveObj.imageList = []
      }
      this.saveObj.imageList.push(res.result.url)
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
</style>
