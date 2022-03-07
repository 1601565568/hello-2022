<template>
  <div>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>支付配置</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_save' type="text" size='large' @click='jumpGuide(1)'>如何进行支付配置？</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='handleAdd'>新增授权</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <el-row v-if='!isEmpty'>
          <template v-for='itemData in data'>
            <el-col :span='8' class='card-warrper' :key='itemData.id'>
              <div class='card-content'>
                <template v-for='item in itemData.mapList'>
                  <div class='card-item' :key='item.key'>
                    <div class='card-key'><span class='key-name'><span v-if='item.isRequire' class='red-point'>*</span>{{item.name}}</span></div>
                    <template v-if='item.key === "key"'>
                      <div class='card-value'>
                        <template v-for='(items,indexs) in item.value'>
                          <span :key='indexs'>*</span>
                        </template>
                      </div>
                    </template>
                    <template v-else-if='item.key === "officialAccount"'>
                      <div v-if='item.value' class='form-item card-value'>
                        <img :src='item.value.headImgUrl' />
                        <span>{{item.value.nickName}}</span>
                      </div>
                      <div v-else class='form-item card-value'>-</div>
                    </template>
                    <template v-else>
                      <div class='card-value'>{{item.value}}</div>
                    </template>
                  </div>
                </template>
                <ns-button class='fix-btn' @click='handleEdit(itemData)'>修改</ns-button>
              </div>
            </el-col>
          </template>
        </el-row>
        <NoWxpay v-else />
      </template>
    </page-edit>
    <el-dialog
      title="支付设置"
      append-to-body
      :visible.sync="visible"
      width="500px">
      <el-form v-if='visible' class='drawer-form' :model="drawerData" ref="form" label-width="95px" :rules="rules">
        <el-form-item label="支付商户号" prop='mchid' required>
          <LengthInput v-model="drawerData.mchid" placeholder="请输入支付商户号" :length='32'></LengthInput>
          <div class='label-tip' v-show="$isShowDocs">
            <span class='label-point'></span>
            <span class='label-text'>如何获取支付商户号</span>
            <ns-button type='text' @click='jumpGuide(1)'>立即查看</ns-button>
          </div>
        </el-form-item>
        <el-form-item label="API密钥" prop='key' required>
          <LengthInput v-model="drawerData.key" placeholder="请输入API密钥" :length='32' type='password'></LengthInput>
          <div class='label-tip' v-show="$isShowDocs">
            <span class='label-point'></span>
            <span class='label-text'>如何获取API密钥</span>
            <ns-button type='text' @click='jumpGuide(2)'>立即查看</ns-button>
          </div>
        </el-form-item>
        <el-form-item label="API证书" prop='cert' required>
          <el-upload
            class="upload-demo"
            accept=".p12,.P12"
            :action="$api.core.uploadCert()"
            :on-remove='handleRemove'
            :show-file-list='false'
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <ns-button size="small" type="text">上传证书</ns-button>
          </el-upload>
          <div class="el-upload-list el-upload-list--text" v-if='drawerData.cert'>
            <div class='el-upload-list__item'>
              <a class="el-upload-list__item-name">
                <i class="el-icon-document"></i>
                {{certName || drawerData.cert}}
              </a>
            </div>
          </div>
          <div class='label-tip' v-show="$isShowDocs">
            <span class='label-point'></span>
            <span class='label-text'>如何获取API证书</span>
            <ns-button type='text' @click='jumpGuide(2)'>立即查看</ns-button>
          </div>
        </el-form-item>
        <el-form-item label="证书有效期" prop='time'>
          <el-date-picker
            style='width:100%'
            v-model="drawerData.time"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联公众号" prop='mchAppid' required>
          <el-select v-model='drawerData.mchAppid' style='width:100%' placeholder="请选择关联公众号">
            <el-option
              v-for="item in appIdList"
              :key="item.appId"
              :label="item.nickName"
              :value="item.appId">
            </el-option>
          </el-select>
          <div class='label-tip' v-show="$isShowDocs">
            <span class='label-point'></span>
            <span class='label-text'>如何关联公众号</span>
            <ns-button type='text'  @click='jumpGuide(4)'>立即查看</ns-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="handleCancel" :loading='btnLoad'>取消</ns-button>
        <ns-button type="primary" @click="handleSubmit" :loading='btnLoad'>确定</ns-button>
      </span>
      <el-dialog
        width="480px"
        title="提示"
        custom-class='embedded_dialog'
        :visible.sync="innerVisible"
        append-to-body>
        <div class="dialog_main">
          <div class="u_v1"><img class="v_img" src="./image/warning.png" alt="">修改支付配置后，已创建的红包策略将变更为新的支付配置。</div>
          <div class="u_v1">若不变更已创建的红包策略，请新增支付配置</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <ns-button @click="innerVisible = false" :loading='btnLoad'>取消</ns-button>
          <ns-button type="primary" @click="continueToSave" :loading='btnLoad'>继续保存</ns-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/index'
import ElDrawer from '@nascent/nui/lib/drawer'
import PageEdit from '@/components/NewUi/PageEdit'
import LengthInput from '@/components/NewUi/LengthInput'
import ElUpload from '@nascent/nui/lib/upload'
import NoWxpay from '../RedPacket/components/NoWxpay'
Index.components = {
  PageEdit, ElDrawer, LengthInput, ElUpload, NoWxpay
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.card-warrper {
  padding: 0 8px;
  margin-bottom: 16px;
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
.form-item {
  display: flex;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
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
<style lang="scss">
.embedded_dialog{
 .dialog_main{
   .v_img{
     margin-left: 7px;
     margin-right: 9px;
     margin-bottom: 1px;
   }
   .u_v1{
     display: block;
     height: 22px;
     line-height: 22px;
      font-size: 14px;
     &:first-child{
       color: #262626;
       margin-top: 16px;
     }
     &:last-child{
       color: #8C8C8C;
       margin: 4px 0 18px 30px;
     }
   }
 }
}
</style>
