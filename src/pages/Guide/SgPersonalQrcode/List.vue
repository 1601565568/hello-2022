<template>
  <div>
    <NsTableAutoPass ref="mainTable" :url=$api.guide.personalQrcode.findList @scopeRowCount="scopeRowCount"
                  @shopEdit="shopEdit" @onAddFun="onAddFun" @showShop="showShop" @onEditFun="onEditFun" @onShowFun="onShowFun" @onDeleteFun="onDeleteFun" @qrcodeLink="qrcodeLink" @@handleSelectionChange="handleSelectionChange">
    </NsTableAutoPass>

    <!--聚合二维码展示开始-->
    <el-dialog :title="title" :visible.sync="personalLinkFormVisible" width="400px" class="detail-dialog">
      <div class="detail-dialog__content">
        <el-form label-width="90px" class="detail-leftside">
          <el-form-item label="链接：" >
            <el-form-grid>
              <div style='display:flex'>
                <el-input  autofocus=true v-model="personalQrcodeLink" placeholder="" width="300px">{{ personalQrcodeLink }}</el-input>
                <ns-button type='text' @click='copy(personalQrcodeLink)'>复制</ns-button>
                <ns-button type='text' @click='preview'>投放预览</ns-button>
              </div>
              <span>该链接为聚合码H5，可投放公众号等</span>
              <div v-if="personalQrcodeLink !=''&& personalQrcodeLink!=null">
                <qr-code :value="personalQrcodeLink" :size="150" :options="{size:150}"></qr-code>
                <ns-button type='text' @click='downLode(personalQrcodeLink)'>下载</ns-button>
              </div>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button type="primary" @click="cleanPersonQrcode">确定</ns-button>
      </div>
    </el-dialog>
    <!--聚合二维码展示结束-->

    <!-- 新投放预览开始 -->
    <ElDialog
      width="900px"
      title="投放预览"
      :visible.sync="dialogVisible"
      response-limit :show-scroll-x=false>
      <div class="preview-container">
        <ElForm label-width="90px" class="preview-container__form">
          <ElFormItem label="聚合码标题：" required>
            <ElInput
              type="text"
              placeholder="请输入聚合码会在微信打开的页面标题"
              v-model="onShowTitle"
              maxlength="10"
              show-word-limit
            >
            </ElInput>
          </ElFormItem>
          <ElFormItem label="背景图设置：" required class="preview-btn">
            <ElUpload
              :action="this.$api.core.sgUploadFile('test')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <ns-button type="primary" plain>
                <Icon type="plus"/>
                选择图片
              </ns-button>
            </ElUpload>
          </ElFormItem>
          <ElFormItem class="preview-btn">
            <ns-button type="primary" @click="download(bgpic)" plain>下载原图</ns-button>
          </ElFormItem>
          <ElFormItem>
            <div class="text-primary">
              <Icon type="exclamation-circle" theme="outlined"/>
              建议上传尺寸为750px*1624px，大小不超过5M
            </div>
          </ElFormItem>
          <ElFormItem>
            <ElImage
              :width="160"
              :src="bgpic"
              mode="fill"
              class="preview-photo"></ElImage>
          </ElFormItem>
        </ElForm>
        <div class="preview-container__example">
          <div class="preview-bgimg">
            <div class="preview-bgimg__title">聚合码标题</div>
            <div class="preview-bgpic">
              <ElImage :width="243" :src="bgpic"></ElImage>
            </div>
            <div class="preview-bgimg__qrcode">
              <div class="preview-blank">
                <ElImage
                  :width="103"
                  :height="103"
                  :src="qrcodeimg"
                  mode="cover" class="preview-blank__qrcodeimg"></ElImage>
              </div>
            </div>
            <div class="preview-bgimg__line"></div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSaveShow()">确定</ns-button>
      </span>
    </ElDialog>
    <!--  投放预览结束 -->
  </div>
</template>

<script>
import List from './src/List'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableAutoPass from './NsTablePersonalQrcode'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import QrCode from '@xkeshi/vue-qrcode'
import ElImage from '@nascent/nui/lib/image'

