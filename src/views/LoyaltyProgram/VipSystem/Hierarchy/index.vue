<template>
  <div class="form-main" v-loading="saveLoading" element-loading-text="数据保存中...">
    <el-scrollbar ref="hierarchyHeight" outsider>
      <el-form label-width="150px">
        <el-form-item label="会员体系：">
          <el-form-grid>
            <el-form-item>
              <el-switch :disabled="false" v-model="model.gradeStatus" :active-value="1"
                         :inactive-value="0"></el-switch>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules" :model="{model:model ,ratingData: ratingData}"
               :disabled="model.gradeStatus === 0"
               ref='form' v-loading="gradeRuleLoading" :element-loading-text="$t('prompt.loading')">
        <el-form-item label="数据有效范围：">
          <el-radio v-model="dataValidRange" :label="1">
            <el-form-grid>从</el-form-grid>
            <el-form-grid size="xmd">
              <el-form-item prop="model.dateStart">
                <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                :disabled="dataValidRange === 1 ? false : true" v-model="model.dateStart"
                                placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-form-grid>
            <el-form-grid>开始累计</el-form-grid>
          </el-radio>
          <el-radio v-model="dataValidRange" :label="2">
            <el-form-grid>只累计最近</el-form-grid>
            <el-form-grid size="xs">
              <el-form-item prop="model.daysBetween">
                <el-input type="number" v-model="model.daysBetween" :disabled="dataValidRange === 2 ? false : true"
                          placeholder="请输入天数"></el-input>
              </el-form-item>
            </el-form-grid>
            <el-form-grid>天内数据</el-form-grid>
          </el-radio>
        </el-form-item>
        <el-form-item label="支持降级："
                      prop='mobile'>
          <el-switch
            v-model="model.allowSubGrade" :active-value="1" :inactive-value="0">
          </el-switch>
          <template v-if="model.allowSubGrade === 1">
            <el-form-grid>当</el-form-grid>
            <el-form-grid size="xs">
              <el-form-item prop="model.subDays">
                <el-input type="number" v-model="model.subDays" :disabled="model.allowSubGrade === 1 ? false : true"
                          placeholder="请输入天数"></el-input>
              </el-form-item>
            </el-form-grid>
            <el-form-grid>天内未有成功交易自动下降一个会员等级</el-form-grid>
          </template>
        </el-form-item>
        <el-form-item label="排除客户：">
          <el-checkbox v-model="model.isExcludeNoActive" label="排除未激活客户" :true-label="1" :false-label="0"></el-checkbox>
          <el-checkbox v-model="model.isIncludeBlack" label="排除权益黑名单" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <div class="institution-rating">
          <!-- 拖拽等级名称 -->
          <el-row class="institution-rating__head">
            <el-col :span="9">等级名称</el-col>
            <el-col :span="11">等级规则</el-col>
          </el-row>
          <div class="institution-rating__content">
            <el-row v-for="(rating, index) in ratingData" :key="index" class="institution-content__item">
              <el-col :span="9">
                <!--等级名称-->
                <el-form-item label-width="0">
                  <el-form-grid>Lv.{{rating.grade}}</el-form-grid>
                  <el-form-grid>
                    <el-switch
                      v-model="rating.isEnable"
                      @change="val => onChangeGradeEnable(val,index)"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-form-item :prop="'ratingData.' + index + '.gradeName'"
                                  :rules="{validator: (rule,val,call) =>onCheckGradeName(index,val,call),trigger: ['blur','change']}">
                      <el-input :disabled="rating.isEnable === 0" v-model.trim="rating.gradeName"
                                placeholder="请输入等级名称"></el-input>
                    </el-form-item>
                  </el-form-grid>
                  <!--<el-form-grid v-if="index !== 0">-->
                  <!--<ns-button type="primary" size="small" @click="onDeleteMember(index)">删除</ns-button>-->
                  <!--</el-form-grid>-->
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item :key="ruleIndex" v-for="(rule, ruleIndex) in rating.rules">
                  <label slot="label"><span v-if="ruleIndex !== 0 " class="tmp-mark">或</span>{{rule.name}}：</label>
                  <el-form-grid width="110">
                    <el-form-item :prop="'ratingData.' + index + '.rules.' + ruleIndex + '.value'"
                                  :rules="{validator: (rule,val,call) =>onCheckConditions(index,ruleIndex,val,call),trigger: ['blur','change']}">
                      <el-input :disabled="rating.isEnable === 0" type="number" v-model="rule.value"
                                :placeholder="rule.placeholder"></el-input>
                    </el-form-item>
                  </el-form-grid>
                  <el-form-grid>{{rule.unit}}</el-form-grid>
                  <!-- 删除 -->
                  <el-form-grid v-show="rating.rules.length !== 1">
                    <ns-button :disabled="rating.isEnable === 0" @click="onMemberRuleDelete(index, ruleIndex, rule.key)"
                               type="text"><i
                      class="el-icon-delete"></i>
                    </ns-button>
                  </el-form-grid>
                  <!-- end/删除 -->
                  <!-- 添加 -->
                  <el-form-grid v-if="ruleIndex === rating.rules.length - 1">
                    <el-popover placement="right"
                                :key="'popover' + index"
                                popper-class="tmp-popover-add"
                                trigger="click"
                                title="选择条件"
                                @hide="onMemberRulePopoverHide(index)"
                                v-model="rule.popover"
                                width="180">
                      <el-checkbox-group v-model="rating.checkedRules" :min="1" class="tmp-popover-add-checkbox">
                        <el-checkbox v-for="(item, mIndex) in memberRuleCheckData" :key="mIndex"
                                     :label="item.key">{{item.name}}
                        </el-checkbox>
                      </el-checkbox-group>
                      <div class="tmp-popover-add-footer">
                        <ns-button size="mini"
                                   @click="rule.popover = false">取消
                        </ns-button>
                        <ns-button type="primary" size="mini"
                                   @click="rule.popover = false, onMemberRuleSaveCheck(index)">确定
                        </ns-button>
                      </div>
                      <ns-button :disabled="rating.isEnable === 0" slot="reference" type="text"><i
                        class="el-icon-circle-plus"></i></ns-button>
                    </el-popover>
                  </el-form-grid>
                </el-form-item>
                <el-form-item class="institution-form__nolabel">
                  <label slot="label"><span class="tmp-mark">或</span>购买了以下任意商品：</label>
                  <el-form-item>
                    <ns-goods-select v-model="rating.arbitrarilyGoods"></ns-goods-select>
                  </el-form-item>
                </el-form-item>
                <el-form-item class="institution-form__nolabel">
                  <label slot="label"><span class="tmp-mark">且</span>购买了以下全部商品：</label>
                  <el-form-item>
                    <ns-goods-select v-model="rating.allGoods"></ns-goods-select>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div class="form-save__unique">
      <ns-save :loading="saveBtnLoading" @click="onSave"></ns-save>
      <ns-button @click="onReset">{{$t('operating.reset')}}</ns-button>
    </div>
  </div>
