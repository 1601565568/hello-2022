<template>
  <div class="pay-container">
      <template slot='content'>
        <div class='container'>
          <div id='step1' class='step step1'>
            <div class='header-title'>
              <div class='header-name'>企微侧边栏配置说明</div>
            </div>
            <div class='content'>
              <p>操作路径：【企业微信管理后台】->【我的企业】->【外部沟通管理】，配置自定义详情页</p>
            </div>
            <div class='content'>
              <p>操作说明：</p>
            </div>
            <div class='content'>
              <p>1.填写以下信息，配置自定义详情页</p>
              <p class='little-step'>1）详情页名称：可自定义，建议为“客户详情”</p>
              <p class='little-step'>2）详情页类型：选择“网页</p>
              <p class='little-step'>3）网页地址：这里显示地址<Icon type='ns-thick-copy' class='icon copy-icon'></Icon></p>
            </div>
            <div class='content-image'>
              <img src='./images/DetailsPage1.jpg' class='preview-img' />
            </div>
            <div class='content-image'>
              <img src='./images/DetailsPage2.jpg' class='preview-img' />
            </div>
            <div class='content-image'>
              <img src='./images/DetailsPage3.jpg' class='preview-img' />
            </div>
          </div>
        </div>
      </template>
  </div>
</template>
<script>
import Index from './src/index'
import PageEdit from '@/components/NewUi/PageEdit'
import ElLink from '@nascent/nui/lib/link'
Index.components = {
  PageEdit, ElLink
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.pay-container .container{
  background: #fff;
  padding: 30px 32px;
  padding-top: 0px;
  .step {
    padding-top: 30px;
    .header-title {
      font-size: 14px;
      color: #262626;
      line-height: 22px;
      font-weight: 500;
    }
  }
}
.content {
  font-size: 14px;
  color: #595959;
  position: relative;
  margin: 16px 0;
  p{
    line-height: 22px;
    &.little-step {
      line-height: 20px;
      margin-left: 12px;
      margin: 8px 0 16px 12px;
    }
    .icon {
      margin-left: 8px;
      font-size: 16px;
      color: #595959;
      cursor: pointer;
    }
  }
}
.content-image {
  margin-bottom: 24px;
  .preview-img {
    width: 871px;
  }
}
</style>
<style scoped>
.content >>> .el-link {
  position: relative;
  top:-2px;
}
</style>