List.components = {
  NsTableAutoPass,
  ElUpload,
  ShopSelectLoad,
  QrCode,
  ElImage
}
export default List
</script>
<style scoped>
  @import "@theme/variables.pcss";

  >>>.avatar-uploader .el-upload {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-base-link-color-hover);
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: var(--theme-font-color-secondary);
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
</style>
<style scoped>
  @import "@theme/variables.pcss";

  .resignFormVisible_title{
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #FFDEAD;
    font-size: 14px;
    padding-left: 10px;
    margin-bottom: 10px
  }
  .resignFormVisible_way{
    line-height: 40px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid #aaaaaa;
  }
  .resignFormVisible_otherShoppers_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_otherShoppers_search{
    padding: 10px 0 10px 0;
  }
  .resignFormVisible_otherShoppers_02{
    line-height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #aaaaaa;
    padding-left: 10px;
  }
  .resignFormVisible_custom_title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 10px;
    font-size: 13px;
    line-height: 40px;
  }
  .resignFormVisible_custom_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_custom_search{
    padding-top: 5px;

  }
  .template-table__more-btns{
    padding-left: -3px !important;
  }
  .dialog-footer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .replaceTheShoppers{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 10px 20px 0;
    position: relative;;
    float: right;
    bottom: 0
  }
  .el-scrollbar__bar.is-vertical {
    width: 0!important;
    top: 2px;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
    left: 2px;
  }
  .user_style_text{
    font-size: 14px;
    font-weight: 600;
  }
  .user_style{
    text-align: center;
    display: inline-block;
    background:rgba(255,0,0,0.1);
    padding: 3px 10px;
    margin-top: 10px;
    border-radius: var(--default-radius-mini);
  }
  .bulkReplacementStores{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 20px;
  }
  .bulkReplacementStores_logo{
    font-size: 24px;
    position: relative;
    top: 13px;
    left: -15px;
  }
  .Setupbulksalesguide{
    margin: 0 20px !important;
  }
  .bulkReplacementStores_cause{
    color: var(--theme-font-color-secondary);
    background: rgba(188,188,188,0.3);
    padding: 0 var(--default-padding-base);
    border-radius: var(--default-radius-mini);
  }
  >>> .el-radio-group {
    vertical-align: unset;
  }
  .text-black {
    color: var(--theme-font-color-primary);
    font-weight: bold;
  }
  @component-namespace preview {
    @b container {
      display: flex;
      @e form {
        padding-right: 87px;
        >>> .el-input__suffix:before {
          border-left: 0;
        }
      }
      @e example {
        padding: 0 0 30px 87px;
        border-left: 1px solid var(--theme-base-border-color-primary);
      }
    }
    @b photo {
      margin-top: var(--default-margin-larger);
    }
    @b bgpic {
      width: 243px;
      height: 468px;
      margin-top: var(--default-margin-small);
      border-bottom-left-radius: 26px;
      border-bottom-right-radius: 26px;
      overflow: hidden;
    }
    @b bgimg {
      width: 296px;
      height: 575px;
      position: relative;
      padding: 75px 30px 40px 27px;
      background-image: url("./src/images/iphonexmockup.png");
      background-repeat: no-repeat;
      background-size: 100% auto;
      @e title {
        font-weight: bold;
        color: var(--theme-font-color-primary);
        text-align: center;
        width: 10em;
        white-space: nowrap;
        overflow: hidden;
        margin: -18px auto 0;
      }
      @e line {
        width: 87px;
        height: 3px;
        position: absolute;
        left: 50%;
        bottom: 35px;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, .5);
        border-radius: 65px;;
      }
      @e qrcode {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 231px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, .3);
        box-shadow: 0 3px 4px 0 rgba(51, 51, 51, .1);
        border-radius: 6px;
      }
    }
    @b blank {
      width: 107px;
      height: 107px;
      padding: 2px;
      background: var(--theme-color-white);
      border-radius: 6px;
      @e qrcodeimg {
        border-radius: 6px;
      }
    }
    @b btn {
      >>> .el-upload {
        width: 100%;
      }
      >>> .el-button {
        color: var(--theme-color-primary);
        width: 100%;
        background: var(--theme-color-white);
        border-color: var(--theme-color-primary);
    &:hover {
       color: var(--theme-color-primary);
     }
    }
  }
  }
</style>