</template>

<script>
  import Index from './src/index'
  import NsGoodsSelect from 'components/NsGoodsSelect'

  Index.components = {
    NsGoodsSelect
  }
  export default Index
</script>
<style scoped>
  @import "../../../../style/small/variables.pcss";

  .form-save__unique {
    padding: 5px 5px 0 150px;
    border-top: 1px solid var(--theme-base-border-color-primary);
  }

  .form-main {

  >>> .el-radio {
    line-height: inherit;
  }

  }
  @component-namespace institution {
    @b rating {
      border-top:

    1px solid

    var(--theme-base-border-color-primary

    );
      border-left:

    1px solid

    var(--theme-base-border-color-primary

    );
      border-right:

    1px solid

    var(--theme-base-border-color-primary

    );
      @e head {
        background-color:

      var(--theme-bg-color-primary

      );
        .el-col {
          padding: var(--default-padding-small) var(--default-padding-small) var(--default-padding-small) var(--default-padding-base);
          font-size: var(--default-font-size-base);
          line-height: 22px;
        }
      }
      @e content {
        @b content {
          @e item {
            padding:

          var(--default-padding-base

          );
            border-top:

          1px solid

          var(--theme-base-border-color-primary

          );
            >>> .el-col {

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
        >>> .el-form-item {

      &:last-child {
         margin-bottom: 0;
       }
      }
      .tmp-mark {
        float: left;
        margin: 6px 0;
        font-size: var(--default-font-size-small);
        font-weight: bold;
        color: var(--theme-color-primary);
        background: var(--theme-color-white);
        padding: 0 2px;
        line-height: 16px;
      }
    }
  }
  }
  }
  }
  .tmp-popover-add-checkbox {

  .el-checkbox {
    margin: 0;
  }

  }
  .tmp-popover-add-footer {
    padding-top: var(--default-padding-small);
    text-align: right;
  }
</style>
