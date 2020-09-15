<template>
  <div style="background-color: white" class="base-border-radius">
    <el-scrollbar ref="fullScreen" outsider>
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
                  placeholder="请输入聚合群码标题,长度20个字符以内"
                  v-model="model.remark"
                  maxlength="20"
                  show-word-limit
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                />
              </el-form-grid>
            </el-form-item>
            <el-form-item label="可加入的群聊：" required>
              <el-form-grid>
                <NsChatRoomDialog btnTitle="选择群聊" :selectedDataParent="model.checkedChatRoom" @getChatRoomData="getChatRoomData" v-model="model.checkedChatRoom"></NsChatRoomDialog>
              </el-form-grid>
              <div class="library-icon__extra">
                <Icon type="tishi"/>
                <span>选择多个群聊时，微信用户扫码后会随机加入一个群聊</span>
              </div>
            </el-form-item>
            <ElFormItem :rules="rules">
              <div class="message-detail" >
                <ElTable :data="model.checkedChatRoom" class="message-detail__table">
                  <ElTableColumn prop="style" label="群名称">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="群主">
                    <template slot-scope="scope">
                      {{ scope.row.ownerName}}({{scope.row.ownerWorkNum }})
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="成员数">
                    <template slot-scope="scope">
                      {{ scope.row.personNum }}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="群主工作门店">
                    <template slot-scope="scope">
                      {{ scope.row.workShopName}}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn label="操作" align="center" :width="70">
                    <template slot-scope="scope">
                      <ns-button type="text" size="small" @click="handleDelete(scope.row)">删除</ns-button>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </ElFormItem>
            <el-form-item label="自动建群："  required>
                <el-switch :active-value="1" :inactive-value="0" v-model="model.autoCreateRoom"></el-switch>
              <div class="library-icon__extra">
                <Icon type="tishi"/>
                <span>开启后，已选群聊群人数达到上限，将以原群主身份自动创建新群</span>
              </div>
            </el-form-item>
            <el-form-item v-if="model.autoCreateRoom === 1" label="自动创建的群聊名称：" required>
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
              <div class="library-icon__extra">
                <Icon type="tishi"/>
                <span>如未设置，自动创建新群将为未命名群聊</span>
              </div>
            </el-form-item>
            <el-form-item v-if="model.autoCreateRoom === 1" label="自动建群的起始序号："  required>
              <el-form-grid size="xlg">
              <el-input-number class="inputSize" :controls="false"  v-model="model.roomBaseId" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
              </el-form-grid>
              <div class="library-icon__extra">
                <Icon type="tishi"/>
                <span>自动创建的群聊将按照序号依次生成，如：“广州客户群1”</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div class="form-save__unique">
      <ns-button type="primary" @click="onSave()">保存</ns-button>
      <ns-button @click="cancel()">取消</ns-button>
    </div>
  </div>
</template>

<script>
import chatRoomGroup from './src/chatRoomGroup'
export default chatRoomGroup
</script>

<style scoped>

</style>
