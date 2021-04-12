<template>
  <div>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>支付配置</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>新增授权</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <el-row>
          <el-col :span='8' class='card-warrper'>
            <div class='card-content'>
              <template v-for='item in mapItem'>
                <div class='card-item' :key='item.key'>
                  <div class='card-key'><span class='key-name'><span v-if='item.isRequire' class='red-point'>*</span>{{item.name}}</span></div>
                  <div class='card-value'>{{item.value}}</div>
                </div>
              </template>
              <ns-button class='fix-btn'>修改</ns-button>
            </div>
          </el-col>
        </el-row>
      </template>
    </page-edit>
    <el-dialog
      title="支付设置"
      :visible.sync="visible"
      width="500px"
      :before-close="handleClose">
      <el-form class='drawer-form' :model="drawerData" ref="form" label-width="95px">
        <el-form-item label="支付商户号" required>
          <el-input v-model="drawerData.name" placeholder="请输入支付商户号" :length='32'></el-input>
          <div class='label-tip'>
            <span class='label-point'></span>
            <span class='label-text'>如何获取支付商户号</span>
            <ns-button type='text'>立即查看</ns-button>
          </div>
        </el-form-item>
        <el-form-item label="支付密钥" required>
          <el-input v-model="drawerData.name" placeholder="请输入支付密钥" :length='20'></el-input>
        </el-form-item>
        <el-form-item label="API证书" required>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed">
            <ns-button size="small" type="text">上传证书</ns-button>
          </el-upload>
          <div class='label-tip'>
            <span class='label-point'></span>
            <span class='label-text'>如何获取API证书</span>
            <ns-button type='text'>立即查看</ns-button>
          </div>
        </el-form-item>
        <el-form-item label="证书有效期" required>
          <el-date-picker
            v-model="drawerData.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联公众号" required>
          <el-input v-model="drawerData.name" placeholder="请输入支付商户号" :length='32'></el-input>
          <div class='label-tip'>
            <span class='label-point'></span>
            <span class='label-text'>如何关联公众号</span>
            <ns-button type='text'>立即查看</ns-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="visible = false">取消</ns-button>
        <ns-button type="primary" @click="visible = false">确定</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/index'
import ElDrawer from '@nascent/nui/lib/drawer'
import PageEdit from '@/components/NewUi/PageEdit'
import LengthInput from '@/components/NewUi/LengthInput'
import ElUpload from '@nascent/nui/lib/upload'
Index.components = {
  PageEdit, ElDrawer, LengthInput, ElUpload
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.card-warrper {
  padding: 0 8px;
  .card-content {
    background-color: #fff;
    border-radius: 5px;
    padding: 17px 0;
    overflow: hidden;
    .card-item {
      height: 52px;
      display: flex;
      margin-bottom: 4px;
      align-items: center;
      .card-key {
        font-size: 14px;
        line-height: 22px;
        color: #595959;
        width: 102px;
        text-align: right;
        .key-name {
          position: relative;
          .red-point {
            font-size: 14px;
            color: #D63102;
          }
        }
      }
      .card-value {
        font-size: 12px;
        color: #595959;
        line-height: 20px;
        margin-left: 36px;
      }
    }
    .fix-btn {
      float: right;
      margin-right: 16px;
    }
  }
}
.label-tip {
  display: flex;
  font-size: 12px;
  color: #595959;
  line-height: 20px;
  align-items: center;
  .label-point {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #F2AA18;
    border-radius: 50%;
  }
  .label-text {
    margin: 0 16px 0 8px;
  }
}
</style>
<style scoped>
.drawer-form {
  >>> .el-form-item__label {
    padding-right: 22px;
  }
  >>> .el-form-item--small.el-form-item  {
    margin-bottom: 26px;
  }
}
</style>
