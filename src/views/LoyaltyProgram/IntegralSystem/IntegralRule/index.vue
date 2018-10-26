<template>
  <div class="form-main" v-loading="loading" element-loading-text="正在加载......">
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form label-width="150px">
        <el-form-item label="是否启用：">
          <el-switch v-model="model.ruleStatus" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" ref="form" :model="model" :rules="rules"
               :disabled="model.ruleStatus === 0 ? true : false">
        <!--交易送积分规则-->
        <div class="form-grid">
          <div class="form-grid__title">交易送积分规则</div>
          <div class="form-grid__content">
            <el-form-item label="积分赠送规则：">
              <el-form-grid>
                每成功交易一元赠送
              </el-form-grid>
              <el-form-grid size="xxs">
                <el-form-item prop="integralValue">
                  <el-input type="number" v-model="model.integralValue"></el-input>
                </el-form-item>
              </el-form-grid>
              <el-form-grid>
                积分
              </el-form-grid>
            </el-form-item>
            <el-form-item label="积分赠送上限：">
              <el-form-grid>
                单笔交易额最高赠送
              </el-form-grid>
              <el-form-grid size="xxs">
                <el-form-item prop="integralLimit">
                  <el-input type="number" v-model="model.integralLimit"></el-input>
                </el-form-item>
              </el-form-grid>
              <el-form-grid>
                积分
              </el-form-grid>
            </el-form-item>
            <el-form-item label="积分生效日期：">
              <el-form-grid>
                交易成功（线上交易确认收货）之后的
              </el-form-grid>
              <el-form-grid size="xxs">
                <el-form-item prop="tradeStatusDay">
                  <el-input type="number" v-model="model.tradeStatusDay"></el-input>
                </el-form-item>
              </el-form-grid>
              <el-form-grid>
                天后生效
              </el-form-grid>
            </el-form-item>
            <el-form-item label="积分取整：">
              <el-form-grid size="xmd">
                <el-form-item>
                  <el-select v-model="model.integralRound">
                    <el-option v-for="(round,index) in integralRound" :key="index" :label="round.label"
                               :value="round.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
        </div>
        <!--积分过期规则（过期的积分将自动清零）-->
        <div class="form-grid">
          <div class="form-grid__title">积分过期规则（过期的积分将自动清零）</div>
          <div class="form-grid__content">
            <el-form-item label="积分有效期：">
              <el-radio-group v-model="model.effectiveType">
                <el-form-item>
                  <el-radio :label="0">
                    <el-form-grid>积分生效</el-form-grid>
                    <el-form-grid size="xxs">
                      <el-form-item prop="effectiveLength">
                        <el-input type="number" v-model="model.effectiveLength"
                                  :disabled="model.effectiveType !== 0"></el-input>
                      </el-form-item>
                    </el-form-grid>
                    <el-form-grid>天后过期</el-form-grid>
                  </el-radio>
                </el-form-item>
                <el-form-item>
                  <el-radio :label="1">
                    <el-form-grid>积分生效后</el-form-grid>
                    <el-form-grid size="xs">
                      <el-select v-model="model.yearNum" :disabled="model.effectiveType === 0">
                        <el-option label="当年" :value="0"></el-option>
                        <el-option label="次年" :value="1"></el-option>
                      </el-select>
                    </el-form-grid>
                    <el-form-grid>的</el-form-grid>
                    <el-form-grid width="100">
                      <el-form-item prop="monthDay">
                        <el-date-picker v-model="model.monthDay" type="dateday"
                                        value-format="MM-dd"
                                        :picker-options="pickerOptions"
                                        :disabled="model.effectiveType === 0"></el-date-picker>
                      </el-form-item>
                    </el-form-grid>
                    <el-form-grid>过期</el-form-grid>
                  </el-radio>
                </el-form-item>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <!--排除规则-->
        <div class="form-grid">
          <div class="form-grid__title">排除规则</div>
          <div class="form-grid__content">
            <!--<el-form-item label="积分取整：">-->
            <!--<el-form-grid>-->
            <!--<el-form-item>-->
            <!--<el-checkbox v-model="model.isExcludeNoActive" :true-label="1" :false-label="0">-->
            <!--排除未激活会员-->
            <!--</el-checkbox>-->
            <!--<el-checkbox v-model="model.isExcludeBlack" :true-label="1" :false-label="0">-->
            <!--排除权益黑名单客户-->
            <!--</el-checkbox>-->
            <!--</el-form-item>-->
            <!--</el-form-grid>-->
            <!--</el-form-item>-->
            <el-form-item label="排除商品：">
              <el-form-grid>
                <el-form-item>
                  <ns-goods-select v-model="model.itemConditionJson"></ns-goods-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="排除店铺：">
              <el-form-grid>
                <el-form-item>
                  <ns-shop-select v-model="model.shopIds"></ns-shop-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
        </div>
        <!--通知方式-->
        <div class="form-grid border-bottom__none">
          <div class="form-grid__title">通知方式</div>
          <div class="form-grid__content">
            <el-form-item label="通知方式：" prop="careContentJson">
              <el-checkbox-group v-model="model.careWays" class="checkbox-noLabel" @change="onCareWaysChange">
                <span v-for="(option ,index) in  careWayBtnList" :key="index" class="checkbox-noLabel__btn">
                  <el-checkbox :label="option.value"
                               @change="(checked) =>onCheckCareWay(checked,option.value)"></el-checkbox>
                  <ns-button :class="currCareWay === option.value ? 'selectedItem__primary' : ''"
                             @click="onMouseMoveCareWay(option.value)">
                    {{option.label}}
                  </ns-button>
                </span>
              </el-checkbox-group>
            </el-form-item>
            <template v-if="model.careWays && model.careWays.length > 0">
              <el-form-item label="关怀内容：">
                <!--短信-->
                <div v-show="currCareWay === 'sms'">
                  <el-form-item label-width="80px" label="短信模板：">
                    <el-form-grid size="xmd">
                      <el-form-item>
                        <el-select v-model="model.smsTemplateId" clearable="" @change="onChangeSmsTemplate">
                          <el-option v-for="(option ,index) in  smsTemplateData"
                                     :key="index"
                                     :label="option.label"
                                     :value="option.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="短信内容：" required>
                    <el-form-grid size="xlg">
                      <el-form-item prop="smsContent">
                        <ns-sms-template ref="smsTemplate" v-model="model.smsContent" :signature="model.smsSignature"
                                         :tags="tags"></ns-sms-template>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="短信签名：" required>
                    <el-form-grid size="xmd">
                      <el-form-item prop="smsSignature">
                        <ns-select :is-default="model.smsSignature ? false : true" v-model="model.smsSignature"
                                   :url="$api.core.common.getSmsSignatures"></ns-select>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                </div>
                <!--微信-->
                <div v-show="currCareWay === 'weChat'">
                  <el-form-item label-width="80px" label="微信模板：" required>
                    <el-form-grid size="xmd">
                      <el-form-item prop="weChatTemplateId">
                        <el-select v-model="model.weChatTemplateId" @change="onChangeWeChatTemplate">
                          <el-option v-for="(option ,index) in  weChatTemplateData"
                                     :key="index"
                                     :label="option.label"
                                     :value="option.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="内容：">
                    <el-form-grid size="xmd">
                      <el-form-item prop="weChatContent">
                        <el-input v-model.trim="model.weChatContent"></el-input>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="备注：">
                    <el-form-grid size="xmd">
                      <el-form-item prop="weChatRemark">
                        <el-input type="textarea" v-model.trim="model.weChatRemark"></el-input>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="详情链接：">
                    <el-form-grid size="xmd">
                      <el-form-item prop="weChatLink">
                        <el-input v-model.trim="model.weChatLink"></el-input>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" v-if="model.weChatTemplateId > 0" label="效果预览："
                                class="el-inline-block">
                    <el-form-grid size="lg">
                      <el-form-item>
                        <div class="receive-part">
                          <p class="font-size-middle">{{weChatTempContent.wxTemplateName }}</p>
                          <p class="text-secondary font-size-small">{{getCurrDateFormat()}}</p>
                          <p class="margin-base-t text-info">{{model.weChatContent}}</p>
                          <p style="margin-top: 10px"
                             v-for="(tag ,index) in weChatTempContent.templateTags" :key="index">
                            {{tag.wxTagName}}：<span
                            class="text-info">{{tag.wxTagExample}}</span></p>
                          <p class="text-info">{{model.weChatRemark}}</p>
                          <a class="more-info" v-if="model.weChatLink" :href="model.weChatLink" target="_blank">详情</a>
                          <a class="more-info" v-else>详情</a>
                        </div>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                </div>
                <!--邮件-->
                <div v-show="currCareWay === 'email'">
                  <el-form-item label-width="80px" label="邮件模板：" required>
                    <el-form-grid size="xmd">
                      <el-form-item prop="emailTemplateId">
                        <el-select v-model="model.emailTemplateId" @change="onChangeEmailTemplate">
                          <el-option v-for="(option ,index) in  emailTemplateData"
                                     :key="index"
                                     :label="option.label"
                                     :value="option.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item label-width="80px" label="邮件内容：" required>
                    <el-form-grid size="xxlg">
                      <el-form-item prop="emailContent">
                        <vue-ueditor-wrap v-model.trim="model.emailContent"
                                          :config="ueditorConfig"></vue-ueditor-wrap>
                      </el-form-item>
                    </el-form-grid>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="调度机制：" required>
                <el-form-grid size="xmd">
                  <el-radio-group v-model="model.isAllSchedule">
                    <el-form-item>
                      <el-radio :label="1">已选关怀方式全部发送</el-radio>
                    </el-form-item>
                    <el-form-item prop="scheduleOrder">
                      <el-radio :label="0">
                        按
                        <el-form-grid size="md">
                          <el-select v-model="model.scheduleOrder" :disabled="model.isAllSchedule === 1">
                            <el-option v-for="(option ,index) in  dispatchData"
                                       :key="index"
                                       :label="option.label"
                                       :value="option.value"></el-option>
                          </el-select>
                        </el-form-grid>
                        顺序发送，已发送的客户不再另外发送
                      </el-radio>
                    </el-form-item>
                  </el-radio-group>
                </el-form-grid>
              </el-form-item>
            </template>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div class="form-save__unique">
      <ns-save :loading="saveBtnLoading" @click="onSave"></ns-save>
    </div>
  </div>
