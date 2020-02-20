<template>
  <div>
    <NsTableAutoPass ref="mainTable" :url=$api.guide.personalQrcode.findList @scopeRowCount="scopeRowCount"
                  @shopEdit="shopEdit" @onAddFun="onAddFun" @showShop="showShop" @onEditFun="onEditFun" @onShowFun="onShowFun" @onDeleteFun="onDeleteFun" @qrcodeLink="qrcodeLink" @@handleSelectionChange="handleSelectionChange">
    </NsTableAutoPass>

    <!--聚合二维码展示开始-->
    <el-dialog :title="title" :visible.sync="personalLinkFormVisible" width="504px" class="detail-dialog">
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
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button type="primary" :disabled="isHidden">确定</ns-button>
      </div>
    </el-dialog>
    <!--聚合二维码展示结束-->

    <!-- 新增/修改聚合二维码开始 -->
    <el-dialog :title="title" :visible.sync="addOrEditFormVisible" width="460px"  @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp"
               @opened='opened'>
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <el-form :model="model.personalQrcode" ref="addForm" label-width="100px" :rules="rules" >
          <el-form-item label="聚合码名称：" required>
            <el-form-grid size="xxmd">
              <el-input  autofocus=true v-model="model.personalQrcode.name" placeholder="" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="子码设置：" required>
            <el-form-grid size="xxmd">
              <el-input  autofocus=true v-model="model.personalQrcode.name" placeholder="" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="子码展示方式：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="sex">
                <el-radio-group @change="sexs" v-model="model.personalQrcode.showType">
                  <el-radio :label="1">随机展示</el-radio>
                  <el-radio :label="2">轮流展示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="onSave(model)" :disabled="isHidden">确定</ns-button>
      </div>
    </el-dialog>
    <!--  新增/修改聚合二维码结束 -->
  </div>
</template>

<script>
import List from './src/List'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableAutoPass from './NsTablePersonalQrcode'
import ShopSelectLoad from '@/components/ShopSelectLoad'

List.components = {
  NsTableAutoPass,
  ElUpload,
  ShopSelectLoad
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
</style>
