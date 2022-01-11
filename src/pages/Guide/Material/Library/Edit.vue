<template>
  <PageEdit>
    <template slot="header">
      <div class="common-header flex-box">
        <h3>{{isEdit ? '编辑素材' : '新建素材'}}</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" @click="onBack" size="large">取消</ns-button>
          <ns-button class="customer-btn_save" @click='onSave' type="primary" size="large">保存</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <SimpleCollapse :title="'素材配置'">
        <PhoneBox phoneTitle phoneBar="素材库">
          <template slot='collapse-left'>
            <source-all
              ref='sourceAll'
              :isEdit="isEdit"
              :detail="detail"
              :labelList="labelList"
              :breadcrumb="breadcrumb"
              @toggleLabel="toggleLabel"
              @list='proviewList'
              @title='proviewTitle'
              @subdivision='proviewSubdivision'
              @pitContent='proviewPitContent'
              @togglePreview="togglePreview"
              @back="gotoList"
            />
          </template>
          <template slot="collapse-right">
            <MessagePreviewPanel
              :list='list'
              :title='title'
              :subdivision='subdivision'
              :pitContent='pitContent'
            />
          </template>
        </PhoneBox>
        <label-add ref="labelAdd" @submit="getLabelList"></label-add>
      </SimpleCollapse>
    </template>
  </PageEdit>
</template>
<script>
import Index from './src/edit'
export default Index
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @import "@components/NewUi/styles/reset.css";
  @import "./styles/reset.css";
  @component-namespace library {
    @b wrapper {
      padding: 20px 0 0;
      background: #fff;
      >>> .library-icon__extra {
        font-size: var(--default-font-size-small);
        color: #0392fb;
        cursor: pointer;
        svg + span {
          margin-left: var(--default-margin-small);
        }
      }
      >>> .library-footer {
        padding: 5px 0 5px 120px;
        border-top: 1px solid var(--theme-base-border-color-primary);;
        button + button {
          margin-left: var(--default-margin-larger);
        }
      }
      >>> .el-tabs__header {
        margin: 0 20px;
      }
      >>> .el-tabs__nav {
        border: none;
        .el-tabs__item {
          padding: var(--default-padding-base) 20px;
          font-size: var(--default-font-size-small);
          color: #303133;
          font-weight: normal;
          line-height: var(--default-font-line-height);
          border-style: solid;
          border-color: var(--theme-base-border-color-primary);
          border-bottom: none;
          border-width: 1px 1px 0 1px;
          &:first-child {
            border-width: 1px 0 0 1px;
            border-radius: var(--default-radius-mini) 0 0 0;
          }
          &:last-child {
            border-width: 1px 1px 0 0;
            border-radius: 0 var(--default-radius-mini) 0 0;
          }
          &.is-active {
            color: #fff;
            border-color: var(--head-nav-bg);
            background-color: var(--head-nav-bg);
          }
        }
      }
      >>> .el-tabs__content {
        .el-form {
          padding: 20px;
        }
        .el-form-item {
          margin-bottom: var(--default-margin-larger);
          .el-form-item__label {
            font-size: var(--default-font-size-base);
            color: var(--theme-font-color-regular);
          }
          .el-select + .library-icon__extra {
            margin-left: var(--default-margin-larger);
          }
          .el-textarea__inner {
            height: 90px;
          }
        }
      }
    }
  }
</style>
