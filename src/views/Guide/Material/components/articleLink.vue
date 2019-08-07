
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="wechatLink">
  <el-dialog
  title="小程序链接"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="450px"
  :before-close="handleClose">
    <div class='ptb20'>
      <el-form :model="saveObj"  ref="wechatForm" label-width="90px" :rules="rules">
        <el-form-item label="显示样式：" prop="type" >
          <el-form-grid size="md">
            <el-select  v-model="saveObj.type" clearable>
              <el-option v-for="item in typeList" :key="item.type" :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="文字内容：" prop="text" v-if='!saveObj.type' >
          <el-form-grid size="md">
          <el-input  type="text" v-model="saveObj.text" placeholder="请输入文字内容"></el-input></el-form-grid>
        </el-form-item>
        <el-form-item label="图片：" prop="img" v-if='saveObj.type' >
          <ul class="comUploadList">
                <li class="imgItem" v-if="saveObj.img">
                  <img :src="saveObj.img" class="comUploadImg">
                  <div class="del" @click="delImgFun(index)">
                    <i class="el-icon-delete"></i>
                  </div>
                </li>
                <li v-else>
                  <el-upload class="avatar-uploader" :action="this.$api.core.sgUploadFile('test')" accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </li>
              </ul>
        </el-form-item>
        <el-form-item label="小程序链接：" prop = 'codeTarget'>
          <el-form-grid size="md">
            <el-select v-model="saveObj.codeModule" placeholder="请选择" @change='codeModuleChange'>
              <el-option v-for="item in wechatPageTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-grid>

            <el-select v-model="saveObj.codeTarget" placeholder="请选择" clearable v-if="saveObj.codeModule==1">
              <el-option v-for="item in wechatPageUrlList" :key="item.codeTarget" :label="item.codeTargetName"
                :value="item.codeTarget">
              </el-option>
            </el-select>

          <template v-if="saveObj.codeModule==2">
            <ns-button @click='selectGoods' type='primary' class='ml10'>选择商品</ns-button>
          </template>
          <template v-if="saveObj.codeModule==3">
            <ns-button @click='selectCoupon' type='primary' class='ml10'>选择优惠券</ns-button>
          </template>
          <template v-if="saveObj.codeModule==4">
            <ns-button @click='selectMarket' type='primary' class='ml10'>选择营销活动</ns-button>
          </template>
        </el-form-item>
        <el-form-item :label="saveObj.codeModule==2?'商品名称：':saveObj.codeModule==4?'活动名称：':''"  v-if="saveObj.codeModule &&codeTargetName!=''">
          <el-form-grid size="md"><el-input v-model="codeTargetName" :disabled="true"></el-input></el-form-grid>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary"  @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
  <SelectMarket ref="selectMarket" :callBack="selectMarketlBack"></SelectMarket>
  <SelectGoods ref="selectGoods" :callBack="selectMarketlBack"></SelectGoods>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import ElUpload from 'nui-v2/lib/upload'
import SelectMarket from './selectMarket'
import SelectGoods from './selectGoods'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload,
    SelectMarket,
    SelectGoods
  },
  mixins: [listPageMixin],
  props: {
    callBack: Function
  },
  data () {
    return {
      saveObj: {
        type: 0
      },
      codeTargetName: '',
      typeList: [{ name: '文字', type: 0 }, { name: '图片', type: 1 }],
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '营销活动', id: 4 }],
      wechatPageUrlList: [{ codeTargetName: '首页', codeTarget: '/pages/index/index' }, { codeTargetName: '分类', codeTarget: '/pages/TabBar/GoodsClassifyNew/index' }, { codeTargetName: '我的', codeTarget: '/pages/TabBar/My/index' }],
      dialogVisible: false,
      rules: {
        type: [
          { required: true, message: '请选择显示样式', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '请输入文字内容', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请添加小程序图片', trigger: 'change' }
        ],
        codeTarget: [
          { required: true, message: '请选择小程序页面', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    codeModuleChange (e) {
      this.$set(this.saveObj, 'codeTarget', '')
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
      if (obj.guid) {
        let path
        if (obj.marketType === 2) {
          path = `/pages/Activity/GroupBuy/GroupBuyDetail/index?marketingGuid=${obj.guid}`
        } else if (obj.marketType === 4) {
          path = `/pages/Activity/Seckill/Detail/index?marketingGuid=${obj.guid}`
        } else if (obj.marketType === 3) {
          path = `/pages/Activity/FullReduction/Detail/index?marketingGuid=${obj.guid}`
        }
        this.codeTargetName = obj.name
        this.$set(this.saveObj, 'codeTarget', path)
      } else if (obj.goodsId) {
        let path = `/pages/Good/GoodsDetail/index?goodsId=${obj.goodsId}`
        this.codeTargetName = obj.title
        this.$set(this.saveObj, 'codeTarget', path)
      }
    },
    selectCurrentChange (currentRow) {
      this.market = currentRow || {}
    },
    showToggle (obj) {
      this.codeTargetName = ''
      this.saveObj = {
        type: 0,
        img: '',
        text: null,
        codeModule: null
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAvatarSuccess: function (res, file) {
      this.$set(this.saveObj, 'img', res.result.url)
    },
    delImgFun (index) {
      this.saveObj.img = null
    },
    // 提交保存
    saveFun () {
      this.$refs.wechatForm.validate(valid => {
        if (valid) {
          this.$props.callBack(this.saveObj)
          this.handleClose()
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    async loadListFun () {
      let that = this
      this.loading = true
      await this.$http.fetch(this.$api.guide.material.findMallGoodsList, this.searchObj).then(res => {
        that.pagination.total = Number(res.result.recordsTotal)
        that.dataList = res.result.data
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      }).finally(() => {
        this.loading = false
      })
    },
    async getGoodsCategory () {
      let that = this
      await this.$http.fetch(this.$api.guide.material.getGoodsCategory, {}).then(res => {
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    submitForm () {
      this.market = {}
      this.clearSearch()
      this.loadListFun()
    }
  }
}
</script>
<style scoped>
.selectMarketbox .current-row{
  td{
    color: #fff !important;
    background:  #0091FA !important
  }
}

@component-namespace wechatLink {
  .comDialogBoxCon {
    padding-bottom: 20px;
  }
  .comUploadBox {
    width: 330px;
  }
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
      list-style:none;
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
