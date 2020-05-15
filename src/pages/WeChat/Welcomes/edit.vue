<template>
  <div>
    <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
        <ElScrollbar ref="fullScreen">
          <div class="message-container modify-card">
            <ElCard shadow="never">
              <div>
                <ElForm label-width="100px">
                  <ElFormItem label="欢迎语标题：" required>
                    <ElFormGrid size="xlg">
                      <ElInput
                        type="text"
                        placeholder="请输入欢迎语标题"
                        v-model="title"
                        maxlength="30"
                        :input="title=title.replace(/(^\s*)|(\s*$)/g, '')"
                        show-word-limit
                      />
                    </ElFormGrid>
                  </ElFormItem>
                  <!-- 员工组件 开始-->
                  <ElFormItem label="选择营销人群：">
                    <ElFormGrid>
                      <NsEmployeeOrCustGroupDialog btnTitle="选择营销人群" v-model="employeeSelectData"></NsEmployeeOrCustGroupDialog>
                    </ElFormGrid>
                    <ElFormGrid>
                      已选择<span class="text-primary">{{employeeSelectData? employeeSelectData.length: 0}}</span>个导购员工
                    </ElFormGrid>
                  </ElFormItem>
                  <!-- 员工组件 结束-->
                </ElForm>
              </div>
            </ElCard>
            <ElCard shadow="never" class="message-container__card">
              <div slot="header">欢迎语设置</div>
              <div class="message-composition">
                <div class="message-composition__left">
                  <ElForm label-width="100px">
                    <ElFormItem label="欢迎语内容：" required>
                      <ElFormGrid class="text-secondary">
                        一套欢迎语组最多添加10条欢迎语消息
                      </ElFormGrid>
                    </ElFormItem>
                    <ElFormItem>
                      <postContent :publishDataFather="publishData" :presetLinkFather="presetLink"/>
                    </ElFormItem>
                  </ElForm>
                </div>
                <div class="message-composition__right">
                  <contentPreview :publishDataFather="publishData"/>
                </div>
              </div>
            </ElCard>
          </div>
        </ElScrollbar>
        <div class="form-save__unique">
          <NsSave :loading="loading" @click="saveOrUpdateWelcomes"/>
          <NsButton @click="cancelWelcomes">{{$t('operating.cancel')}}</NsButton>
        </div>
      </el-form>
  </div>
</template>

<script>
import edit from './src/edit.js'
import ElCard from '@nascent/nui/lib/card'
import ElTimeSelect from '@nascent/nui/lib/time-select'
import postContent from './content/postContent.vue'
import contentPreview from './content/contentPreview.vue'
import { getErrorMsg } from '@/utils/toast'
import NsEmployeeOrCustGroupDialog from './../../../components/NsGuideDialog'
edit.components = {
  ElCard,
  ElTimeSelect,
  postContent,
  contentPreview,
  NsEmployeeOrCustGroupDialog
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
        margin-right: var(--default-margin-xlarge);
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
