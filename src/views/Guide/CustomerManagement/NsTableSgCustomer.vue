
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="addMaterialbox">
  <el-dialog
  :title="modalTit"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="500px"
  :before-close="handleClose">
    <div class="comDialogBoxCon">
      <el-form :model="saveObj" :rules="rules" ref="addForm" label-width="100px" style="width:440px;">
          <el-form-item label="素材类型：" prop="m_type">
            <el-radio-group v-model="saveObj.m_type">
                <el-radio :label="1">图文
                </el-radio>
                <el-radio :label="0">链接
                </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="素材标题："  prop = "title">
            <el-input type="text" placeholder="请输入素材标题" autofocus=true  v-model="saveObj.title"></el-input>
          </el-form-item>

          <el-form-item label="所属分组：" prop="subdivision_id">
            <el-select @change="selChange" v-model="saveObj.subdivision_id" placeholder="请选择">
                    <el-option v-for="item in groudList"
                        :key="item.subdivision_id"
                        :label="item.subdivision_name"
                        :value="item.subdivision_id">
                        </el-option>
                    </el-select>
          </el-form-item>
          <el-form-item label="推广文案："  prop="content">
            <el-form-item>
                <el-input resize="none" type="textarea" v-model="saveObj.content" placeholder="请输入推广文案"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item  label="二维码链接：" v-if="saveObj.m_type==1" prop="urlPic">
              <el-input  v-model="saveObj.urlPic" placeholder="请输入二维码链接"></el-input>
              <p><Icon type="info-circle" theme="filled" className="text-tips">推广图片中如果有带参二维码，请务必设置该项</Icon></p>
          </el-form-item>
            <el-form-item v-if="saveObj.m_type==1" label="推广图片：" prop="imgUrl">
                <div class="comUploadBox">
                    <ul class="comUploadList">
                        <li class="imgItem" v-for="(item,index) in saveObj.imageList" :key="index">
                            <img :src="item" class="comUploadImg">
                            <div class="del" @click="delImgFun(index)">
                                <Icon type="deletes" />
                            </div>
                        </li>
                        <li v-if="saveObj.imageList.length<9">
                            <el-upload class="avatar-uploader"
                            :action="this.$api.core.sgUploadFile('test')"
                            accept=".jpg,.jpeg,.png,.bmp,.gif"
                            :show-file-list="false"
                            list-type="picture-card"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            >
                            <Icon type="plus" className="avatar-uploader-icon"/>
                        </el-upload>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                    <div style="color:#999">上传图片不能大于200KB;图片最多上传9张</div>
                </div>
            </el-form-item>
            <!-- 链接开始 -->
            <el-form-item  v-if="saveObj.m_type==0"  prop="url" label="推广链接：">
                <el-input v-model="saveObj.url" placeholder="请输入推广链接"></el-input>
            </el-form-item>
          <el-form-item v-if="saveObj.m_type==0" label="封面图片：">
              <div class="comUploadBox">
                   <el-upload class="avatar-uploader"
                        :action="this.$api.core.sgUploadFile('test')"
                        accept=".jpg,.jpeg,.png,.bmp,.gif"
                        :show-file-list="false"
                        list-type="picture-card"
                        :on-remove="handleRemove"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        >
                        <img v-if="saveObj.imageList[0]" :src="saveObj.imageList[0]" alt="">
                        <Icon v-else type="plus" className="avatar-uploader-icon"/>
                    </el-upload>
                <p style="color:#999">上传图片不能大于200KB</p>
              </div>
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
</div>
</template>
<script>
import api from '@/config/http'
import ElUpload from '@nascent/nui/lib/upload'
import { isURL } from '../Common/utils.js'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload
  },
  props: {
    callBack: Function
  },
  data () {
    var validateURL = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入链接'))
      } else if (!isURL(value)) {
        callback(new Error('路径必须带http或者是https格式！'))
      } else {
        callback()
      }
    }
    var validateURLImg = (rule, value, callback) => {
      if (value === undefined || value === null) {
        callback()
      } else if (!isURL(value)) {
        callback(new Error('请输入正确的二维码链接'))
      } else {
        callback()
      }
    }
    return {
      loading: false, // 防重复提交
      dialogImageUrl: '',
      modalTit: '新增素材',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      groudList: [],
      shareimgList: [],
      saveObj: {
        m_type: 0,
        title: '',
        content: '',
        url: '',
        shareUrl: '',
        imageList: [],
        imgUrl: ''
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
        m_type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        title: [
          { required: true, message: '请输入素材标题', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20个字符以内', trigger: 'blur' }
        ],
        subdivision_id: [
          { required: true, message: '请选择所属分组', trigger: 'blur' }
        ],
        groud: [
          { required: true, message: '请选择素材分组', trigger: 'change' }
        ],
        imgUrl: [
          { required: true, message: '请上传推广图片', trigger: 'change' }
        ],
        url: [
          { required: true, validator: validateURL, trigger: 'blur' }
        ],
        urlPic: [
          { required: true, validator: validateURLImg, trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {},
  methods: {
    selChange (e) {
    },
    showToggle (obj, groudArr) {
      this.groudList = groudArr
      // 数据重置
      this.saveObj = {
        m_type: 0,
        title: '',
        content: '',
        url: '',
        shareUrl: '',
        imageList: [],
        imgUrl: ''
      }
      if (obj.id) {
        this.modalTit = '编辑素材'
        this.saveObj = JSON.parse(JSON.stringify(obj))
        this.saveObj.imgUrl = this.saveObj.imageList[0]
        // 处理类型
        if (obj.m_type === 1) {
          this.saveObj.urlPic = this.saveObj.url
        }
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delImgFun (index) {
      this.saveObj.imageList.splice(index, 1)
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
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      if (this.saveObj.m_type === 1) {
        this.saveObj.url = this.saveObj.urlPic
      }
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.materialEdit, this.saveObj)
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
      if (this.saveObj.m_type === 0) {
        // 链接就先置空
        this.saveObj.imageList = []
      }
      this.saveObj.imgUrl = res.result.url
      this.saveObj.imageList.push(res.result.url)
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 200) {
        this.$notify.warning('上传图片不得大于200KB')
        return false
      }
    },
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
