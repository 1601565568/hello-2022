<template>
  <div class="page-main">
      <div class="page-title">导购招募配置</div>
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form label-width="150px" ref="form">
        <!-- 会员招募码配置开始 -->
        <div class="form-grid">
          <div class="form-grid__title">
            <div class="bluepillar"></div>
            导购招募奖励计算设置
          </div>
          <div class="form-grid__content" style="margin-left: -100px">
            <el-form-item size="xxs">
              <el-form-grid>
                <el-radio v-model="model.recruit_type" :label="0" :disabled="status===0" size="xxs">全渠道首次入会时计算招募提成 </el-radio>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid style="padding-left: 10px">
                导购招募为全渠道新会员时，计算导购招募奖励<br/>
                例如： 会员在天猫店铺已经入会，此时导购再次招募，不会计算导购招募奖励
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid>
                <el-radio v-model="model.recruit_type" :label="1" :disabled="status===0" size="xxs">按照平台首次入会时计算招募奖励 </el-radio>

              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid style="padding-left: 10px">
                导购招募为首次在微信平台注册入会成功，则计算招募奖励<br/>
                例如： 会员已经在天猫店铺入会。但是未在微信平台开卡，此时导购再次招募，会计算导购招募奖励
              </el-form-grid>
            </el-form-item>
          </div>
        </div>
        <!-- 会员招募码配置结束 -->
        <div v-if="status === 1" class="form-save__unique">
          <ns-button type="primary" @click="onSave">确定</ns-button>
          <ns-button @click="reload()" >取消</ns-button>
        </div>
      </el-form>
    </el-scrollbar>
    <div class="page-title">门店招募配置</div>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .page-main {
    padding: var(--default-padding-larger);
    background: var(--theme-color-white);
  }
  .page-title {
    height: 32px;
    padding: 0 var(--default-padding-larger);
    line-height: 32px;
    background-color: var(--theme-bg-color-primary);
  }
  .dialog_mian_topText p sapn{
    color:grey;
  }
  .dialog_mian_topText p{
    line-height: 30px;
    height: 30px;
  }
  .form-grid__title {
    font-size: var(--default-font-size-base);
    padding: var(--default-padding-larger) 0;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  .bluepillar {
    width: 4px;
    height: 12px;
    margin-right: var(--default-margin-small);
    background-color: #0091FA;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 61px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  >>> .template-table__bar {
    margin-bottom: 0;
  }
  .form-grid {
    border-radius: var(--default-radius-mini);
  }
</style>
