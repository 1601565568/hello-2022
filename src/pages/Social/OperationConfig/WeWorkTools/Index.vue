<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' size='large' @submit.native.prevent>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>企微聊天工具</h3>
        </div>
      </template>
      <template slot='content'>
        <!-- 企微侧边栏设置 start -->
        <recruitment-collapse title='企微侧边栏设置' phoneTitle=''>
          <template slot='collapse-left'>
            <div class='step'>
              <div class='step-title'>1.设置网页授权的可信域名<ns-button type='text' class='lager-btn'>去配置</ns-button><ns-button type='text' class='lager-btn'>配置说明</ns-button></div>
              <div class='step-content'>
                <label class=''>可信域名</label>
                <el-input placeholder="请输入内容" :value="input3" disabled size='large'>
                  <Icon slot="append" type="ns-thick-copy" class='copy-btn'/>
                </el-input>
              </div>
            </div>
            <div class='step'>
              <div class='step-title'>2.上传校验域名文件<ns-button type='text' class='lager-btn'>去配置</ns-button><ns-button type='text' class='lager-btn'>配置说明</ns-button></div>
              <div class='step-content'>
                <label >上传文件</label>
                <ElUpload
                  class="upload-demo"
                  accept=".p12,.P12"
                  :action="$api.core.uploadVerifyFile()"
                  :on-remove='handleRemove'
                  :show-file-list='false'
                  :before-upload="beforeUpload"
                  :on-success="handleUploadSuccess"
                >
                  <ns-button><Icon type="ns-upload2"/>上传文件</ns-button>
                </ElUpload>
              </div>
              <div class='step-content' v-if='file'>
                <label class='mini'>{{file}}</label>
                <ns-button type='text' class='lager-btn' @click='handleDeleteFile'>删除</ns-button>
              </div>
            </div>
            <div class='step'>
              <div class='step-title'>3.设置侧边栏功能<ns-button type='text' class='lager-btn'>去配置</ns-button><ns-button type='text' class='lager-btn'>配置说明</ns-button></div>
              <div class='step-content'>
                <div>
                <template v-for='item in data'>
                  <label :key='item.customerDetail'>
                    {{item.explain}}<Icon slot="append" @click='copy(item.value)' type="ns-thick-copy" className="text-primary configuration-copy"/>
                  </label>
                </template>
                </div>
              </div>
            </div>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <img :src='qychat2'>
            </div>
          </template>
        </recruitment-collapse>
        <!-- 企微侧边栏设置 end -->
        <!-- 好友自定义详情页 start -->
        <recruitment-collapse title='好友自定义详情页' phoneTitle=''>
          <template slot='collapse-left'>
            <div class='step'>
              <div class='step-title'>设置自定义详情<ns-button type='text' class='lager-btn'>去配置</ns-button><ns-button type='text' class='lager-btn'>配置说明</ns-button></div>
              <div class='step-content'>
                <label class=''>客户详情</label>
                <el-input placeholder="请输入内容" :value="input3" disabled size='large'>
                  <Icon slot="append" type="ns-thick-copy"  class='copy-btn'/>
                </el-input>
              </div>
            </div>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <img :src='qychat3'>
            </div>
          </template>
        </recruitment-collapse>
        <!-- 好友自定义详情页 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/index'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import PageEdit from '@/components/NewUi/PageEdit'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElUpload from '@nascent/nui/lib/upload'
Index.components = {
  RecruitmentCollapse, PageEdit, NsGuideDialog, ElUpload
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .step {
    margin-bottom: 24px;
    .step-title {
      font-size: 14px;
      color: #262626;
      .lager-btn {
        font-size: 14px;
        margin: 0 16px;
      }
    }
    .step-content {
      display: flex;
      align-items: center;
      margin-top: 16px;
    }
    label {
      display: inline-block;
      min-width: 72px;
      color: #595959;
      &.mini {
        font-size: 12px;
      }
    }
  }
  .configuration-copy {
    margin-left:16px;
    font-size: 11px;
    cursor: pointer;
  }
  .copy-btn {
    cursor: pointer;
  }
  .preview-img {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
    height: 100%;
    }
  }
</style>
