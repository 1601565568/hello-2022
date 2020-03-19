<template>
  <div>
    <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
        <ElScrollbar ref="fullScreen">
          <div class="message-container">
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
                        show-word-limit
                      />
                    </ElFormGrid>
                  </ElFormItem>
                  <ElFormItem label="选择营销人群：" required>
                    <el-form-grid>
                      <ns-button type='text' @click="choosePersonnel">+ 选择员工</ns-button>
                    </el-form-grid>
                    <ElFormGrid>
                      已选择<span class="text-primary">{{tree.selectedData.length}}</span>个员工
                    </ElFormGrid>
                  </ElFormItem>
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
                      <postContent :publishDataFather="publishData"/>
                    </ElFormItem>
                  </ElForm>
                </div>
                <div class="message-composition__right">
                  <contentPreview :publishDataFather="publishData"/>
                </div>
              </div>
            </ElCard>
            <!--选择好友弹窗开始-->
            <ElDialog width="600px" title="选择子码" :visible.sync="dialogVisible" :show-scroll-x=false>
              <ElRow :gutter="10" class="code-container">
                  <ElCol :span="12" class="code-container__item">
                    <div class="code-title">可选员工</div>
                    <ElInput
                      placeholder="请输入员工姓名"
                      suffix-icon="el-icon-search"
                      v-model="tree.select" class="code-space">
                    </ElInput>
                    <ElScrollbar>
                      <ElTree
                        :data="tree.selectData"
                        ref="selectTree"
                        show-checkbox
                        :filter-node-method="selectFilterNode"
                        node-key="id"
                        :default-expand-all="true"
                        :default-checked-keys="tree.selectKeys"
                        :default-expanded-keys="tree.selectedData"
                        @check="check"
                        :props="tree.leftDefaultProps" class="code-space">
                        <span class="code-detail clearfix" slot-scope="{ node, data }">
                          <span class="code-detail__text">{{ node.label }}</span>
                          <span>{{ data.children ? '/' + data.children.length : '' }}</span>
                        </span>
                      </ElTree>
                    </ElScrollbar>
                  </ElCol>
                  <ElCol :span="12" class="code-container__item">
                    <div class="code-title">已选员工</div>
                    <ElInput
                      placeholder="请输入员工姓名"
                      suffix-icon="el-icon-search"
                      v-model="tree.selected" class="code-space">
                    </ElInput>
                    <ElScrollbar>
                      <ElTree
                        :data="tree.selectedData"
                        ref="selectedTree"
                        node-key="id"
                        :expand-on-click-node="false" class="code-space">
                        <span class="code-detail clearfix" slot-scope="{ node, data }">
                          <span class="code-detail__text">{{ node.label }}</span>
                          <span>
                            <ns-button
                              type="text"
                              size="mini"
                              @click="() => remove(node, data)">
                              <Icon type="delete" className="code-delete"/>
                            </ns-button>
                          </span>
                        </span>
                      </ElTree>
                    </ElScrollbar>
                  </ElCol>
                </ElRow>
              <template slot="footer">
                <ns-button @click="dialogVisible = false">取消</ns-button>
                <ns-button type="primary" @click="dialogVisible = false">确定</ns-button>
              </template>
            </ElDialog>
            <!--选择好友弹窗结束-->
          </div>
        </ElScrollbar>
        <div class="form-save__unique">
          <NsSave @click="saveOrUpdateWelcomes"/>
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
edit.components = {
  ElCard,
  ElTimeSelect,
  postContent,
  contentPreview
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

  /* 卡片样式 start*/
  >>> .el-card:last-child {
    border-bottom: none;
  }
  /* 卡片样式 end*/
</style>
