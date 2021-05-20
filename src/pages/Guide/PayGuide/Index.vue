<template>
  <div class="pay-container">
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>配置流程说明</h3>
        </div>
      </template>
      <template slot='content'>
        <div class='hidden'>
          <a href='#step1' id='step1a'></a>
          <a href='#step2' id='step2a'></a>
          <a href='#step3' id='step3a'></a>
          <a href='#step4' id='step4a'></a>
        </div>
        <div class='container'>
          <div id='step1' class='step step1'>
            <div class='header-title'>
              <div class='header-tip'>1</div>
              <div class='header-name'>获取商户号</div>
            </div>
            <div class='content has-border'>
              <p>登录微信支付商户平台（ <el-link type="primary" href="https://pay.weixin.qq.com" target="_blank" :underline='false'>https://pay.weixin.qq.com</el-link> ）更多微信支付商户号查询方法，进入【账户中心】->【账号设置】->【商户信息】，</p>
              <p>更多微信支付商户号查询方法。<el-link type="primary" href="https://kf.qq.com/faq/200729EZ7fEj200729aumYR7.html" target="_blank" :underline='false'>查看操作指引</el-link></p>
            </div>
            <div class='content-image'>
              <img src='./images/step1.jpg' class='preview-img' />
            </div>
          </div>
          <div id='step2' class='step step2'>
            <div class='header-title'>
              <div class='header-tip'>2</div>
              <div class='header-name'>获取API证书、API密钥和证书有效期</div>
            </div>
            <div class='content has-border'>
              <p>登录微信支付商户平台（ <el-link type="primary" href="https://pay.weixin.qq.com" target="_blank" :underline='false'>https://pay.weixin.qq.com</el-link>  ），进入【账户中心】->【账号设置】->【API安全】</p>
              <p>2.1、若页面效果如下图，显示证书有效期，可点击“下载证书”按钮，并按页面指引操作即可。可点击“设置密钥”按钮，设置API密钥。</p>
            </div>
            <div class='content-image'>
              <img src='./images/step2.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>2.2、若页面效果如下图，请点击“申请证书”按钮，并查看操作指引完成证书申请。查看证书有效期，设置API密钥。 <el-link type="primary" href="https://kf.qq.com/faq/161222NneAJf161222U7fARv.html" target="_blank" :underline='false'>查看操作指引</el-link>  ）</p>
            </div>
            <div class='content-image'>
              <img src='./images/step3.jpg' class='preview-img' />
            </div>
          </div>
          <div id='step3' class='step step3'>
            <div class='header-title'>
              <div class='header-tip'>3</div>
              <div class='header-name'>开通企微付款到零钱</div>
            </div>
            <div class='content has-border'>
              <p>登录微信支付商户平台（ <el-link type="primary" href="https://pay.weixin.qq.com" target="_blank" :underline='false'>https://pay.weixin.qq.com</el-link>  ），进入【产品中心】->【企业付款到零钱】，点击根据指引开通即可。</p>
            </div>
            <div class='content-image'>
              <img src='./images/step4.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>Q：为什么我在【产品中心】找不到【企业付款到零钱】产品？</p>
              <p>A：需同时满足三个条件，才能看到开通入口：</p>
              <p>1）入驻满足90天；</p>
              <p>2）截止今日往回推30天有连续不间断的交易；</p>
              <p>3）交易需为正常的健康交易。</p>
            </div>
            <div class='content'>
              <p>Q：开通时提示开通失败，请保持健康交易，代表什么含义？</p>
              <p>A：“正常健康交易“是微信支付根据商户行为的综合判断，如不满足，请先保持交易一段时间，并后续再尝试开通。</p>
            </div>
          </div>
          <div class='step step4'>
            <div class='header-title'>
              <div class='header-tip'>4</div>
              <div class='header-name'>将支付商户号相关信息填写到SCRM系统</div>
            </div>
            <div class='content has-border'>
              <p>登录SCRM系统，进入【系统设置】->【授权管理】->【支付配置】，填写对应的授权信息即可</p>
              <p>4.1、填写支付商户号相关信息</p>
            </div>
            <div class='content-image'>
              <img src='./images/step5.jpg' class='preview-img' />
            </div>
            <div id='step4' class='content'>
              <p>4.2、选择关联公众号</p>
              <p>① 登录ECRP cloud系统，进入【系统设置】->【授权管理】->【公众号授权】，授权公众号</p>
              <p class='prompt-text'><span class='yellow-point'></span>公众号必须与企业微信在同一个开放平台</p>
            </div>
            <div class='content-image'>
              <img src='./images/step6.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>② 登录微信支付商户平台，将支付商户号关联公众号</p>
              <p>第一步：商家登录微信支付商户平台</p>
              <p>（ <el-link type="primary" href="https://pay.weixin.qq.com" target="_blank" :underline='false'>https://pay.weixin.qq.com</el-link> ），进入【产品中心】->【AppID账号管理】->【我关联的AppID账号】->【+关联AppID】，新增AppID账号；</p>
            </div>
            <div class='content-image'>
              <img src='./images/step7.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>第二步：填写已完成微信认证的AppID信息，阅读并签署《微信支付商户号与APPID授权协议》，点击“提交”，发起授权申请；</p>
            </div>
            <div class='content-image'>
              <img src='./images/step8.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>第三步： 通知AppID的管理员登录对应的管理后台，确认信息并完成授权。</p>
              <p class='warning'>注意：登录的账号（昵称及AppID）需要与待授权的账号一致，若不一致时无法完成确认流程。</p>
              <p>公众号/订阅号：前往公众平台（ <el-link type="primary" href="https://pay.weixin.qq.com" target="_blank" :underline='false'>https://pay.weixin.qq.com</el-link> ），点击【微信支付】->【商户号管理】，查看相关商户号信息，确认授权申请；</p>
            </div>
            <div class='content-image'>
              <img src='./images/step9.jpg' class='preview-img' />
            </div>
            <div class='content'>
              <p>③ 选择系统中已授权且已关联支付商户号即可</p>
            </div>
            <div class='content-image'>
              <img src='./images/step10.jpg' class='preview-img' />
            </div>
          </div>
        </div>
        <div v-if='!load' style='height:1000px'></div>
      </template>
    </page-edit>
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
  }
}
.hidden {
  display: none;
}
.header-title {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  .header-tip {
    width: 24px;
    height: 24px;
    background: #0091FA;
    border-radius: 50%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .header-name {
    font-size: 14px;
    color: #262626;
    line-height: 22px;
    font-weight: 500;
    margin-left: 8px;
  }
}
.content {
  margin-left: 12px;
  padding-left: 19px;
  font-size: 14px;
  color: #595959;
  position: relative;
  margin-bottom: 24px;
  p{
    line-height: 22px;
  }
  &.has-border::before {
    content: ' ';
    position: absolute;
    top:8px;
    bottom: 8px;
    left: 0;
    background: rgba(0,0,0,0.15);
    width: 1px;
  }
}
.content-image {
  margin-bottom: 24px;
  .preview-img {
    width: 871px;
  }
}
.container {
  padding-left: 18px;
}
.prompt-text {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: #595959;
  .yellow-point {
    background: #F2AA18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
<style scoped>
.content >>> .el-link {
  position: relative;
  top:-2px;
}
</style>
