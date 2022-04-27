<template>
  <el-form
    label-width="100px"
    label-position="left"
    ref="searchform"
    class="normal-from common-container"
    size="large"
    @submit.native.prevent
  >
    <page-edit>
      <template slot="header">
        <div class="common-header flex-box">
          <h3>企微聊天工具</h3>
        </div>
      </template>
      <template slot="content">
        <!-- 企微侧边栏设置 start -->
        <recruitment-collapse title="企微侧边栏设置" phoneTitle="">
          <template slot="collapse-left">
            <div class="step" v-platform-show="'ecrp'">
              <div class="step-title">
                1.设置网页授权的可信域名<ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('WEB_OPTION_URL')"
                  >去配置</ns-button
                ><ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('WEB_DESCRIBE_URL')"
                  v-show="$isShowDocs"
                  >配置说明</ns-button
                >
              </div>
              <div class="step-content">
                <label class="">可信域名</label>
                <el-input
                  placeholder="请输入内容"
                  :value="model.appDomain"
                  disabled
                  size="large"
                >
                  <Icon
                    slot="append"
                    type="ns-thick-copy"
                    class="copy-btn"
                    @click="copy(model.appDomain)"
                  />
                </el-input>
              </div>
            </div>
            <div class="step" v-platform-show="'ecrp'">
              <div class="step-title">
                2.上传校验域名文件<ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('FILE_OPTION_URL')"
                  >去配置</ns-button
                ><ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('FILE_DESCRIBE_URL')"
                  v-show="$isShowDocs"
                  >配置说明</ns-button
                >
              </div>
              <div class="step-content">
                <label>上传文件</label>
                <ElUpload
                  class="upload-demo"
                  accept=".txt,.TXT"
                  :action="$api.core.uploadVerifyFile()"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-success="handleUploadSuccess"
                >
                  <ns-button><Icon type="ns-upload2" />上传文件</ns-button>
                </ElUpload>
              </div>
              <div class="step-content" v-if="model.filename">
                <label class="mini">{{ model.filename }}</label>
              </div>
            </div>
            <div class="step">
              <div class="step-title">
                <span v-platform-show="'ecrp'">3.</span>
                设置侧边栏功能
                <ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('SIDE_OPTION_URL')"
                  >去配置
                </ns-button>
                <ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation(cloudPlatformType === 'ecrp' ? 'SIDE_DESCRIBE_URL' : 'HELP_CENTER_URL')"
                  v-show="$isShowDocs"
                  >配置说明
                </ns-button>
              </div>
              <template v-for="item in data">
                <!-- <label :key='item.customerDetail'>
                  {{item.explain}}<Icon slot="append" @click='copy(item.value)' type="ns-thick-copy" className="text-primary configuration-copy"/>
                </label> -->
                <div class="step-content" :key="item.customerDetail">
                  <label class="">{{ item.explain.split("：")[0] }}</label>
                  <el-input
                    placeholder="请输入内容"
                    :value="item.explain.split('：')[1]"
                    disabled
                    size="large"
                  >
                    <Icon
                      slot="append"
                      type="ns-thick-copy"
                      class="copy-btn"
                      @click="copy(item.explain.split('：')[1].split('(')[0])"
                    />
                  </el-input>
                </div>
              </template>
            </div>
          </template>
          <template slot="collapse-right">
            <div class="preview-img">
              <img :src="qychat2" />
            </div>
          </template>
        </recruitment-collapse>
        <!-- 企微侧边栏设置 end -->
        <!-- 好友自定义详情页 start -->
        <recruitment-collapse
          title="好友自定义详情页"
          phoneTitle=""
          v-if="cloudPlatformType === 'ecrp'"
        >
          <template slot="collapse-left">
            <div class="step">
              <div class="step-title">
                设置自定义详情<ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('DIY_OPTION_URL')"
                  >去配置</ns-button
                ><ns-button
                  type="text"
                  class="lager-btn"
                  @click="handleLocation('DIY_DESCRIBE_URL')"
                  v-show="$isShowDocs"
                  >配置说明</ns-button
                >
              </div>
              <div class="step-content">
                <label class="">客户详情</label>
                <el-input
                  placeholder="请输入内容"
                  :value="model.webLink"
                  disabled
                  size="large"
                >
                  <Icon
                    slot="append"
                    type="ns-thick-copy"
                    class="copy-btn"
                    @click="copy(model.webLink)"
                  />
                </el-input>
              </div>
            </div>
          </template>
          <template slot="collapse-right">
            <div class="preview-img">
              <img :src="qychat3" />
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
  RecruitmentCollapse,
  PageEdit,
  NsGuideDialog,
  ElUpload
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
  margin-left: 16px;
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
