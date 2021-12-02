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
                v-model="model.mpFollowState"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
              <ns-button type="text" class='preview-btn' @click='handlePreview'>预览</ns-button>
            </template>
          </div>
        </template>
      </div>
    </div>
    <div class='recruitment-container'>
      <h1 class='recruitment-title'>
        招募通知（通知节点：招募会员成功）
      </h1>
      <div class='recruitment-tip'>
        招募会员成功后，会根据以下配置发送通知
      </div>
      <div v-for="(item, index) in noticeList" :key="index">
        <div class='step-content'>
          <span class='step-content_name'>{{item.value}}</span>
          <el-switch
            class='preview-swicth'
            v-model="model[item.key].state"
            :active-value="1"
            :inactive-value="0"
            @change="(state) => changeState(item.key, state)"
          >
          </el-switch>
          <ns-button type="text" class='preview-btn' @click='handlePreviewNotice(item.key)'>预览</ns-button>
        </div>
        <div style="margin-left: 26px">
          <div class='step-content' v-show="model[item.key].state">
            <span class='step-content_name'>自定义选择通知内容：</span>
            <div style="margin-top: 4px;">
              <el-checkbox
                v-for="option in noticeOptions"
                :key="option.key"
                v-model="model[item.key][option.key]"
                :label="option.label"
                :true-label="1"
                :false-label="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="招募流程预览"
      :visible.sync="previewVisin"
      fullscreen>
      <div class='dialog-content' :style='`background-image:url(${showImg})`'>
      </div>
    </el-dialog>
    <el-dialog
      title="招募通知预览"
      :visible.sync="previewNoticeVisin"
      width="500px">
      <div class='notice-dialog-content'>
        <img v-if="previewNoticeVisin" :src="noticeImg"/>
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
  .notice-dialog-content {
    display: flex;
    justify-content: center;
    height: 800px;
    width: 460px;
  }
  .notice-dialog-content > img {
    height: 750px;
    width: 400px;
    object-fit: contain;
  }
</style>
