<template>
  <div class="template-page">
   <ns-table-grade-benefit-setting ref="table" @add="onAdd"
                                    @benefit-update="onUpdateBenefit">

    </ns-table-grade-benefit-setting>
    <el-dialog :title="manageType === 1?'添加权益':'修改权益'" :visible.sync="visible" v-loading="saveBenefitLoading" element-loading-text="正在保存..."
               :close-on-click-modal="false"  :before-close="onCloseDialog" width="30%">
      <el-form label-width="90px" :model="{selectedBenefitType:selectedBenefitType,benefitModel:benefitModel ,benefitRuleList: benefitRuleList}"
                 ref='form' :rules="rules"
                 v-loading="gradeBenefitLoading"  :element-loading-text="$t('prompt.loading')">
          <el-form-item  v-show = "manageType === 1" label="选择权益："  required>
            <el-form-grid size="xmd">
              <el-form-item prop = "selectedBenefitType">
                <el-select @change="onBenefitChange" v-model="selectedBenefitType"  :placeholder="$t('prompt.select')">
                  <el-option v-for="benefit in benefitOption" :key="benefit.typecd" :label="benefit.typename" :value="benefit.typecd"></el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="权益名称："  required>
            <el-form-grid size="xmd">
             <el-form-item  prop = "benefitModel.grade_benefit_name">
                <el-input type="text" v-model.trim = "benefitModel.grade_benefit_name" placeholder="请输入权益名称">
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <div v-show = "formVisible === true">
           <!-- <div v-show = "selectedBenefitType !== undefined && selectedBenefitType!==''">-->
            <div class="institution-rating">
              <!-- 拖拽等级名称 -->
              <el-row class="institution-rating__head">
                <el-col :span="7">会员等级</el-col>
                <el-col :span="17">权益明细</el-col>
              </el-row>
              <div class="institution-rating__content">
                <el-row v-for="(benefitRule, index) in benefitRuleList" :key="index" class="institution-content__item" v-show="benefitRule.ruleDetailState === 1">
                    <el-col :span="7">
                      <el-form-item label-width="0">
                        <el-form-grid>{{ benefitRule.gradeName}}</el-form-grid>
                      </el-form-item>
                    </el-col>
                    <el-col :span="17" >
                      <el-form-item label-width="0">
                        <template v-for="(handleItem, contentIndex) in benefitRule.handleRuleContent">
                          <!-- 输入框类型 -->
                          <template v-if="handleItem.type == 2" >
                            <el-form-grid size="xs">
                              <el-form-item :rules="{validator: (rule,val,call) =>onCheckConditions(benefitRule.ruleDetailState,handleItem.regexStr,handleItem.alertMsg,val,call),trigger: ['blur','change']}" :prop="'benefitRuleList.'+ index + '.handleRuleContent.' + contentIndex + '.value'">
                                <el-input type="text" v-model.trim = "handleItem.value" placeholder="" class="text-right">
                                  <template v-if ="handleItem.showSupWord === true" slot="append">{{handleItem.supplementWord}}</template>
                                </el-input>
                              </el-form-item>
                            </el-form-grid>
                          </template>
                          <!-- 下拉框类型 -->
                          <template v-else-if="handleItem.type == 1">
                            <el-form-grid size="xs">
                              <el-select v-model="handleItem.value"  @change="onHandleItemChange(contentIndex,index)" :placeholder="$t('prompt.select')">
                                <el-option v-for="item in handleItem.selectItems" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                            </el-form-grid>
                          </template>
                          <template v-else-if="handleItem.type == 99">
                            {{handleItem.text}}
                          </template>
                          <template v-else>
                            {{handleItem.text}}
                          </template>

                        </template>

                      </el-form-item>
                    </el-col>
                </el-row>
              </div>
            </div>
            <template v-for="(desc, index) in benefitModel.descArr">
              <div class="tmp-tips text-info"><i class="el-icon-info"></i>
                <span class="description-main__content" v-html="desc"></span>
              </div>
            </template>

          </div>

        </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" ></ns-save>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import NsTableGradeBenefitSetting from './NsTableGradeBenefitSetting'
  import index from './src/index'
  // import {NsShopSelect, NsDroptree} from 'components'
  index.components = {
    NsTableGradeBenefitSetting
  }
  export default index
</script>

<style scoped>
  @import "../../../../style/small/variables.pcss";
  @component-namespace institution {
    @b rating {
      border: 1px solid var(--theme-base-border-color-primary);
      @e head {
        border-bottom: 1px solid var(--theme-base-border-color-primary);
        background-color: var(--theme-bg-color-primary);
        .el-col {
          padding: var(--default-padding-small) var(--default-padding-small) var(--default-padding-small) var(--default-padding-base);
          font-size: var(--default-font-size-small);
          line-height: 20px;
        }
      }
      @e content {
        @b content {
          @e item {
            padding: var(--default-padding-base);
            border-bottom: 1px solid var(--theme-base-border-color-primary);
            .el-col {
              &:first-child {
                .el-form {
                  position: absolute;
                  top: 50%;
                  transform: translate(0, -50%);
                }
              }
              &:last-child {
                 float: right;
               }
            }
            .el-form-item {
              &:last-child {
                 margin-bottom: 0;
             }
            }
            .tmp-mark {
              font-size: var(--default-font-size-small);
              color: var(--theme-color-primary);
              border: 1px solid var(--theme-base-border-color-primary);
              background: var(--theme-color-white);
              padding: 0 2px;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  @component-namespace description {
    @b main {
      margin-top: var(--default-margin-base);
      @e title {
        font-size: var(--default-font-size-middle);
      }
      @e content {
        font-size: var(--default-font-size-small);
        line-height: 1.8;
      }
    }
  }
  .tmp-popover-add-footer {
    padding-top: var(--default-padding-small);
    text-align: right;
  }
  .institution-content__item{
    &:last-child{
      border-bottom-color: transparent;
    }
  }
</style>
