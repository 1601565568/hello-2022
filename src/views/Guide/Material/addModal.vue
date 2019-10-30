
<template>
  <!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
  <div class="addMaterialbox">
    <el-dialog :title="modalTit" :close-on-click-modal=false :visible.sync="dialogVisible" width="500px" :before-close="handleClose" class="custom-box">
      <div class="comDialogBoxCon">
        <el-form :model="saveObj" :rules="rules" ref="addForm" label-width="100px" style="width:440px;">
          <el-form-item label="所属分组：" prop="subdivisionId">
            <el-select v-model="saveObj.subdivisionId" placeholder="请选择" clearable>
              <el-option v-for="item in groudList" :key="item.subdivision_id" :label="item.subdivision_name" :value="item.subdivision_id">
              </el-option>
            </el-select>
            <ns-button type='text' @click="$router.push({name:'MaterialSubdivision'})"> + 添加分组</ns-button>
          </el-form-item>
          <el-form-item label="推广文案：" prop="content">
            <el-input resize="none" type="textarea" maxlength='10000' v-model="saveObj.content" placeholder="可在此输入推广文案，限制长度在10000个字符以内。"></el-input>
          </el-form-item>

          <el-form-item label="素材图片：" prop="imageList">
            <div class="comUploadBox">
              <ul class="comUploadList">
                <li class="imgItem" v-for="(item,index) in saveObj.imageList" :key="index">
                  <img :src="item" class="comUploadImg">
                  <div class="del" @click="delImgFun(index)">
                    <Icon type="delete" />
                  </div>
                </li>
                <li v-if="saveObj.imageList.length< 10 - saveObj.codeType">
                  <el-upload class="avatar-uploader" :action="this.$api.core.sgUploadFile('test')" accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card" multiple  :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <Icon type="plus" className="avatar-uploader-icon"/>
                  </el-upload>
                </li>
              </ul>
              <div class="clearfix"></div>
              <div style="color:#999">上传图片不能大于500KB；图片最多上传9张（加小程序码的最多8张）</div>
            </div>
          </el-form-item>
          <el-form-item label="小程序链接：">
            <!-- clearable -->
            <el-select  v-model="saveObj.codeModule" placeholder="请选择" clearable @change='codeModuleChange'>
              <el-option v-for="item in wechatPageTypeList" :key="item.id" :label="item.name" :value="item.id" >
              </el-option>
            </el-select>
            <template v-if="saveObj.codeModule==1">
              <el-select v-model="saveObj.codeTarget" placeholder="请选择" clearable  @change='codeTargetChange'>
                  <el-option v-for="item in wechatPageUrlList"
                  :key="item.codeTarget"
                  :label="item.codeTargetName"
                  :value="item.codeTarget">
                  </el-option>
              </el-select>
            </template>
            <template v-if="saveObj.codeModule==2">
              <ns-button @click='selectGoods' type='primary' class='ml15'>选择商品</ns-button>
            </template>
            <template v-if="saveObj.codeModule==3">
              <ns-button @click='selectCoupon' type='primary' class='ml15'>选择优惠券</ns-button>
            </template>
            <template v-if="saveObj.codeModule==4">
              <ns-button @click='selectMarket' type='primary' class='ml15'>选择营销活动</ns-button>
            </template>
          </el-form-item>
            <el-form-item :label="saveObj.codeModule==2?'商品名称：':saveObj.codeModule==4?'活动名称：':''" prop='codeTargetName' v-if="saveObj.codeModule &&saveObj.codeModule!=1 && saveObj.codeTargetName!=''">
              <!-- saveObj.codeTargetName&& -->
              <el-form-grid size="xmd"><el-input v-model="saveObj.codeTargetName" :disabled="true"></el-input></el-form-grid>
            </el-form-item>

          <el-form-item label="小程序码类型：" prop="codeType" v-if='saveObj.codeTarget'>
            <el-radio-group v-model="saveObj.codeType">
              <el-radio :label="1">图片上植入小程序码
              </el-radio>
              <el-radio :label="2">单独增加一张小程序码图
              </el-radio>
            </el-radio-group>
            <p style='line-height:1.5;margin-top:10px'>
              <Icon type="info-circle" theme="filled" className="text-tips"/>
              <span>将在图片中加入带导购参数的小程序码，需门店里有对应信息的才会显示</span>
            </p>
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
    <SelectMarket ref="selectMarket" :callBack="selectMarketlBack"></SelectMarket>
    <!-- <SelectCoupon ref="selectCoupon" :callBack="selectMarketlBack"></SelectCoupon> -->
    <SelectGoods ref="selectGoods" :callBack="selectMarketlBack"></SelectGoods>
  </div>
