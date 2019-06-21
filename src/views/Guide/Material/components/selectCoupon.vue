
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="selectCouponbox" v-loading.lock="loadingShopSell" :element-loading-text="$t('prompt.loading')">
  <el-dialog
  title="选择营销活动"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="template-table">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchObj.searchMap"  :inline="true">
            <el-form-item label="优惠券类型：" prop="type">
              <el-select v-model="searchObj.searchMap.type" placeholder="请选择活动类型" clearable>
                <el-option v-for="item in groudList"
                :key="item.type"
                :label="item.name"
                :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="优惠券名称：" prop="content">
              <el-input v-model="searchform.content" placeholder="请输入活动名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="优惠券编码：" prop="content">
              <el-input v-model="searchform.content" placeholder="请输入活动名称" clearable></el-input>
            </el-form-item>-->
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="resetForm('searchform')">重置</ns-button>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import api from '@/config/http'
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
  },
  mixins: [listPageMixin],
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
      loadingShopSell: true,
      searchObj: { searchMap: {
        type: 2
      } },
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '优惠券', id: 3 }, { name: '营销活动', id: 4 }, { name: '自定义页面', id: 5 }],
      wechatPageUrlList: [],
      loading: false, // 防重复提交
      dialogImageUrl: '',
      modalTit: '新增素材',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      groudList: [{ name: '多人拼团', type: 2 }, { name: '满减送', type: 3 }, { name: '秒杀', type: 4 }],
      shareimgList: [],
      saveObj: {
        mType: 1,
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
        subdivisionId: [
          { required: true, message: '请选择所属分组', trigger: 'blur' }
        ],
        imageList: [
          { required: true, message: '请添加素材图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showToggle (obj) {
      this.dialogVisible = true
      this.$http.fetch(this.$api.guide.material.findMallMarketingList, this.searchObj)
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
      this.saveObj.imageList.push(res.result.url)
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 500) {
        this.$notify.warning('上传图片不得大于500KB')
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
  },
  mounted: function () {

  }

}
</script>
