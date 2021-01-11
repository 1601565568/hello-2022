<template>
  <div>
    <div class='common-header flex-box'>
      <h3>导购招募流程设置</h3>
      <div class='common-btn'>
        <ns-button class='common-btn_save' type="primary" size='large' @click='handleSave' :loading='btnLoad'>保存</ns-button>
      </div>
    </div>
    <div class='recruitment-container'>
      <h1 class='recruitment-title'>
        导购招募码（获取位置：导购小程序-会员招募）
      </h1>
      <div class='recruitment-tip'>
        可根据自身需求自定义导购招募流程
      </div>
      <div>
        <template v-for='item in stepList'>
          <div :key='item.value' class='step-content'>
            <span class='step-content_name'>{{item.value}}</span>
            <template v-if="item.extra === 'checkbox_button'">
              <el-switch
                class='preview-swicth'
                v-model="mpFollowState">
              </el-switch>
              <ns-button type="text" class='preview-btn' @click='handlePreview'>预览</ns-button>
            </template>
          </div>
        </template>
      </div>
    </div>
    <el-dialog
      title="招募流程预览"
      :visible.sync="previewVisin"
      fullscreen>
      <div class='dialog-content' :style='`background-image:url(${showImg})`'>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @import "@components/NewUi/styles/reset.css";
  .recruitment-container {
    background-color: #ffffff;
    padding: 0 40px;
    margin: 16px 0;
    padding-bottom: 24px;
    .recruitment-title {
      margin: 0;
      padding: 16px 0;
      font-size: 16px;
      color: #262626;
      line-height: 24px;
    }
    .recruitment-tip {
      padding: 9px 16px;
      font-size: 14px;
      color: #595959;
      line-height: 22px;
      background: #F2F9FE;
      width: 60%;
    }
    .step-content {
      margin-top: 24px;
      display: flex;
      align-items: center;
      .step-content_name {
        font-size: 14px;
        color: #595959;
        line-height: 22px;
      }
      .preview-swicth {
        margin: 0 16px
      }
      .preview-btn {
        font-size: 14px;
      }
    }
  }
  .img-container {
    height: 100%;
  }
  .dialog-content {
    height: calc( 100vh - 100px );
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center
  }
</style>