</template>
<script>
import api from '@/config/http'
import ElUpload from '@nascent/nui/lib/upload'
import SelectMarket from './components/selectMarket'
// import SelectCoupon from './components/selectCoupon'
import SelectGoods from './components/selectGoods'
import $ from 'jquery'
// import { isURL } from '../Common/utils.js'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload,
    SelectMarket,
    // SelectCoupon,
    SelectGoods
  },
  props: {
    callBack: Function
  },
  data () {
    return {
      // { name: '优惠券', id: 3 },, { name: '自定义页面', id: 5 }
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '营销活动', id: 4 }],
      wechatPageUrlList: [{ codeTargetName: '首页', codeTarget: '1' }, { codeTargetName: '分类', codeTarget: '2' }, { codeTargetName: '我的', codeTarget: '3' }],
      loading: false, // 防重复提交
      dialogImageUrl: '',
      modalTit: '新增素材',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      groudList: [],
      shareimgList: [],
      saveObj: {
        mType: 1,
        title: '',
        codeType: 1,
        content: '',
        url: '',
        shareUrl: '',
        imageList: [],
        codeTargetName: '',
        marketType: null,
        codeModule: null
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
          { min: 4, max: 20, message: '限制长度在4-20个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ],
        subdivisionId: [
          { required: true, message: '请选择所属分组', trigger: 'blur' }
        ],
        imageList: [
          { required: true, message: '请添加素材图片', trigger: 'change' }
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
    codeModuleChange (e) {
      this.$set(this.saveObj, 'selectBackName', '')
      this.$set(this.saveObj, 'codeTarget', '')
      this.$set(this.saveObj, 'codeTargetName', '')
    },
    codeTargetChange (e) { // 首页，分类，我的页面选择是添加codeTargetName
      this.$set(this.saveObj, 'codeTargetName', this.wechatPageUrlList[Number(e) - 1].codeTargetName)
    },
    selectMarket () {
      this.$nextTick(() => {
        this.$refs.selectMarket.showToggle()
      })
    },
    selectCoupon () {
      this.$nextTick(() => {
        this.$refs.selectCoupon.showToggle()
      })
    },
    selectGoods () {
      this.$nextTick(() => {
        this.$refs.selectGoods.showToggle()
      })
    },
    selectMarketlBack (obj) {
      if (obj.activityId) {
        this.$set(this.saveObj, 'selectBackName', '活动名称：')
        this.$set(this.saveObj, 'codeTarget', obj.activityId)
        this.$set(this.saveObj, 'codeTargetName', obj.activityName)
        this.$set(this.saveObj, 'marketType', obj.marketType)
      } else if (obj.outItemId) {
        this.$set(this.saveObj, 'selectBackName', '商品名称：')
        this.$set(this.saveObj, 'codeTarget', obj.outItemId)
        this.$set(this.saveObj, 'codeTargetName', obj.title)
      }
    },
    showToggle (obj, groudArr) {
      let that = this

      if (obj.id) {
        this.modalTit = '编辑素材'
        this.groudList = groudArr
        this.$http.fetch(this.$api.guide.queryMaterial, { id: obj.id })
          .then(resp => {
            this.saveObj = $.extend(true, {}, resp.result)
          })
          .catch(resp => {
            that.$notify.error(getErrorMsg('查询失败', resp))
          })
      } else {
        this.groudList = groudArr
        // 数据重置
        this.modalTit = '新增素材'
        this.saveObj = {
          mType: 1,
          content: '',
          url: '',
          imageList: [],
          subdivisionId: null,
          codeType: 1,
          codeTargetName: null,
          marketType: null,
          codeModule: null
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
      if (this.saveObj.imageList.length >= 9 && this.saveObj.codeType === 2) {
        this.$notify.warning('加小程序码的素材最多8张图片')
        return
      }
      if (this.saveObj.codeModule === '' || this.saveObj.codeModule === null) {
        this.saveObj.codeType = 0
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
      if (this.saveObj.imageList.length < 9) {
        this.saveObj.imageList.push(res.result.url)
      }
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
/* 此处scoped暂时不能加，等空闲了再出解决方案 */
.addMaterialbox >>> .custom-box {
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
