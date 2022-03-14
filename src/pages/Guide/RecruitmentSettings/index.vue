<template>
  <div>
    <ElScrollbar ref="fullScreen" class="recruit-container">
      <div class="recruit-container__card">
        <div class="recruit-title">导购招募配置</div>
        <div class="recruit-content">
          <div class="recruit-content__caption">导购招募奖励计算设置</div>
          <ElRadioGroup v-model="model.secruitment_type" class="recruit-content__radiogroup" :class="[radioBOX==='QA'?radioQA:radio]">
            <ElForm>
              <ElFormItem v-for="item in radioList" :key="item.id" class="option">
                <ElRadio  :label="item.value">{{item.label}}</ElRadio>
                <ElFormItem class="recruit-prompt">
                  <ElFormGrid class="text-secondary recruit-prompt__space">{{item.explain}}</ElFormGrid>
                  <ElFormGrid class="text-secondary recruit-prompt__space">{{item.example}}</ElFormGrid>
                </ElFormItem>
              </ElFormItem>
            </ElForm>
          </ElRadioGroup>
        </div>
      </div>
     <!-- <div class="recruit-container__card recruit-container__card&#45;&#45;topspace">
        <div class="recruit-title">门店招募配置</div>
        <div class="recruit-content recruit-content&#45;&#45;flex">
          <div class="recruit-example">
            <img :src="model.sign_up_url" alt="示例图片" class="recruit-example__img"/>
            <div class="recruit-example__btn">立即开卡</div>
          </div>
          <div class="recruit-detail">
            <div class="recruit-detail__heading">设置门店招募开卡页面：</div>
            <div class="recruit-detail__explanation">会员开卡页面：</div>
            <ElUpload
              :action="this.$api.core.sgUploadFile('test')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" class="recruit-detail__upload">
              <img v-if="model.sign_up_url" :src="model.sign_up_url" class="recruit-avatar">
              <Icon type="plus" className="recruit-tip" v-else/>
            </ElUpload>
            <div class="text-secondary">建议图片尺寸：750*1334大小；</div>
            <div class="text-secondary">场景说明：用户扫门店招募码，进入此页面。点击“立即开卡”，进入开卡录入信息页面。</div>
          </div>
        </div>
      </div>-->
    </ElScrollbar>
    <div class="form-save__unique">
      <NsButton type="primary" @click="update">保存</NsButton>
    </div>
  </div>
</template>
<script>
import index from './src/index'

export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace recruit {
    @b container {
      @e card {
        background: var(--theme-color-white);
        border-radius: var(--default-radius-mini);
        @m topspace {
          margin-top: var(--default-margin-small);
        }
      }
    }
    @b title {
      font-size: var(--default-font-size-base);
      font-weight: bold;
      padding: var(--default-padding-larger) 20px;
      border-bottom: 1px solid var(--theme-base-border-color-primary);
    }
    @b content {
      padding: 20px;
      @e caption {
        font-size: var(--default-font-size-base);
        font-weight: bold;
      }
      @e radiogroup {
        margin-top: var(--default-margin-xlarger);
      }
      @m flex {
        display: flex;
      }
    }
    @b prompt {
      @e space {
        margin-left: 17px;
      }
      >>> .el-form-item__content {
        line-height: 15px;
      }
    }
    @b example {
      width: 320px;
      max-height: 569px;
      position: relative;
      flex-shrink: 0;
      @e img {
        width: 100%;
        height: 100%;
      }
      @e btn {
        font-size: var(--default-font-size-base);
        color: var(--theme-color-white);
        text-align: center;
        padding: 13px 20px;
        width: 294px;
        position: absolute;
        bottom: 25px;
        left: 13px;
        background: #009900;
        border-radius: var(--default-radius-small);
      }
    }
    @b detail {
      flex: 1;
      margin-left: 20px;
      @e explanation {
        font-size: var(--default-font-size-base);
        margin-top: var(--default-margin-xlarger);
      }
      @e heading {
        font-size: var(--default-font-size-base);
        font-weight: bold;
      }
      @e upload {
        height: 100px;
        margin:  var(--default-margin-larger) 0;
        >>> .el-upload {
          width: 100px;
          height: 100px;
          position: relative;
          border: 1px dashed var(--theme-base-border-color-primary);
          border-radius: var(--default-radius-mini);
          &:hover {
             border-color: var(--theme-color-primary-light);
           }
        }
      }
    }
    @b tip {
      font-size: 24px;
      color: var(--theme-base-border-color-primary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    @b avatar {
      width: 100px;
      height: 100px;
    }
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 20px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  .radioQA>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #2153D4;
  background: #2153D4;
}
.radio>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #0091FA;
  background: #0091FA;
}
.radioQA>>> .el-radio__input.is-checked + .el-radio__label{
  color: #2153D4;
}
.radio>>>.el-radio__input.is-checked + .el-radio__label{
  color: #0091FA;
}
</style>