</template>

<script>
  import Index from './src/index'
  import NsGoodsSelect from 'components/NsGoodsSelect'
  import NsShopSelect from 'components/NsShopSelect'
  import NsSmsTemplate from 'components/NsSmsTemplate'
  import VueUeditorWrap from 'vue-ueditor-wrap'

  Index.components = {
    NsGoodsSelect,
    NsShopSelect,
    NsSmsTemplate,
    VueUeditorWrap
  }
  export default Index
</script>

<style scoped>
  @import "../../../../style/small/variables.pcss";

  >>> .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }

  .form-save__unique {
    padding: 5px 5px 0 150px;
    border-top: 1px solid var(--theme-base-border-color-primary);
  }

  .form-grid {
    margin: 0;

  &
  .border-bottom__none {
    border-bottom-color: transparent;
  }

  }
  .form {

  >>> .el-radio {
    line-height: inherit;
  }

  .el-block + .el-block {
    margin-top: 22px;
  }

  }
  @component-namespace form {
    @b grid {
      border:

    1px solid

    var(--theme-base-border-color-primary

    );
    & + .el-form-item {
        margin-top: var(--default-margin-xlarger);
      }

      @e title {
        height: 32px;
        padding-left: var(--default-padding-larger);
        line-height: 32px;
        background-color: var(--theme-bg-color-primary);
      }
      @e content {
        padding: var(--default-padding-base) 0;
      }
    }
  }
  .receive-part {
    line-height: 20px;
    border: 1px solid var(--theme-base-border-color-primary);
    padding: var(--default-margin-base) var(--default-margin-larger);
  }

  .more-info {
    margin-top: var(--default-margin-base);
    border-top: 1px solid var(--theme-base-border-color-primary);
    padding-top: var(--default-margin-base);
    display: block;
    cursor: pointer;
  }

  @component-namespace form {
    @b grid {
      border:

    1px solid

    var(--theme-base-border-color-primary

    );
    & + .form-grid {
        border-top: none;
      }

    & + .el-form-item {
        margin-top: var(--default-margin-xlarger);
      }

      @e title {
        height: 32px;
        padding: 0 var(--default-padding-larger);
        line-height: 32px;
        background-color: var(--theme-bg-color-primary);
      }
      @e content {
        padding:

      var(--default-padding-base

      ) 0 0;
        >>> .el-radio-group {
          line-height: 1;
        }

        .el-form-item {

        .el-form-item {
          margin-bottom: var(--default-margin-base);
        }

        .el-form-grid {

        .el-form-item {
          margin-bottom: 0;
        }
      }
      >>> .checkbox-noLabel {

      .checkbox-noLabel__btn {
        position: relative;
        display: inline-block;
        margin-right: var(--default-margin-larger);

      .el-checkbox {
        position: absolute;
        left: 9px;
        top: -1px;

      .el-checkbox__label {
        display: none;
      }
    }
  }
  .el-button {
    padding: 7px 10px 7px 30px;

  &
  .selectedItem__primary {
    border: 1px solid var(--theme-color-primary);
  }

  }
  }
  }
  }
  }
  }
</style>
