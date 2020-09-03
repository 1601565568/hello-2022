<template>
  <div>
    <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
      <ElScrollbar ref="fullScreen">
        <div class="message-container modify-card">
          <ElCard shadow="never">
            <div>
              <ElForm label-width="100px">
                <!-- 店铺组件 开始-->
                <ElFormItem label="选择店铺：">
                  <ElFormGrid>
                    已选择<span class="text-primary">{{shopSelectData? shopSelectData.length: 0}}</span>家店铺
                  </ElFormGrid>
                  <ElFormGrid>
                    <NsShopDialog btnTitle="选择店铺" v-model="shopSelectData"></NsShopDialog>
                  </ElFormGrid>
                </ElFormItem>
                <!-- 店铺组件 结束-->
                <!-- 员工组件 开始-->
                <ElFormItem label="">
                  <ElFormGrid>
                    已选择<span class="text-primary">{{employeeSelectData? employeeSelectData.length: 0}}</span>个员工
                  </ElFormGrid>
                  <ElFormGrid>
                    <NsGuideDialog btnTitle="选择员工" dialogTitle="选择员工" v-model="employeeSelectData"></NsGuideDialog>
                  </ElFormGrid>
                </ElFormItem>
                <!-- 员工组件 结束-->

                <ElFormItem label="自动回复间隔：" required>
                  <ElInputNumber class="inputSize" :controls="false" :min="1" :max="60"
                                 v-model.number="replyTimeSpace"></ElInputNumber>&nbsp;min
                  <span class="text-secondary left-space">
                    在自动回复间隔内不会自动重复触发回复，最大可设置60分钟
                  </span>
                </ElFormItem>
                <ElFormItem label="发送延迟设置：" required>
                  <ElInputNumber class="inputSize" :controls="false" :min="1" :max="60"
                                 v-model.number="sendSpaceSet"></ElInputNumber>&nbsp;min
                  <span class="text-secondary left-space">
                    由于网络等原因可能导致智能回复延迟，收到客户消息通过该指定时间后，将不会自动回复，最大可设置60分钟
                  </span>
                </ElFormItem>
                <ElFormItem label="匹配方式：" required>
                  <ElRadioGroup v-model="matchType">
                    <el-radio :label="0">模糊匹配</el-radio>
                    <el-radio :label="1">完全匹配</el-radio>
                    <el-radio :label="2">任意匹配</el-radio>
                  </ElRadioGroup>
                </ElFormItem>
                <ElFormItem label="触发时间：" required>
                  <el-time-picker
                    is-range
                    v-model="replyTime"
                    value-format="HH:mm:ss"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                  </el-time-picker>
                  <span class="text-secondary left-space">
                    在触发时间之外不会进行智能回复
                  </span>
                </ElFormItem>
                <ElFormItem label="聊天关键词：" v-if="matchType != 2" required>
                  <ElFormGrid size="xlg">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 8}"
                      v-model="chatKeyWord">
                    </el-input>
                  </ElFormGrid>
                  <div>
                    <span class="text-secondary left-space">
                      请输入聊天消息关键词，关键词之间用英文逗号隔开，最多输入50个关键词，单个关键词最长20个字。
                    </span>
                  </div>
                </ElFormItem>
                <ElFormItem label="欢迎语内容：" required>
                  <ElFormGrid class="text-secondary">
                    一套欢迎语组最多添加10条欢迎语消息
                  </ElFormGrid>
                </ElFormItem>
                <ElFormItem>
                  <postContent :publishDataFather="publishData" :presetLinkFather="presetLink"/>
                </ElFormItem>
                <!-- 员工组件 结束-->
              </ElForm>
            </div>
          </ElCard>
<!--          <ElCard shadow="never" class="message-container__card">-->
<!--            <div slot="header">欢迎语设置</div>-->
<!--            <div class="message-composition">-->
<!--              <div class="message-composition__left">-->
<!--                <ElForm label-width="100px">-->
<!--                  <ElFormItem label="欢迎语内容：" required>-->
<!--                    <ElFormGrid class="text-secondary">-->
<!--                      一套欢迎语组最多添加10条欢迎语消息-->
<!--                    </ElFormGrid>-->
<!--                  </ElFormItem>-->
<!--                  <ElFormItem>-->
<!--                    <postContent :publishDataFather="publishData" :presetLinkFather="presetLink"/>-->
<!--                  </ElFormItem>-->
<!--                </ElForm>-->
<!--              </div>-->
<!--              <div class="message-composition__right">-->
<!--&lt;!&ndash;                <contentPreview :publishDataFather="publishData"/>&ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--          </ElCard>-->
        </div>
      </ElScrollbar>
      <div class="form-save__unique">
        <NsSave :loading="loading" @click="saveOrUpdateAutoReply"/>
        <NsButton @click="cancelWelcomes">{{$t('operating.cancel')}}</NsButton>
      </div>
    </el-form>
  </div>
</template>

<script>
import edit from './src/edit.js'
import ElCard from '@nascent/nui/lib/card'
import ElTimeSelect from '@nascent/nui/lib/time-select'
import ElInputNumber from '@nascent/nui/lib/input-number'
import postContent from './content/postContent.vue'
import contentPreview from './content/contentPreview.vue'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
edit.components = {
  ElCard,
  ElTimeSelect,
  postContent,
  ElInputNumber,
  contentPreview,
  NsGuideDialog,
  NsShopDialog
}
export default edit
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace message {
    @b container {
      @e card {
        margin-top: var(--default-margin-base);
      }
    }
    @b composition {
      display: flex;
      @e left {
        width: 68%;
        margin-right: var(--default-margin-xlarger);
      }
      @e right {
        flex-shrink: 0;
        margin: 0 auto;
        >>> .el-scrollbar__wrap {
          height: 410px;
          padding-bottom: 20px;
        }
      }
    }
  }

  /* 页面结构标题样式 start*/
  .page-title {
    font-size: var(--default-font-size-base);
    padding-bottom: var(--default-padding-larger);
    font-weight: bold;
  }
  /* 页面结构标题样式 end*/

  /* 底部按钮样式 start*/
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 121px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  /* 底部按钮样式 end*/

  /* 修改el-card的默认样式 start */
  .modify-card {
  >>>.el-card {
    border: 0;
    border-radius: var(--default-radius-mini);
  }
  }
  /* 修改el-card的默认样式 end */
  .dialog-scroll {
  >>> .el-scrollbar__wrap {
    height: 200px;
  }
  }
</style>
