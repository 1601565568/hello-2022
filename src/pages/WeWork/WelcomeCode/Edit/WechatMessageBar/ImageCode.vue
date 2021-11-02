<template>
  <el-dialog
    title="新增附码图片"
    :visible.sync="visible"
    width="960px"
    :before-close="handleCanle"
    modal-append-to-body
    append-to-body
  >
    <div class="container-view">
      <div class="left-view">
        <el-form label-width="100px" label-position="left" class="form-view">
          <el-form-item label="小程序" required>
            <el-select v-model="miniList" placeholder="请选择小程序">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <div class="mini-view">
              <div>已授权未显示？点此刷新</div>
              <div>
                <span>如何授权&nbsp;</span>
                <span>&nbsp;去授权</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附码方式" required>
            <el-radio-group v-model="codeStyle">
              <el-radio label="0">选择商品</el-radio>
              <el-radio label="1">输入小程序路径</el-radio>
            </el-radio-group>
            <div class="select-shop-view" v-show="codeStyle === '0'">
              <el-input placeholder="商品名称" />
              <div class="shop-button">选择商品</div>
            </div>
            <div class="parameter-view"></div>
          </el-form-item>
          <el-form-item label="货号">
            <el-input placeholder="请输入货号" />
          </el-form-item>
          <el-form-item label="图片" required>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="remind-img">
              请上传格式为JPG、JPEG、PNG格式的图片，大小不超过2M
            </div>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input placeholder="请输入标题，长度在36个字符以内" />
          </el-form-item>
          <el-form-item label="售价" required>
            <el-switch v-model="price" active-color="#0091FA"> </el-switch>
            <div class="price-view">
              <div class="sub-title">售价（元）</div>
              <el-input placeholder="请输入售价" />
            </div>
          </el-form-item>
          <el-form-item label="原价" required>
            <el-switch v-model="originalPrice" active-color="#0091FA">
            </el-switch>
            <div class="price-view">
              <div class="sub-title">原价（元）</div>
              <el-input placeholder="请输入原价" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-view"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="handleCanle">取 消</NsButton>
      <NsButton type="primary" @click="handleSure">保 存</NsButton>
    </span>
  </el-dialog>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
export default {
  components: {
    ElUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      miniList: ['shanghai', 'beijing'],
      codeStyle: '0',
      price: '',
      originalPrice: '',
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleCanle () {
      this.$emit('handleImageCode', false)
    },
    handleSure () {
      this.$emit('handleImageCode', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './styles/imageCode.css';
.container-view {
  display: flex;
  flex-direction: row;
}
.left-view {
  width: 55%;
}
.right-view {
  width: 45%;
}
.mini-view {
  font-size: 14px;
  color: #0094fc;
  line-height: 22px;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 5px;
}
.select-shop-view {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  .shop-button {
    width: 88px;
    height: 32px;
    background: #0094fc;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    box-sizing: content-box;
    line-height: 32px;
  }
}
.price-view {
  margin-top: 16px;
  background: #f5f5f5;
  border-radius: 2px;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  .sub-title {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #595959;
  }
}
.parameter-view {
  background: #f5f5f5;
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
}
.remind-img {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  margin-top: 8px;
}
</style>
