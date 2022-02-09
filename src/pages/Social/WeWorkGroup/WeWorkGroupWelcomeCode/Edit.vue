<template>
  <PageEdit class="group-welcome">
    <template slot="header">
      <div class="common-header flex-box">
        <h3>{{isEdit ? '编辑群欢迎语' : disabled ? '查看群欢迎语' : '新建群欢迎语'}}</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" @click="onBack" size="large">取消</ns-button>
          <ns-button class="customer-btn_save" v-if="!disabled" @click='onSave' type="primary" size="large">保存</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <SimpleCollapse class="group-simple" :title="'发布设置'">
        <PhoneBox phoneTitle :showPhoneHead="true">
          <template slot='collapse-left'>
            <source-all
              ref='sourceAll'
              :disabled="disabled"
              :detail="detail"
              @list='proviewList'
              @pitContent='proviewPitContent'
              @back="gotoList"
            />
          </template>
          <template slot="collapse-right">
            <MessagePreviewPanel class="message-preivew-panel" imageLabel="image" videoLabel="video" miniAndLinkImageLabel="image" :list="list"/>
          </template>
        </PhoneBox>
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
</style>
