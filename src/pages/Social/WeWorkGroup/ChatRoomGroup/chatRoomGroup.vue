<template>
  <div style="background-color: white" class="base-border-radius">
    <el-form label-width="150px" ref="form">
      <!-- 会员招募码配置开始 -->
      <div class="form-grid">
        <div class="form-grid__title">
          <div class="bluepillar"></div>
          {{ title }}
        </div>
        <div class="form-grid__content">
          <el-form-item label="标题：" required>
            <el-form-grid size="xlg">
              <el-input
                type="text"
                placeholder="请输入群聚合码标题"
                v-model="model.remark"
                maxlength="20"
                show-word-limit
                onkeyup="this.value=this.value.replace(/\s+/g,'')"
              />
            </el-form-grid>
          </el-form-item>
          <el-form-item label="可加入的群聊：" required>
            <el-form-grid class="el-form__grid--special" >
              <NsChatRoomDialog :selectedMax="isWhiteList ? 100 : 5" btnTitle="选择已有群聊" :selectedDataParent="model.checkedChatRoom" @getChatRoomData="getChatRoomData"></NsChatRoomDialog>
              <div  class="form-grid__tips" :class="[ messageQA==='QA'? messageIconQA : messageIcon]">
                <Icon type="tishi"/>
                <span>选择多个群聊时，微信用户扫码后会随机加入一个群聊</span>
              </div>
            </el-form-grid>
          </el-form-item>
          <ElFormItem :rules="rules">
            <div class="form-chat__table" >
              <ElTable :data="model.checkedChatRoom">
                <ElTableColumn prop="style" label="群名称" :min-width="120">
                  <template slot-scope="scope">
                    {{scope.row.name || '-'}}
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="style" label="群主" :min-width="160" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{scope.row.ownerName || '-'}}{{scope.row.ownerWorkNum ? '('+ scope.row.ownerWorkNum +')':''}}
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="personNum" label="成员数" :min-width="80">
                  <template slot-scope="scope">
                    {{scope.row.personNum}}
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="workShopName" label="群主工作门店" :min-width="200" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{scope.row.workShopName}}
                  </template>
                </ElTableColumn>
                <ElTableColumn label="操作" align="center" :width="80">
                  <template slot-scope="scope">
                    <ns-button type="text" size="small" @click="handleDelete(scope)">删除</ns-button>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </ElFormItem>
          <el-form-item label="自动建群：" required>
            <el-form-grid class="el-form__grid--special" :class="[messageQA==='QA'? radioboxQA:radiobox]">
              <el-switch :active-value="1" :inactive-value="0" v-model="model.autoCreateRoom"></el-switch>
              <div class="form-grid__tips" :class="[ messageQA==='QA'? messageIconQA : messageIcon]">
                <Icon type="tishi"/>
                <span>开启后，已选群聊群人数达到上限，将以原群主身份自动创建新群</span>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-if="model.autoCreateRoom === 1" label="自动创建的群聊名称：">
            <el-form-grid size="xlg">
            <el-input
              type="text"
              placeholder="未命名群聊"
              v-model="model.roomBaseName"
              maxlength="30"
              show-word-limit
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
            />
            </el-form-grid>
            <div class="form-grid__tips" :class="[ messageQA==='QA'? messageIconQA : messageIcon]">
              <Icon type="tishi"/>
              <span>如未设置，自动创建新群将为未命名群聊</span>
            </div>
          </el-form-item>
          <el-form-item v-if="model.autoCreateRoom === 1" label="自动建群的起始序号：" >
            <el-form-grid size="xlg">
              <el-input-number class="inputSize" controls-position="right" v-model="model.roomBaseId" :min="1" :max="100"></el-input-number>
            </el-form-grid>
            <div class="form-grid__tips" :class="[ messageQA==='QA'? messageIconQA : messageIcon]">
              <Icon type="tishi"/>
              <span>自动创建的群聊将按照序号依次生成，如：“广州客户群1”，请输入1-100的正整数</span>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="form-save__unique">
      <ns-button :loading="loading" type="primary" @click="onSave()">保存</ns-button>
      <ns-button @click="cancel()">取消</ns-button>
    </div>
  </div>
</template>

<script>
import chatRoomGroup from './src/chatRoomGroup'
export default chatRoomGroup
</script>

<style scoped>
  @import "@theme/variables.pcss";

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
  .el-form__grid--special {
    display: flex;
    align-items: center;
    > .form-grid__tips {
      margin-left: var(--default-margin-larger);
    }
  }
  .form-grid__tips {
    font-size: 12px;
    color: #0392fb;
    > svg + span {
      margin-left: var(--default-margin-small);
    }
  }
  .form-chat__table {
    width: 700px;
    padding: 15px 20px;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 160px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
</style>
<style scoped>
.form-tipsQA{
      font-size: 12px;
    color: #2153D4;
}
.form-tips {
    font-size: 12px;
    color: #0392fb;
}
.radiobox >>> .el-switch.is-checked .el-switch__core{
  background-color:#41a2e8;
  border-color:#41a2e8;
}
.radioboxQA >>> .el-switch.is-checked .el-switch__core{
  background-color:#2153D4 ;
  border-color:#2153D4 ;
}
</style>
