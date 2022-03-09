<template>
  <BaseContainer>
    <div class="list-head_setting-bar">
      <span>拥有企微侧边栏社群日历使用权限的人员才可在聊天窗口发送下方内容。</span>
      <NsButton type="text" size="medium" @click="settingUserDialogVisible = true">立即设置</NsButton>
    </div>
    <SettingUserDialog :visible.sync="settingUserDialogVisible"/>
  </BaseContainer>
</template>

<script>
import BaseContainer from '../../components/BaseContainer.vue'
import SettingUserDialog from './SettingUserDialog.vue'

export default {
  components: {
    BaseContainer,
    SettingUserDialog
  },
  data () {
    return {
      settingUserDialogVisible: false
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.list-head_setting-bar {
  height: 57px;
  display: flex;
  font-size: 14px;
  span {
    display: inline-block;
    margin: 0 16px;
    line-height: 57px;
    color: #979797;
  }
}
</style>
