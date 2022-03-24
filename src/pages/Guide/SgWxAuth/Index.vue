<template>
  <div class='auth-container'>
    <!-- <template v-if='!isEmpty && isLoad'>
      <div class='auth-header'>
        <h3>小程序信息展示</h3>
        <ns-button @click='handleCancel'>取消授权</ns-button>
      </div>
      <div class='auth-content'>
        <div class='auth-content_icon'>
          <img :src='infoData.icon'>
        </div>
        <div class='auth-content_form'>
          <h5 class='auth-form_header'>
            {{infoData.name}}
          </h5>
          <div class='auth-form_content'>
            <template v-for='item in displayData'>
              <div class='auth-form_item' :key="item.key">
                <div class='auth-form_name'>
                  {{item.name}}：
                </div>
                <div class='auth-form_value'>
                  {{item.value}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if='isLoad'>
      <div class='auth-empty'>
        <img :src='linkminiapp' class='empty-img'>
        <div class='auth-empty_content'>
          <h3>温馨提示</h3>
          <p class='empty-tip'>一个小程序只能授权给一个商户！</p>
          <p class='empty-tip_bold'>【可点击下方按钮，跳转到微信公众平台授权页面，授权小程序】</p>
          <ns-button class='empty-btn' type='primary' @click='handleAuth'>去授权</ns-button>
        </div>
      </div>
    </template> -->
    <page-edit>
      <template slot='header'>
          <div class='common-header flex-box'>
            <h3>小程序信息展示</h3>
            <div class='common-btn' v-if='!isEmpty && isLoad && !isSaasAccount'>
              <ns-button  @click='handleCancel'>取消授权</ns-button>
            </div>
          </div>
        </template>
        <template slot='content'>
          <template v-if='!isEmpty && isLoad'>
            <div class='auth-content'>
              <div class='auth-content_icon'>
                <img :src='infoData.icon'>
              </div>
              <div class='auth-content_form'>
                <h5 class='auth-form_header'>
                  {{infoData.name}}<Icon v-if='infoData.qrcode' type="icon-zhaomuma" class="icon-upload" style='margin-left: 5px;cursor: pointer;color:#8C8C8C' @click='handleClick'/>
                </h5>
                <div class='auth-form_content'>
                  <template v-for='item in displayData'>
                    <!-- QA版本隐藏主体信息 -->
                    <div class='auth-form_item' :key="item.key" >
                      <div class='auth-form_name'>
                        {{item.name}}：
                      </div>
                      <div class='auth-form_value'>
                        {{item.value}}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if='isLoad'>
            <div class='auth-empty'>
              <img :src='linkminiapp' class='empty-img'>
              <div class='auth-empty_content'>
                <h3>温馨提示</h3>
                <p class='empty-tip'>一个小程序只能授权给一个商户！</p>
                <p class='empty-tip_bold'>【可点击下方按钮，跳转到微信公众平台授权页面，授权小程序】</p>
                <ns-button class='empty-btn' type='primary' @click='handleAuth'>去授权</ns-button>
              </div>
            </div>
          </template>
        </template>
    </page-edit>
    <PreviewPoster activityName='小程序二维码' type='qrcode' title='二维码' :isQrcodeImg='true' posterName='小程序二维码' :dialogVisible='dialogVisible' :url='infoData.qrcode' @onClose='dialogVisible = false' appendToBody/>
    <!-- 最新弹窗取消授权开始 -->
    <el-dialog width="450px" class="authorization" title="取消授权"
               :visible.sync="visible"
               :modal-append-to-body="false"
               @before-close="closeDialog">
      <div>
        <p>若要取消授权，请登录<a href="https://mp.weixin.qq.com" target="_blank">【微信公众平台】</a>授权管理页面取消授权</p>
      </div>
      <div slot="footer" class="authorization_footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="cancelAuthorization">已确认取消授权</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗取消授权结束 -->
  </div>
</template>
<script>
import PageEdit from '@/components/NewUi/PageEdit'
import PreviewPoster from '../components/PreviewPoster'
import Index from './src/index'
Index.components = {
  PageEdit, PreviewPoster
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.auth-container {
  border-radius: 4px;
  padding-bottom:32px;
  .auth-header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    h3 {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      .icon-upload {
        cursor: pointer;
      }
    }
  }
  .auth-content {
    border-radius: 4px;
    background-color: #fff;
    display: flex;
    padding: 32px 24px;
    margin-top: 0;
    .auth-content_icon img{
      border-radius: 2px;
      height: 56px;
      width: 56px;
    }
  }
  .auth-content_form {
    margin-left: 16px;
    h5{
      font-size: 16px;
      color: #262626;
      line-height: 24px;
    }
    .auth-form_content {
      margin-top:16px;
      .auth-form_item {
        margin-bottom: 8px;
        display: flex;
        font-size: 14px;
        .auth-form_name {
          color: #606266;
        }
        .auth-form_value {
          color: #262626;
        }
      }
    }
  }
  .auth-empty {
    display: flex;
    height: calc(100vh - 250px);
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .empty-img {
      height: 235px;
      margin-right: 68px;
    }
    .auth-empty_content {
      h3 {
        font-size: 24px;
        color: #262626;
        line-height: 32px;
        margin-bottom: 27px;
      }
      p {
        font-size: 16px;
        color: #595959;
        line-height: 24px;
        margin-bottom: 6px;
      }
      .empty-btn {
        margin-top: 60px;
      }
    }
  }
}

</style>
